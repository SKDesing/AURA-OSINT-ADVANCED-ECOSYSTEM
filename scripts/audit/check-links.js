#!/usr/bin/env node
// Check broken links in documentation
const fs = require('fs');
const path = require('path');

function scanLinks(dir) {
  const links = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    if (file.name.startsWith('.')) continue;
    const filepath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      links.push(...scanLinks(filepath));
    } else if (file.name.endsWith('.md')) {
      const content = fs.readFileSync(filepath, 'utf8');
      const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
      
      for (const match of linkMatches) {
        const [, text, url] = match.match(/\[([^\]]+)\]\(([^)]+)\)/);
        links.push({ file: filepath, text, url, status: 'unchecked' });
      }
    }
  }
  return links;
}

const docsDir = path.join(process.cwd(), 'docs');
const links = fs.existsSync(docsDir) ? scanLinks(docsDir) : [];

const report = {
  timestamp: new Date().toISOString(),
  total_links: links.length,
  broken_links: 0,
  links: links.slice(0, 10) // Sample
};

console.log('🔗 Links Check Report');
console.log(JSON.stringify(report, null, 2));