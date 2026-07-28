import { motion } from 'framer-motion';
import { useState } from 'react';

interface WelcomeStageProps {
  onComplete: () => void;
}

export default function WelcomeStage({ onComplete }: WelcomeStageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClick = () => {
    setIsExiting(true);
    setTimeout(onComplete, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center relative px-4"
    >
      {/* Corner flower decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5 }}
        className="absolute top-8 left-8 text-6xl md:text-7xl"
        style={{ color: '#FFD1DC', transform: 'rotate(-15deg)' }}
      >
        ✿
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.7 }}
        className="absolute top-12 right-12 text-5xl md:text-6xl"
        style={{ color: '#B0E0E6', transform: 'rotate(20deg)' }}
      >
        ❀
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-12 left-16 text-7xl md:text-8xl"
        style={{ color: '#E8D5F5', transform: 'rotate(10deg)' }}
      >
        ✿
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-16 right-8 text-6xl md:text-7xl"
        style={{ color: '#FFDAB9', transform: 'rotate(-12deg)' }}
      >
        ❀
      </motion.div>

      {/* Washi tape decorations */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 0.35, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-20 left-0"
        style={{
          width: '120px',
          height: '40px',
          background: 'linear-gradient(90deg, #FFD1DC 0%, #FFD1DC 100%)',
          transform: 'rotate(-8deg)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 0.3, x: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute bottom-32 right-0"
        style={{
          width: '100px',
          height: '40px',
          background: 'linear-gradient(90deg, #B0E0E6 0%, #B0E0E6 100%)',
          transform: 'rotate(12deg)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      />

      {/* Top greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-caveat text-xl md:text-2xl mb-12"
        style={{ color: '#70665b' }}
      >
        🌸 Sebuah kejutan untukmu
      </motion.div>

      {/* Main button with rings and orbiting sparkles */}
      <div className="relative mb-8">
        {/* Outer pulsing ring - delayed */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            width: '240px',
            height: '240px',
            top: '50%',
            left: '50%',
            marginLeft: '-120px',
            marginTop: '-120px',
            border: '2px solid #FFD1DC',
            animation: 'pulse-ring-delayed 2s ease-in-out infinite',
          }}
        />

        {/* Inner pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            width: '220px',
            height: '220px',
            top: '50%',
            left: '50%',
            marginLeft: '-110px',
            marginTop: '-110px',
            border: '2px solid #B0E0E6',
            animation: 'pulse-ring 1.5s ease-in-out infinite',
          }}
        />

        {/* Orbiting sparkles */}
        <div className="absolute inset-0" style={{ width: '200px', height: '200px' }}>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ animation: isHovered ? 'orbit 8s linear infinite' : 'orbit 12s linear infinite' }}
          >
            <span className="text-2xl" style={{ color: '#FFD1DC' }}>✦</span>
          </div>
          
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ animation: isHovered ? 'orbit-reverse 7s linear infinite' : 'orbit-reverse 11s linear infinite', animationDelay: '1s' }}
          >
            <span className="text-xl" style={{ color: '#B0E0E6' }}>✦</span>
          </div>
          
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ animation: isHovered ? 'orbit 9s linear infinite' : 'orbit 13s linear infinite', animationDelay: '2s' }}
          >
            <span className="text-2xl" style={{ color: '#E8D5F5' }}>✦</span>
          </div>
          
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ animation: isHovered ? 'orbit-reverse 8.5s linear infinite' : 'orbit-reverse 12.5s linear infinite', animationDelay: '3s' }}
          >
            <span className="text-lg" style={{ color: '#FFDAB9' }}>✦</span>
          </div>
        </div>

        {/* Main button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: isExiting ? 0 : 1, 
            opacity: isExiting ? 0 : 1,
          }}
          transition={{ duration: 0.6, type: 'spring' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative rounded-full w-48 h-48 md:w-52 md:h-52 flex items-center justify-center text-center cursor-pointer border-none outline-none focus:outline-none"
          style={{
            background: 'radial-gradient(circle at center, #ffffff 0%, #FFD1DC 50%, #B0E0E6 100%)',
            boxShadow: '0 15px 50px rgba(255, 209, 220, 0.4), 0 8px 20px rgba(176, 224, 230, 0.3)',
          }}
          data-testid="button-welcome"
        >
          <span className="text-lg md:text-xl font-medium px-8 leading-relaxed" style={{ color: '#3d3229' }}>
            Ada sesuatu<br />buat kamu...
          </span>
        </motion.button>
      </div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="font-light text-xs md:text-sm"
        style={{ color: '#9a8d82' }}
      >
        ( ketuk untuk membuka )
      </motion.div>
    </motion.div>
  );
}
