#!/bin/bash
# Script to publish to PyPI
# Package is already built in dist/ directory

echo "Publishing language-compatibility-matrix to PyPI..."
echo ""
echo "You'll need your PyPI API token from: https://pypi.org/manage/account/token/"
echo ""

source .venv/bin/activate
python -m twine upload dist/*

# Or use API token directly:
# python -m twine upload -u __token__ -p YOUR_PYPI_TOKEN dist/*

echo ""
echo "After publishing, package will be available at:"
echo "https://pypi.org/project/language-compatibility-matrix/"
echo ""
echo "Users can install with:"
echo "pip install language-compatibility-matrix"
