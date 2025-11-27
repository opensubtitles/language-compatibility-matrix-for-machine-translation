#!/usr/bin/env python3
"""Setup script for language-compatibility-matrix package."""

from setuptools import setup
import json
from pathlib import Path

# Read the long description from README
readme_file = Path(__file__).parent / "README.md"
long_description = readme_file.read_text(encoding="utf-8")

# Read version from package.json to keep in sync
package_json = Path(__file__).parent / "package.json"
with open(package_json, "r") as f:
    pkg_data = json.load(f)
    version = pkg_data["version"]

setup(
    name="language-compatibility-matrix",
    version=version,
    description="Comprehensive dataset quantifying linguistic distance and translation compatibility between 139 global languages",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="OpenSubtitles.org",
    author_email="admin@opensubtitles.org",
    url="https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation",
    project_urls={
        "Bug Reports": "https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation/issues",
        "Source": "https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation",
        "Documentation": "https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation#readme",
        "npm Package": "https://www.npmjs.com/package/@opensubtitles/language-compatibility-matrix",
    },
    license="MIT",
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Software Development :: Internationalization",
        "Topic :: Software Development :: Localization",
        "Topic :: Text Processing :: Linguistic",
        "Natural Language :: English",
        "Operating System :: OS Independent",
    ],
    keywords=[
        "language-compatibility",
        "language-distance",
        "language-similarity",
        "linguistic-distance",
        "machine-translation",
        "nmt",
        "neural-machine-translation",
        "nlp",
        "natural-language-processing",
        "i18n",
        "l10n",
        "internationalization",
        "localization",
        "pivot-language",
        "language-fallback",
        "zero-shot",
        "transfer-learning",
        "cross-lingual",
        "multilingual",
        "translation-quality",
        "mutual-intelligibility",
        "lexical-similarity",
        "dataset",
        "linguistics",
    ],
    python_requires=">=3.7",
    package_dir={"": "src"},
    py_modules=["language_compatibility"],
    package_data={
        "": ["language-pairs-translation-proximity.json"],
    },
    include_package_data=True,
    install_requires=[],
    extras_require={
        "dev": ["pytest>=7.0", "black>=22.0", "flake8>=4.0"],
    },
    zip_safe=True,
)
