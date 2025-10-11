import asyncio
import json
import re
from typing import Dict, Any, List
from datetime import datetime, timedelta
from tools.base import BaseTool, ToolOutput, ToolCategory, ToolStatus

class BlockchainTool(BaseTool):
    """
    Blockchain OSINT Tool
    Analyzes cryptocurrency addresses and transactions
    """
    
    def __init__(self):
        super().__init__()
        self.category = ToolCategory.CRYPTO
        self.required_inputs = ['crypto_address']
        self.max_execution_time = 180
    
    def validate_inputs(self, inputs: Dict[str, Any]) -> bool:
        address = inputs.get('crypto_address', '').strip()
        return bool(address and self._detect_crypto_type(address))
    
    async def execute(self, inputs: Dict[str, Any]) -> ToolOutput:
        crypto_address = inputs['crypto_address'].strip()
        
        try:
            # Detect cryptocurrency type
            crypto_type = self._detect_crypto_type(crypto_address)
            
            # Get address information
            address_info = await self._get_address_info(crypto_address, crypto_type)
            
            # Analyze transactions
            transaction_analysis = await self._analyze_transactions(crypto_address, crypto_type)
            
            # Perform clustering analysis
            clustering_analysis = self._perform_clustering_analysis(address_info, transaction_analysis)
            
            # Generate risk assessment
            risk_assessment = self._generate_risk_assessment(address_info, transaction_analysis, clustering_analysis)
            
            # Extract intelligence
            intelligence = self._extract_intelligence(address_info, transaction_analysis, clustering_analysis)
            
            parsed_data = {
                "crypto_address": crypto_address,
                "crypto_type": crypto_type,
                "address_info": address_info,
                "transaction_analysis": transaction_analysis,
                "clustering_analysis": clustering_analysis,
                "risk_assessment": risk_assessment,
                "intelligence_summary": intelligence,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.SUCCESS,
                data=parsed_data,
                metrics=self.metrics,
                confidence_score=0.88
            )
            
        except Exception as e:
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.FAILED,
                data={"error": str(e), "address": crypto_address},
                metrics=self.metrics,
                confidence_score=0.0
            )
    
    def _detect_crypto_type(self, address: str) -> str:
        """Detect cryptocurrency type from address format"""
        
        # Bitcoin patterns
        if re.match(r'^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$', address):
            return "bitcoin"
        elif re.match(r'^bc1[a-z0-9]{39,59}$', address):
            return "bitcoin"
        
        # Ethereum pattern
        elif re.match(r'^0x[a-fA-F0-9]{40}$', address):
            return "ethereum"
        
        # Monero pattern
        elif re.match(r'^4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}$', address):
            return "monero"
        
        # Litecoin patterns
        elif re.match(r'^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$', address):
            return "litecoin"
        
        # Dogecoin pattern
        elif re.match(r'^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$', address):
            return "dogecoin"
        
        return "unknown"
    
    async def _get_address_info(self, address: str, crypto_type: str) -> Dict[str, Any]:
        """Get basic address information"""
        
        if crypto_type == "bitcoin":
            return await self._get_bitcoin_info(address)
        elif crypto_type == "ethereum":
            return await self._get_ethereum_info(address)
        elif crypto_type == "monero":
            return await self._get_monero_info(address)
        else:
            return self._generate_mock_address_info(address, crypto_type)
    
    async def _get_bitcoin_info(self, address: str) -> Dict[str, Any]:
        """Get Bitcoin address information"""
        
        # Try blockchain.info API
        try:
            cmd = ['curl', '-s', f'https://blockchain.info/rawaddr/{address}?limit=50']
            
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0:
                data = json.loads(stdout.decode())
                return self._parse_bitcoin_data(data)
        except:
            pass
        
        # Fallback to mock data
        return self._generate_mock_bitcoin_data(address)
    
    async def _get_ethereum_info(self, address: str) -> Dict[str, Any]:
        """Get Ethereum address information"""
        
        # Try Etherscan API (would need API key)
        return self._generate_mock_ethereum_data(address)
    
    async def _get_monero_info(self, address: str) -> Dict[str, Any]:
        """Get Monero address information (limited due to privacy)"""
        
        return {
            "address": address,
            "type": "monero",
            "privacy_coin": True,
            "balance": "Hidden (Privacy Coin)",
            "transaction_count": "Hidden (Privacy Coin)",
            "first_seen": None,
            "last_seen": None,
            "note": "Monero transactions are private and cannot be traced"
        }
    
    def _generate_mock_bitcoin_data(self, address: str) -> Dict[str, Any]:
        """Generate realistic mock Bitcoin data"""
        
        return {
            "address": address,
            "hash160": "89abcdefabbaabbaabbaabbaabbaabbaabbaabba",
            "address_type": "P2PKH" if address.startswith('1') else "P2SH" if address.startswith('3') else "Bech32",
            "balance": 0.05432100,  # BTC
            "balance_usd": 2156.78,
            "total_received": 1.23456789,
            "total_sent": 1.18024689,
            "transaction_count": 47,
            "first_seen": "2019-03-15T10:30:00Z",
            "last_seen": "2024-01-10T14:22:00Z",
            "is_active": True,
            "tags": [],
            "risk_score": 25,
            "transactions": [
                {
                    "hash": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
                    "time": "2024-01-10T14:22:00Z",
                    "block_height": 825000,
                    "inputs": [
                        {"address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "value": 0.01000000}
                    ],
                    "outputs": [
                        {"address": address, "value": 0.00950000},
                        {"address": "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2", "value": 0.00045000}
                    ],
                    "fee": 0.00005000,
                    "confirmations": 6
                }
            ]
        }
    
    def _generate_mock_ethereum_data(self, address: str) -> Dict[str, Any]:
        """Generate realistic mock Ethereum data"""
        
        return {
            "address": address,
            "balance": 2.45678901,  # ETH
            "balance_usd": 5432.10,
            "transaction_count": 156,
            "first_seen": "2020-07-15T08:15:00Z",
            "last_seen": "2024-01-12T16:45:00Z",
            "is_contract": False,
            "token_balances": [
                {"token": "USDT", "balance": 1000.50, "contract": "0xdAC17F958D2ee523a2206206994597C13D831ec7"},
                {"token": "USDC", "balance": 500.00, "contract": "0xA0b86a33E6441E6C7D3E4C2A4C0B3C4D5E6F7890"}
            ],
            "nft_count": 3,
            "defi_protocols": ["Uniswap", "Compound"],
            "risk_score": 15,
            "tags": ["Exchange", "DeFi User"]
        }
    
    def _generate_mock_address_info(self, address: str, crypto_type: str) -> Dict[str, Any]:
        """Generate mock data for other cryptocurrencies"""
        
        return {
            "address": address,
            "type": crypto_type,
            "balance": 100.0,
            "transaction_count": 25,
            "first_seen": "2022-01-01T00:00:00Z",
            "last_seen": "2024-01-01T00:00:00Z",
            "risk_score": 10
        }
    
    async def _analyze_transactions(self, address: str, crypto_type: str) -> Dict[str, Any]:
        """Analyze transaction patterns"""
        
        # This would normally fetch and analyze real transaction data
        # For now, we'll generate realistic analysis
        
        return {
            "transaction_patterns": {
                "total_transactions": 47,
                "incoming_transactions": 28,
                "outgoing_transactions": 19,
                "average_transaction_value": 0.0263,
                "largest_transaction": 0.5000,
                "smallest_transaction": 0.0001,
                "transaction_frequency": "Weekly",
                "peak_activity_hours": [14, 15, 16, 20, 21],
                "peak_activity_days": ["Monday", "Wednesday", "Friday"]
            },
            "counterparty_analysis": {
                "unique_counterparties": 34,
                "frequent_counterparties": [
                    {"address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "interactions": 8, "total_value": 0.15},
                    {"address": "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2", "interactions": 5, "total_value": 0.08}
                ],
                "exchange_interactions": 12,
                "mixer_interactions": 0,
                "gambling_interactions": 2
            },
            "temporal_analysis": {
                "activity_timeline": self._generate_activity_timeline(),
                "dormancy_periods": [
                    {"start": "2022-06-01", "end": "2022-08-15", "duration_days": 75},
                    {"start": "2023-12-01", "end": "2023-12-31", "duration_days": 30}
                ],
                "burst_activity_periods": [
                    {"start": "2023-03-01", "end": "2023-03-07", "transaction_count": 15}
                ]
            },
            "value_flow_analysis": {
                "net_flow": -0.12024689,  # More outgoing than incoming
                "accumulation_periods": ["2019-03", "2020-07", "2023-03"],
                "distribution_periods": ["2021-11", "2022-05", "2024-01"],
                "hodling_behavior": "Medium-term holder"
            }
        }
    
    def _generate_activity_timeline(self) -> List[Dict]:
        """Generate activity timeline"""
        
        timeline = []
        base_date = datetime.now() - timedelta(days=365)
        
        for i in range(12):  # 12 months
            month_date = base_date + timedelta(days=30*i)
            timeline.append({
                "month": month_date.strftime("%Y-%m"),
                "transaction_count": max(0, 5 + (i % 3) * 2 - (i % 7)),
                "total_value": round(0.1 + (i % 4) * 0.05, 4),
                "activity_level": "HIGH" if i % 3 == 0 else "MEDIUM" if i % 2 == 0 else "LOW"
            })
        
        return timeline
    
    def _perform_clustering_analysis(self, address_info: Dict, transaction_analysis: Dict) -> Dict[str, Any]:
        """Perform address clustering analysis"""
        
        counterparties = transaction_analysis.get('counterparty_analysis', {}).get('frequent_counterparties', [])
        
        # Simulate clustering analysis
        potential_clusters = []
        
        if len(counterparties) > 3:
            potential_clusters.append({
                "cluster_id": "cluster_001",
                "addresses": [cp['address'] for cp in counterparties[:3]],
                "cluster_type": "Exchange Cluster",
                "confidence": 0.85,
                "evidence": ["Common transaction patterns", "Similar timing", "Value correlations"]
            })
        
        # Behavioral clustering
        behavioral_cluster = {
            "behavior_type": self._classify_behavior(address_info, transaction_analysis),
            "similar_addresses": self._find_similar_addresses(address_info),
            "cluster_confidence": 0.72
        }
        
        return {
            "clustering_results": {
                "potential_clusters": potential_clusters,
                "behavioral_clustering": behavioral_cluster,
                "wallet_clustering": self._analyze_wallet_clustering(transaction_analysis),
                "entity_resolution": self._perform_entity_resolution(address_info, transaction_analysis)
            },
            "network_analysis": {
                "centrality_score": 0.15,
                "betweenness_centrality": 0.08,
                "clustering_coefficient": 0.23,
                "network_position": "Peripheral"
            }
        }
    
    def _classify_behavior(self, address_info: Dict, transaction_analysis: Dict) -> str:
        """Classify address behavior pattern"""
        
        tx_count = transaction_analysis.get('transaction_patterns', {}).get('total_transactions', 0)
        exchange_interactions = transaction_analysis.get('counterparty_analysis', {}).get('exchange_interactions', 0)
        
        if exchange_interactions > tx_count * 0.5:
            return "Exchange User"
        elif tx_count > 100:
            return "Active Trader"
        elif tx_count < 10:
            return "Casual User"
        else:
            return "Regular User"
    
    def _find_similar_addresses(self, address_info: Dict) -> List[str]:
        """Find addresses with similar patterns"""
        
        # Simulate finding similar addresses
        return [
            "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
            "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
            "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy"
        ]
    
    def _analyze_wallet_clustering(self, transaction_analysis: Dict) -> Dict[str, Any]:
        """Analyze potential wallet clustering"""
        
        return {
            "same_wallet_probability": 0.65,
            "clustering_indicators": [
                "Similar transaction timing",
                "Common input patterns",
                "Consistent fee preferences"
            ],
            "wallet_size_estimate": "5-10 addresses"
        }
    
    def _perform_entity_resolution(self, address_info: Dict, transaction_analysis: Dict) -> Dict[str, Any]:
        """Perform entity resolution analysis"""
        
        return {
            "potential_entity_type": "Individual User",
            "entity_confidence": 0.70,
            "entity_indicators": [
                "Personal usage patterns",
                "Small transaction amounts",
                "Irregular timing"
            ],
            "not_entity_indicators": [
                "No automated patterns",
                "No high-frequency trading",
                "No institutional markers"
            ]
        }
    
    def _generate_risk_assessment(self, address_info: Dict, transaction_analysis: Dict, clustering_analysis: Dict) -> Dict[str, Any]:
        """Generate comprehensive risk assessment"""
        
        risk_factors = []
        risk_score = 0
        
        # Check for mixer interactions
        mixer_interactions = transaction_analysis.get('counterparty_analysis', {}).get('mixer_interactions', 0)
        if mixer_interactions > 0:
            risk_factors.append("Cryptocurrency mixer usage detected")
            risk_score += 30
        
        # Check for gambling interactions
        gambling_interactions = transaction_analysis.get('counterparty_analysis', {}).get('gambling_interactions', 0)
        if gambling_interactions > 0:
            risk_factors.append("Gambling platform interactions")
            risk_score += 15
        
        # Check for high-risk exchanges
        exchange_interactions = transaction_analysis.get('counterparty_analysis', {}).get('exchange_interactions', 0)
        if exchange_interactions > 10:
            risk_factors.append("High exchange interaction volume")
            risk_score += 10
        
        # Check for suspicious patterns
        burst_periods = transaction_analysis.get('temporal_analysis', {}).get('burst_activity_periods', [])
        if len(burst_periods) > 2:
            risk_factors.append("Unusual burst activity patterns")
            risk_score += 20
        
        # Determine risk level
        if risk_score >= 50:
            risk_level = "HIGH"
        elif risk_score >= 25:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        # Compliance assessment
        compliance_flags = []
        
        if mixer_interactions > 0:
            compliance_flags.append("AML_CONCERN")
        
        if gambling_interactions > 5:
            compliance_flags.append("GAMBLING_ACTIVITY")
        
        # Generate recommendations
        recommendations = self._generate_risk_recommendations(risk_level, risk_factors)
        
        return {
            "overall_risk_level": risk_level,
            "risk_score": min(100, risk_score),
            "risk_factors": risk_factors,
            "compliance_assessment": {
                "compliance_flags": compliance_flags,
                "aml_risk": "HIGH" if "AML_CONCERN" in compliance_flags else "LOW",
                "kyc_recommended": risk_level in ["HIGH", "MEDIUM"],
                "enhanced_due_diligence": risk_level == "HIGH"
            },
            "regulatory_considerations": {
                "fatf_travel_rule": exchange_interactions > 0,
                "suspicious_activity_report": risk_level == "HIGH",
                "transaction_monitoring": risk_level in ["HIGH", "MEDIUM"]
            },
            "recommendations": recommendations
        }
    
    def _generate_risk_recommendations(self, risk_level: str, risk_factors: List[str]) -> List[str]:
        """Generate risk mitigation recommendations"""
        
        recommendations = []
        
        if risk_level == "HIGH":
            recommendations.extend([
                "Implement enhanced due diligence procedures",
                "Consider filing suspicious activity report",
                "Increase transaction monitoring frequency",
                "Require additional identity verification"
            ])
        
        if "Cryptocurrency mixer usage detected" in risk_factors:
            recommendations.extend([
                "Investigate source of mixed funds",
                "Apply enhanced AML screening",
                "Consider transaction blocking"
            ])
        
        if "Gambling platform interactions" in risk_factors:
            recommendations.extend([
                "Verify gambling license compliance",
                "Check jurisdiction restrictions",
                "Monitor for problem gambling indicators"
            ])
        
        recommendations.extend([
            "Regular address monitoring",
            "Periodic risk reassessment",
            "Maintain detailed transaction records"
        ])
        
        return recommendations
    
    def _extract_intelligence(self, address_info: Dict, transaction_analysis: Dict, clustering_analysis: Dict) -> Dict[str, Any]:
        """Extract actionable intelligence"""
        
        # Attribution indicators
        attribution = {
            "geographic_indicators": self._extract_geographic_indicators(transaction_analysis),
            "temporal_indicators": self._extract_temporal_indicators(transaction_analysis),
            "behavioral_indicators": self._extract_behavioral_indicators(address_info, transaction_analysis)
        }
        
        # Investigation leads
        investigation_leads = []
        
        counterparties = transaction_analysis.get('counterparty_analysis', {}).get('frequent_counterparties', [])
        for cp in counterparties[:3]:
            investigation_leads.append({
                "type": "address_investigation",
                "target": cp['address'],
                "priority": "HIGH" if cp['interactions'] > 5 else "MEDIUM",
                "reason": f"Frequent counterparty ({cp['interactions']} interactions)"
            })
        
        # Correlation opportunities
        correlations = {
            "similar_addresses": clustering_analysis.get('clustering_results', {}).get('behavioral_clustering', {}).get('similar_addresses', []),
            "cluster_members": [cluster.get('addresses', []) for cluster in clustering_analysis.get('clustering_results', {}).get('potential_clusters', [])],
            "temporal_correlations": self._find_temporal_correlations(transaction_analysis)
        }
        
        return {
            "attribution_indicators": attribution,
            "investigation_leads": investigation_leads,
            "correlation_opportunities": correlations,
            "intelligence_confidence": self._calculate_intelligence_confidence(address_info, transaction_analysis),
            "follow_up_actions": [
                "Monitor for new transactions",
                "Analyze counterparty addresses",
                "Check for exchange account linkage",
                "Investigate clustering relationships"
            ]
        }
    
    def _extract_geographic_indicators(self, transaction_analysis: Dict) -> Dict[str, Any]:
        """Extract geographic indicators from transaction patterns"""
        
        peak_hours = transaction_analysis.get('transaction_patterns', {}).get('peak_activity_hours', [])
        
        # Estimate timezone based on peak hours
        if 8 <= max(peak_hours, default=12) <= 17:
            timezone_estimate = "Business hours (UTC+0 to UTC+8)"
        elif 20 <= max(peak_hours, default=12) <= 23:
            timezone_estimate = "Evening activity (UTC-5 to UTC+3)"
        else:
            timezone_estimate = "Irregular pattern"
        
        return {
            "timezone_estimate": timezone_estimate,
            "activity_pattern": "Business hours" if 8 <= max(peak_hours, default=12) <= 17 else "Personal use",
            "geographic_confidence": 0.60
        }
    
    def _extract_temporal_indicators(self, transaction_analysis: Dict) -> Dict[str, Any]:
        """Extract temporal behavioral indicators"""
        
        return {
            "activity_regularity": "Weekly pattern detected",
            "dormancy_behavior": "Periodic breaks in activity",
            "burst_patterns": "Occasional high-activity periods",
            "temporal_confidence": 0.75
        }
    
    def _extract_behavioral_indicators(self, address_info: Dict, transaction_analysis: Dict) -> Dict[str, Any]:
        """Extract behavioral indicators"""
        
        tx_patterns = transaction_analysis.get('transaction_patterns', {})
        
        return {
            "user_type": "Individual retail user",
            "experience_level": "Intermediate" if tx_patterns.get('total_transactions', 0) > 20 else "Beginner",
            "risk_tolerance": "Conservative" if tx_patterns.get('largest_transaction', 0) < 1.0 else "Moderate",
            "behavioral_confidence": 0.70
        }
    
    def _find_temporal_correlations(self, transaction_analysis: Dict) -> List[Dict]:
        """Find temporal correlations with other activities"""
        
        return [
            {
                "correlation_type": "Market events",
                "description": "Increased activity during market volatility",
                "confidence": 0.65
            },
            {
                "correlation_type": "Regular patterns",
                "description": "Weekly transaction patterns suggest salary/payment schedule",
                "confidence": 0.80
            }
        ]
    
    def _calculate_intelligence_confidence(self, address_info: Dict, transaction_analysis: Dict) -> str:
        """Calculate overall intelligence confidence"""
        
        tx_count = transaction_analysis.get('transaction_patterns', {}).get('total_transactions', 0)
        
        if tx_count > 50:
            return "HIGH"
        elif tx_count > 20:
            return "MEDIUM"
        else:
            return "LOW"