import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import './Hero3D.css';

// Particules 3D animées
function ParticleField(props) {
  const ref = useRef();
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const radius = Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#00ff88"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// Compteur animé
const AnimatedCounter = ({ target, label, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="stat-item">
      <div className="stat-value">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const Hero3D = () => {
  return (
    <section className="hero-3d">
      {/* Canvas 3D en arrière-plan */}
      <div className="hero-canvas-container">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ParticleField />
        </Canvas>
      </div>

      {/* Contenu principal */}
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="hero-title glitch" data-text="AURA ADVANCED OSINT">
            AURA ADVANCED OSINT
          </h1>
          
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Technology Beyond The Creators Themselves
          </motion.p>

          <motion.div
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <p>
              🎯 <strong>Pénétration Invisible</strong> - Impossible à détecter<br/>
              🔬 <strong>Analyse Profonde</strong> - Plus de données que les créateurs<br/>
              ⚡ <strong>Rapidité Extrême</strong> - 10M points/heure<br/>
              🌐 <strong>47+ Plateformes</strong> - Couverture totale
            </p>
          </motion.div>

          {/* Statistiques en temps réel */}
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <AnimatedCounter target={125000} label="Data Points" suffix="+" />
            <AnimatedCounter target={47} label="Platforms" suffix="+" />
            <AnimatedCounter target={99.9} label="Stealth" suffix="%" />
            <AnimatedCounter target={12} label="Depth Layers" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <button className="cta-primary scan-button">
              <span className="scan-line"></span>
              <span className="btn-text">Initiate Demo</span>
            </button>
            <button className="cta-secondary">
              View Capabilities
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Effet de scan */}
      <div className="scan-overlay"></div>
    </section>
  );
};

export default Hero3D;