// Universal Footer Component for Language Compatibility Matrix
class UniversalFooter {
    constructor(githubRepoUrl = 'https://github.com/opensubtitles/language-compatibility-matrix-for-machine-translation/') {
        this.githubRepoUrl = githubRepoUrl;
    }

    // Method to create footer for any page
    createFooter(containerId, pageType = 'main') {
        const footer = document.createElement('div');
        footer.className = 'footer';

        // Repository link with modern styling
        const repoLink = document.createElement('a');
        repoLink.href = this.githubRepoUrl;
        repoLink.target = '_blank';
        repoLink.className = 'repo-link';
        repoLink.innerHTML = '📊 Dataset: <strong>Manus v1 Dataset</strong>';
        repoLink.style.cssText = 'color: white; text-decoration: none; font-weight: 600; margin-left: 10px;';

        // Platform-specific styling
        const platformLink = document.createElement('a');
        platformLink.href = '#';
        platformLink.className = 'platform-link';
        platformLink.innerHTML = '📦 Platform: <strong>GitHub Pages</strong>';
        platformLink.style.cssText = 'color: white; text-decoration: none; font-weight: 600; margin-left: 10px;';

        // Page-type specific content
        let content = '';
        let badgeHtml = '';

        if (pageType === 'datasets') {
            content = `
                <h2>📊 Datasets</h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <div class="icon">📁</div>
                        <h4>Main Dataset</h4>
                        <p>Production-ready language compatibility matrix with 85+ languages and 7,225+ directional pairs</p>
                        <ul style="margin: 0; padding-left: 25px; line-height: 1.4;">
                            <li><strong>7,225+ language pairs</strong></li>
                            <li><strong>85+ languages</strong></li>
                            <li><strong>0–255 TCS scale</strong></li>
                            <li><strong>Multiple models</strong></li>
                        </div>
                    </div>
                    <div class="feature-card">
                        <div class="icon">🔍</div>
                        <h4>Model Variants</h4>
                        <p>Gemini v1, Perplexity v1, and Manus v1 datasets included for comparative analysis</p>
                        <ul style="margin: 0; padding-left: 25px; line-height: 1.4;">
                            <li><a href="./datasets/language-pairs-translation-proximity-gemini-v1.json" class="btn btn-secondary">Gemini v1 Dataset →</a></li>
                            <li><a href="./datasets/language-pairs-translation-proximity-perplexity-v1.json" class="btn btn-secondary">Perplexity v1 Dataset →</a></li>
                            <li><a href="./datasets/language-pairs-translation-proximity-manus-v1.json" class="btn btn-secondary">Manus v1 Dataset →</a></li>
                        </ul>
                    </div>
                </div>
                <div class="feature-card">
                        <div class="icon">📋</div>
                        <h4>Data Exploration</h4>
                        <p>Interactive filtering, sorting, and visualization capabilities</p>
                        <ul style="margin: 0; padding-left: 25px; line-height: 1.4;">
                            <li><strong>Real-time search</strong></li>
                            <li><strong>Multiple views</strong> (Heat Map, Network, Scatter)</li>
                            <li><strong>Export options</strong></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // Navigation back to visualization
        if (pageType !== 'visualization') {
            content += `
                <div class="navigation">
                    <a href="${this.githubRepoUrl}" class="back-button">← Back to Visualization</a>
                </div>
            `;
        }

        footer.innerHTML = content;

        // Add the footer to the page
        const container = document.getElementById(containerId);
        if (container) {
            container.appendChild(footer);
        }
    }
}