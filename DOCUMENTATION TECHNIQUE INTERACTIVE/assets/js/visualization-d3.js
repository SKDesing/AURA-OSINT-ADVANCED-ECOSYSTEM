/**
 * 📊 AURA D3.js VISUALIZATION ENGINE
 * Visualisations interactives pour profils OSINT complexes
 */

class AURAVisualizationEngine {
  constructor() {
    this.svg = null;
    this.width = 1200;
    this.height = 800;
    this.PHI = 1.618033988749;

    this.colorSchemes = {
      risk: { low: '#2ECC71', medium: '#F39C12', high: '#E74C3C', critical: '#8B0000' },
      golden: { primary: '#C9A063', secondary: '#8B7355', accent: '#D4AF37', background: '#1A1A1A' }
    };

    this.initializeSVGContainer();
  }

  initializeSVGContainer() {
    d3.select('#visualization-container').selectAll('*').remove();

    this.svg = d3.select('#visualization-container')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .append('g')
      .attr('class', 'main-group');

    const defs = this.svg.append('defs');

    const goldenGradient = defs.append('linearGradient')
      .attr('id', 'golden-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '100%');

    goldenGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', this.colorSchemes.golden.primary);

    goldenGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', this.colorSchemes.golden.accent);
  }

  renderNetworkGraph(profile, associates) {
    this.clearVisualization();

    const nodes = [
      {
        id: profile.id,
        name: `${profile.metadata.firstname} ${profile.metadata.lastname}`,
        category: profile.category,
        type: 'target',
        radius: 40
      }
    ];

    associates.forEach((assoc, idx) => {
      nodes.push({
        id: `ASSOC_${idx}`,
        name: assoc.name || `Associate ${idx + 1}`,
        relationship: assoc.relationship,
        type: 'associate',
        radius: 25,
        threat_level: assoc.threat_level || 'UNKNOWN'
      });
    });

    const links = associates.map((assoc, idx) => ({
      source: profile.id,
      target: `ASSOC_${idx}`,
      strength: assoc.confidence || Math.random()
    }));

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2));

    const link = this.svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', this.colorSchemes.golden.secondary)
      .attr('stroke-width', d => Math.sqrt(d.strength * 5))
      .attr('stroke-opacity', 0.6);

    const node = this.svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => this.getNodeColor(d))
      .attr('stroke', this.colorSchemes.golden.accent)
      .attr('stroke-width', d => d.type === 'target' ? 4 : 2);

    const labels = this.svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text(d => d.name)
      .attr('font-size', d => d.type === 'target' ? '14px' : '12px')
      .attr('fill', this.colorSchemes.golden.primary)
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.radius + 20);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });
  }

  renderTimeline(events) {
    this.clearVisualization();

    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const width = this.width - margin.left - margin.right;
    const height = this.height - margin.top - margin.bottom;

    const g = this.svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleTime()
      .domain(d3.extent(events, d => new Date(d.date)))
      .range([0, width]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .selectAll('text')
      .attr('fill', this.colorSchemes.golden.primary);

    g.append('line')
      .attr('x1', 0).attr('y1', height / 2)
      .attr('x2', width).attr('y2', height / 2)
      .attr('stroke', 'url(#golden-gradient)')
      .attr('stroke-width', 3);

    const eventGroups = g.selectAll('.event')
      .data(events)
      .enter()
      .append('g')
      .attr('class', 'event')
      .attr('transform', (d, i) => {
        const x = xScale(new Date(d.date));
        const y = height / 2 + (i % 2 === 0 ? -60 : 60);
        return `translate(${x},${y})`;
      });

    eventGroups.append('circle')
      .attr('r', 0)
      .attr('fill', d => this.getEventColor(d.type))
      .attr('stroke', this.colorSchemes.golden.accent)
      .attr('stroke-width', 2)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('r', 12);

    eventGroups.append('text')
      .text(d => d.milestone || d.description)
      .attr('text-anchor', 'middle')
      .attr('dy', (d, i) => i % 2 === 0 ? -10 : 25)
      .attr('fill', this.colorSchemes.golden.primary)
      .attr('font-size', '11px');
  }

  renderRiskHeatmap(profile) {
    this.clearVisualization();

    const riskCategories = [
      { name: 'Financial', score: this.calculateFinancialRisk(profile) },
      { name: 'Legal', score: this.calculateLegalRisk(profile) },
      { name: 'Operational', score: this.calculateOperationalRisk(profile) },
      { name: 'Reputational', score: Math.random() * 100 },
      { name: 'Physical', score: this.calculatePhysicalRisk(profile) },
      { name: 'Digital', score: this.calculateDigitalRisk(profile) }
    ];

    const margin = { top: 80, right: 80, bottom: 80, left: 150 };
    const width = this.width - margin.left - margin.right;
    const height = this.height - margin.top - margin.bottom;

    const g = this.svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('text')
      .attr('x', width / 2).attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('fill', this.colorSchemes.golden.primary)
      .text('RISK ASSESSMENT MATRIX');

    const xScale = d3.scaleBand()
      .domain(['Current', '3 Months', '6 Months', '1 Year'])
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleBand()
      .domain(riskCategories.map(d => d.name))
      .range([0, height])
      .padding(0.1);

    const colorScale = d3.scaleLinear()
      .domain([0, 50, 100])
      .range([this.colorSchemes.risk.low, this.colorSchemes.risk.medium, this.colorSchemes.risk.high]);

    const heatmapData = [];
    riskCategories.forEach(category => {
      ['Current', '3 Months', '6 Months', '1 Year'].forEach((period, idx) => {
        heatmapData.push({
          category: category.name,
          period: period,
          score: category.score + (idx * Math.random() * 10)
        });
      });
    });

    const cells = g.selectAll('.cell')
      .data(heatmapData)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', d => xScale(d.period))
      .attr('y', d => yScale(d.category))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.score))
      .attr('stroke', this.colorSchemes.golden.accent)
      .attr('opacity', 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('opacity', 0.85);

    g.selectAll('.cell-text')
      .data(heatmapData)
      .enter()
      .append('text')
      .attr('x', d => xScale(d.period) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.category) + yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', '#FFFFFF')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text(d => Math.round(d.score));

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', this.colorSchemes.golden.primary);

    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', this.colorSchemes.golden.primary);
  }

  renderGoldenSpiral(profile) {
    this.clearVisualization();

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    const points = [];
    const numPoints = 500;
    const maxRadius = Math.min(this.width, this.height) / 2.5;

    for (let i = 0; i < numPoints; i++) {
      const angle = i * 2.39996;
      const radius = maxRadius * Math.sqrt(i / numPoints);
      
      points.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        index: i,
        data: profile.complexity_score * (i / numPoints)
      });
    }

    const line = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveCatmullRom.alpha(0.5));

    this.svg.append('path')
      .datum(points)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'url(#golden-gradient)')
      .attr('stroke-width', 3)
      .attr('stroke-opacity', 0)
      .transition()
      .duration(3000)
      .attr('stroke-opacity', 0.8);

    this.svg.selectAll('.data-point')
      .data(points.filter((d, i) => i % 20 === 0))
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 0)
      .attr('fill', this.colorSchemes.golden.accent)
      .attr('opacity', 0.6)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr('r', d => 3 + (d.data / 10));

    this.svg.append('text')
      .attr('x', centerX).attr('y', centerY)
      .attr('text-anchor', 'middle')
      .attr('font-size', '48px')
      .attr('font-weight', 'bold')
      .attr('fill', this.colorSchemes.golden.primary)
      .text('Φ')
      .attr('opacity', 0)
      .transition()
      .duration(2000)
      .attr('opacity', 1);

    this.svg.append('text')
      .attr('x', centerX).attr('y', centerY + 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('fill', this.colorSchemes.golden.secondary)
      .text(`Complexity Score: ${profile.complexity_score}`)
      .attr('opacity', 0)
      .transition()
      .duration(2000)
      .delay(500)
      .attr('opacity', 1);
  }

  getNodeColor(node) {
    if (node.type === 'target') return this.colorSchemes.risk.critical;
    
    const threatColors = {
      'LOW': this.colorSchemes.risk.low,
      'MEDIUM': this.colorSchemes.risk.medium,
      'HIGH': this.colorSchemes.risk.high,
      'UNKNOWN': this.colorSchemes.golden.secondary
    };

    return threatColors[node.threat_level] || this.colorSchemes.golden.secondary;
  }

  getEventColor(eventType) {
    const colors = {
      'FINANCIAL': '#F39C12',
      'LEGAL': '#E74C3C',
      'SURVEILLANCE': '#3498DB',
      'COMMUNICATION': '#9B59B6',
      'TRAVEL': '#1ABC9C',
      'DEFAULT': this.colorSchemes.golden.primary
    };

    return colors[eventType] || colors['DEFAULT'];
  }

  calculateFinancialRisk(profile) {
    let score = 0;
    if (profile.osint_footprint?.crypto?.length > 0) score += 30;
    if (profile.metadata?.occupation?.includes('unemployed')) score += 20;
    return Math.min(score + Math.random() * 50, 100);
  }

  calculateLegalRisk(profile) {
    const threatLevels = { 'LOW': 20, 'MEDIUM': 50, 'HIGH': 85 };
    return threatLevels[profile.osint_footprint?.threat_level] || 30;
  }

  calculateOperationalRisk(profile) {
    return (profile.complexity_score || 50) * 0.7 + Math.random() * 20;
  }

  calculatePhysicalRisk(profile) {
    const highRiskCategories = ['TERRORIST_SUSPECT', 'NARCOTRAFFICKER', 'MERCENARY'];
    return highRiskCategories.includes(profile.category) ? 80 + Math.random() * 20 : Math.random() * 50;
  }

  calculateDigitalRisk(profile) {
    let score = 0;
    if (profile.osint_footprint?.emails?.length > 3) score += 20;
    if (profile.osint_footprint?.usernames?.length > 5) score += 25;
    return Math.min(score + Math.random() * 30, 100);
  }

  clearVisualization() {
    this.svg.selectAll('*').remove();
    this.initializeSVGContainer();
  }
}

// Initialiser moteur visualisation
const AURAViz = new AURAVisualizationEngine();
window.AURAViz = AURAViz;

console.log('📊 AURA Visualization Engine initialisé');