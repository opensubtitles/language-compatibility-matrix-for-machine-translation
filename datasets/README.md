# Language Translation Proximity Datasets

This directory contains various language compatibility datasets for machine translation analysis.

## Available Datasets

### 1. Extended Dataset
**File:** `language-pairs-translation-proximity.json`

The most comprehensive dataset with extensive coverage of language pairs and detailed proximity scores.

- **Coverage:** 100+ languages
- **Pairs:** 10,000+ directional pairs
- **Source:** Aggregated from multiple sources
- **Use Case:** Comprehensive analysis and research

---

### 2. Gemini v1 Dataset
**File:** `language-pairs-translation-proximity-gemini-v1.json`

**Documentation:** [../visualization/gemini-dataset-documentation.html](../visualization/gemini-dataset-documentation.html)

Global Linguistic Compatibility Framework for Neural Machine Translation based on comprehensive linguistic research.

- **Coverage:** Selected major languages
- **Methodology:**
  - Lexical Similarity (δ_lex): Percentage of shared cognates
  - Levenshtein Distance (δ_lev): Edit distance between cognates
  - Mutual Intelligibility (δ_int): Functional understanding between speakers
- **Scoring:** 0-255 scale (also uses 0-1000 analytical scale)
- **Key Findings:**
  - Romance: Spanish-Portuguese (TCS: 227/255)
  - Slavic: Czech-Slovak (TCS: 250/255)
  - Germanic: Scandinavian continuum exceptional
  - Turkic: Within-branch high, cross-branch drops

---

### 3. Perplexity v1 Dataset
**File:** `language-pairs-translation-proximity-perplexity-v1.json`

**Documentation:** [../visualization/perplexity-dataset-documentation.html](../visualization/perplexity-dataset-documentation.html)

AI-generated language compatibility scores optimized for practical translation workflows.

- **Coverage:** 40+ languages
- **Focus:** Real-world NMT system performance
- **Features:**
  - Balanced scores across language families
  - Optimized for practical translation workflows
  - Based on modern NMT system performance (2024)
- **Key Highlights:**
  - Czech-Slovak: 250/255
  - Ukrainian-Belarusian: 190/255
  - Spanish-Portuguese: 220/255
  - Norwegian-Danish: 235/255

---

## Score Interpretation

All datasets use a **0-255 scale** where:

- **250-255:** Near-perfect compatibility
- **200-249:** Excellent compatibility
- **150-199:** Good compatibility
- **100-149:** Moderate compatibility
- **50-99:** Limited compatibility
- **0-49:** Low compatibility

## Usage

These datasets are used by the [Language Compatibility Matrix Visualization Tool](../visualization/index.html).

### Programmatic Access

```javascript
// Load dataset
const response = await fetch('datasets/language-pairs-translation-proximity.json');
const languageData = await response.json();

// Get compatibility score
const score = languageData['en']['es']; // English to Spanish
console.log(`English → Spanish: ${score}/255`);
```

### Python Example

```python
import json

# Load dataset
with open('datasets/language-pairs-translation-proximity.json', 'r') as f:
    language_data = json.load(f)

# Get compatibility score
score = language_data['en']['es']
print(f"English → Spanish: {score}/255")
```

## Data Format

All datasets follow the same JSON structure:

```json
{
  "source_language_code": {
    "target_language_code": compatibility_score,
    "another_target": compatibility_score
  },
  "another_source": {
    "target_1": compatibility_score,
    "target_2": compatibility_score
  }
}
```

## Applications

- **Translation Pivot Selection:** Choose optimal intermediate languages
- **Quality Prediction:** Estimate translation quality before processing
- **Resource Allocation:** Prioritize training data for high-value pairs
- **Workflow Optimization:** Route requests through compatible language paths
- **Transfer Learning:** Leverage pre-trained models from related languages

## Contributing

To add a new dataset:

1. Create a JSON file following the standard format
2. Place it in this directory
3. Add documentation in `../visualization/`
4. Update `../visualization/visualization.js` DATASETS configuration
5. Add option to `../visualization/index.html` dropdown

## License

These datasets are provided for research and educational purposes. Please refer to individual dataset documentation for specific licensing and attribution requirements.
