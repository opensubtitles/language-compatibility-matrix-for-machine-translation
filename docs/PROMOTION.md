# Promotion & Submission Guide

## PyPI Publication Instructions

To publish to PyPI (requires build tools):

```bash
# Install build tools (if needed)
pip install --upgrade build twine

# Build the package
python3 -m build

# Upload to PyPI (you'll need PyPI credentials)
python3 -m twine upload dist/*
```

After publishing, the package will be available as:
```bash
pip install language-compatibility-matrix
```

---

## Awesome Lists Submissions

### 1. awesome-nlp (keon/awesome-nlp) ⭐17,979
**Repository**: https://github.com/keon/awesome-nlp
**Category**: Datasets > Machine Translation

**Submission Text**:
```markdown
* [Language Compatibility Matrix](https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation) - Comprehensive dataset quantifying linguistic distance and translation compatibility between 139 global languages. Translation Compatibility Scores (0-255) for intelligent pivot language selection, zero-shot transfer, and fallback chains.
```

**How to Submit**:
1. Fork the repository
2. Add entry under "Datasets" → "Machine Translation" section
3. Create pull request with title: "Add Language Compatibility Matrix dataset"

---

### 2. awesome-i18n (oh-jon-paul/awesome-i18n) ⭐386
**Repository**: https://github.com/oh-jon-paul/awesome-i18n
**Category**: Tools & Libraries > JavaScript or Python

**Submission Text**:
```markdown
### Language Compatibility Matrix
- **Description**: Dataset of linguistic distance scores between 139 languages for intelligent language fallback and pivot translation
- **Package**: [npm](https://www.npmjs.com/package/@opensubtitles/language-compatibility-matrix) | [PyPI](https://pypi.org/project/language-compatibility-matrix/) (pending)
- **Repository**: https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation
- **License**: MIT
```

**How to Submit**:
1. Fork the repository
2. Add entry under appropriate section (Tools & Libraries or Datasets)
3. Create pull request with title: "Add Language Compatibility Matrix"

---

### 3. awesome-public-datasets (awesomedata/awesome-public-datasets) ⭐70,823
**Repository**: https://github.com/awesomedata/awesome-public-datasets
**Category**: Natural Language

**Submission Text**:
```markdown
* [Language Compatibility Matrix for Machine Translation](https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation) - Translation Compatibility Scores (0-255) quantifying linguistic distance between 139 global languages based on lexical similarity, mutual intelligibility, and Levenshtein distance. JSON format, 139 languages, MIT license.
```

**How to Submit**:
1. Fork the repository
2. Add entry under "Natural Language" section (alphabetically)
3. Create pull request with title: "Add Language Compatibility Matrix dataset"

---

### 4. awesome-translations (mbiesiad/awesome-translations) ⭐172
**Repository**: https://github.com/mbiesiad/awesome-translations
**Category**: Tools

**Submission Text**:
```markdown
- [Language Compatibility Matrix](https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation) - Linguistic distance and translation compatibility scores for 139 languages. Helps select optimal pivot languages and build intelligent fallback chains for i18n/l10n.
```

---

## Social Media Posts

### Twitter/X Post #1 (Main Announcement)

```
🚀 Just released: Language Compatibility Matrix for Machine Translation

📊 139 languages × compatibility scores (0-255)
🎯 Use cases:
  • Intelligent pivot language selection
  • Zero-shot transfer learning
  • Smart i18n/l10n fallback chains

📦 npm: @opensubtitles/language-compatibility-matrix
🔗 https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation

#NLP #MachinTranslation #i18n #l10n #OpenData #ComputationalLinguistics #MultilingualNLP #ZeroShot #TransferLearning
```

### Twitter/X Post #2 (Technical Deep Dive)

```
💡 Did you know? Not all language pairs are equal for MT!

Spanish→Portuguese: 245/255 ✅
English→German: 240/255 ✅
Slovak↔Czech: 252/255 (near-perfect!)

Our new dataset helps you choose the best pivot languages & fallback chains for your i18n stack

Try it: npm i @opensubtitles/language-compatibility-matrix

#MachineTranslation #NMT #Localization
```

### Twitter/X Post #3 (Use Case)

```
🌍 Building multilingual apps?

Skip trial & error! Our Language Compatibility Matrix tells you:
• Best fallback language (e.g., Slovak→Czech before English)
• Optimal pivot for translation (e.g., Galician via Portuguese not English)
• Compatible language families

139 languages. Free. MIT license.

https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation

#SoftwareDevelopment #i18n #InternationalDev
```

### LinkedIn Post

```
🎉 Excited to announce the release of the Language Compatibility Matrix for Machine Translation!

As developers and researchers building multilingual systems, we often face the question: "Which language should we use as a fallback?" or "What's the best pivot language for this translation pair?"

This new open-source dataset provides scientifically-backed answers with Translation Compatibility Scores (0-255) for 139 global languages based on:
• Lexical similarity
• Mutual intelligibility
• Levenshtein distance

**Real-World Applications:**
✅ Translation Management Systems (TMS)
✅ Neural Machine Translation (NMT) model selection
✅ i18n/l10n fallback chain optimization
✅ Zero-shot learning in multilingual NLP
✅ Language selection for transfer learning

**Easy Integration:**
📦 npm: @opensubtitles/language-compatibility-matrix
🐍 PyPI: language-compatibility-matrix (coming soon)
📄 JSON: Direct download or CDN access

Example: When Slovak (sk) content is unavailable, the optimal fallback order is Czech (252/255) → Polish (240/255) → English (195/255), not jumping straight to English!

MIT licensed. Ready for production use.

🔗 GitHub: https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation
📚 Full documentation included

Special thanks to the OpenSubtitles.org team for making this research dataset publicly available!

#MachineLearning #NaturalLanguageProcessing #SoftwareEngineering #OpenSource #Data #AI #NLP #Internationalization #Localization #MultilingualNLP
```

### Reddit Post (r/MachineLearning, r/LanguageTechnology, r/datasets)

**Title**: [R] Language Compatibility Matrix: 139 Languages × Translation Compatibility Scores for Intelligent Pivot Selection & Zero-Shot Learning

**Body**:
```markdown
Hi everyone!

I'm excited to share the **Language Compatibility Matrix for Machine Translation** - an open dataset that quantifies linguistic distance and translation compatibility between 139 global languages.

## What is it?

A comprehensive dataset providing Translation Compatibility Scores (0-255) for language pairs, based on:
- Lexical similarity (shared cognates from Swadesh lists)
- Normalized Levenshtein distance
- Mutual intelligibility studies

## Why does it matter?

Not all language pairs are created equal for MT. For example:
- Slovak ↔ Czech: 252/255 (near-perfect intelligibility)
- Spanish → Portuguese: 245/255 (high asymmetric intelligibility)
- Russian → Ukrainian: 248/255 (very high compatibility)

This helps with:
1. **Pivot language selection**: Route translations through the most similar "donor" language
2. **Zero-shot transfer**: Select optimal pre-training weights for low-resource languages
3. **Fallback chains**: Intelligent UI fallback (if `sk` is missing, fallback to `cs` before `en`)
4. **Model selection**: Choose the right base model for fine-tuning

## Data Format

JSON format, 139 source languages, ~68KB file size
```json
{
  "es": {
    "pt": 245,
    "ca": 248,
    "it": 230,
    "fr": 220
  }
}
```

## Installation

**npm**: `npm install @opensubtitles/language-compatibility-matrix`
**Direct download**: Available on GitHub
**CDN**: jsDelivr

## Repository & Documentation

📖 Full documentation: https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation

Includes:
- Methodology details
- Python & TypeScript integration examples
- Linguistic analysis by language family
- Academic references

## License

MIT - Free for commercial and research use

## Questions?

Happy to answer questions about methodology, use cases, or integration!

---

*Dataset curated by OpenSubtitles.org based on ASJP, Ethnologue, and peer-reviewed mutual intelligibility studies.*
```

### Hacker News Post

**Title**: Language Compatibility Matrix – Translation compatibility scores for 139 languages

**URL**: https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation

---

## Papers with Code Submission

**Note**: Papers with Code typically requires an associated academic paper. If you don't have a paper, you can:

### Option 1: Submit as Dataset (without paper)

1. Go to: https://paperswithcode.com/datasets
2. Click "Add Dataset"
3. Fill in:
   - **Name**: Language Compatibility Matrix for Machine Translation
   - **Full Name**: Language Compatibility Matrix for Machine Translation
   - **Homepage**: https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation
   - **Description**: Comprehensive dataset quantifying linguistic distance and translation compatibility between 139 global languages with Translation Compatibility Scores (0-255)
   - **Tasks**: Machine Translation, Cross-Lingual Transfer, Zero-Shot Learning
   - **Modalities**: Text
   - **Languages**: Multilingual (139 languages)
   - **License**: MIT

### Option 2: Write a Technical Report

Create a short technical report (arXiv paper) describing:
1. Methodology for score calculation
2. Data sources (ASJP, Ethnologue, mutual intelligibility studies)
3. Validation against known language pairs
4. Use cases and applications
5. Benchmark results

Then submit to arXiv under cs.CL (Computation and Language) and link from Papers with Code.

### Option 3: Write a Data Descriptor Paper

Submit to:
- **Data in Brief** (Elsevier)
- **Scientific Data** (Nature)
- **Journal of Open Source Software** (JOSS)

---

## Additional Promotion Channels

### 1. Dev.to / Medium Article

Write a technical blog post:
- "Choosing the Right Pivot Language for Machine Translation"
- "Building Intelligent i18n Fallback Chains with Language Compatibility Scores"
- "Zero-Shot Learning: Which Languages Should You Use for Transfer?"

### 2. Product Hunt

Launch on Product Hunt under "Developer Tools" or "Open Source"

### 3. Stack Overflow

Answer relevant questions and reference the dataset:
- "How to choose fallback languages for internationalization?"
- "Which languages are similar for machine translation?"
- "Best pivot language for translating X to Y?"

### 4. Academic Mailing Lists

- **Corpora List**: https://www.listserv.dfn.de/sympa/info/corpora
- **LinguistList**: https://linguistlist.org/

### 5. Discord/Slack Communities

- Hugging Face Discord
- EleutherAI Discord
- r/MachineLearning Discord
- NLP Community Slack

### 6. Conference Presentations

Submit to demo/poster tracks:
- ACL (Association for Computational Linguistics)
- EMNLP (Empirical Methods in NLP)
- LREC (Language Resources and Evaluation Conference)
- EACL (European Chapter of ACL)

---

## Hashtag Strategy

### Primary Hashtags (Always Use)
#NLP #MachinTranslation #OpenData #i18n #l10n

### Technical Hashtags
#NeuralMachineTranslation #NMT #ComputationalLinguistics #MultilingualNLP #CrossLingual #ZeroShot #TransferLearning

### Community Hashtags
#OpenSource #Dataset #Research #AI #ML #DeepLearning

### Platform-Specific
**Twitter**: Max 5-7 hashtags
**LinkedIn**: 3-5 hashtags
**Instagram**: 10-15 hashtags (if visual content)

---

## Metrics to Track

- GitHub Stars
- npm downloads
- PyPI downloads
- Documentation views
- Social media engagement
- Awesome list acceptance rate
- Citations (via Google Scholar alerts)

---

Last Updated: 2025-11-27
