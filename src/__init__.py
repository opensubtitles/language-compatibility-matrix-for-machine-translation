"""Language Compatibility Matrix for Machine Translation."""

from .language_compatibility import (
    get_compatibility,
    get_fallback_chain,
    get_best_pivot,
    get_all_pairs,
    get_supported_languages,
    get_language_family_score,
    get_data,
    __version__,
)

__all__ = [
    'get_compatibility',
    'get_fallback_chain',
    'get_best_pivot',
    'get_all_pairs',
    'get_supported_languages',
    'get_language_family_score',
    'get_data',
    '__version__',
]
