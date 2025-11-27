# Global Language Compatibility Matrix for Machine Translation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/@opensubtitles/language-compatibility-matrix.svg)](https://www.npmjs.com/package/@opensubtitles/language-compatibility-matrix)
[![npm downloads](https://img.shields.io/npm/dm/@opensubtitles/language-compatibility-matrix.svg)](https://www.npmjs.com/package/@opensubtitles/language-compatibility-matrix)
[![Data: JSON](https://img.shields.io/badge/Data-JSON-blue.svg)](#data-the-compatibility-dataset)
[![Languages: 139](https://img.shields.io/badge/Languages-139-brightgreen.svg)](#)
[![Topic: NLP](https://img.shields.io/badge/Topic-NLP-green.svg)](#)
[![Topic: i18n](https://img.shields.io/badge/Topic-i18n-blue.svg)](#)
[![GitHub Stars](https://img.shields.io/github/stars/opensubtitles/language-compatibility-matrix-for-machine-translation?style=social)](https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation)

> **A comprehensive dataset quantifying linguistic distance and translation compatibility between 139 global languages**

Designed for developers and researchers building **Translation Management Systems (TMS)**, **Neural Machine Translation (NMT)** pipelines, and **Language Fallback Strategies** in internationalization (i18n) and localization (l10n).

## 📖 Table of Contents

- [Executive Summary](#executive-summary)
- [Methodology](#methodology)
- [Data: The Compatibility Dataset (JSON)](#data-the-compatibility-dataset-json)
- [Integration Guide](#integration-guide)
- [Linguistic Clusters & Analysis](#linguistic-clusters--analysis)
  - [Romance Languages](#romance-languages)
  - [Germanic Languages](#germanic-languages)
  - [Slavic Languages](#slavic-languages)
  - [Indo-Aryan & Dravidian](#indo-aryan--dravidian)
- [References](#references)

## 🏷️ Keywords & Tags

**Core Concepts:** Language Compatibility • Language Distance • Language Similarity • Language Proximity • Linguistic Distance • Linguistic Similarity • Linguistic Proximity • Linguistic Affinity • Language Relatedness • Language Kinship • Translation Compatibility • Translation Distance

**Machine Translation:** Machine Translation • MT • Neural Machine Translation • NMT • Statistical Machine Translation • SMT • Translation Model • Translation Engine • MT Quality • Translation Quality Prediction • MT Evaluation • Automatic Translation • Translation Automation

**NLP & AI:** Natural Language Processing • NLP • Computational Linguistics • Multilingual NLP • Cross-Lingual NLP • Multilingual Models • Cross-Lingual Embeddings • Language Models • Pretrained Models • Transfer Learning • Zero-Shot Learning • Few-Shot Learning • Low-Resource Languages • Underresourced Languages

**Internationalization:** Internationalization • i18n • Localization • l10n • Globalization • g11n • Translation Management • TMS • Translation Management System • Content Localization • Software Localization • Website Translation • App Localization • Multilingual Content • Multilingual Support

**Language Selection:** Pivot Language • Pivot Translation • Intermediate Language • Bridge Language • Language Fallback • Fallback Chain • Fallback Strategy • Language Routing • Translation Routing • Best Translation Path • Optimal Translation Route

**Linguistic Metrics:** Mutual Intelligibility • Lexical Similarity • Lexical Distance • Lexical Overlap • Cognate Detection • Cognate Similarity • Levenshtein Distance • Edit Distance • String Similarity • Phonological Distance • Morphological Similarity • Syntactic Similarity • Language Typology

**Language Pairs:** Language Pairs • Translation Pairs • Source Language • Target Language • Language Combinations • Bidirectional Translation • Language Mapping • Translation Matrix • Compatibility Matrix • Similarity Matrix • Distance Matrix

**Language Families:** Romance Languages • Latin Languages • Germanic Languages • Slavic Languages • Scandinavian Languages • Nordic Languages • Indo-European Languages • Indo-Aryan Languages • Dravidian Languages • Uralic Languages • Turkic Languages • Semitic Languages • Sino-Tibetan Languages

**Specific Languages:** Spanish Portuguese Italian French German English Russian Chinese Arabic Japanese Hindi Urdu Turkish Korean Vietnamese Polish Czech Slovak Ukrainian Danish Swedish Norwegian Finnish Dutch Catalan Romanian Greek Hebrew Hungarian Thai Indonesian Malay

**Use Cases:** Translation Quality Estimation • Translation Memory • CAT Tools • Computer-Assisted Translation • Translation Workflow • Multilingual SEO • Multilingual Chatbots • Multilingual Search • Language Detection • Language Identification • Translation API • Translation Service

**Research & Data:** Dataset • JSON Dataset • Open Data • Research Dataset • Linguistic Database • Language Database • Translation Dataset • NLP Dataset • Benchmark Dataset • Language Metrics • Language Statistics • Corpus Linguistics • Quantitative Linguistics • Language Resources

**Related Fields:** Glottochronology • Phylogenetic Linguistics • Historical Linguistics • Comparative Linguistics • Sociolinguistics • Psycholinguistics • Applied Linguistics • Translation Studies • Dialectology • Language Contact

## Executive Summary

In Machine Translation and Localization, **not all language pairs are created equal**. Transfer learning from Slovak to Czech is significantly more efficient than from English to Czech due to high morphosyntactic isomorphism and lexical overlap.

This repository provides a **Translation Compatibility Score (TCS)** for language pairs, normalized to a **0–255 scale** (8-bit integer) for efficient storage and processing. A score of **255** indicates perfect intelligibility or identity; a score of **0** indicates no practical transferability.

### Key Use Cases:

- **Pivot Language Selection**: Routing translations through the most similar "donor" language (e.g., translating Galician via Portuguese rather than English).
- **Zero-Shot Transfer**: Selecting optimal pre-training weights for low-resource languages.
- **Fallback Chains**: Intelligent UI fallback (e.g., if `sk` is missing, fallback to `cs` before `en`).

## Methodology

The **Translation Compatibility Score (TCS)** is a weighted aggregate of three linguistic metrics:

1. **Lexical Similarity** ($\delta_{lex}$): The percentage of shared cognates in standardized Swadesh lists (e.g., Slovak *voda* vs Czech *voda*).
2. **Normalized Levenshtein Distance** ($\delta_{lev}$): The orthographic edit distance required to transform tokens from Source to Target.
3. **Mutual Intelligibility** ($\delta_{int}$): Functional asymmetric intelligibility based on speaker studies (e.g., Danish speakers understanding Norwegian Bokmål).

### The Scale

- **Input Data**: Normalized coefficients ($0.0 - 1.0$) from academic sources (ASJP, Ethnologue).
- **Output Score**: Mapped to **0 - 255**.

| Score Range | Interpretation | Example |
|-------------|----------------|---------|
| **255** | Identity (Same Language) | `en-en`, `es-es` |
| **250+** | Near-Perfect Intelligibility | Slovak ↔ Czech |
| **200+** | High Intelligibility (Dialect Continuum) | Danish ↔ Norwegian |
| **150+** | High Lexical Similarity (Same Branch) | Spanish ↔ Italian |
| **50-100** | Genetic Relation, Low Intelligibility | English ↔ German |

## Data: The Compatibility Dataset (JSON)

The dataset is provided in [`language-pairs-translation-proximity.json`](./language-pairs-translation-proximity.json).

### Installation

**Via npm:**
```bash
npm install @opensubtitles/language-compatibility-matrix
```

**Via direct download:**
```bash
curl -O https://raw.githubusercontent.com/opensubtitles/language-compatibility-matrix-for-machine-translation/master/language-pairs-translation-proximity.json
```

**Via CDN (jsDelivr):**
```javascript
// Always get the latest version
const url = 'https://cdn.jsdelivr.net/gh/opensubtitles/language-compatibility-matrix-for-machine-translation@master/language-pairs-translation-proximity.json';

// Or use a specific version
const url = 'https://cdn.jsdelivr.net/gh/opensubtitles/language-compatibility-matrix-for-machine-translation@v1.0.0/language-pairs-translation-proximity.json';
```

### Data Format

This JSON object is keyed by **ISO 639-1** (2-letter) language codes.

### Structure

```json
{
  "sk": {
    "cs": 252,
    "pl": 240,
    "ru": 220,
    "en": 195
  },
  "es": {
    "pt": 245,
    "ca": 248,
    "it": 230,
    "fr": 220
  }
}
```

## Integration Guide

### Python Example: Intelligent Fallback

```python
import json

with open('language-pairs-translation-proximity.json') as f:
    compatibility = json.load(f)

def get_fallback_chain(target_lang, available_langs, threshold=150):
    """
    Returns a prioritized list of fallback languages for target_lang.

    Args:
        target_lang: ISO 639 code (e.g., 'sk')
        available_langs: List of available language codes
        threshold: Minimum compatibility score (default: 150)

    Returns:
        List of language codes sorted by compatibility score
    """
    if target_lang not in compatibility:
        return []

    scores = compatibility[target_lang]
    candidates = [
        (lang, score)
        for lang, score in scores.items()
        if lang in available_langs and score >= threshold
    ]

    return [lang for lang, score in sorted(candidates, key=lambda x: x[1], reverse=True)]

# Example usage
available = ['en', 'cs', 'pl', 'de']
fallbacks = get_fallback_chain('sk', available)
print(f"Fallback chain for Slovak: {fallbacks}")
# Output: ['cs', 'pl', 'en'] (de not included, below threshold)
```

### JavaScript/TypeScript Example

```typescript
import compatibilityData from './language-pairs-translation-proximity.json';

interface CompatibilityMatrix {
  [sourceLang: string]: {
    [targetLang: string]: number;
  };
}

const compatibility: CompatibilityMatrix = compatibilityData;

function getBestPivot(
  sourceLang: string,
  targetLang: string,
  availablePivots: string[]
): string | null {
  const sourceScores = compatibility[sourceLang] || {};
  const targetScores = compatibility[targetLang] || {};

  let bestPivot: string | null = null;
  let bestScore = 0;

  for (const pivot of availablePivots) {
    const sourceToP = sourceScores[pivot] || 0;
    const pivotToTarget = targetScores[pivot] || 0;
    const combinedScore = (sourceToP + pivotToTarget) / 2;

    if (combinedScore > bestScore) {
      bestScore = combinedScore;
      bestPivot = pivot;
    }
  }

  return bestPivot;
}

// Example: Translating from Galician to Romanian
const pivot = getBestPivot('gl', 'ro', ['en', 'es', 'pt', 'fr']);
console.log(`Best pivot language: ${pivot}`); // 'pt' or 'es'
```

## Linguistic Clusters & Analysis

### Romance Languages

The Romance family exhibits some of the highest internal compatibility scores in the world.

- **Spanish (es) & Portuguese (pt)**: Score **245**. High asymmetric intelligibility; Portuguese speakers generally understand Spanish better than vice versa.
- **Spanish (es) & Catalan (ca)**: Score **248**. Catalan shows very high compatibility with Spanish.
- **Italian (it) & Spanish (es)**: Score **230**. Strong lexical similarity across the Romance branch.
- **Italian (it) & French (fr)**: Score **220**. High lexical similarity despite phonological differences.
- **Catalan (ca)**: Acts as a bridge between Ibero-Romance (es: 248, pt: 235) and Gallo-Romance (fr: 225, it: 220).

### Germanic Languages

- **The Scandinavian Continuum**: Danish (da), Norwegian (nb), and Swedish (sv) share very high scores: da-nb: **245**, da-sv: **248**, nb-sv: **240**, allowing for near-lossless "semicommunication".
- **West Germanic**: English (en) to German (de) shows a score of **240**, while Dutch (nl) to German also scores **240**, reflecting their shared West Germanic heritage.

### Slavic Languages

- **Slovak (sk) & Czech (cs)**: Score **252**. These are functionally mutually intelligible dialects in many contexts.
- **Russian (ru) & Ukrainian (uk)**: Score **248**. Very high mutual intelligibility reflecting their close East Slavic relationship.
- **Ukrainian (uk) & Polish (pl)**: Score **235**. Strong compatibility reflecting historical and geographic proximity.

### Indo-Aryan & Dravidian

- **Hindi (hi) & Urdu (ur)**: Score **248**. Spoken registers are identical (Hindustani); the score accounts for the script difference (Devanagari vs. Perso-Arabic) which requires transliteration algorithms.
- **Tamil (ta) & Malayalam (ml)**: Score **215**. High lexical overlap due to shared Sanskrit loans and Proto-Dravidian roots.

## References

1. **ASJP (Automated Similarity Judgment Program)**: Müller, André, et al. "ASJP World Language Tree of Lexical Similarity: Version 3." [http://asjp.clld.org/](http://asjp.clld.org/)

2. **Ethnologue**: Simons, Gary F., and Charles D. Fennig (eds.). 2018. *Ethnologue: Languages of the World, Twenty-first edition*. Dallas, Texas: SIL International. [https://www.ethnologue.com/](https://www.ethnologue.com/)

3. **Gooskens, C., et al. (2018)**: Mutual intelligibility between closely related languages in Europe. *International Journal of Multilingualism*. [DOI: 10.1080/14790718.2017.1350185](https://doi.org/10.1080/14790718.2017.1350185)

4. **Dyen, I., Kruskal, J. B., & Black, P. (1992)**: An Indoeuropean classification: A lexicostatistical experiment. *Transactions of the American Philosophical Society*. [DOI: 10.2307/1006517](https://doi.org/10.2307/1006517)

5. **ISO 639-2 Registration Authority**: Library of Congress. [https://www.loc.gov/standards/iso639-2/](https://www.loc.gov/standards/iso639-2/)

---

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! If you have updated linguistic research, additional language pairs, or improvements to the scoring methodology, please open an issue or submit a pull request.

## Citation

If you use this dataset in your research, please cite:

```bibtex
@misc{language-compatibility-matrix-2024,
  title={Global Language Compatibility Matrix for Machine Translation},
  author={OpenSubtitles.org},
  year={2024},
  publisher={GitHub},
  url={https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation}
}
```
