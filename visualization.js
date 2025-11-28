// Language Compatibility Matrix Visualization
let languageData = {};
let currentView = 'heat';
let matrixChart = null;
let networkChart = null;
let scatterChart = null;
let selectedSource = null;
let selectedTarget = null;
let languageStats = {};
let searchTimeout = null;
let heatMapFilter = 'major'; // 'all' or 'major' - default to major languages
let currentLanguages = []; // Store current filtered languages for redrawing
let currentData = []; // Store current data matrix
let currentLabels = []; // Store current labels

// Available datasets
const DATASETS = {
    'main': {
        name: 'Extended Dataset',
        file: './datasets/language-pairs-translation-proximity.json',
        description: 'Extended translation proximity scores',
        reference: null
    },
    'gemini': {
        name: 'Gemini v1 Dataset',
        file: './datasets/language-pairs-translation-proximity-gemini-v1.json',
        description: 'Global Linguistic Compatibility Framework for Neural Machine Translation',
        reference: {
            title: 'Global Linguistic Compatibility Framework for Neural Machine Translation',
            url: 'gemini-dataset-documentation.html',
            summary: `This comprehensive research establishes a <strong>Translation Compatibility Score (TCS)</strong> system for measuring cross-lingual transfer efficiency in neural machine translation.

<div style="margin: 8px 0;">
<strong style="color: #764ba2;">Core Methodology:</strong>
<ul style="margin: 4px 0; padding-left: 25px; line-height: 1.4;">
<li style="margin: 2px 0;"><strong>Lexical Similarity (δ_lex):</strong> Percentage of shared cognates</li>
<li style="margin: 2px 0;"><strong>Levenshtein Distance (δ_lev):</strong> Edit distance between cognates</li>
<li style="margin: 2px 0;"><strong>Mutual Intelligibility (δ_int):</strong> Functional understanding between speakers</li>
</ul>
</div>

<div style="margin: 8px 0;">
<strong style="color: #764ba2;">Key Findings:</strong>
<ul style="margin: 4px 0; padding-left: 25px; line-height: 1.4;">
<li style="margin: 2px 0;"><strong>Romance:</strong> Spanish-Portuguese <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1px 5px; border-radius: 3px; font-size: 0.85em;">TCS: 227/255</span> - Catalan optimal bridge</li>
<li style="margin: 2px 0;"><strong>Slavic:</strong> Czech-Slovak near-perfect <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1px 5px; border-radius: 3px; font-size: 0.85em;">TCS: 250/255</span> - passive bilingualism</li>
<li style="margin: 2px 0;"><strong>Germanic:</strong> Scandinavian continuum exceptional - English universal pivot</li>
<li style="margin: 2px 0;"><strong>Turkic:</strong> Within-branch high, cross-branch drops significantly</li>
</ul>
</div>

<p style="margin-top: 8px; font-style: italic; color: #555; line-height: 1.4;">The analysis demonstrates that language proximity enables higher-fidelity translation pathways than default English pivoting.</p>`
        }
    },
    'manus': {
        name: 'Manus v1 Dataset',
        file: './datasets/language-pairs-translation-proximity-manus-v1.json',
        description: 'Manual curation and refinement of language compatibility scores',
        reference: {
            title: 'Manus v1 Language Compatibility Dataset',
            url: 'manus-dataset-documentation.html',
            summary: `Manually curated language compatibility scores based on expert linguistic analysis. Covers 57 languages with 3,192 directional pairs, focusing on practical translation quality assessment.`
        }
    },
    'perplexity': {
        name: 'Perplexity v1 Dataset',
        file: './datasets/language-pairs-translation-proximity-perplexity-v1.json',
        description: 'Perplexity AI-powered Language Compatibility Matrix',
        reference: {
            title: 'Perplexity AI Language Compatibility Analysis',
            url: 'perplexity-dataset-documentation.html',
            summary: `AI-generated language compatibility scores based on comprehensive linguistic analysis and machine translation performance metrics.

<div style="margin: 8px 0;">
<strong style="color: #764ba2;">Dataset Features:</strong>
<ul style="margin: 4px 0; padding-left: 25px; line-height: 1.4;">
<li style="margin: 2px 0;">Comprehensive coverage of 40+ languages</li>
<li style="margin: 2px 0;">Balanced scores across language families</li>
<li style="margin: 2px 0;">Optimized for practical translation workflows</li>
<li style="margin: 2px 0;">Based on modern NMT system performance</li>
</ul>
</div>

<div style="margin: 8px 0;">
<strong style="color: #764ba2;">Key Highlights:</strong>
<ul style="margin: 4px 0; padding-left: 25px; line-height: 1.4;">
<li style="margin: 2px 0;"><strong>Czech-Slovak:</strong> Exceptional mutual intelligibility <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1px 5px; border-radius: 3px; font-size: 0.85em;">250/255</span></li>
<li style="margin: 2px 0;"><strong>Ukrainian-Belarusian:</strong> Near-perfect compatibility <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1px 5px; border-radius: 3px; font-size: 0.85em;">190/255</span></li>
<li style="margin: 2px 0;"><strong>Spanish-Portuguese:</strong> Strong Ibero-Romance connection <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1px 5px; border-radius: 3px; font-size: 0.85em;">220/255</span></li>
<li style="margin: 2px 0;"><strong>Norwegian-Danish:</strong> Scandinavian continuum <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1px 5px; border-radius: 3px; font-size: 0.85em;">235/255</span></li>
</ul>
</div>

<p style="margin-top: 8px; font-style: italic; color: #555; line-height: 1.4;">Optimized for real-world translation systems with emphasis on practical usability.</p>`
        }
    }
};
let currentDataset = 'perplexity';

// Helper function to check if language has a proper name
function hasLanguageName(langCode) {
    return LANGUAGE_METADATA.names[langCode] && LANGUAGE_METADATA.names[langCode].trim() !== '';
}

// Toggle heat map filter - make it globally accessible
window.setHeatMapFilter = function(filter) {
    heatMapFilter = filter;

    // Update button states
    document.querySelectorAll('.heatmap-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });

    // Reinitialize heat map
    initializeHeatMap();
};

// Switch dataset - make it globally accessible
window.switchDataset = function(datasetKey) {
    if (DATASETS[datasetKey]) {
        // Update description
        const descEl = document.getElementById('datasetDescription');
        if (descEl) {
            descEl.textContent = DATASETS[datasetKey].description;
        }

        // Show/hide reference panel
        showDatasetReference(datasetKey);

        // Load the new dataset
        loadLanguageData(datasetKey);
    }
};

// Show dataset reference information
function showDatasetReference(datasetKey) {
    const dataset = DATASETS[datasetKey];
    let refPanel = document.getElementById('datasetReference');

    // Create panel if it doesn't exist
    if (!refPanel) {
        refPanel = document.createElement('div');
        refPanel.id = 'datasetReference';
        refPanel.style.cssText = 'background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; border-radius: 8px; margin-bottom: 20px; display: none;';

        // Insert after dataset selector
        const controls = document.querySelector('.controls');
        const firstRow = controls.querySelector('.controls-row');
        controls.insertBefore(refPanel, firstRow);
    }

    // Show or hide based on whether dataset has reference
    if (dataset.reference) {
        refPanel.style.display = 'block';
        refPanel.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">
                📚 ${dataset.reference.title}
            </h3>
            <div style="color: #555; line-height: 1.5; font-size: 13px;">
                ${dataset.reference.summary}
            </div>
            <div style="margin-top: 12px;">
                <a href="${dataset.reference.url}" target="_blank" rel="noopener noreferrer"
                   style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                    📄 View Full Documentation →
                </a>
            </div>
        `;
    } else {
        refPanel.style.display = 'none';
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadLanguageData();
    setupEventListeners();
    showDatasetReference(currentDataset);
});

async function loadLanguageData(datasetKey = currentDataset) {
    try {
        // Show loading
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').innerHTML = '⏳ Loading dataset...';

        const dataset = DATASETS[datasetKey];
        const response = await fetch(dataset.file);
        languageData = await response.json();
        currentDataset = datasetKey;

        // Hide loading
        document.getElementById('loading').style.display = 'none';

        // Clear selections
        selectedSource = null;
        selectedTarget = null;

        // Populate language selects
        populateLanguageSelects();

        // Update statistics
        updateStatistics();

        // Clear pair analysis
        const pairAnalysis = document.getElementById('pairAnalysis');
        if (pairAnalysis) {
            pairAnalysis.innerHTML = 'Select a source and target language to see detailed compatibility information.';
        }

        // Re-initialize current view
        setView(currentView);

        console.log(`Dataset loaded successfully: ${dataset.name}`);
    } catch (error) {
        console.error('Error loading language data:', error);
        document.getElementById('loading').innerHTML = '❌ Error loading language data. Please check file path.';
    }
}

function populateLanguageSelects() {
    const sourceSelect = document.getElementById('sourceLang');
    const targetSelect = document.getElementById('targetLang');

    // Clear existing options
    sourceSelect.innerHTML = '<option value="">Select language...</option>';
    targetSelect.innerHTML = '<option value="">Select language...</option>';

    // Add language options
    Object.keys(languageData).sort().forEach(lang => {
        if (LANGUAGE_METADATA.names[lang]) {
            const option1 = new Option(LANGUAGE_METADATA.names[lang], lang);
            const option2 = new Option(LANGUAGE_METADATA.names[lang], lang);
            sourceSelect.add(option1);
            targetSelect.add(option2);
        }
    });
}

function updateStatistics() {
    // Count only languages with proper names
    const languagesWithNames = Object.keys(languageData).filter(lang => hasLanguageName(lang));
    const totalLanguages = languagesWithNames.length;
    let totalPairs = 0;
    let scoreSum = 0;
    let maxScore = 0;

    languagesWithNames.forEach(source => {
        Object.keys(languageData[source]).forEach(target => {
            if (source !== target && hasLanguageName(target)) {
                totalPairs++;
                const score = languageData[source][target];
                scoreSum += score;
                maxScore = Math.max(maxScore, score);
            }
        });
    });

    const avgScore = Math.round(scoreSum / totalPairs);

    document.getElementById('totalLanguages').textContent = totalLanguages;
    document.getElementById('totalPairs').textContent = totalPairs.toLocaleString();
    document.getElementById('avgScore').textContent = avgScore;
    document.getElementById('highScore').textContent = maxScore;
}

function initializeHeatMap() {
    const container = document.querySelector('.matrix-canvas-container');

    // Recreate canvas if it doesn't exist
    if (!document.getElementById('matrixCanvas')) {
        container.innerHTML = '<canvas id="matrixCanvas"></canvas>';
    }

    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    // Get languages sorted by family, then alphabetically (only those with proper names)
    let languages = Object.keys(languageData)
        .filter(lang => hasLanguageName(lang));

    // Filter to major languages if needed
    if (heatMapFilter === 'major') {
        // Get top 40 languages by connection count
        const languagesByConnections = languages.map(lang => ({
            code: lang,
            connections: Object.keys(languageData[lang]).length,
            avgScore: Object.values(languageData[lang]).reduce((a, b) => a + b, 0) / Object.keys(languageData[lang]).length
        }))
        .sort((a, b) => b.connections - a.connections)
        .slice(0, 40)
        .map(l => l.code);

        languages = languages.filter(lang => languagesByConnections.includes(lang));
    }

    // Sort by family, then alphabetically
    languages.sort((a, b) => {
        const familyA = getLanguageFamily(a);
        const familyB = getLanguageFamily(b);
        if (familyA !== familyB) return familyA.localeCompare(familyB);
        return LANGUAGE_METADATA.names[a].localeCompare(LANGUAGE_METADATA.names[b]);
    });

    // Set canvas size to fit container - add padding for labels
    const containerWidth = container.offsetWidth;
    const matrixSize = Math.min(containerWidth - 20, 1200); // Matrix area
    const labelPadding = currentLanguages.length <= 50 ? 120 : 40; // More padding for major view
    const canvasSize = matrixSize + labelPadding * 2;

    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.style.width = canvasSize + 'px';
    canvas.style.height = canvasSize + 'px';

    // Create data matrix and store globally
    currentLanguages = languages;
    currentData = [];
    currentLabels = languages.map(lang => LANGUAGE_METADATA.names[lang]);

    languages.forEach((source, i) => {
        const row = [];
        languages.forEach((target, j) => {
            const score = languageData[source][target] || 0;
            row.push(score);
        });
        currentData.push(row);
    });

    // Color scale function - improved contrast
    const getColor = (value) => {
        if (value === 0) return '#f0f0f0';

        // Use a more vibrant color scale with better contrast
        if (value >= 240) {
            // Very high compatibility - bright green with dark text
            return '#1a7321';
        } else if (value >= 200) {
            // High compatibility - green
            return '#2ea443';
        } else if (value >= 160) {
            // Medium compatibility - yellow/orange
            return '#f59e0b';
        } else if (value >= 100) {
            // Low compatibility - orange/red
            return '#e67e22';
        } else {
            // Very low compatibility - dark red
            return '#dc2626';
        }
    };

    // Draw custom heat map
    drawCustomHeatMap(ctx, currentData, currentLabels, currentLanguages, canvas.width, canvas.height);

    // Add click handler
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Account for label padding
        const labelPadding = currentLanguages.length <= 50 ? 120 : 40;
        const matrixSize = canvas.width - labelPadding * 2;
        const cellWidth = matrixSize / currentLanguages.length;
        const cellHeight = matrixSize / currentLanguages.length;

        // Adjust for label padding offset
        const adjustedX = x - labelPadding;
        const adjustedY = y - labelPadding;

        const col = Math.floor(adjustedX / cellWidth);
        const row = Math.floor(adjustedY / cellHeight);

        if (col >= 0 && col < currentLanguages.length && row >= 0 && row < currentLanguages.length) {
            const sourceLang = currentLanguages[row];
            const targetLang = currentLanguages[col];
            const score = currentData[row][col];

            // Update info panel
            updateInfoPanel(sourceLang, targetLang, score);

            // Update selects
            document.getElementById('sourceLang').value = sourceLang;
            document.getElementById('targetLang').value = targetLang;
            selectedSource = sourceLang;
            selectedTarget = targetLang;
        }
    });

    // Store current hover state for highlighting
    let currentHoverRow = -1;
    let currentHoverCol = -1;

    // Add hover handler with row/column highlighting
    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Account for label padding
        const labelPadding = currentLanguages.length <= 50 ? 120 : 40;
        const matrixSize = canvas.width - labelPadding * 2;
        const cellWidth = matrixSize / currentLanguages.length;
        const cellHeight = matrixSize / currentLanguages.length;

        // Adjust for label padding offset
        const adjustedX = x - labelPadding;
        const adjustedY = y - labelPadding;

        const col = Math.floor(adjustedX / cellWidth);
        const row = Math.floor(adjustedY / cellHeight);

        if (col >= 0 && col < currentLanguages.length && row >= 0 && row < currentLanguages.length) {
            const sourceLang = currentLanguages[row];
            const targetLang = currentLanguages[col];
            const score = currentData[row][col];

            // Redraw with highlight if position changed
            if (currentHoverRow !== row || currentHoverCol !== col) {
                currentHoverRow = row;
                currentHoverCol = col;

                // Redraw with highlight using global variables
                drawCustomHeatMap(ctx, currentData, currentLabels, currentLanguages, canvas.width, canvas.height, row, col);
            }

            // Show enhanced tooltip
            const sourceFamily = getLanguageFamily(sourceLang);
            const targetFamily = getLanguageFamily(targetLang);

            // Different tooltip for same language (diagonal cells)
            if (sourceLang === targetLang) {
                showTooltip(event.pageX, event.pageY,
                    `<strong>${LANGUAGE_METADATA.names[sourceLang]}</strong><br>` +
                    `<span style="font-size: 14px; color: #666;">Same language</span>`);
            } else {
                showTooltip(event.pageX, event.pageY,
                    `<strong>${LANGUAGE_METADATA.names[sourceLang]}</strong> (${sourceFamily}) →<br>` +
                    `<strong>${LANGUAGE_METADATA.names[targetLang]}</strong> (${targetFamily})<br>` +
                    `<span style="font-size: 16px; font-weight: bold; color: ${score >= 200 ? '#2ea443' : score >= 150 ? '#f59e0b' : '#dc2626'};">${score}/255</span>`);
            }
        }
    });

    canvas.addEventListener('mouseleave', function() {
        hideTooltip();
        // Clear highlight
        currentHoverRow = -1;
        currentHoverCol = -1;
        drawCustomHeatMap(ctx, currentData, currentLabels, currentLanguages, canvas.width, canvas.height);
    });

    // Show language reference list
    showLanguageReference(currentLanguages);
}

function showLanguageReference(languages) {
    const referenceDiv = document.getElementById('languageReference');
    const listDiv = document.getElementById('languageList');

    if (!referenceDiv || !listDiv) return;

    // Update header with count
    const headerText = heatMapFilter === 'major'
        ? `📋 Language Reference - Major Languages (${languages.length} shown)`
        : `📋 Language Reference - All Languages (${languages.length} total)`;

    const header = referenceDiv.querySelector('h4');
    if (header) header.textContent = headerText;

    // Group languages by family
    const byFamily = {};
    languages.forEach(lang => {
        const family = getLanguageFamily(lang);
        if (!byFamily[family]) byFamily[family] = [];
        byFamily[family].push(lang);
    });

    // Build HTML
    let html = '';
    Object.keys(byFamily).sort().forEach(family => {
        const familyData = Object.values(LANGUAGE_METADATA.families).find(f => f.name === family);
        const color = familyData ? familyData.color : '#999';

        html += `<div style="break-inside: avoid; margin-bottom: 15px;">`;
        html += `<div style="font-weight: bold; color: ${color}; margin-bottom: 5px; border-bottom: 2px solid ${color}; padding-bottom: 3px;">${family} (${byFamily[family].length})</div>`;
        html += `<div style="margin-left: 10px;">`;

        byFamily[family].sort((a, b) => {
            const nameA = LANGUAGE_METADATA.names[a] || a;
            const nameB = LANGUAGE_METADATA.names[b] || b;
            return nameA.localeCompare(nameB);
        }).forEach(lang => {
            html += `<div style="color: #666; padding: 2px 0;">${LANGUAGE_METADATA.names[lang]}</div>`;
        });

        html += `</div></div>`;
    });

    listDiv.innerHTML = html;
    referenceDiv.style.display = 'block';
}

function drawCustomHeatMap(ctx, data, labels, languages, width, height, highlightRow = -1, highlightCol = -1) {
    // Calculate padding and matrix area
    const labelPadding = languages.length <= 50 ? 120 : 40;
    const matrixSize = width - labelPadding * 2;
    const cellWidth = matrixSize / languages.length;
    const cellHeight = matrixSize / languages.length;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Save context for matrix drawing with offset
    ctx.save();
    ctx.translate(labelPadding, labelPadding);

    // Draw highlight overlay for row and column if hovering
    if (highlightRow >= 0 || highlightCol >= 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';

        // Highlight row
        if (highlightRow >= 0) {
            ctx.fillRect(0, highlightRow * cellHeight, matrixSize, cellHeight);
        }

        // Highlight column
        if (highlightCol >= 0) {
            ctx.fillRect(highlightCol * cellWidth, 0, cellWidth, matrixSize);
        }
    }

    // Draw cells with improved color scheme
    languages.forEach((source, i) => {
        languages.forEach((target, j) => {
            const score = data[i][j];
            const x = j * cellWidth;
            const y = i * cellHeight;

            let r, g, b;

            // Diagonal cells (same language) - gray
            if (i === j) {
                r = g = b = 200; // Light gray for same-language pairs
            } else {
                // Improved color gradient: Red (low) → Yellow (medium) → Green (high)
                const normalized = score / 255;

                if (score === 0) {
                    // No data - light gray
                    r = g = b = 240;
                } else if (normalized < 0.5) {
                    // Red to Yellow (0-128)
                    const t = normalized * 2; // 0 to 1
                    r = 220;
                    g = Math.floor(50 + t * 180); // 50 to 230
                    b = 50;
                } else {
                    // Yellow to Green (128-255)
                    const t = (normalized - 0.5) * 2; // 0 to 1
                    r = Math.floor(220 - t * 180); // 220 to 40
                    g = 230;
                    b = Math.floor(50 + t * 30); // 50 to 80
                }
            }

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, y, cellWidth - 0.5, cellHeight - 0.5);

            // Numbers removed - cleaner visualization
        });
    });

    // Draw family separators to group languages
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    let currentFamily = null;
    languages.forEach((lang, i) => {
        const family = getLanguageFamily(lang);
        if (currentFamily !== null && family !== currentFamily) {
            const y = i * cellHeight;
            const x = i * cellWidth;
            // Draw horizontal line
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(matrixSize, y);
            ctx.stroke();
            // Draw vertical line
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, matrixSize);
            ctx.stroke();
        }
        currentFamily = family;
    });

    // Restore context before drawing labels
    ctx.restore();

    // Draw language labels if cells are large enough (e.g., Major Languages view)
    if (cellWidth > 20) {
        const fontSize = Math.min(cellWidth * 0.5, 10);
        ctx.fillStyle = '#333';
        ctx.font = `bold ${fontSize}px Arial`;

        labels.forEach((label, i) => {
            // Top labels (rotated 45 degrees)
            ctx.save();
            ctx.translate(labelPadding + i * cellWidth + cellWidth / 2, labelPadding - 10);
            ctx.rotate(-Math.PI / 4);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, 0, 0);
            ctx.restore();

            // Left labels (horizontal)
            ctx.save();
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, labelPadding - 10, labelPadding + i * cellHeight + cellHeight / 2);
            ctx.restore();
        });
    }

    // Save context for legend drawing
    ctx.save();

    // Add color scale legend at the bottom
    const legendHeight = 40;
    const legendY = height + 30;
    const legendWidth = Math.min(400, width * 0.8);
    const legendX = (width - legendWidth) / 2;

    // Draw gradient
    for (let i = 0; i <= legendWidth; i++) {
        const normalized = i / legendWidth;
        const score = Math.floor(normalized * 255);

        let r, g, b;
        if (normalized < 0.5) {
            const t = normalized * 2;
            r = 220;
            g = Math.floor(50 + t * 180);
            b = 50;
        } else {
            const t = (normalized - 0.5) * 2;
            r = Math.floor(220 - t * 180);
            g = 230;
            b = Math.floor(50 + t * 30);
        }

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(legendX + i, legendY, 1, 20);
    }

    // Draw legend labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('0', legendX, legendY + 35);
    ctx.fillText('Low', legendX + legendWidth * 0.25, legendY + 35);
    ctx.fillText('Medium', legendX + legendWidth * 0.5, legendY + 35);
    ctx.fillText('High', legendX + legendWidth * 0.75, legendY + 35);
    ctx.fillText('255', legendX + legendWidth, legendY + 35);

    // Add family legend
    const familiesInData = [...new Set(languages.map(lang => getLanguageFamily(lang)))].sort();
    const familyLegendY = legendY + 60;
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#666';
    ctx.fillText('Language Families (separated by black lines):', 20, familyLegendY);

    let xOffset = 20;
    let yOffset = familyLegendY + 20;
    familiesInData.forEach((family, idx) => {
        const familyData = Object.values(LANGUAGE_METADATA.families).find(f => f.name === family);
        if (familyData) {
            // Draw color box
            ctx.fillStyle = familyData.color;
            ctx.fillRect(xOffset, yOffset - 8, 12, 12);

            // Draw text
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.fillText(family, xOffset + 16, yOffset);

            xOffset += ctx.measureText(family).width + 35;

            // Wrap to next line if needed
            if (xOffset > width - 100 && idx < familiesInData.length - 1) {
                xOffset = 20;
                yOffset += 20;
            }
        }
    });

    // Restore context
    ctx.restore();
}

function updateInfoPanel(source, target, score) {
    const sourceFamily = getLanguageFamily(source);
    const targetFamily = getLanguageFamily(target);
    const sourceName = LANGUAGE_METADATA.names[source] || source;
    const targetName = LANGUAGE_METADATA.names[target] || target;

    let interpretation = '';
    if (score >= 240) {
        interpretation = 'Very High - Near perfect mutual intelligibility';
    } else if (score >= 200) {
        interpretation = 'High - Strong mutual intelligibility';
    } else if (score >= 150) {
        interpretation = 'Medium - Moderate mutual intelligibility';
    } else if (score >= 100) {
        interpretation = 'Low - Limited mutual intelligibility';
    } else {
        interpretation = 'Very Low - Minimal mutual intelligibility';
    }

    const analysis = `
        <div class="pair-analysis">
            <div class="analysis-item">
                <div class="analysis-label">Language Pair</div>
                <div class="analysis-value">${sourceName} → ${targetName}</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Compatibility Score</div>
                <div class="analysis-value ${getScoreClass(score)}">${score}/255</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Source Family</div>
                <div class="analysis-value">${sourceFamily}</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Target Family</div>
                <div class="analysis-value">${targetFamily}</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Interpretation</div>
                <div class="analysis-value ${getScoreClass(score)}">${interpretation}</div>
            </div>
        </div>
    `;

    document.getElementById('pairAnalysis').innerHTML = analysis;
}

function getLanguageFamily(lang) {
    for (const [family, data] of Object.entries(LANGUAGE_METADATA.families)) {
        if (data.languages.includes(lang)) {
            return data.name;
        }
    }
    return 'Other';
}

function setView(view) {
    currentView = view;

    // Update button states
    document.querySelectorAll('.matrix-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-view') === view) {
            btn.classList.add('active');
        }
    });

    // Show/hide legend and language reference
    document.getElementById('legend').style.display =
        view === 'families' ? 'block' : 'none';

    const langRef = document.getElementById('languageReference');
    if (langRef) {
        langRef.style.display = view === 'heat' ? 'block' : 'none';
    }

    // Switch visualization
    switch (view) {
        case 'heat':
            initializeHeatMap();
            break;
        case 'network':
            initializeNetworkGraph();
            break;
        case 'families':
            initializeFamilyView();
            break;
        case 'scatter':
            initializeScatterPlot();
            break;
        case 'rankings':
            initializeRankingsView();
            break;
        case 'bidirectional':
            initializeBidirectionalView();
            break;
        case 'statistics':
            initializeStatisticsView();
            break;
    }
}

function initializeNetworkGraph() {
    const container = document.querySelector('.matrix-canvas-container');
    container.innerHTML = '<canvas id="networkCanvas"></canvas>';

    const canvas = document.getElementById('networkCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = container.offsetWidth;
    canvas.height = Math.max(container.offsetHeight, 800); // Minimum 800px height

    // Create network graph
    drawNetworkGraph(ctx, canvas.width, canvas.height);
}

function drawNetworkGraph(ctx, width, height) {
    // Get top 20 languages by connections (only those with proper names)
    const languages = Object.keys(languageData).filter(lang => hasLanguageName(lang));
    const connections = languages.map(lang => {
        const connections = Object.keys(languageData[lang]).length;
        return { lang, connections };
    }).sort((a, b) => b.connections - a.connections).slice(0, 20);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.42; // Increased from 0.35 to 0.42

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw edges
    connections.forEach((node1, i) => {
        const angle1 = (i / connections.length) * Math.PI * 2;
        const x1 = centerX + Math.cos(angle1) * radius;
        const y1 = centerY + Math.sin(angle1) * radius;

        connections.forEach((node2, j) => {
            if (i < j) {
                const angle2 = (j / connections.length) * Math.PI * 2;
                const x2 = centerX + Math.cos(angle2) * radius;
                const y2 = centerY + Math.sin(angle2) * radius;

                const score = languageData[node1.lang][node2.lang] || 0;
                const opacity = score / 255;

                ctx.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
                ctx.lineWidth = 1 + opacity * 2;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        });
    });

    // Draw nodes
    connections.forEach((node, i) => {
        const angle = (i / connections.length) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const family = getLanguageFamily(node.lang);
        const color = getFamilyColor(family);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2); // Increased node size from 8 to 10
        ctx.fill();

        // Position label further out based on angle to avoid overlap
        const labelDistance = 25; // Distance from node center
        const labelX = x + Math.cos(angle) * labelDistance;
        const labelY = y + Math.sin(angle) * labelDistance;

        ctx.fillStyle = '#333';
        ctx.font = 'bold 13px Arial'; // Increased from 10px to 13px, made bold
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(LANGUAGE_METADATA.names[node.lang], labelX, labelY);
    });
}

function initializeFamilyView() {
    const container = document.querySelector('.matrix-canvas-container');
    container.innerHTML = '<canvas id="familyCanvas"></canvas>';

    const canvas = document.getElementById('familyCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = container.offsetWidth;
    canvas.height = Math.max(container.offsetHeight, 800); // Minimum 800px height

    drawFamilyComparison(ctx, canvas.width, canvas.height);
}

function drawFamilyComparison(ctx, width, height) {
    const families = Object.keys(LANGUAGE_METADATA.families);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.38; // Increased from 0.3 to 0.38

    ctx.clearRect(0, 0, width, height);

    families.forEach((family, i) => {
        const angle = (i / families.length) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const familyData = LANGUAGE_METADATA.families[family];

        // Draw family circle
        ctx.fillStyle = familyData.color;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2); // Increased from 30 to 50
        ctx.fill();

        // Draw family label
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial'; // Increased from 14px to 16px
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(familyData.name, x, y - 5);
        ctx.font = '12px Arial'; // Increased from 10px to 12px
        ctx.fillText(`${familyData.languages.length} languages`, x, y + 15);
    });

    // Draw connections between families
    families.forEach((family1, i) => {
        const angle1 = (i / families.length) * Math.PI * 2;
        const x1 = centerX + Math.cos(angle1) * radius;
        const y1 = centerY + Math.sin(angle1) * radius;

        families.forEach((family2, j) => {
            if (i < j) {
                const angle2 = (j / families.length) * Math.PI * 2;
                const x2 = centerX + Math.cos(angle2) * radius;
                const y2 = centerY + Math.sin(angle2) * radius;

                // Calculate average compatibility between families
                let totalScore = 0;
                let count = 0;

                LANGUAGE_METADATA.families[family1].languages.forEach(lang1 => {
                    LANGUAGE_METADATA.families[family2].languages.forEach(lang2 => {
                        if (languageData[lang1] && languageData[lang1][lang2]) {
                            totalScore += languageData[lang1][lang2];
                            count++;
                        }
                    });
                });

                const avgScore = count > 0 ? totalScore / count : 0;
                const opacity = avgScore / 255;

                ctx.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
                ctx.lineWidth = 1 + opacity * 2;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        });
    });
}

function initializeScatterPlot() {
    const container = document.querySelector('.matrix-canvas-container');
    container.innerHTML = `
        <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 15px; font-size: 13px; line-height: 1.5;">
            <strong style="color: #667eea;">📊 How to Read:</strong>
            <span style="color: #555;">
                <strong>X-axis:</strong> Outgoing (→ others) |
                <strong>Y-axis:</strong> Incoming (others →) |
                <strong>Top-right:</strong> Best both ways |
                <strong>Above diagonal:</strong> Better FROM |
                <strong>Below diagonal:</strong> Better TO
            </span>
        </div>
        <canvas id="scatterCanvas" style="max-height: 600px;"></canvas>
    `;

    const canvas = document.getElementById('scatterCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = container.offsetWidth;
    canvas.height = 600;

    drawScatterPlot(ctx, canvas.width, canvas.height);
}

function drawScatterPlot(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);

    const padding = 80;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;

    // Calculate incoming and outgoing compatibility for each language
    const languageMetrics = [];
    const allLanguages = Object.keys(languageData).filter(lang => hasLanguageName(lang));

    allLanguages.forEach(lang => {
        // Outgoing: how well this language translates TO others
        const outgoingScores = [];
        if (languageData[lang]) {
            Object.keys(languageData[lang]).forEach(target => {
                if (target !== lang && languageData[lang][target]) {
                    outgoingScores.push(languageData[lang][target]);
                }
            });
        }
        const avgOutgoing = outgoingScores.length > 0
            ? outgoingScores.reduce((a, b) => a + b, 0) / outgoingScores.length
            : 0;

        // Incoming: how well others translate TO this language
        const incomingScores = [];
        allLanguages.forEach(source => {
            if (source !== lang && languageData[source]?.[lang]) {
                incomingScores.push(languageData[source][lang]);
            }
        });
        const avgIncoming = incomingScores.length > 0
            ? incomingScores.reduce((a, b) => a + b, 0) / incomingScores.length
            : 0;

        if (avgOutgoing > 0 || avgIncoming > 0) {
            languageMetrics.push({
                lang: lang,
                avgOutgoing: avgOutgoing,
                avgIncoming: avgIncoming,
                family: getLanguageFamily(lang),
                totalConnections: outgoingScores.length + incomingScores.length
            });
        }
    });

    // Find ranges for scaling
    const maxScore = 255;

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (plotHeight * i / 5);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();

        const x = padding + (plotWidth * i / 5);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();

    // Draw diagonal reference line (where incoming = outgoing)
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, padding);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw points
    languageMetrics.forEach(metric => {
        const x = padding + (metric.avgOutgoing / maxScore) * plotWidth;
        const y = height - padding - (metric.avgIncoming / maxScore) * plotHeight;

        const color = getFamilyColor(metric.family);
        const avgTotal = (metric.avgOutgoing + metric.avgIncoming) / 2;
        const size = 6 + (avgTotal / maxScore) * 10;

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Add label for notable languages (high scores or asymmetric)
        const asymmetry = Math.abs(metric.avgOutgoing - metric.avgIncoming);
        if (avgTotal > 160 || asymmetry > 40) {
            ctx.fillStyle = '#333';
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(LANGUAGE_METADATA.names[metric.lang], x, y - size - 5);
        }
    });

    // Add axis labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Outgoing Compatibility (This → Others)', width / 2, height - 20);

    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Incoming Compatibility (Others → This)', 0, 0);
    ctx.restore();

    // Add title
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Translation Compatibility: Incoming vs Outgoing', width / 2, 30);

    // Add subtitle
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('Points above diagonal: easier to translate FROM | Below diagonal: easier to translate TO', width / 2, 50);

    // Add scale markers
    ctx.fillStyle = '#333';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const y = padding + (plotHeight * i / 5);
        const value = Math.round(maxScore * (1 - i / 5));
        ctx.fillText(value, padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
        const x = padding + (plotWidth * i / 5);
        const value = Math.round((maxScore * i / 5));
        ctx.fillText(value, x, height - padding + 20);
    }
}

function getFamilyColor(familyName) {
    for (const [family, data] of Object.entries(LANGUAGE_METADATA.families)) {
        if (data.name === familyName) {
            return data.color;
        }
    }
    return '#999';
}

function getScoreClass(score) {
    if (score >= 200) return 'score-high';
    if (score >= 150) return 'score-medium';
    return 'score-low';
}

function findBestPath() {
    const source = document.getElementById('sourceLang').value;
    const target = document.getElementById('targetLang').value;

    if (!source || !target) {
        alert('Please select both source and target languages');
        return;
    }

    if (source === target) {
        alert('Source and target languages cannot be the same');
        return;
    }

    // Simple direct lookup with undefined check
    const directScore = languageData[source][target] || 0;

    // Find best pivot language
    let bestPivot = null;
    let bestScore = 0;

    Object.keys(languageData).forEach(pivot => {
        if (pivot !== source && pivot !== target) {
            const score1 = languageData[source][pivot] || 0;
            const score2 = languageData[pivot][target] || 0;

            if (score1 > 0 && score2 > 0) {
                const avgScore = (score1 + score2) / 2;

                if (avgScore > bestScore) {
                    bestScore = avgScore;
                    bestPivot = pivot;
                }
            }
        }
    });

    const sourceName = LANGUAGE_METADATA.names[source] || source;
    const targetName = LANGUAGE_METADATA.names[target] || target;
    const pivotName = bestPivot ? (LANGUAGE_METADATA.names[bestPivot] || bestPivot) : 'None found';

    const improvement = bestScore > 0 ? Math.round(bestScore - directScore) : 0;
    const avgScoreDisplay = bestScore > 0 ? Math.round(bestScore) : 0;

    const pathInfo = `
        <div class="pair-analysis">
            <div class="analysis-item">
                <div class="analysis-label">Direct Translation</div>
                <div class="analysis-value">${sourceName} → ${targetName}</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Direct Score</div>
                <div class="analysis-value ${getScoreClass(directScore)}">${directScore}/255</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Best Pivot Language</div>
                <div class="analysis-value">${pivotName}</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Pivot Path</div>
                <div class="analysis-value">${bestPivot ? `${sourceName} → ${pivotName} → ${targetName}` : 'No suitable pivot found'}</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Pivot Average Score</div>
                <div class="analysis-value ${getScoreClass(avgScoreDisplay)}">${avgScoreDisplay}/255</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Improvement</div>
                <div class="analysis-value ${improvement > 0 ? 'score-high' : improvement < 0 ? 'score-low' : ''}">${improvement > 0 ? '+' : ''}${improvement} points</div>
            </div>
        </div>
    `;

    document.getElementById('pairAnalysis').innerHTML = pathInfo;
}

function resetFilters() {
    document.getElementById('sourceLang').value = '';
    document.getElementById('targetLang').value = '';
    document.getElementById('minScore').value = '100';
    document.getElementById('maxScore').value = '200';

    // Re-initialize current view
    setView(currentView);

    document.getElementById('pairAnalysis').innerHTML =
        'Select a source and target language to see detailed compatibility information.';
}

function exportData() {
    const dataStr = JSON.stringify(languageData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'language-compatibility-matrix.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showTooltip(x, y, text) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = text;
    tooltip.style.left = x + 10 + 'px';
    tooltip.style.top = y - 30 + 'px';
    tooltip.style.display = 'block';
}

function hideTooltip() {
    document.getElementById('tooltip').style.display = 'none';
}

function setupEventListeners() {
    // Add change listeners for selects
    document.getElementById('sourceLang').addEventListener('change', function() {
        selectedSource = this.value;
        if (selectedTarget) {
            const score = languageData[selectedSource][selectedTarget];
            updateInfoPanel(selectedSource, selectedTarget, score);
        }
    });

    document.getElementById('targetLang').addEventListener('change', function() {
        selectedTarget = this.value;
        if (selectedSource) {
            const score = languageData[selectedSource][selectedTarget];
            updateInfoPanel(selectedSource, selectedTarget, score);
        }
    });
}

// ==================== NEW ADVANCED FEATURES ====================

// Calculate comprehensive language statistics
function calculateLanguageStats() {
    const stats = {};

    Object.keys(languageData).forEach(lang => {
        // Skip languages without proper names
        if (!hasLanguageName(lang)) return;

        const targets = languageData[lang];
        const scores = Object.values(targets);

        stats[lang] = {
            connectionCount: scores.length,
            avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
            maxScore: Math.max(...scores),
            minScore: Math.min(...scores),
            highQualityConnections: scores.filter(s => s >= 200).length,
            mediumQualityConnections: scores.filter(s => s >= 150 && s < 200).length,
            lowQualityConnections: scores.filter(s => s < 150).length
        };
    });

    languageStats = stats;
    return stats;
}

// Initialize Rankings View
function initializeRankingsView() {
    const container = document.querySelector('.matrix-canvas-container');
    container.innerHTML = '<div id="rankingsView" style="padding: 20px; max-height: 600px; overflow-y: auto;"></div>';

    const stats = calculateLanguageStats();
    const rankingsView = document.getElementById('rankingsView');

    // Sort languages by different criteria
    const byConnections = Object.entries(stats)
        .sort((a, b) => b[1].connectionCount - a[1].connectionCount)
        .slice(0, 20);

    const byAvgScore = Object.entries(stats)
        .sort((a, b) => b[1].avgScore - a[1].avgScore)
        .slice(0, 20);

    const byHighQuality = Object.entries(stats)
        .sort((a, b) => b[1].highQualityConnections - a[1].highQualityConnections)
        .slice(0, 20);

    let html = '<h2 style="text-align: center; color: #667eea; margin-bottom: 30px;">📊 Language Rankings</h2>';

    // Top by Connections
    html += '<div style="margin-bottom: 40px;">';
    html += '<h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">🔗 Most Connected Languages</h3>';
    html += '<div style="display: grid; gap: 10px; margin-top: 15px;">';
    byConnections.forEach(([lang, data], index) => {
        const name = LANGUAGE_METADATA.names[lang] || lang;
        html += `
            <div style="background: linear-gradient(90deg, rgba(102,126,234,0.1) 0%, rgba(102,126,234,0.05) 100%);
                        padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;
                        border-left: 4px solid #667eea;">
                <div>
                    <span style="font-size: 18px; font-weight: bold; color: #667eea; margin-right: 10px;">#${index + 1}</span>
                    <span style="font-size: 16px; font-weight: 600; color: #333;">${name}</span>
                    <span style="font-size: 12px; color: #666; margin-left: 8px;">(${lang})</span>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 20px; font-weight: bold; color: #667eea;">${data.connectionCount}</div>
                    <div style="font-size: 11px; color: #666;">connections</div>
                </div>
            </div>
        `;
    });
    html += '</div></div>';

    // Top by Average Quality
    html += '<div style="margin-bottom: 40px;">';
    html += '<h3 style="color: #333; border-bottom: 2px solid #2ea443; padding-bottom: 10px;">⭐ Highest Average Compatibility</h3>';
    html += '<div style="display: grid; gap: 10px; margin-top: 15px;">';
    byAvgScore.forEach(([lang, data], index) => {
        const name = LANGUAGE_METADATA.names[lang] || lang;
        html += `
            <div style="background: linear-gradient(90deg, rgba(46,164,67,0.1) 0%, rgba(46,164,67,0.05) 100%);
                        padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;
                        border-left: 4px solid #2ea443;">
                <div>
                    <span style="font-size: 18px; font-weight: bold; color: #2ea443; margin-right: 10px;">#${index + 1}</span>
                    <span style="font-size: 16px; font-weight: 600; color: #333;">${name}</span>
                    <span style="font-size: 12px; color: #666; margin-left: 8px;">(${lang})</span>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 20px; font-weight: bold; color: #2ea443;">${Math.round(data.avgScore)}</div>
                    <div style="font-size: 11px; color: #666;">avg score</div>
                </div>
            </div>
        `;
    });
    html += '</div></div>';

    // Top by High Quality Connections
    html += '<div style="margin-bottom: 20px;">';
    html += '<h3 style="color: #333; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">🏆 Most High-Quality Connections (200+)</h3>';
    html += '<div style="display: grid; gap: 10px; margin-top: 15px;">';
    byHighQuality.forEach(([lang, data], index) => {
        const name = LANGUAGE_METADATA.names[lang] || lang;
        html += `
            <div style="background: linear-gradient(90deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.05) 100%);
                        padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;
                        border-left: 4px solid #f59e0b;">
                <div>
                    <span style="font-size: 18px; font-weight: bold; color: #f59e0b; margin-right: 10px;">#${index + 1}</span>
                    <span style="font-size: 16px; font-weight: 600; color: #333;">${name}</span>
                    <span style="font-size: 12px; color: #666; margin-left: 8px;">(${lang})</span>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 20px; font-weight: bold; color: #f59e0b;">${data.highQualityConnections}</div>
                    <div style="font-size: 11px; color: #666;">high quality</div>
                </div>
            </div>
        `;
    });
    html += '</div></div>';

    rankingsView.innerHTML = html;
}

// Initialize Bidirectional Comparison View
function initializeBidirectionalView() {
    const container = document.querySelector('.matrix-canvas-container');
    container.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="text-align: center; color: #667eea; margin-bottom: 20px;">🔄 Bidirectional Translation Analysis</h2>
            <p style="text-align: center; color: #666; margin-bottom: 30px;">
                Compare translation quality in both directions. Asymmetry indicates one-way compatibility is stronger.
            </p>
            <div id="bidirectionalResults" style="max-height: 500px; overflow-y: auto;"></div>
        </div>
    `;

    // Find language pairs with significant asymmetry
    const asymmetricPairs = [];
    const languages = Object.keys(languageData).filter(lang => hasLanguageName(lang));

    languages.forEach(lang1 => {
        languages.forEach(lang2 => {
            if (lang1 < lang2) { // Avoid duplicates
                const score12 = languageData[lang1]?.[lang2];
                const score21 = languageData[lang2]?.[lang1];

                // Only include pairs where BOTH directions are defined
                if (score12 !== undefined && score21 !== undefined && score12 > 0 && score21 > 0) {
                    const diff = Math.abs(score12 - score21);

                    if (diff > 10) {
                        asymmetricPairs.push({
                            lang1, lang2, score12, score21, diff,
                            avgScore: (score12 + score21) / 2
                        });
                    }
                }
            }
        });
    });

    // Sort by difference
    asymmetricPairs.sort((a, b) => b.diff - a.diff);

    let html = '<h3 style="color: #333; margin-bottom: 20px;">Top Asymmetric Language Pairs</h3>';

    if (asymmetricPairs.length === 0) {
        html += '<div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center; color: #666;">';
        html += '<p style="font-size: 16px;">No asymmetric language pairs found in this dataset.</p>';
        html += '<p style="font-size: 14px; margin-top: 10px;">This dataset may have symmetric scores or limited bidirectional data.</p>';
        html += '</div>';
    } else {
        html += '<div style="display: grid; gap: 15px;">';

        asymmetricPairs.slice(0, 30).forEach(pair => {
        const name1 = LANGUAGE_METADATA.names[pair.lang1] || pair.lang1;
        const name2 = LANGUAGE_METADATA.names[pair.lang2] || pair.lang2;

        // Determine stronger direction
        let strongerDirection, strongerScore;
        if (pair.score12 > pair.score21) {
            strongerDirection = `${name1} → ${name2}`;
            strongerScore = pair.score12;
        } else {
            strongerDirection = `${name2} → ${name1}`;
            strongerScore = pair.score21;
        }

        html += `
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        border-left: 4px solid ${pair.diff > 50 ? '#dc2626' : pair.diff > 30 ? '#f59e0b' : '#2ea443'};">
                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 15px; align-items: center; margin-bottom: 10px;">
                    <div style="text-align: right;">
                        <div style="font-weight: 600; color: #333;">${name1}</div>
                        <div style="font-size: 24px; font-weight: bold; color: ${pair.score12 > pair.score21 ? '#2ea443' : '#666'};">${pair.score12}</div>
                    </div>
                    <div style="font-size: 24px;">↔️</div>
                    <div style="text-align: left;">
                        <div style="font-weight: 600; color: #333;">${name2}</div>
                        <div style="font-size: 24px; font-weight: bold; color: ${pair.score21 > pair.score12 ? '#2ea443' : '#666'};">${pair.score21}</div>
                    </div>
                </div>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; font-size: 13px; color: #666;">
                    <strong>Asymmetry:</strong> ${pair.diff} points |
                    <strong>Stronger direction:</strong> ${strongerDirection} (score: ${strongerScore})
                </div>
            </div>
        `;
        });

        html += '</div>';
    }

    document.getElementById('bidirectionalResults').innerHTML = html;
}

// Initialize Statistics View with Distribution Charts
function initializeStatisticsView() {
    const container = document.querySelector('.matrix-canvas-container');
    container.innerHTML = '<canvas id="statsCanvas" style="max-height: 600px;"></canvas>';

    const canvas = document.getElementById('statsCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = container.offsetWidth;
    canvas.height = 600;

    // Collect all scores (only from languages with proper names)
    const allScores = [];
    Object.keys(languageData).forEach(source => {
        if (!hasLanguageName(source)) return;
        Object.keys(languageData[source]).forEach(target => {
            if (!hasLanguageName(target)) return;
            allScores.push(languageData[source][target]);
        });
    });

    // Create distribution buckets
    const buckets = Array(26).fill(0); // 0-9, 10-19, ..., 250-255
    allScores.forEach(score => {
        const bucket = Math.floor(score / 10);
        buckets[bucket]++;
    });

    // Draw distribution chart
    const barWidth = canvas.width / buckets.length;
    const maxCount = Math.max(...buckets);
    const chartHeight = canvas.height - 100;

    // Clear and draw axes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Score Distribution Across All Language Pairs', canvas.width / 2, 30);

    // Draw bars
    buckets.forEach((count, i) => {
        const x = i * barWidth;
        const barHeight = (count / maxCount) * chartHeight;
        const y = canvas.height - 60 - barHeight;

        // Color based on score range
        const scoreRange = i * 10;
        let color;
        if (scoreRange >= 200) color = '#2ea443';
        else if (scoreRange >= 150) color = '#f59e0b';
        else if (scoreRange >= 100) color = '#e67e22';
        else color = '#dc2626';

        ctx.fillStyle = color;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);

        // Draw count on top of bar if significant
        if (count > maxCount * 0.1) {
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(count, x + barWidth / 2, y - 5);
        }

        // Draw x-axis labels every 5 buckets
        if (i % 5 === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${scoreRange}`, x + barWidth / 2, canvas.height - 35);
        }
    });

    // Draw x-axis
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 60);
    ctx.lineTo(canvas.width, canvas.height - 60);
    ctx.stroke();

    // Add legend
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score Range', 10, canvas.height - 10);

    // Add statistics summary
    const avg = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    const median = allScores.sort((a, b) => a - b)[Math.floor(allScores.length / 2)];
    const mode = buckets.indexOf(Math.max(...buckets)) * 10;

    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Avg: ${Math.round(avg)} | Median: ${median} | Mode: ${mode}-${mode+9}`, canvas.width - 10, 30);
}

// Initialize Language Search/Filter
function setupLanguageSearch() {
    const searchInput = document.getElementById('langSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filterLanguagesBySearch(e.target.value.toLowerCase());
        }, 300);
    });
}

function filterLanguagesBySearch(query) {
    if (!query) {
        // Reset filters
        setView(currentView);
        return;
    }

    // Find matching languages
    const matches = Object.keys(languageData).filter(lang => {
        const name = (LANGUAGE_METADATA.names[lang] || '').toLowerCase();
        return name.includes(query) || lang.includes(query);
    });

    // Update dropdown filters
    const sourceSelect = document.getElementById('sourceLang');
    const targetSelect = document.getElementById('targetLang');

    if (matches.length > 0) {
        sourceSelect.value = matches[0];
        if (matches.length > 1) {
            targetSelect.value = matches[1];
        }
    }
}

// Recommendation Engine
function getRecommendations() {
    const source = document.getElementById('sourceLang').value;
    const target = document.getElementById('targetLang').value;

    if (!source || !target) {
        alert('Please select both source and target languages');
        return;
    }

    const directScore = languageData[source]?.[target] || 0;
    const recommendations = [];

    // Find alternative pivot languages (only those with proper names)
    Object.keys(languageData).forEach(pivot => {
        if (pivot !== source && pivot !== target && hasLanguageName(pivot)) {
            const score1 = languageData[source]?.[pivot] || 0;
            const score2 = languageData[pivot]?.[target] || 0;

            if (score1 > 0 && score2 > 0) {
                const avgScore = (score1 + score2) / 2;
                const minScore = Math.min(score1, score2);

                recommendations.push({
                    pivot,
                    avgScore,
                    minScore,
                    score1,
                    score2,
                    improvement: avgScore - directScore
                });
            }
        }
    });

    // Sort by minimum score (weakest link) to ensure quality
    recommendations.sort((a, b) => b.minScore - a.minScore);

    const sourceName = LANGUAGE_METADATA.names[source] || source;
    const targetName = LANGUAGE_METADATA.names[target] || target;

    let html = `
        <div class="pair-analysis">
            <div style="grid-column: 1 / -1; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0;">🎯 Translation Recommendations</h3>
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">
                    ${sourceName} → ${targetName} (Direct: ${directScore}/255)
                </p>
            </div>
    `;

    if (recommendations.length === 0) {
        html += '<div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #666;">No pivot languages found.</div>';
    } else {
        html += '<div style="grid-column: 1 / -1;"><h4 style="color: #333; margin-bottom: 15px;">Top 10 Recommended Pivot Languages</h4></div>';

        recommendations.slice(0, 10).forEach((rec, index) => {
            const pivotName = LANGUAGE_METADATA.names[rec.pivot] || rec.pivot;
            const improvementClass = rec.improvement > 0 ? 'score-high' : rec.improvement < 0 ? 'score-low' : '';

            html += `
                <div style="grid-column: 1 / -1; background: white; border-left: 4px solid ${index === 0 ? '#2ea443' : '#667eea'};
                            padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div style="flex: 1;">
                            <div style="font-size: 18px; font-weight: bold; color: #333;">
                                ${index + 1}. ${pivotName}
                                ${index === 0 ? ' 🏆' : ''}
                            </div>
                            <div style="font-size: 13px; color: #666; margin-top: 5px;">
                                ${sourceName} → ${pivotName} → ${targetName}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 12px; color: #666;">Min Score (Bottleneck)</div>
                            <div style="font-size: 24px; font-weight: bold; color: ${rec.minScore >= 200 ? '#2ea443' : rec.minScore >= 150 ? '#f59e0b' : '#dc2626'};">
                                ${Math.round(rec.minScore)}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 12px; color: #666;">Avg Score</div>
                            <div style="font-size: 20px; font-weight: bold; color: #667eea;">
                                ${Math.round(rec.avgScore)}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 12px; color: #666;">vs Direct</div>
                            <div class="${improvementClass}" style="font-size: 20px; font-weight: bold;">
                                ${rec.improvement > 0 ? '+' : ''}${Math.round(rec.improvement)}
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 10px; display: flex; gap: 20px; font-size: 12px; color: #666;">
                        <span>Step 1: ${rec.score1}/255</span>
                        <span>Step 2: ${rec.score2}/255</span>
                    </div>
                </div>
            `;
        });
    }

    html += '</div>';
    document.getElementById('pairAnalysis').innerHTML = html;
}