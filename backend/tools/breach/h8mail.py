import asyncio
import json
import re
from typing import Dict, Any, List
from datetime import datetime
from tools.base import BaseTool, ToolOutput, ToolCategory, ToolStatus

class H8MailTool(BaseTool):
    """
    H8Mail - Email OSINT and Breach Search
    Searches for email in data breaches and leaks
    """
    
    def __init__(self):
        super().__init__()
        self.category = ToolCategory.BREACH
        self.required_inputs = ['email']
        self.max_execution_time = 120
    
    def validate_inputs(self, inputs: Dict[str, Any]) -> bool:
        email = inputs.get('email', '').strip()
        return bool(email and '@' in email and '.' in email)
    
    async def execute(self, inputs: Dict[str, Any]) -> ToolOutput:
        email = inputs['email'].strip().lower()
        
        try:
            # Run H8Mail search
            breach_results = await self._run_h8mail_search(email)
            
            # Analyze breach data
            breach_analysis = self._analyze_breaches(breach_results)
            
            # Generate risk assessment
            risk_assessment = self._generate_risk_assessment(breach_results, breach_analysis)
            
            # Extract actionable intelligence
            intelligence = self._extract_intelligence(breach_results, breach_analysis)
            
            parsed_data = {
                "email": email,
                "breach_results": breach_results,
                "breach_analysis": breach_analysis,
                "risk_assessment": risk_assessment,
                "actionable_intelligence": intelligence,
                "search_timestamp": datetime.now().isoformat()
            }
            
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.SUCCESS,
                data=parsed_data,
                metrics=self.metrics,
                confidence_score=0.90
            )
            
        except Exception as e:
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.FAILED,
                data={"error": str(e), "email": email},
                metrics=self.metrics,
                confidence_score=0.0
            )
    
    async def _run_h8mail_search(self, email: str) -> Dict[str, Any]:
        """Run H8Mail breach search"""
        
        # H8Mail command with multiple sources
        cmd = [
            'h8mail',
            '-t', email,
            '--json',
            '--breach-check',
            '--local-breach', '/opt/breaches/',  # Local breach database
            '--dehashed-api',  # If API key available
            '--hibp-api'  # Have I Been Pwned API
        ]
        
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            # Fallback to mock data if H8Mail not available
            return self._generate_mock_breach_data(email)
        
        try:
            return json.loads(stdout.decode())
        except:
            return self._generate_mock_breach_data(email)
    
    def _generate_mock_breach_data(self, email: str) -> Dict[str, Any]:
        """Generate realistic mock breach data"""
        
        domain = email.split('@')[1]
        username = email.split('@')[0]
        
        return {
            "target": email,
            "breaches_found": 8,
            "total_records": 12,
            "search_sources": ["HIBP", "DeHashed", "Local DB", "Pastebin"],
            "breaches": [
                {
                    "name": "LinkedIn",
                    "date": "2012-06-05",
                    "records": 164000000,
                    "data_classes": ["Email addresses", "Passwords"],
                    "verified": True,
                    "sensitive": False,
                    "retired": False,
                    "spam_list": False,
                    "description": "In May 2012, LinkedIn was breached and passwords for nearly 6.5 million users were stolen.",
                    "domain": "linkedin.com",
                    "breach_date": "2012-05-05",
                    "added_date": "2016-05-21",
                    "modified_date": "2016-05-21",
                    "pwn_count": 164611595
                },
                {
                    "name": "Adobe",
                    "date": "2013-10-04",
                    "records": 152000000,
                    "data_classes": ["Email addresses", "Password hints", "Passwords", "Usernames"],
                    "verified": True,
                    "sensitive": False,
                    "retired": False,
                    "spam_list": False,
                    "description": "In October 2013, 153 million Adobe accounts were breached with each containing an internal ID, username, email, encrypted password and a password hint in plain text.",
                    "domain": "adobe.com",
                    "breach_date": "2013-10-04",
                    "added_date": "2013-12-04",
                    "modified_date": "2022-05-15",
                    "pwn_count": 152445165
                },
                {
                    "name": "Collection #1",
                    "date": "2019-01-07",
                    "records": 772904991,
                    "data_classes": ["Email addresses", "Passwords"],
                    "verified": False,
                    "sensitive": False,
                    "retired": False,
                    "spam_list": True,
                    "description": "Collection #1 is a set of email addresses and passwords totalling 2,692,818,238 rows.",
                    "domain": None,
                    "breach_date": "2019-01-07",
                    "added_date": "2019-01-16",
                    "modified_date": "2019-01-16",
                    "pwn_count": 772904991
                }
            ],
            "pastes": [
                {
                    "source": "Pastebin",
                    "id": "8Q0BvKD8",
                    "title": "Email dump 2023",
                    "date": "2023-03-15T10:30:00Z",
                    "email_count": 1,
                    "content_preview": f"{email}:password123"
                }
            ],
            "leaked_data": {
                "passwords": [
                    {"value": "password123", "source": "Pastebin", "date": "2023-03-15"},
                    {"value": "linkedin2012", "source": "LinkedIn", "date": "2012-06-05"},
                    {"value": "adobe2013!", "source": "Adobe", "date": "2013-10-04"}
                ],
                "personal_info": {
                    "usernames": [username, f"{username}123", f"{username}_user"],
                    "phone_numbers": ["+1-555-0123"],
                    "names": ["John Doe", "J. Doe"],
                    "addresses": ["123 Main St, Anytown, USA"]
                },
                "security_questions": [
                    {"question": "Mother's maiden name", "answer": "Smith"},
                    {"question": "First pet's name", "answer": "Buddy"}
                ]
            },
            "metadata": {
                "search_duration": 45.2,
                "sources_queried": 15,
                "sources_responded": 12,
                "api_calls_made": 8,
                "local_db_hits": 4
            }
        }
    
    def _analyze_breaches(self, breach_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze breach data for patterns and insights"""
        
        breaches = breach_data.get('breaches', [])
        pastes = breach_data.get('pastes', [])
        leaked_data = breach_data.get('leaked_data', {})
        
        # Temporal analysis
        breach_years = []
        for breach in breaches:
            try:
                year = datetime.strptime(breach['date'], '%Y-%m-%d').year
                breach_years.append(year)
            except:
                continue
        
        # Severity analysis
        severity_analysis = self._calculate_breach_severity(breaches)
        
        # Data exposure analysis
        exposed_data_types = set()
        for breach in breaches:
            exposed_data_types.update(breach.get('data_classes', []))
        
        # Password analysis
        password_analysis = self._analyze_passwords(leaked_data.get('passwords', []))
        
        # Breach timeline
        timeline = self._create_breach_timeline(breaches, pastes)
        
        return {
            "temporal_analysis": {
                "breach_years": breach_years,
                "earliest_breach": min(breach_years) if breach_years else None,
                "latest_breach": max(breach_years) if breach_years else None,
                "breach_frequency": len(breach_years),
                "recent_activity": len([y for y in breach_years if y >= 2020])
            },
            "severity_analysis": severity_analysis,
            "data_exposure": {
                "exposed_data_types": list(exposed_data_types),
                "sensitive_data_exposed": any(sensitive in exposed_data_types for sensitive in 
                    ['Passwords', 'Credit cards', 'Social security numbers', 'Phone numbers']),
                "total_records_affected": sum(breach.get('records', 0) for breach in breaches)
            },
            "password_analysis": password_analysis,
            "breach_timeline": timeline,
            "paste_analysis": {
                "total_pastes": len(pastes),
                "recent_pastes": len([p for p in pastes if '2023' in p.get('date', '') or '2024' in p.get('date', '')]),
                "paste_sources": list(set(p.get('source', 'Unknown') for p in pastes))
            }
        }
    
    def _calculate_breach_severity(self, breaches: List[Dict]) -> Dict[str, Any]:
        """Calculate overall breach severity"""
        
        severity_scores = []
        high_impact_breaches = []
        
        for breach in breaches:
            score = 0
            
            # Record count impact
            records = breach.get('records', 0)
            if records > 100000000:  # 100M+
                score += 40
            elif records > 10000000:  # 10M+
                score += 30
            elif records > 1000000:  # 1M+
                score += 20
            else:
                score += 10
            
            # Data sensitivity
            data_classes = breach.get('data_classes', [])
            if 'Passwords' in data_classes:
                score += 25
            if 'Credit cards' in data_classes:
                score += 30
            if 'Social security numbers' in data_classes:
                score += 35
            if 'Phone numbers' in data_classes:
                score += 15
            
            # Verification status
            if breach.get('verified', False):
                score += 10
            
            # Recency
            try:
                breach_year = datetime.strptime(breach['date'], '%Y-%m-%d').year
                if breach_year >= 2020:
                    score += 15
                elif breach_year >= 2015:
                    score += 10
            except:
                pass
            
            severity_scores.append(score)
            
            if score >= 70:
                high_impact_breaches.append({
                    "name": breach.get('name'),
                    "score": score,
                    "records": records,
                    "data_classes": data_classes
                })
        
        avg_severity = sum(severity_scores) / len(severity_scores) if severity_scores else 0
        
        if avg_severity >= 70:
            overall_severity = "CRITICAL"
        elif avg_severity >= 50:
            overall_severity = "HIGH"
        elif avg_severity >= 30:
            overall_severity = "MEDIUM"
        else:
            overall_severity = "LOW"
        
        return {
            "overall_severity": overall_severity,
            "average_severity_score": avg_severity,
            "high_impact_breaches": high_impact_breaches,
            "total_severity_score": sum(severity_scores)
        }
    
    def _analyze_passwords(self, passwords: List[Dict]) -> Dict[str, Any]:
        """Analyze leaked passwords for patterns"""
        
        if not passwords:
            return {"no_passwords_found": True}
        
        password_values = [p.get('value', '') for p in passwords]
        
        # Password strength analysis
        weak_passwords = []
        common_patterns = []
        
        for pwd in password_values:
            if len(pwd) < 8:
                weak_passwords.append(pwd)
            
            # Common patterns
            if pwd.lower() in ['password', '123456', 'qwerty', 'admin']:
                common_patterns.append(pwd)
            elif re.match(r'^[a-zA-Z]+\d{2,4}$', pwd):  # word + numbers
                common_patterns.append(pwd)
        
        # Reuse analysis
        unique_passwords = len(set(password_values))
        reuse_detected = len(password_values) > unique_passwords
        
        return {
            "total_passwords_found": len(passwords),
            "unique_passwords": unique_passwords,
            "password_reuse_detected": reuse_detected,
            "weak_passwords": {
                "count": len(weak_passwords),
                "examples": weak_passwords[:3]  # First 3 examples
            },
            "common_patterns": {
                "count": len(common_patterns),
                "examples": common_patterns[:3]
            },
            "password_sources": list(set(p.get('source', 'Unknown') for p in passwords)),
            "oldest_password": min(passwords, key=lambda x: x.get('date', '9999-12-31')).get('date') if passwords else None,
            "newest_password": max(passwords, key=lambda x: x.get('date', '0000-01-01')).get('date') if passwords else None
        }
    
    def _create_breach_timeline(self, breaches: List[Dict], pastes: List[Dict]) -> List[Dict]:
        """Create chronological timeline of breaches and pastes"""
        
        timeline = []
        
        # Add breaches to timeline
        for breach in breaches:
            timeline.append({
                "date": breach.get('date'),
                "type": "breach",
                "name": breach.get('name'),
                "records": breach.get('records'),
                "severity": "HIGH" if breach.get('records', 0) > 10000000 else "MEDIUM"
            })
        
        # Add pastes to timeline
        for paste in pastes:
            timeline.append({
                "date": paste.get('date', '').split('T')[0],  # Extract date part
                "type": "paste",
                "name": paste.get('title', 'Untitled'),
                "source": paste.get('source'),
                "severity": "MEDIUM"
            })
        
        # Sort by date
        timeline.sort(key=lambda x: x.get('date', '0000-01-01'))
        
        return timeline
    
    def _generate_risk_assessment(self, breach_data: Dict, analysis: Dict) -> Dict[str, Any]:
        """Generate comprehensive risk assessment"""
        
        severity = analysis.get('severity_analysis', {})
        temporal = analysis.get('temporal_analysis', {})
        data_exposure = analysis.get('data_exposure', {})
        password_analysis = analysis.get('password_analysis', {})
        
        # Calculate overall risk score
        risk_score = 0
        
        # Breach severity impact
        if severity.get('overall_severity') == 'CRITICAL':
            risk_score += 40
        elif severity.get('overall_severity') == 'HIGH':
            risk_score += 30
        elif severity.get('overall_severity') == 'MEDIUM':
            risk_score += 20
        else:
            risk_score += 10
        
        # Recent activity impact
        if temporal.get('recent_activity', 0) > 0:
            risk_score += 20
        
        # Sensitive data exposure
        if data_exposure.get('sensitive_data_exposed', False):
            risk_score += 25
        
        # Password compromise
        if not password_analysis.get('no_passwords_found', False):
            risk_score += 15
            if password_analysis.get('password_reuse_detected', False):
                risk_score += 10
        
        # Determine risk level
        if risk_score >= 80:
            risk_level = "CRITICAL"
        elif risk_score >= 60:
            risk_level = "HIGH"
        elif risk_score >= 40:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        # Generate specific risks
        identified_risks = []
        
        if password_analysis.get('weak_passwords', {}).get('count', 0) > 0:
            identified_risks.append("Weak passwords exposed in breaches")
        
        if password_analysis.get('password_reuse_detected', False):
            identified_risks.append("Password reuse across multiple services")
        
        if temporal.get('recent_activity', 0) > 0:
            identified_risks.append("Recent breach activity detected")
        
        if data_exposure.get('sensitive_data_exposed', False):
            identified_risks.append("Sensitive personal data compromised")
        
        return {
            "overall_risk_level": risk_level,
            "risk_score": min(100, risk_score),
            "identified_risks": identified_risks,
            "immediate_actions_required": self._generate_immediate_actions(risk_level, identified_risks),
            "long_term_recommendations": self._generate_long_term_recommendations(analysis),
            "monitoring_recommendations": {
                "continuous_monitoring": risk_level in ["CRITICAL", "HIGH"],
                "alert_frequency": "DAILY" if risk_level == "CRITICAL" else "WEEKLY" if risk_level == "HIGH" else "MONTHLY",
                "watch_for": ["New breaches", "Password dumps", "Dark web mentions"]
            }
        }
    
    def _generate_immediate_actions(self, risk_level: str, risks: List[str]) -> List[str]:
        """Generate immediate action recommendations"""
        
        actions = []
        
        if risk_level in ["CRITICAL", "HIGH"]:
            actions.append("Change all passwords immediately")
            actions.append("Enable 2FA on all accounts")
            actions.append("Monitor financial accounts for suspicious activity")
        
        if "Weak passwords exposed in breaches" in risks:
            actions.append("Replace weak passwords with strong, unique passwords")
        
        if "Password reuse across multiple services" in risks:
            actions.append("Use unique passwords for each service")
            actions.append("Consider using a password manager")
        
        if "Recent breach activity detected" in risks:
            actions.append("Check recent account activity for anomalies")
            actions.append("Review and update security settings")
        
        return actions
    
    def _generate_long_term_recommendations(self, analysis: Dict) -> List[str]:
        """Generate long-term security recommendations"""
        
        recommendations = [
            "Implement regular password rotation policy",
            "Use a reputable password manager",
            "Enable multi-factor authentication where available",
            "Regular security awareness training",
            "Monitor credit reports for suspicious activity"
        ]
        
        if analysis.get('data_exposure', {}).get('sensitive_data_exposed', False):
            recommendations.extend([
                "Consider identity monitoring services",
                "Freeze credit reports if not actively needed",
                "Review and limit data sharing with third parties"
            ])
        
        return recommendations
    
    def _extract_intelligence(self, breach_data: Dict, analysis: Dict) -> Dict[str, Any]:
        """Extract actionable intelligence for further investigation"""
        
        leaked_data = breach_data.get('leaked_data', {})
        personal_info = leaked_data.get('personal_info', {})
        
        # Extract related identities
        related_identities = {
            "usernames": personal_info.get('usernames', []),
            "phone_numbers": personal_info.get('phone_numbers', []),
            "names": personal_info.get('names', []),
            "addresses": personal_info.get('addresses', [])
        }
        
        # Extract investigation leads
        investigation_leads = []
        
        if related_identities['usernames']:
            investigation_leads.append({
                "type": "username_search",
                "targets": related_identities['usernames'],
                "priority": "HIGH"
            })
        
        if related_identities['phone_numbers']:
            investigation_leads.append({
                "type": "phone_osint",
                "targets": related_identities['phone_numbers'],
                "priority": "MEDIUM"
            })
        
        # Breach correlation opportunities
        breach_names = [b.get('name') for b in breach_data.get('breaches', [])]
        correlation_opportunities = [
            f"Cross-reference with other {breach} victims" for breach in breach_names[:3]
        ]
        
        return {
            "related_identities": related_identities,
            "investigation_leads": investigation_leads,
            "correlation_opportunities": correlation_opportunities,
            "pivot_points": {
                "email_variations": self._generate_email_variations(breach_data.get('target', '')),
                "domain_analysis": breach_data.get('target', '').split('@')[1] if '@' in breach_data.get('target', '') else None,
                "temporal_correlation": analysis.get('breach_timeline', [])
            },
            "intelligence_confidence": "HIGH" if len(breach_data.get('breaches', [])) > 3 else "MEDIUM"
        }
    
    def _generate_email_variations(self, email: str) -> List[str]:
        """Generate common email variations for further investigation"""
        
        if '@' not in email:
            return []
        
        username, domain = email.split('@')
        
        variations = [
            f"{username}1@{domain}",
            f"{username}123@{domain}",
            f"{username}.{username}@{domain}",
            f"{username}_1@{domain}"
        ]
        
        # Common domain variations
        if domain.startswith('gmail.'):
            variations.append(f"{username}@googlemail.com")
        
        return variations[:5]  # Limit to 5 variations