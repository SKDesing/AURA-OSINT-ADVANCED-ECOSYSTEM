"""
AURA OSINT - NLP Analyzer
Moteur d'analyse IA pour détection de contenu haineux
"""

import re
from typing import Dict, List, Tuple
from dataclasses import dataclass

@dataclass
class AnalysisResult:
    """Résultat d'analyse NLP"""
    is_hate_speech: bool
    confidence_score: float
    detected_categories: List[str]
    severity_level: str  # low, medium, high, critical
    explanation: str
    keywords_detected: List[str]

class NLPAnalyzer:
    """Analyseur NLP pour détection de haine en ligne"""
    
    def __init__(self):
        self.hate_keywords = {
            'racism': ['sale race', 'retourne', 'pays', 'étranger'],
            'sexism': ['salope', 'pute', 'femme au foyer'],
            'homophobia': ['pédé', 'tapette', 'anormal'],
            'violence': ['crever', 'tuer', 'mort', 'violence'],
            'harassment': ['harcèlement', 'insulte', 'menace']
        }
        
        self.severity_weights = {
            'racism': 0.9,
            'violence': 0.95,
            'harassment': 0.7,
            'sexism': 0.8,
            'homophobia': 0.85
        }
    
    def analyze_content(self, text: str) -> AnalysisResult:
        """Analyse le contenu pour détecter la haine"""
        if not text or len(text.strip()) < 3:
            return self._create_safe_result()
        
        # Normalisation du texte
        normalized_text = self._normalize_text(text)
        
        # Détection des catégories
        detected_categories = self._detect_categories(normalized_text)
        keywords_found = self._extract_keywords(normalized_text, detected_categories)
        
        # Calcul du score de confiance
        confidence = self._calculate_confidence(detected_categories, keywords_found)
        
        # Détermination de la sévérité
        severity = self._determine_severity(detected_categories, confidence)
        
        # Classification finale
        is_hate = confidence > 0.6 and len(detected_categories) > 0
        
        return AnalysisResult(
            is_hate_speech=is_hate,
            confidence_score=confidence,
            detected_categories=detected_categories,
            severity_level=severity,
            explanation=self._generate_explanation(detected_categories, confidence),
            keywords_detected=keywords_found
        )
    
    def _normalize_text(self, text: str) -> str:
        """Normalise le texte pour l'analyse"""
        # Conversion en minuscules
        text = text.lower()
        
        # Suppression des caractères spéciaux répétés
        text = re.sub(r'(.)\1{2,}', r'\1', text)
        
        # Gestion du leet speak basique
        replacements = {
            '4': 'a', '3': 'e', '1': 'i', '0': 'o', '5': 's'
        }
        for old, new in replacements.items():
            text = text.replace(old, new)
        
        return text
    
    def _detect_categories(self, text: str) -> List[str]:
        """Détecte les catégories de haine présentes"""
        detected = []
        
        for category, keywords in self.hate_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    if category not in detected:
                        detected.append(category)
                    break
        
        return detected
    
    def _extract_keywords(self, text: str, categories: List[str]) -> List[str]:
        """Extrait les mots-clés détectés"""
        found_keywords = []
        
        for category in categories:
            for keyword in self.hate_keywords[category]:
                if keyword in text:
                    found_keywords.append(keyword)
        
        return found_keywords
    
    def _calculate_confidence(self, categories: List[str], keywords: List[str]) -> float:
        """Calcule le score de confiance"""
        if not categories:
            return 0.0
        
        # Score basé sur les catégories et leur poids
        category_score = sum(self.severity_weights.get(cat, 0.5) for cat in categories)
        
        # Bonus pour multiple catégories
        multi_category_bonus = min(len(categories) * 0.1, 0.3)
        
        # Score final normalisé
        final_score = min((category_score + multi_category_bonus) / len(categories), 1.0)
        
        return round(final_score, 3)
    
    def _determine_severity(self, categories: List[str], confidence: float) -> str:
        """Détermine le niveau de sévérité"""
        if confidence >= 0.9:
            return 'critical'
        elif confidence >= 0.7:
            return 'high'
        elif confidence >= 0.5:
            return 'medium'
        else:
            return 'low'
    
    def _generate_explanation(self, categories: List[str], confidence: float) -> str:
        """Génère une explication de l'analyse"""
        if not categories:
            return "Aucun contenu haineux détecté"
        
        category_names = {
            'racism': 'racisme',
            'sexism': 'sexisme', 
            'homophobia': 'homophobie',
            'violence': 'violence',
            'harassment': 'harcèlement'
        }
        
        detected_names = [category_names.get(cat, cat) for cat in categories]
        
        return f"Contenu potentiellement haineux détecté: {', '.join(detected_names)} (confiance: {confidence:.1%})"
    
    def _create_safe_result(self) -> AnalysisResult:
        """Crée un résultat pour contenu sûr"""
        return AnalysisResult(
            is_hate_speech=False,
            confidence_score=0.0,
            detected_categories=[],
            severity_level='low',
            explanation="Contenu analysé comme sûr",
            keywords_detected=[]
        )