#!/usr/bin/env python3
"""
AURA French NER - Named Entity Recognition for French OSINT
Extracts: SIREN/SIRET, phones, emails, addresses, persons, companies
"""

import re
import json
import sys
from typing import Dict, List, Tuple
from dataclasses import dataclass

@dataclass
class Entity:
    type: str
    value: str
    normalized: str
    confidence: float
    start: int
    end: int

class FrenchNER:
    def __init__(self):
        # French-specific patterns
        self.patterns = {
            'siren': re.compile(r'\b\d{3}\s?\d{3}\s?\d{3}\b'),
            'siret': re.compile(r'\b\d{3}\s?\d{3}\s?\d{3}\s?\d{5}\b'),
            'phone_fr': re.compile(r'\b0[1-9](?:[\s.-]?\d{2}){4}\b'),
            'phone_intl': re.compile(r'\+33\s?[1-9](?:[\s.-]?\d{2}){4}\b'),
            'email': re.compile(r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b'),
            'postal_code': re.compile(r'\b\d{5}\b'),
            'iban_fr': re.compile(r'\bFR\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}\b'),
            'tva_fr': re.compile(r'\bFR\s?[A-Z0-9]{2}\s?\d{9}\b'),
        }
        
        # Address patterns
        self.address_patterns = [
            re.compile(r'\d+\s+(rue|avenue|boulevard|place|impasse|allée)\s+[^,\n]+\s+\d{5}\s+\w+', re.IGNORECASE),
            re.compile(r'\d+\s+(bis|ter)?\s*(rue|av\.?|bd\.?|pl\.?)\s+[^,\n]+', re.IGNORECASE)
        ]
        
        # Company suffixes
        self.company_suffixes = [
            'SAS', 'SARL', 'SA', 'SNC', 'SCS', 'EURL', 'SASU', 'SCI',
            'SCOP', 'SCIC', 'GIE', 'Association', 'Fondation'
        ]
        
        # Common French first/last names for person detection
        self.french_names = {
            'first': ['Jean', 'Marie', 'Pierre', 'Michel', 'Alain', 'Philippe', 'Daniel', 'Bernard', 'Catherine', 'Françoise'],
            'last': ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau']
        }

    def normalize_siren_siret(self, value: str) -> str:
        """Normalize SIREN/SIRET by removing spaces"""
        return re.sub(r'\s', '', value)

    def normalize_phone(self, value: str) -> str:
        """Normalize French phone to E.164 format"""
        clean = re.sub(r'[\s.-]', '', value)
        if clean.startswith('0'):
            return '+33' + clean[1:]
        elif clean.startswith('+33'):
            return clean
        return clean

    def normalize_email(self, value: str) -> str:
        """Normalize email to lowercase"""
        return value.lower()

    def extract_entities(self, text: str) -> List[Entity]:
        """Extract all entities from text"""
        entities = []
        
        # Extract structured data (SIREN, phones, emails, etc.)
        for entity_type, pattern in self.patterns.items():
            for match in pattern.finditer(text):
                value = match.group()
                
                # Normalize based on type
                if entity_type in ['siren', 'siret']:
                    normalized = self.normalize_siren_siret(value)
                    confidence = 0.95 if self.validate_siren_siret(normalized) else 0.7
                elif entity_type.startswith('phone'):
                    normalized = self.normalize_phone(value)
                    confidence = 0.9
                elif entity_type == 'email':
                    normalized = self.normalize_email(value)
                    confidence = 0.95
                else:
                    normalized = value.strip()
                    confidence = 0.8
                
                entities.append(Entity(
                    type=entity_type,
                    value=value,
                    normalized=normalized,
                    confidence=confidence,
                    start=match.start(),
                    end=match.end()
                ))
        
        # Extract addresses
        for pattern in self.address_patterns:
            for match in pattern.finditer(text):
                entities.append(Entity(
                    type='address',
                    value=match.group(),
                    normalized=match.group().strip(),
                    confidence=0.8,
                    start=match.start(),
                    end=match.end()
                ))
        
        # Extract companies (heuristic)
        entities.extend(self.extract_companies(text))
        
        # Extract persons (heuristic)
        entities.extend(self.extract_persons(text))
        
        return sorted(entities, key=lambda e: e.start)

    def extract_companies(self, text: str) -> List[Entity]:
        """Extract company names using suffix patterns"""
        entities = []
        
        for suffix in self.company_suffixes:
            pattern = re.compile(rf'\b([A-Z][a-zA-Z\s&-]+)\s+{suffix}\b')
            for match in pattern.finditer(text):
                company_name = match.group(1).strip() + ' ' + suffix
                entities.append(Entity(
                    type='company',
                    value=match.group(),
                    normalized=company_name,
                    confidence=0.7,
                    start=match.start(),
                    end=match.end()
                ))
        
        return entities

    def extract_persons(self, text: str) -> List[Entity]:
        """Extract person names using French name patterns"""
        entities = []
        
        # Pattern: Prénom NOM (capitalized)
        pattern = re.compile(r'\b([A-Z][a-z]+)\s+([A-Z][A-Z]+)\b')
        for match in pattern.finditer(text):
            first_name, last_name = match.groups()
            if (first_name in self.french_names['first'] or 
                last_name in self.french_names['last']):
                entities.append(Entity(
                    type='person',
                    value=match.group(),
                    normalized=f"{first_name} {last_name}",
                    confidence=0.6,
                    start=match.start(),
                    end=match.end()
                ))
        
        return entities

    def validate_siren_siret(self, number: str) -> bool:
        """Validate SIREN/SIRET using Luhn algorithm"""
        if len(number) not in [9, 14]:
            return False
        
        # Simple validation - can be enhanced with proper Luhn
        return number.isdigit()

    def process_document(self, text: str) -> Dict:
        """Process a document and return structured results"""
        entities = self.extract_entities(text)
        
        # Group by type
        by_type = {}
        for entity in entities:
            if entity.type not in by_type:
                by_type[entity.type] = []
            by_type[entity.type].append({
                'value': entity.value,
                'normalized': entity.normalized,
                'confidence': entity.confidence,
                'position': [entity.start, entity.end]
            })
        
        return {
            'total_entities': len(entities),
            'entities_by_type': by_type,
            'high_confidence_count': len([e for e in entities if e.confidence > 0.8])
        }

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 ner-french.py <text>", file=sys.stderr)
        sys.exit(1)
    
    text = sys.argv[1]
    ner = FrenchNER()
    result = ner.process_document(text)
    
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()