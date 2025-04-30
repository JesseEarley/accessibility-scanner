# Accessibility Scanner

Scan an entire website for WCAG accessibility violations using Puppeteer and axe-core.

## 📦 Installation

```bash
git clone https://github.com/your-username/accessibility-scanner.git
cd accessibility-scanner
npm install
```

## 🚀 Usage

```bash
npm start -- https://example.com
```

Or directly:

```bash
node scan.js https://example.com
```

## 📁 Output

Results will be saved to the `results/` directory as:

- `report.json`: machine-readable violations
- `report.html`: user-friendly report

## 🔒 Domain Restriction

The scanner will only follow internal links within the same domain as the starting URL.

## 🛠 Configuration

- Max pages: 50 (default)
- Modify in `crawler.js` if needed

## 📄 License

MIT
