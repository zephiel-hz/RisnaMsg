import { motion } from 'framer-motion';

export default function BackgroundLayer() {
  // Generate 18 floating particles with random properties
  const particles = Array.from({ length: 18 }, (_, i) => {
    const symbols = ['✿', '❀', '✦', '·', '°', '◦'];
    const colors = ['#FFD1DC', '#B0E0E6', '#E8D5F5', '#FFDAB9'];
    
    return {
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 12,
      opacity: 0.15 + Math.random() * 0.25,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 10,
    };
  });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base buttercream background */}
      <div className="absolute inset-0" style={{ backgroundColor: '#FFFDD0' }} />
      
      {/* Dot texture overlay */}
      <div className="absolute inset-0 dot-texture" />

      {/* Large floating blobs with CSS animations */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: '600px',
          height: '600px',
          background: '#B0E0E6',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.45,
          transform: 'translate(-35%, -35%)',
          animation: 'drift-slow 20s ease-in-out infinite',
        }}
      />
      
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: '600px',
          height: '600px',
          background: '#FFD1DC',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.5,
          transform: 'translate(35%, 35%)',
          animation: 'drift-slow-reverse 18s ease-in-out infinite',
        }}
      />
      
      <div
        className="absolute"
        style={{
          top: '40%',
          right: '10%',
          width: '350px',
          height: '350px',
          background: '#E8D5F5',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.35,
          animation: 'drift-medium 22s ease-in-out infinite',
        }}
      />
      
      <div
        className="absolute"
        style={{
          bottom: '15%',
          left: '15%',
          width: '250px',
          height: '250px',
          background: '#FFDAB9',
          borderRadius: '50%',
          filter: 'blur(60px)',
          opacity: 0.4,
          animation: 'drift-slow 16s ease-in-out infinite',
        }}
      />

      {/* Floating particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          initial={{ 
            x: `${particle.x}vw`, 
            y: '100vh',
            opacity: 0,
          }}
          animate={{
            y: '-20vh',
            x: [`${particle.x}vw`, `${particle.x + (Math.random() * 10 - 5)}vw`],
            opacity: [0, particle.opacity, particle.opacity, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute"
          style={{
            fontSize: `${particle.size}px`,
            color: particle.color,
            left: 0,
            bottom: 0,
          }}
        >
          {particle.symbol}
        </motion.div>
      ))}
    </div>
  );
}
