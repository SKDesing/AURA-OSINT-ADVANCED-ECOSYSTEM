#!/usr/bin/env node
/**
 * AURA Front Inventory Scanner (v1)
 * Objectif : recenser frameworks, libs UI, dashboards, pages, routes, composants volumineux, patterns obsolètes.
 */

const fs = require('fs');
const path = require('path');

const ARGS = process.argv.slice(2);
const FLAGS = new Set(ARGS.filter(a => a.startsWith('--')));

class FrontInventory {
  constructor() {
    this.rootDir = process.cwd();
    this.srcCandidates = [
      'src', 'client', 'frontend', 'web', 'app', 'ui',
      'clients/web', 'clients/desktop', 'clients/web/frontend',
      'clients/web-react', 'marketing/sites'
    ];
    this.results = {
      frameworks: [],
      uiLibs: [],
      graphLibs: [],
      stateLibs: [],
      authLibs: [],
      routingLibs: [],
      pages: [],
      routes: [],
      dashboards: [],
      largeComponents: [],
      sweetAlertUsages: [],
      bootstrapImports: [],
      duplications: [],
      packageJsons: []
    };
  }

  run() {
    console.log('🔍 AURA Frontend Inventory Starting...');
    
    this.scanPackageJsons();
    this.scanSourceStructure();
    this.scanDashboards();
    this.scanLargeComponents();
    this.scanSweetAlert();
    this.scanBootstrap();
    this.scanDuplications();
    this.generateOutputs();
  }

  scanPackageJsons() {
    console.log('📦 Scanning package.json files...');
    
    const packageFiles = this.findPackageJsonFiles();
    
    packageFiles.forEach(file => {
      try {
        const content = JSON.parse(fs.readFileSync(file, 'utf8'));
        const deps = { ...content.dependencies, ...content.devDependencies };
        
        this.results.packageJsons.push({
          file: path.relative(this.rootDir, file),
          deps: Object.keys(deps).length,
          framework: this.detectFramework(deps),
          uiLibs: this.detectUILibs(deps),
          graphLibs: this.detectGraphLibs(deps)
        });
        
        // Aggregate detections
        this.results.frameworks.push(...this.detectFramework(deps));
        this.results.uiLibs.push(...this.detectUILibs(deps));
        this.results.graphLibs.push(...this.detectGraphLibs(deps));
        this.results.stateLibs.push(...this.detectStateLibs(deps));
        this.results.authLibs.push(...this.detectAuthLibs(deps));
        this.results.routingLibs.push(...this.detectRoutingLibs(deps));
        
      } catch (e) {
        console.warn(`Failed to parse ${file}: ${e.message}`);
      }
    });
    
    // Deduplicate
    this.results.frameworks = [...new Set(this.results.frameworks)];
    this.results.uiLibs = [...new Set(this.results.uiLibs)];
    this.results.graphLibs = [...new Set(this.results.graphLibs)];
  }

  detectFramework(deps) {
    const frameworks = [];
    if (deps.react) frameworks.push('React');
    if (deps.next) frameworks.push('Next.js');
    if (deps.vue) frameworks.push('Vue');
    if (deps['@angular/core']) frameworks.push('Angular');
    if (deps.svelte) frameworks.push('Svelte');
    return frameworks;
  }

  detectUILibs(deps) {
    const libs = [];
    if (deps.bootstrap) libs.push('Bootstrap');
    if (deps.tailwindcss) libs.push('Tailwind CSS');
    if (deps['@mui/material']) libs.push('Material-UI');
    if (deps.antd) libs.push('Ant Design');
    if (deps['sweetalert2']) libs.push('SweetAlert2');
    if (deps['react-bootstrap']) libs.push('React Bootstrap');
    return libs;
  }

  detectGraphLibs(deps) {
    const libs = [];
    if (deps['chart.js']) libs.push('Chart.js');
    if (deps.d3) libs.push('D3.js');
    if (deps.echarts) libs.push('ECharts');
    if (deps['@nivo/core']) libs.push('Nivo');
    if (deps.recharts) libs.push('Recharts');
    return libs;
  }

  detectStateLibs(deps) {
    const libs = [];
    if (deps.redux) libs.push('Redux');
    if (deps.zustand) libs.push('Zustand');
    if (deps.jotai) libs.push('Jotai');
    if (deps.recoil) libs.push('Recoil');
    return libs;
  }

  detectAuthLibs(deps) {
    const libs = [];
    if (deps['jwt-decode']) libs.push('JWT Decode');
    if (deps['next-auth']) libs.push('NextAuth');
    if (deps['@auth0/auth0-react']) libs.push('Auth0');
    return libs;
  }

  detectRoutingLibs(deps) {
    const libs = [];
    if (deps['react-router-dom']) libs.push('React Router');
    if (deps['vue-router']) libs.push('Vue Router');
    if (deps['@angular/router']) libs.push('Angular Router');
    return libs;
  }

  scanSourceStructure() {
    console.log('📁 Scanning source structure...');
    
    const srcDirs = this.srcCandidates.filter(dir => 
      fs.existsSync(path.join(this.rootDir, dir))
    );
    
    srcDirs.forEach(srcDir => {
      const fullPath = path.join(this.rootDir, srcDir);
      this.scanPages(fullPath);
      this.scanRoutes(fullPath);
    });
  }

  scanPages(srcDir) {
    const pageFiles = this.findFilesInDir(srcDir, /\.(js|jsx|ts|tsx|vue)$/)
      .filter(file => 
        file.includes('/pages/') || 
        file.includes('/page/') ||
        file.toLowerCase().includes('page')
      );
    
    this.results.pages = pageFiles.map(file => ({
      file: path.relative(this.rootDir, file),
      size: this.getFileSize(file),
      type: this.detectPageType(file)
    }));
  }

  scanRoutes(srcDir) {
    const routeFiles = this.findFilesInDir(srcDir, /\.(js|jsx|ts|tsx)$/)
      .filter(file => {
        const content = this.readFileSafe(file);
        return content && (
          content.includes('Route') ||
          content.includes('router') ||
          content.includes('createBrowserRouter') ||
          content.includes('useRouter')
        );
      });
    
    this.results.routes = routeFiles.map(file => ({
      file: path.relative(this.rootDir, file),
      size: this.getFileSize(file)
    }));
  }

  scanDashboards() {
    console.log('📊 Scanning dashboards...');
    
    const dashboardFiles = this.findFiles('**/*.{js,jsx,ts,tsx,vue}')
      .filter(file => {
        const basename = path.basename(file).toLowerCase();
        const content = this.readFileSafe(file);
        
        return basename.includes('dashboard') ||
               basename.includes('metrics') ||
               basename.includes('analytics') ||
               basename.includes('insights') ||
               (content && (
                 content.includes('Dashboard') ||
                 content.includes('Metrics') ||
                 content.includes('Chart') ||
                 content.includes('Graph')
               ));
      });
    
    this.results.dashboards = dashboardFiles.map(file => ({
      file: path.relative(this.rootDir, file),
      size: this.getFileSize(file),
      type: this.detectDashboardType(file)
    }));
  }

  scanLargeComponents() {
    console.log('🔍 Scanning large components...');
    
    const componentFiles = this.findFiles('**/*.{js,jsx,ts,tsx,vue}')
      .filter(file => {
        const size = this.getFileSize(file);
        return size > 500; // Lines > 500
      });
    
    this.results.largeComponents = componentFiles.map(file => ({
      file: path.relative(this.rootDir, file),
      lines: this.getFileSize(file),
      type: this.detectComponentType(file)
    }));
  }

  scanSweetAlert() {
    console.log('🍭 Scanning SweetAlert usage...');
    
    const sweetAlertFiles = this.findFiles('**/*.{js,jsx,ts,tsx}')
      .filter(file => {
        const content = this.readFileSafe(file);
        return content && (
          content.includes('Swal.fire') ||
          content.includes('sweetAlert') ||
          content.includes('import Swal')
        );
      });
    
    this.results.sweetAlertUsages = sweetAlertFiles.map(file => ({
      file: path.relative(this.rootDir, file),
      usages: this.countSweetAlertUsages(file)
    }));
  }

  scanBootstrap() {
    console.log('🅱️ Scanning Bootstrap imports...');
    
    const bootstrapFiles = this.findFiles('**/*.{js,jsx,ts,tsx,css,scss}')
      .filter(file => {
        const content = this.readFileSafe(file);
        return content && (
          content.includes('bootstrap.css') ||
          content.includes('bootstrap.min.css') ||
          content.includes('from "bootstrap"') ||
          content.includes("from 'bootstrap'")
        );
      });
    
    this.results.bootstrapImports = bootstrapFiles.map(file => 
      path.relative(this.rootDir, file)
    );
  }

  scanDuplications() {
    console.log('🔄 Scanning potential duplications...');
    
    // Simple heuristic: files with similar names
    const allFiles = this.findFiles('**/*.{js,jsx,ts,tsx,vue}');
    const basenames = {};
    
    allFiles.forEach(file => {
      const basename = path.basename(file, path.extname(file)).toLowerCase();
      if (!basenames[basename]) basenames[basename] = [];
      basenames[basename].push(file);
    });
    
    Object.entries(basenames).forEach(([name, files]) => {
      if (files.length > 1) {
        this.results.duplications.push({
          basename: name,
          files: files.map(f => path.relative(this.rootDir, f)),
          count: files.length
        });
      }
    });
  }

  // Utility methods
  loadExclusions() {
    const ignorePath = path.join(this.rootDir, '.inventoryignore');
    const defaultExcludes = ['node_modules', '.git', 'dist', 'build', '.next', 'out', '.cache', 'coverage', 'vendor', '.venv', 'tmp', 'ai/local-llm', 'assets', 'reports'];
    
    if (fs.existsSync(ignorePath)) {
      const ignoreContent = fs.readFileSync(ignorePath, 'utf8');
      const ignoreList = ignoreContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      return new Set([...defaultExcludes, ...ignoreList]);
    }
    return new Set(defaultExcludes);
  }

  findPackageJsonFiles() {
    const files = [];
    const excludeDirs = this.loadExclusions();
    
    const walk = (dir) => {
      try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        items.forEach(item => {
          const fullPath = path.join(dir, item.name);
          const relPath = path.relative(this.rootDir, fullPath);
          
          if (item.isDirectory() && !item.name.startsWith('.') && !excludeDirs.has(item.name) && !excludeDirs.has(relPath)) {
            walk(fullPath);
          } else if (item.isFile() && item.name === 'package.json') {
            files.push(fullPath);
          }
        });
      } catch (e) {
        // Skip inaccessible directories
      }
    };
    walk(this.rootDir);
    return files;
  }

  findFiles(pattern) {
    const files = [];
    const excludeDirs = this.loadExclusions();
    
    const walk = (dir) => {
      try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        items.forEach(item => {
          const fullPath = path.join(dir, item.name);
          const relPath = path.relative(this.rootDir, fullPath);
          
          if (item.isDirectory() && !item.name.startsWith('.') && !excludeDirs.has(item.name) && !excludeDirs.has(relPath)) {
            walk(fullPath);
          } else if (item.isFile()) {
            files.push(fullPath);
          }
        });
      } catch (e) {
        // Skip inaccessible directories
      }
    };
    walk(this.rootDir);
    return files;
  }

  findFilesInDir(dir, regex) {
    const files = [];
    const walk = (currentDir) => {
      try {
        const items = fs.readdirSync(currentDir, { withFileTypes: true });
        items.forEach(item => {
          const fullPath = path.join(currentDir, item.name);
          if (item.isDirectory() && !item.name.startsWith('.')) {
            walk(fullPath);
          } else if (item.isFile() && regex.test(item.name)) {
            files.push(fullPath);
          }
        });
      } catch (e) {
        // Skip inaccessible directories
      }
    };
    walk(dir);
    return files;
  }

  readFileSafe(file) {
    try {
      return fs.readFileSync(file, 'utf8');
    } catch (e) {
      return null;
    }
  }

  getFileSize(file) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      return content.split('\n').length;
    } catch (e) {
      return 0;
    }
  }

  detectPageType(file) {
    const content = this.readFileSafe(file);
    if (!content) return 'unknown';
    
    if (content.includes('Dashboard')) return 'dashboard';
    if (content.includes('Login') || content.includes('Auth')) return 'auth';
    if (content.includes('Settings')) return 'settings';
    if (content.includes('Profile')) return 'profile';
    return 'page';
  }

  detectDashboardType(file) {
    const content = this.readFileSafe(file);
    if (!content) return 'unknown';
    
    if (content.includes('Chart') || content.includes('Graph')) return 'analytics';
    if (content.includes('Metrics')) return 'metrics';
    if (content.includes('Overview')) return 'overview';
    return 'dashboard';
  }

  detectComponentType(file) {
    const basename = path.basename(file).toLowerCase();
    if (basename.includes('dashboard')) return 'dashboard';
    if (basename.includes('chart') || basename.includes('graph')) return 'chart';
    if (basename.includes('table') || basename.includes('list')) return 'data';
    if (basename.includes('form')) return 'form';
    return 'component';
  }

  countSweetAlertUsages(file) {
    const content = this.readFileSafe(file);
    if (!content) return 0;
    
    const matches = content.match(/Swal\.fire/g);
    return matches ? matches.length : 0;
  }

  generateOutputs() {
    const outDir = path.join(this.rootDir, 'reports');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const summary = {
      frameworks: this.results.frameworks,
      uiLibs: this.results.uiLibs,
      graphLibs: this.results.graphLibs,
      totalPackages: this.results.packageJsons.length,
      errorsCount: 0, // Updated during scan if needed
      totalPages: this.results.pages.length,
      dashboards: this.results.dashboards.length,
      largeComponents: this.results.largeComponents.length,
      sweetAlertUsages: this.results.sweetAlertUsages.length,
      duplications: this.results.duplications.length
    };

    if (FLAGS.has('--json')) {
      const jsonOut = {
        version: '1.0.0',
        generated_at: new Date().toISOString(),
        summary,
        ...this.results
      };
      
      fs.writeFileSync(
        path.join(outDir, 'FRONT-INVENTORY.json'),
        JSON.stringify(jsonOut, null, 2)
      );
      console.log('✅ JSON report: reports/FRONT-INVENTORY.json');
    }

    if (FLAGS.has('--markdown') || !FLAGS.has('--json')) {
      const md = this.renderMarkdown(summary);
      fs.writeFileSync(path.join(outDir, 'FRONT-INVENTORY.md'), md);
      console.log('✅ Markdown report: reports/FRONT-INVENTORY.md');
    }
  }

  renderMarkdown(summary) {
    return `# 🎨 AURA Frontend Inventory Report

Generated: ${new Date().toISOString()}

## 📊 Summary
| Metric | Count |
|--------|-------|
| Frameworks | ${summary.frameworks.join(', ') || 'None detected'} |
| UI Libraries | ${summary.uiLibs.join(', ') || 'None detected'} |
| Graph Libraries | ${summary.graphLibs.join(', ') || 'None detected'} |
| Total Pages | ${summary.totalPages} |
| Dashboards | ${summary.totalDashboards} |
| Large Components (>500 lines) | ${summary.largeComponents} |
| SweetAlert Usages | ${summary.sweetAlertUsages} |
| Potential Duplications | ${summary.duplications} |

## 📦 Package.json Files
${this.results.packageJsons.map(pkg => 
  `- **${pkg.file}**: ${pkg.deps} dependencies, Framework: ${pkg.framework.join(', ') || 'None'}`
).join('\n') || '_No package.json files found_'}

## 📊 Detected Dashboards
${this.results.dashboards.map(dash => 
  `- **${dash.file}** (${dash.lines || dash.size} lines, type: ${dash.type})`
).join('\n') || '_No dashboards detected_'}

## 📄 Pages
${this.results.pages.slice(0, 10).map(page => 
  `- **${page.file}** (${page.size} lines, type: ${page.type})`
).join('\n') || '_No pages detected_'}

## 🔗 Route Files
${this.results.routes.slice(0, 10).map(route => 
  `- **${route.file}** (${route.size} lines)`
).join('\n') || '_No route files detected_'}

## 📏 Large Components
${this.results.largeComponents.slice(0, 10).map(comp => 
  `- **${comp.file}** (${comp.lines} lines, type: ${comp.type})`
).join('\n') || '_No large components detected_'}

## 🍭 SweetAlert Usages
${this.results.sweetAlertUsages.map(usage => 
  `- **${usage.file}**: ${usage.usages} usages`
).join('\n') || '_No SweetAlert usage detected_'}

## 🅱️ Bootstrap Imports
${this.results.bootstrapImports.map(file => `- ${file}`).join('\n') || '_No Bootstrap imports detected_'}

## 🔄 Duplication Candidates
${this.results.duplications.slice(0, 10).map(dup => 
  `- **${dup.basename}**: ${dup.count} files (${dup.files.join(', ')})`
).join('\n') || '_No duplications detected_'}

## 🎯 Suggested Actions

### Immediate
1. Consolidate duplicate components if any
2. Review large components for splitting opportunities
3. Standardize UI library usage

### Short Term
4. Create design system if multiple UI libs detected
5. Implement dashboard architecture if dashboards > 3
6. Consider state management if complex interactions

### Long Term
7. Optimize bundle size
8. Implement component library
9. Add Storybook for component documentation

_Machine readable version: FRONT-INVENTORY.json_
`;
  }
}

if (require.main === module) {
  const inventory = new FrontInventory();
  inventory.run();
}