#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'reports/FRONT-INVENTORY.json');
const thresholdsPath = path.join(__dirname, 'thresholds.json');

if (!fs.existsSync(dataPath)) {
  console.error('❌ reports/FRONT-INVENTORY.json not found. Run inventory first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const thresholds = JSON.parse(fs.readFileSync(thresholdsPath, 'utf8'));

const { summary = {} } = data;
const { largeComponents = 0, dashboards = 0, duplications = 0 } = summary;

const fails = [];

if (largeComponents > thresholds.maxLargeComponents) {
  fails.push(`Composants volumineux: ${largeComponents} > ${thresholds.maxLargeComponents}`);
}
if (dashboards > thresholds.maxDashboards) {
  fails.push(`Dashboards: ${dashboards} > ${thresholds.maxDashboards}`);
}
if (duplications > thresholds.maxDuplications) {
  fails.push(`Duplications: ${duplications} > ${thresholds.maxDuplications}`);
}

if (fails.length) {
  console.error('❌ Inventory thresholds failed:\n- ' + fails.join('\n- '));
  process.exit(1);
} else {
  console.log('✅ Inventory thresholds OK');
}