import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LiveDemo.css';

const LiveDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [terminalLines, setTerminalLines] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef(null);

  const demoSteps = [
    {
      command: "aura --init --target=@username",
      output: [
        "🛡️  AURA ADVANCED OSINT ECOSYSTEM v2.1.0",
        "🔍 Initializing stealth reconnaissance...",
        "✅ Proxy chains activated (47 nodes)",
        "✅ Fingerprint masking enabled",
        "✅ Deep packet inspection bypass",
        "🎯 Target acquired: @username"
      ],
      delay: 100
    },
    {
      command: "aura --scan --depth=12 --stealth=max",
      output: [
        "🔬 Initiating deep scan protocol...",
        "📊 Layer 1: Public profile analysis... ✅",
        "📊 Layer 2: Connection mapping... ✅", 
        "📊 Layer 3: Behavioral patterns... ✅",
        "📊 Layer 4: Cross-platform correlation... ✅",
        "📊 Layer 5: Metadata extraction... ✅",
        "📊 Layer 6: Network topology... ✅",
        "📊 Layer 7: Temporal analysis... ✅",
        "📊 Layer 8: Linguistic fingerprinting... ✅",
        "📊 Layer 9: Device profiling... ✅",
        "📊 Layer 10: Geolocation triangulation... ✅",
        "📊 Layer 11: Social graph reconstruction... ✅",
        "📊 Layer 12: Predictive modeling... ✅",
        "🎯 Scan complete: 125,847 data points collected"
      ],
      delay: 200
    },
    {
      command: "aura --analyze --ai-correlation",
      output: [
        "🧠 AI correlation engine activated...",
        "🔗 Cross-referencing 47 platforms...",
        "📈 Confidence score: 99.7%",
        "🎯 Identity matches found: 12",
        "📍 Location clusters: 3 primary, 7 secondary",
        "⏰ Activity patterns: 94% predictable",
        "🔍 Hidden connections discovered: 23",
        "⚠️  High-value intelligence extracted",
        "✅ Analysis complete - Report generated"
      ],
      delay: 150
    }
  ];

  const typeWriter = async (text, delay = 50) => {
    for (let i = 0; i <= text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, delay));
      setTerminalLines(prev => [
        ...prev.slice(0, -1),
        { type: 'input', content: text.slice(0, i), complete: i === text.length }
      ]);
    }
  };

  const addOutput = async (lines, delay = 100) => {
    for (const line of lines) {
      await new Promise(resolve => setTimeout(resolve, delay));
      setTerminalLines(prev => [...prev, { type: 'output', content: line, complete: true }]);
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }
  };

  const runDemo = async () => {
    setIsRunning(true);
    setTerminalLines([{ type: 'system', content: 'AURA Terminal v2.1.0 - Authorized Access Only', complete: true }]);
    
    for (let i = 0; i < demoSteps.length; i++) {
      const step = demoSteps[i];
      setCurrentStep(i);
      
      // Add prompt
      setTerminalLines(prev => [...prev, { type: 'prompt', content: 'aura@stealth:~$ ', complete: true }]);
      
      // Type command
      setTerminalLines(prev => [...prev, { type: 'input', content: '', complete: false }]);
      await typeWriter(step.command, 80);
      
      // Add output
      await new Promise(resolve => setTimeout(resolve, 300));
      await addOutput(step.output, step.delay);
      
      // Wait before next step
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setTerminalLines(prev => [...prev, 
      { type: 'prompt', content: 'aura@stealth:~$ ', complete: true },
      { type: 'success', content: '🎯 Mission accomplished. All systems nominal.', complete: true }
    ]);
    
    setIsRunning(false);
  };

  const resetDemo = () => {
    setTerminalLines([]);
    setCurrentStep(0);
    setIsRunning(false);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  return (
    <section className="live-demo">
      <div className="container">
        <motion.div
          className="demo-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>🖥️ Live Demo</h2>
          <p>Witness AURA's capabilities in real-time</p>
        </motion.div>

        <div className="demo-content">
          <motion.div
            className="terminal-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="terminal-header">
              <div className="terminal-buttons">
                <span className="btn-close"></span>
                <span className="btn-minimize"></span>
                <span className="btn-maximize"></span>
              </div>
              <div className="terminal-title">AURA Terminal - Classified Access</div>
              <div className="terminal-status">
                <span className={`status-indicator ${isRunning ? 'running' : 'idle'}`}></span>
                {isRunning ? 'EXECUTING' : 'READY'}
              </div>
            </div>

            <div className="terminal-body" ref={terminalRef}>
              <AnimatePresence>
                {terminalLines.map((line, index) => (
                  <motion.div
                    key={index}
                    className={`terminal-line ${line.type}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {line.type === 'input' && !line.complete && (
                      <span className="cursor">|</span>
                    )}
                    <span dangerouslySetInnerHTML={{ __html: line.content }} />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {terminalLines.length === 0 && (
                <div className="terminal-welcome">
                  <div className="ascii-art">
                    {`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║        🛡️  AURA OSINT TERMINAL       ║
    ║                                       ║
    ║     Advanced Reconnaissance Suite     ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
                    `}
                  </div>
                  <p>Ready to demonstrate advanced OSINT capabilities...</p>
                </div>
              )}
            </div>

            <div className="terminal-controls">
              <button 
                className="demo-btn start" 
                onClick={runDemo}
                disabled={isRunning}
              >
                {isRunning ? 'Running...' : 'Start Demo'}
              </button>
              <button 
                className="demo-btn reset" 
                onClick={resetDemo}
                disabled={isRunning}
              >
                Reset
              </button>
            </div>
          </motion.div>

          <motion.div
            className="demo-info"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3>🎯 Demo Features</h3>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <div>
                  <strong>12-Layer Deep Scan</strong>
                  <p>Comprehensive analysis across multiple data dimensions</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🧠</span>
                <div>
                  <strong>AI Correlation</strong>
                  <p>Machine learning powered pattern recognition</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌐</span>
                <div>
                  <strong>47+ Platforms</strong>
                  <p>Cross-platform intelligence gathering</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <div>
                  <strong>Real-time Processing</strong>
                  <p>Instant analysis and correlation</p>
                </div>
              </div>
            </div>

            <div className="demo-stats">
              <h4>Live Statistics</h4>
              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-value">125,847</span>
                  <span className="stat-label">Data Points</span>
                </div>
                <div className="stat">
                  <span className="stat-value">99.7%</span>
                  <span className="stat-label">Accuracy</span>
                </div>
                <div className="stat">
                  <span className="stat-value">&lt;2s</span>
                  <span className="stat-label">Response Time</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;