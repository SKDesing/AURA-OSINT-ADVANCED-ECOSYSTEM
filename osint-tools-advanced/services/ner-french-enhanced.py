#!/usr/bin/env python3
"""
AURA French NER v2.0 - Enhanced Named Entity Recognition for French OSINT
Extracts: SIREN/SIRET (Luhn validated), phones (E.164), emails, addresses, persons, companies
"""

import re
import json
import sys
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, field

@dataclass
class Entity:
    type: str
    value: str
    normalized: str
    confidence: float
    start: int
    end: int
    metadata: Dict = field(default_factory=dict)

class FrenchNER:
    def __init__(self):
        # Enhanced French-specific patterns
        self.patterns = {
            'siren': re.compile(r'\b(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{3})\b'),
            'siret': re.compile(r'\b(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{5})\b'),
            'phone_fr': re.compile(r'\b0[1-9](?:[\s.-]?\d{2}){4}\b'),
            'phone_intl': re.compile(r'\+33[\s.-]?[1-9](?:[\s.-]?\d{2}){4}\b'),
            'email': re.compile(r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b'),
            'postal_code': re.compile(r'\b\d{5}\b'),
            'iban_fr': re.compile(r'\bFR\d{2}(?:\s?\d{4}){6}\b'),
            'tva_fr': re.compile(r'\bFR\s?[A-Z0-9]{2}\s?\d{9}\b'),
            'naf_ape': re.compile(r'\b\d{4}[A-Z]\b'),  # Code NAF/APE
        }
        
        # Enhanced address patterns
        self.address_patterns = [
            re.compile(r'\d+(?:\s+(?:bis|ter|quater))?\s+(?:rue|avenue|boulevard|place|impasse|allée|chemin|route)\s+[^,\n]+?\s+\d{5}\s+[A-Za-zÀ-ÿ\s-]+', re.IGNORECASE),
            re.compile(r'\d+\s+(?:bis|ter)?\s*(?:rue|av\.?|bd\.?|pl\.|imp\.)\s+[^,\n]+', re.IGNORECASE)
        ]
        
        # Enhanced company suffixes with variations
        self.company_suffixes = [
            'SAS', 'SARL', 'SA', 'SNC', 'SCS', 'EURL', 'SASU', 'SCI', 'SEL',
            'SCOP', 'SCIC', 'GIE', 'GEIE', 'Association', 'Fondation',
            'S\.A\.S\.', 'S\.A\.R\.L\.', 'S\.A\.', 'E\.U\.R\.L\.'
        ]
        
        # Expanded French names database
        self.french_names = {
            'first': ['Jean', 'Marie', 'Pierre', 'Michel', 'Alain', 'Philippe', 'Daniel', 'Bernard', 'Catherine', 'Françoise', 
                     'Christophe', 'Nicolas', 'Isabelle', 'Sylvie', 'Thierry', 'Pascal', 'Frédéric', 'Nathalie', 'Laurent', 'Stéphane'],
            'last': ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau',
                    'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier']
        }

    def luhn_check(self, number: str) -> bool:
        """Validate number using Luhn algorithm (for SIREN/SIRET)"""
        def luhn_digit(n):
            return n if n < 10 else n - 9
        
        digits = [int(d) for d in number]
        checksum = sum(luhn_digit(d * 2) if i % 2 == 0 else d for i, d in enumerate(reversed(digits)))
        return checksum % 10 == 0

    def normalize_siren_siret(self, value: str) -> Optional[str]:
        """Normalize SIREN/SIRET by removing spaces and validate"""
        clean = re.sub(r'[\s.-]', '', value)
        return clean if self.validate_siren_siret(clean) else None

    def normalize_phone(self, value: str) -> str:
        """Normalize French phone to E.164 format"""
        clean = re.sub(r'[\s.-]', '', value)
        if clean.startswith('0') and len(clean) == 10:
            return '+33' + clean[1:]
        elif clean.startswith('+33') and len(clean) == 12:
            return clean
        elif clean.startswith('33') and len(clean) == 11:
            return '+' + clean
        return clean

    def normalize_email(self, value: str) -> str:
        """Normalize email to lowercase"""
        return value.lower().strip()

    def normalize_iban(self, value: str) -> str:
        """Normalize IBAN by removing spaces"""
        return re.sub(r'\s', '', value.upper())

    def validate_siren_siret(self, number: str) -> bool:
        """Validate SIREN/SIRET using Luhn algorithm"""
        if len(number) not in [9, 14]:
            return False
        
        if not number.isdigit():
            return False
            
        # For SIRET, validate both SIREN part and full SIRET
        if len(number) == 14:
            siren_part = number[:9]
            return self.luhn_check(siren_part) and self.luhn_check(number)
        else:
            return self.luhn_check(number)

    def extract_entities(self, text: str) -> List[Entity]:
        """Extract all entities from text"""
        entities = []
        
        # Extract structured data (SIREN, phones, emails, etc.)
        for entity_type, pattern in self.patterns.items():
            for match in pattern.finditer(text):
                value = match.group()
                
                # Normalize based on type with enhanced validation
                if entity_type in ['siren', 'siret']:
                    normalized = self.normalize_siren_siret(value)
                    if normalized:
                        confidence = 0.95
                        metadata = {'validated': True, 'luhn_check': True}
                    else:
                        continue  # Skip invalid SIREN/SIRET
                elif entity_type.startswith('phone'):
                    normalized = self.normalize_phone(value)
                    confidence = 0.9 if normalized.startswith('+33') else 0.7
                    metadata = {'format': 'E.164' if normalized.startswith('+33') else 'raw'}
                elif entity_type == 'email':
                    normalized = self.normalize_email(value)
                    confidence = 0.95
                    metadata = {'domain': normalized.split('@')[1] if '@' in normalized else None}
                elif entity_type == 'iban_fr':
                    normalized = self.normalize_iban(value)
                    confidence = 0.9
                    metadata = {'country': 'FR', 'bank_code': normalized[4:9] if len(normalized) >= 9 else None}
                else:
                    normalized = value.strip()
                    confidence = 0.8
                    metadata = {}
                
                entities.append(Entity(
                    type=entity_type,
                    value=value,
                    normalized=normalized,
                    confidence=confidence,
                    start=match.start(),
                    end=match.end(),
                    metadata=metadata
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
                    end=match.end(),
                    metadata={'pattern': 'french_address'}
                ))
        
        # Extract companies (enhanced)
        entities.extend(self.extract_companies(text))
        
        # Extract persons (enhanced)
        entities.extend(self.extract_persons(text))
        
        return sorted(entities, key=lambda e: e.start)

    def extract_companies(self, text: str) -> List[Entity]:
        """Extract company names using suffix patterns"""
        entities = []
        
        for suffix in self.company_suffixes:
            pattern = re.compile(rf'\b([A-ZÀ-Ÿ][a-zA-ZÀ-ÿ\s&\'-]+)\s+{suffix}\b')
            for match in pattern.finditer(text):
                company_name = match.group(1).strip() + ' ' + suffix.replace('\\.', '.')
                entities.append(Entity(
                    type='company',
                    value=match.group(),
                    normalized=company_name,
                    confidence=0.8,
                    start=match.start(),
                    end=match.end(),
                    metadata={'legal_form': suffix.replace('\\.', '.')}
                ))
        
        return entities

    def extract_persons(self, text: str) -> List[Entity]:
        """Extract person names using French name patterns"""
        entities = []
        
        # Pattern: Prénom NOM (capitalized)
        pattern = re.compile(r'\b([A-ZÀ-Ÿ][a-zà-ÿ]+)\s+([A-ZÀ-Ÿ][A-ZÀ-Ÿ]+)\b')
        for match in pattern.finditer(text):
            first_name, last_name = match.groups()
            confidence = 0.6
            
            # Boost confidence if names are in our database
            if first_name in self.french_names['first']:
                confidence += 0.2
            if last_name in self.french_names['last']:
                confidence += 0.2
                
            entities.append(Entity(
                type='person',
                value=match.group(),
                normalized=f"{first_name} {last_name}",
                confidence=min(confidence, 0.95),
                start=match.start(),
                end=match.end(),
                metadata={'first_name': first_name, 'last_name': last_name}
            ))
        
        return entities

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
                'position': [entity.start, entity.end],
                'metadata': entity.metadata
            })
        
        return {
            'total_entities': len(entities),
            'entities_by_type': by_type,
            'high_confidence_count': len([e for e in entities if e.confidence > 0.8]),
            'validated_siren_siret': len([e for e in entities if e.type in ['siren', 'siret'] and e.metadata.get('validated')])
        }

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 ner-french-enhanced.py <text>", file=sys.stderr)
        sys.exit(1)
    
    text = sys.argv[1]
    ner = FrenchNER()
    result = ner.process_document(text)
    
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()