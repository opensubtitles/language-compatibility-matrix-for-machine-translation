"""
Language Compatibility Matrix for Machine Translation

A comprehensive dataset quantifying linguistic distance and translation
compatibility between 139 global languages.

Usage:
    >>> from language_compatibility import get_compatibility, get_fallback_chain
    >>>
    >>> # Get compatibility score between two languages
    >>> score = get_compatibility('es', 'pt')
    >>> print(f"Spanish-Portuguese: {score}/255")
    >>>
    >>> # Get fallback chain for a language
    >>> fallbacks = get_fallback_chain('sk', ['en', 'cs', 'pl', 'de'])
    >>> print(f"Fallback chain for Slovak: {fallbacks}")
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple

__version__ = "1.0.0"
__author__ = "OpenSubtitles.org"
__license__ = "MIT"

# Load the data once when module is imported
_DATA_FILE = Path(__file__).parent.parent / "language-pairs-translation-proximity.json"
_compatibility_data: Optional[Dict[str, Dict[str, int]]] = None


def _load_data() -> Dict[str, Dict[str, int]]:
    """Load compatibility data from JSON file."""
    global _compatibility_data
    if _compatibility_data is None:
        with open(_DATA_FILE, 'r', encoding='utf-8') as f:
            _compatibility_data = json.load(f)
    return _compatibility_data


def get_compatibility(source: str, target: str) -> Optional[int]:
    """
    Get the compatibility score between two languages.

    Args:
        source: Source language code (ISO 639-1, 2-letter code)
        target: Target language code (ISO 639-1, 2-letter code)

    Returns:
        Compatibility score (0-255) or None if not found.
        255 = Perfect intelligibility
        0 = No practical transferability

    Example:
        >>> get_compatibility('es', 'pt')
        245
        >>> get_compatibility('en', 'de')
        240
    """
    data = _load_data()
    if source in data and target in data[source]:
        return data[source][target]
    return None


def get_fallback_chain(
    target_lang: str,
    available_langs: List[str],
    threshold: int = 150
) -> List[str]:
    """
    Get prioritized list of fallback languages for a target language.

    Args:
        target_lang: Target language code
        available_langs: List of available language codes
        threshold: Minimum compatibility score (default: 150)

    Returns:
        List of language codes sorted by compatibility score (highest first)

    Example:
        >>> get_fallback_chain('sk', ['en', 'cs', 'pl', 'de'])
        ['cs', 'pl', 'en']
    """
    data = _load_data()

    if target_lang not in data:
        return []

    scores = data[target_lang]
    candidates = [
        (lang, score)
        for lang, score in scores.items()
        if lang in available_langs and score >= threshold
    ]

    # Sort by score (descending)
    candidates.sort(key=lambda x: x[1], reverse=True)

    return [lang for lang, score in candidates]


def get_best_pivot(
    source: str,
    target: str,
    available_pivots: List[str]
) -> Optional[Tuple[str, float]]:
    """
    Find the best pivot language for translation from source to target.

    Args:
        source: Source language code
        target: Target language code
        available_pivots: List of available pivot language codes

    Returns:
        Tuple of (pivot_language, combined_score) or None if no pivot found.
        Combined score is the average of source->pivot and pivot->target scores.

    Example:
        >>> get_best_pivot('gl', 'ro', ['en', 'es', 'pt', 'fr'])
        ('pt', 235.5)
    """
    data = _load_data()

    if source not in data or target not in data:
        return None

    source_scores = data.get(source, {})
    target_scores = data.get(target, {})

    best_pivot = None
    best_score = 0.0

    for pivot in available_pivots:
        source_to_pivot = source_scores.get(pivot, 0)
        pivot_to_target = target_scores.get(pivot, 0)

        if source_to_pivot > 0 and pivot_to_target > 0:
            combined_score = (source_to_pivot + pivot_to_target) / 2

            if combined_score > best_score:
                best_score = combined_score
                best_pivot = pivot

    if best_pivot:
        return (best_pivot, best_score)
    return None


def get_all_pairs(language: str) -> Dict[str, int]:
    """
    Get all language pairs and their compatibility scores for a given language.

    Args:
        language: Language code

    Returns:
        Dictionary mapping language codes to compatibility scores

    Example:
        >>> pairs = get_all_pairs('es')
        >>> print(f"Spanish pairs: {len(pairs)}")
        >>> print(f"Top 3: {sorted(pairs.items(), key=lambda x: x[1], reverse=True)[:3]}")
    """
    data = _load_data()
    return data.get(language, {})


def get_supported_languages() -> List[str]:
    """
    Get list of all supported language codes.

    Returns:
        List of ISO 639-1 (2-letter) language codes

    Example:
        >>> langs = get_supported_languages()
        >>> print(f"Total languages: {len(langs)}")
        139
    """
    data = _load_data()
    return list(data.keys())


def get_language_family_score(language: str, family: List[str]) -> Dict[str, int]:
    """
    Get compatibility scores between a language and a family of languages.

    Args:
        language: Language code
        family: List of language codes in the family

    Returns:
        Dictionary mapping family language codes to compatibility scores

    Example:
        >>> romance = ['es', 'pt', 'fr', 'it', 'ro', 'ca']
        >>> scores = get_language_family_score('es', romance)
        >>> print(scores)
    """
    data = _load_data()

    if language not in data:
        return {}

    scores = data[language]
    return {lang: scores[lang] for lang in family if lang in scores}


# Convenience data export
def get_data() -> Dict[str, Dict[str, int]]:
    """
    Get the raw compatibility data.

    Returns:
        Complete compatibility matrix as nested dictionary

    Example:
        >>> data = get_data()
        >>> score = data['es']['pt']
        245
    """
    return _load_data()


__all__ = [
    'get_compatibility',
    'get_fallback_chain',
    'get_best_pivot',
    'get_all_pairs',
    'get_supported_languages',
    'get_language_family_score',
    'get_data',
]
