#!/usr/bin/env python3
"""
AURA OSINT Database Mapper
Maps tool outputs to database schema using configuration
"""

import yaml
import json
from typing import Dict, Any, Optional, List
from datetime import datetime
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class DatabaseMapper:
    """Maps OSINT tool outputs to database tables"""
    
    def __init__(self, config_path: str = "backend/config/tool-mappings.yaml"):
        self.config_path = Path(config_path)
        self.config = self._load_config()
        self.tools = self.config.get('tools', {})
        
    def _load_config(self) -> Dict[str, Any]:
        """Load tool mappings configuration"""
        try:
            with open(self.config_path, 'r') as f:
                return yaml.safe_load(f)
        except Exception as e:
            logger.error(f"Failed to load config from {self.config_path}: {e}")
            return {}
    
    def map_tool_output(self, tool_name: str, raw_output: Dict[str, Any], execution_id: str) -> Dict[str, Any]:
        """
        Map tool output to database format
        
        Args:
            tool_name: Name of the OSINT tool
            raw_output: Raw output from the tool
            execution_id: UUID of the execution record
            
        Returns:
            Dictionary ready for database insertion
        """
        
        if tool_name not in self.tools:
            logger.warning(f"No mapping configuration found for tool: {tool_name}")
            return self._create_fallback_mapping(tool_name, raw_output, execution_id)
        
        tool_config = self.tools[tool_name]
        
        try:
            # Get mapping configuration
            outputs_config = tool_config.get('outputs', {})
            table_name = outputs_config.get('database_table')
            fields_mapping = outputs_config.get('fields_mapping', {})
            
            if not table_name:
                logger.error(f"No database table specified for tool: {tool_name}")
                return {}
            
            # Create base record
            mapped_data = {
                'execution_id': execution_id,
                'created_at': datetime.now()
            }
            
            # Add platform if specified (for social media tools)
            if 'platform' in outputs_config:
                mapped_data['platform'] = outputs_config['platform']
            
            # Add target_type if specified (for network tools)
            if 'target_type' in outputs_config:
                mapped_data['target_type'] = outputs_config['target_type']
            
            # Map fields according to configuration
            for source_path, target_field in fields_mapping.items():
                value = self._extract_nested_value(raw_output, source_path)
                if value is not None:
                    mapped_data[target_field] = self._convert_value(value, target_field)
            
            # Add confidence score
            confidence_base = outputs_config.get('confidence_base', 0.5)
            mapped_data['confidence_score'] = confidence_base
            
            # Store raw output as backup
            mapped_data['raw_data'] = raw_output
            
            logger.info(f"Successfully mapped {tool_name} output to {table_name}")
            return {
                'table': table_name,
                'data': mapped_data
            }
            
        except Exception as e:
            logger.error(f"Failed to map output for {tool_name}: {e}")
            return self._create_fallback_mapping(tool_name, raw_output, execution_id)
    
    def _extract_nested_value(self, data: Dict[str, Any], path: str) -> Any:
        """
        Extract value from nested dictionary using dot notation
        
        Args:
            data: Source dictionary
            path: Dot-separated path (e.g., 'profile.name')
            
        Returns:
            Extracted value or None if not found
        """
        try:
            keys = path.split('.')
            current = data
            
            for key in keys:
                if isinstance(current, dict):
                    # Handle array access like 'hostnames[0]'
                    if '[' in key and ']' in key:
                        array_key = key.split('[')[0]
                        index = int(key.split('[')[1].split(']')[0])
                        current = current.get(array_key, [])[index]
                    else:
                        current = current.get(key)
                elif isinstance(current, list) and key.isdigit():
                    current = current[int(key)]
                else:
                    return None
                    
                if current is None:
                    return None
                    
            return current
            
        except (KeyError, IndexError, ValueError, TypeError):
            return None
    
    def _convert_value(self, value: Any, field_name: str) -> Any:
        """
        Convert value to appropriate type for database field
        
        Args:
            value: Raw value to convert
            field_name: Target field name (used for type hints)
            
        Returns:
            Converted value
        """
        
        # Handle None values
        if value is None:
            return None
        
        # Convert based on field name patterns
        if field_name.endswith('_count') or field_name.endswith('_score'):
            try:
                return int(float(value)) if value != '' else 0
            except (ValueError, TypeError):
                return 0
        
        elif field_name.endswith('_percent') or field_name.endswith('_rate'):
            try:
                return float(value) if value != '' else 0.0
            except (ValueError, TypeError):
                return 0.0
        
        elif field_name.endswith('_date'):
            if isinstance(value, str):
                try:
                    # Try common date formats
                    for fmt in ['%Y-%m-%d', '%Y-%m-%d %H:%M:%S', '%Y-%m-%dT%H:%M:%S']:
                        try:
                            return datetime.strptime(value, fmt).date()
                        except ValueError:
                            continue
                    return None
                except:
                    return None
            return value
        
        elif field_name in ['verified', 'private_account', 'is_valid', 'is_possible']:
            # Boolean fields
            if isinstance(value, bool):
                return value
            elif isinstance(value, str):
                return value.lower() in ['true', '1', 'yes', 'on']
            else:
                return bool(value)
        
        elif field_name.endswith('_addresses') or field_name.endswith('_found') or field_name.endswith('_servers'):
            # Array fields
            if isinstance(value, list):
                return value
            elif isinstance(value, str):
                return [value] if value else []
            else:
                return []
        
        elif field_name in ['profile_data', 'network_analysis', 'scan_results', 'aml_flags', 'vulnerabilities']:
            # JSONB fields
            if isinstance(value, (dict, list)):
                return value
            elif isinstance(value, str):
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return {'raw': value}
            else:
                return {'value': str(value)}
        
        # Default: return as string
        return str(value) if value is not None else None
    
    def _create_fallback_mapping(self, tool_name: str, raw_output: Dict[str, Any], execution_id: str) -> Dict[str, Any]:
        """
        Create fallback mapping when no configuration exists
        
        Args:
            tool_name: Name of the tool
            raw_output: Raw output data
            execution_id: Execution ID
            
        Returns:
            Fallback mapping to osint_executions table
        """
        
        logger.warning(f"Using fallback mapping for {tool_name}")
        
        return {
            'table': 'osint_executions',
            'data': {
                'execution_id': execution_id,
                'raw_output': raw_output,
                'created_at': datetime.now()
            }
        }
    
    def get_tool_category(self, tool_name: str) -> str:
        """Get tool category from configuration"""
        return self.tools.get(tool_name, {}).get('category', 'general')
    
    def get_required_inputs(self, tool_name: str) -> List[str]:
        """Get required inputs for a tool"""
        return self.tools.get(tool_name, {}).get('inputs', {}).get('required', [])
    
    def get_optional_inputs(self, tool_name: str) -> List[str]:
        """Get optional inputs for a tool"""
        return self.tools.get(tool_name, {}).get('inputs', {}).get('optional', [])
    
    def validate_tool_inputs(self, tool_name: str, inputs: Dict[str, Any]) -> tuple[bool, List[str]]:
        """
        Validate inputs for a tool
        
        Args:
            tool_name: Name of the tool
            inputs: Input parameters
            
        Returns:
            Tuple of (is_valid, missing_fields)
        """
        
        if tool_name not in self.tools:
            return False, [f"Unknown tool: {tool_name}"]
        
        required_inputs = self.get_required_inputs(tool_name)
        missing_fields = []
        
        for field in required_inputs:
            if field not in inputs or inputs[field] is None or inputs[field] == '':
                missing_fields.append(field)
        
        return len(missing_fields) == 0, missing_fields
    
    def get_execution_order(self, category: str) -> List[str]:
        """Get execution order for tools in a category"""
        return self.config.get('execution_order', {}).get(category, [])
    
    def calculate_risk_score(self, category: str, data: Dict[str, Any]) -> float:
        """
        Calculate risk score based on category-specific weights
        
        Args:
            category: Tool category
            data: Mapped data
            
        Returns:
            Risk score (0.0 to 1.0)
        """
        
        risk_config = self.config.get('risk_scoring', {}).get(category, {})
        
        if not risk_config:
            return 0.5  # Default neutral score
        
        total_score = 0.0
        total_weight = 0.0
        
        for field, weight in risk_config.items():
            field_name = field.replace('_weight', '')
            
            if field_name in data:
                value = data[field_name]
                
                # Normalize different value types to 0-1 scale
                if isinstance(value, bool):
                    normalized_value = 1.0 if value else 0.0
                elif isinstance(value, (int, float)):
                    # Assume higher numbers = higher risk, cap at reasonable limits
                    if field_name.endswith('_count'):
                        normalized_value = min(value / 100.0, 1.0)  # Cap at 100
                    elif field_name.endswith('_percent'):
                        normalized_value = value / 100.0
                    else:
                        normalized_value = min(value, 1.0)
                elif isinstance(value, str):
                    # Map string risk levels to numeric values
                    risk_map = {'low': 0.2, 'medium': 0.5, 'high': 0.8, 'critical': 1.0}
                    normalized_value = risk_map.get(value.lower(), 0.5)
                elif isinstance(value, list):
                    # For arrays, use length as indicator
                    normalized_value = min(len(value) / 10.0, 1.0)  # Cap at 10 items
                else:
                    normalized_value = 0.5  # Default for unknown types
                
                total_score += normalized_value * weight
                total_weight += weight
        
        # Return weighted average, or 0.5 if no weights found
        return total_score / total_weight if total_weight > 0 else 0.5

# Convenience functions for common operations
def map_tool_output(tool_name: str, raw_output: Dict[str, Any], execution_id: str) -> Dict[str, Any]:
    """Convenience function to map tool output"""
    mapper = DatabaseMapper()
    return mapper.map_tool_output(tool_name, raw_output, execution_id)

def validate_tool_inputs(tool_name: str, inputs: Dict[str, Any]) -> tuple[bool, List[str]]:
    """Convenience function to validate tool inputs"""
    mapper = DatabaseMapper()
    return mapper.validate_tool_inputs(tool_name, inputs)

def get_tool_category(tool_name: str) -> str:
    """Convenience function to get tool category"""
    mapper = DatabaseMapper()
    return mapper.get_tool_category(tool_name)

# Example usage
if __name__ == "__main__":
    # Test the mapper with sample data
    mapper = DatabaseMapper()
    
    # Test holehe output mapping
    holehe_output = {
        "email": "test@example.com",
        "sites_found": ["twitter", "instagram", "github"],
        "total_sites": 3,
        "high_value_sites": ["twitter", "instagram"],
        "data_breach_risk": "MEDIUM"
    }
    
    result = mapper.map_tool_output("holehe", holehe_output, "test-execution-id")
    print("Holehe mapping result:")
    print(json.dumps(result, indent=2, default=str))
    
    # Test input validation
    is_valid, missing = mapper.validate_tool_inputs("holehe", {"email": "test@example.com"})
    print(f"\nInput validation: valid={is_valid}, missing={missing}")
    
    # Test risk scoring
    risk_score = mapper.calculate_risk_score("email", {
        "breach_count": 5,
        "high_value_sites": ["twitter", "instagram"],
        "risk_level": "high"
    })
    print(f"\nRisk score: {risk_score}")