const fs = require('fs');
const path = require('path');

function sanitizeFilename(url) {
  return url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function formatViolationsHTML(results) {
  let html = `<!DOCTYPE html>
  <html><head><meta charset="UTF-8"><title>Accessibility Report</title></head><body>
  <h1>Accessibility Violations Report</h1>`;
  for (const result of results) {
    html += `<h2>Page: <a href="${result.url}">${result.url}</a></h2>`;
    if (result.violations.length === 0) {
      html += `<p>No violations found.</p>`;
      continue;
    }
    html += `<ul>`;
    for (const violation of result.violations) {
      html += `<li><strong>${violation.id}</strong>: ${violation.description}<br>`;
      html += `Impact: ${violation.impact || 'N/A'}<br>`;
      html += `Elements: <ul>`;
      for (const node of violation.nodes) {
        html += `<li><code>${node.html}</code></li>`;
      }
      html += `</ul></li>`;
    }
    html += `</ul>`;
  }
  html += `</body></html>`;
  return html;
}

async function writeReport(results, outputDir) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const jsonPath = path.join(outputDir, 'report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  const htmlPath = path.join(outputDir, 'report.html');
  fs.writeFileSync(htmlPath, formatViolationsHTML(results));

  console.log(`✅ Reports saved: \n- ${jsonPath}\n- ${htmlPath}`);
}

module.exports = { writeReport };
