import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface SpawnedBubble {
  id: number;
  word: string;
  x: number; // percent from left
  size: number; // px
  duration: number; // seconds to travel
  fontSize?: number; // px
}

interface BubbleSettings {
  initialBurst: number;
  intervalMs: number;
  maxActive: number;
  sizeMin: number;
  sizeMax: number;
  durationMin: number;
  durationMax: number;
}

const wordsPool: string[] = [
  'kamu tuh selalu nyuri perhatian aku',
  'sayang, kamu manis banget sih',
  'aku nggak bisa berhenti mikirin kamu',
  'kamu bener-bener bikin hari aku cerah',
  'kamu tuh bikin nyaman banget',
  'kamu kayak magnet bikin aku tertarik',
  'eh, kamu imutnya kebangetan sih',
  'kamu tuh alasan senyum aku hari ini',
  'aku kangen deh',
  'suaramu bikin aku adem banget',
  'kamu paket lengkap, cakep + asik banget',
  'aku suka banget gaya kamu yang santai itu',
  'kamu tuh selalu bikin aku penasaran',
  'kamu cantik parah kayak bintang',
  'kamu punya vibe yang bikin aku jatuh hati lagi',
  'dasar kamu, bikin aku gemes terus',
  'kamu bikin semua hal jadi lebih berwarna',
  'kamu selalu bikin hati aku deg-degan',
  'senyum kamu tuh bikin aku meleleh',
  'kamu tuh mood booster aku setiap hari',
  'kalo lagi sama kamu, waktu berasa cepet banget',
  'kamu cakep banget pas senyum',
  'kamu selalu bikin aku penasaran',
  'kamu emang spesial, nggak ada duanya',
];

  function isEmojiCodePoint(cp: number) {
    return (
      (cp >= 0x1f300 && cp <= 0x1f5ff) || // Misc Symbols and Pictographs
      (cp >= 0x1f600 && cp <= 0x1f64f) || // Emoticons
      (cp >= 0x1f680 && cp <= 0x1f6ff) || // Transport & Map
      (cp >= 0x2600 && cp <= 0x26ff) || // Misc symbols
      (cp >= 0x2700 && cp <= 0x27bf) || // Dingbats
      (cp >= 0x1f900 && cp <= 0x1f9ff) || // Supplemental Symbols and Pictographs
      (cp >= 0x1fa70 && cp <= 0x1faff) // Symbols and Pictographs Extended-A
    );
  }

  function getTrailingEmoji(s: string) {
    if (!s) return '';
    const arr = Array.from(s);
    let i = arr.length - 1;
    let collected: string[] = [];
    while (i >= 0) {
      const ch = arr[i];
      const cp = ch.codePointAt(0) as number;
      // treat variation selector and combining marks as part of emoji clusters
      if (cp === 0xfe0f || (cp >= 0x300 && cp <= 0x36f)) {
        collected.unshift(ch);
        i -= 1;
        continue;
      }
      if (isEmojiCodePoint(cp)) {
        collected.unshift(ch);
        i -= 1;
        // also consume any preceding skin tone modifiers (U+1F3FB..U+1F3FF)
        if (i >= 0) {
          const prev = Array.from(arr[i])[0];
          const prevCp = prev ? prev.codePointAt(0) as number : 0;
          if (prevCp >= 0x1f3fb && prevCp <= 0x1f3ff) {
            collected.unshift(prev);
            i -= 1;
          }
        }
        continue;
      }
      // stop when character is not emoji nor modifier
      break;
    }
    return collected.join('');
  }

  function truncateForBubble(s: string, maxChars: number) {
    if (!s) return s;
    const arr = Array.from(s);
    if (arr.length <= maxChars) return s;

    // try to detect trailing emoji(s) so we don't cut them off
    // match a sequence of pictographic characters (emoji) at the end
    const trailingEmoji = getTrailingEmoji(s);
    const emojiLen = trailingEmoji ? Array.from(trailingEmoji).length : 0;

    if (emojiLen > 0) {
      // Reserve space for the emoji and an ellipsis; make sure headLen >= 1
      const headLen = Math.max(1, maxChars - emojiLen - 1);
      const head = arr.slice(0, headLen).join('');
      return head + '…' + trailingEmoji;
    }

    return arr.slice(0, Math.max(0, maxChars - 1)).join('') + '…';
  }

interface BubbleGalleryProps {
  onClose: () => void;
}

function removeTrailingEmoji(s: string) {
  if (!s) return s;
  const trailing = getTrailingEmoji(s);
  if (!trailing) return s;
  const arr = Array.from(s);
  const keep = arr.slice(0, arr.length - Array.from(trailing).length).join('').trim();
  return keep;
}

export default function BubbleGallery({ onClose }: BubbleGalleryProps) {
  const [active, setActive] = useState<SpawnedBubble[]>([]);
  const idRef = useRef(1);
  const spawnIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const settings: BubbleSettings = isMobile
      ? {
          initialBurst: 3,
          intervalMs: 900,
          maxActive: 18,
          sizeMin: 50,
          sizeMax: 100,
          durationMin: 10,
          durationMax: 16,
        }
      : {
          initialBurst: 8,
          intervalMs: 400,
          maxActive: 120,
          sizeMin: 60,
          sizeMax: 160,
          durationMin: 10,
          durationMax: 20,
        };

    const xOffset = isMobile ? 15 : 6;
    const xRange = isMobile ? 70 : 84;
      const maxChars = isMobile ? 36 : 60;

    const spawnBubble = () => {
      const raw = wordsPool[Math.floor(Math.random() * wordsPool.length)];
      const baseSize = settings.sizeMin + Math.random() * (settings.sizeMax - settings.sizeMin);
      const cleaned = removeTrailingEmoji(raw);

      // compute dynamic font size to try fit within 2 lines before truncating
      const maxWidthPx = isMobile ? 160 : 180;
      const baseFont = Math.max(13, Math.round(baseSize * 0.13));
      const approxCharWidth = baseFont * 0.55; // rough px per character
      const charsPerLine = Math.max(6, Math.floor(maxWidthPx / approxCharWidth));
      const allowedChars = charsPerLine * 2;

      let fontSize = baseFont;
      let word = cleaned;

      if (Array.from(cleaned).length > allowedChars) {
        // scale down font to try fit, but not below 11px
        const scale = Math.max(0.6, allowedChars / Array.from(cleaned).length);
        fontSize = Math.max(11, Math.floor(baseFont * scale));
        // if after scaling still too long, truncate to allowedChars
        if (Array.from(cleaned).length > allowedChars && fontSize <= 11) {
          word = truncateForBubble(cleaned, allowedChars);
        }
      }

      const b: SpawnedBubble = {
        id: idRef.current++,
        word,
        x: xOffset + Math.random() * xRange,
        size: baseSize,
        duration: settings.durationMin + Math.random() * (settings.durationMax - settings.durationMin),
        fontSize,
      };
      setActive((prev) => {
        const next = [...prev, b];
        if (next.length > settings.maxActive) next.shift();
        return next;
      });
    };

    for (let i = 0; i < settings.initialBurst; i++) {
      spawnBubble();
    }

    spawnIntervalRef.current = window.setInterval(() => {
      spawnBubble();
    }, settings.intervalMs);

    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    };
  }, []);

  const remove = (id: number) => setActive((prev) => prev.filter((p) => p.id !== id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(255,240,245,0.92)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        overflow: 'hidden',
      }}
    >
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#FFB7C5',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Poppins', sans-serif",
          fontSize: 16,
          color: '#fff',
          boxShadow: '0 2px 8px rgba(255,100,130,0.3)',
          zIndex: 101,
        }}
      >
        ×
      </motion.button>

      {/* counter removed per user request */}

      {/* Bubbles (spawned from bottom -> top) */}
      <AnimatePresence>
        {active.map((b) => (
          <FloatingBubble key={b.id} bubble={b} onComplete={() => remove(b.id)} />
        ))}
      </AnimatePresence>

      {/* Global music player moved to a shared module */}
    </motion.div>
  );
}

function FloatingBubble({ bubble, onComplete }: { bubble: SpawnedBubble; onComplete: () => void }) {
  const [isPopping, setIsPopping] = useState(false);
  const popRotationRef = useRef((Math.random() - 0.5) * 60);

  const handleClick = () => {
    if (isPopping) return;
    setIsPopping(true);
    spawnPopParticles(bubble.x, 95); // approximate y near bottom
    setTimeout(onComplete, 380);
  };

  // travel distance (px)
  const travel = typeof window !== 'undefined' ? window.innerHeight + 300 : 1000;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClick}
      style={{
        position: 'absolute',
        left: `${bubble.x}%`,
        transform: 'translateX(-50%)',
        bottom: -Math.max(20, bubble.size / 2),
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        userSelect: 'none',
        zIndex: 100,
        pointerEvents: 'auto',
      }}
    >
      {/* Floating group: bubble circle + tag */}
      <motion.div
        initial={isPopping ? { translateY: 0, opacity: 0 } : { translateY: 0, opacity: 1 }}
        animate={isPopping ? { scale: [1, 1.4, 0], opacity: 0, rotate: popRotationRef.current } : { translateY: -travel, opacity: 1 }}
        transition={isPopping ? { times: [0, 0.45, 1], duration: 0.38, ease: 'easeOut' } : { duration: bubble.duration, ease: 'linear' }}
        onAnimationComplete={() => {
          if (!isPopping) onComplete();
        }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
      >
        {/* Sweet word tag (no bubble circle) */}
        <motion.div
          initial={isPopping ? { opacity: 0.9, y: 8 } : { opacity: 1, y: 0 }}
          animate={isPopping ? { scale: 0.7, opacity: 0, rotate: popRotationRef.current } : { opacity: 1, y: 0 }}
          transition={isPopping ? { duration: 0.28, ease: 'easeOut' } : { delay: 0 }}
          style={{
            background: 'rgba(255,255,255,0.98)',
            borderRadius: 22,
            padding: '8px 14px',
            fontFamily: "'Caveat', cursive",
            fontSize: bubble.fontSize ?? Math.max(13, bubble.size * 0.13),
            color: '#b04b56',
            boxShadow: '0 6px 18px rgba(176,75,86,0.14)',
            whiteSpace: 'normal',
            wordBreak: 'normal',
            overflowWrap: 'normal',
            textAlign: 'center',
            lineHeight: 1.2,
            border: '1px solid rgba(176,75,86,0.12)',
            transformOrigin: 'center',
          }}
        >
          {bubble.word}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function spawnPopParticles(xPct: number, yPct: number) {
  const originX = (xPct / 100) * window.innerWidth;
  const originY = (yPct / 100) * window.innerHeight;
  const symbols = ['♥', '✦', '✿', '·', '°'];
  const colors = ['#FFB7C5', '#FADA5E', '#FFD1DC', '#B0E0E6', '#E8D5F5'];

  for (let i = 0; i < 10; i++) {
    const el = document.createElement('div');
    el.textContent = symbols[i % symbols.length];
    Object.assign(el.style, {
      position: 'fixed',
      top: `${originY}px`,
      left: `${originX}px`,
      fontSize: `${10 + Math.random() * 8}px`,
      color: colors[i % colors.length],
      pointerEvents: 'none',
      zIndex: '9999',
      transform: 'translate(-50%,-50%)',
      transition: 'none',
    });
    document.body.appendChild(el);

    const angle = (i / 10) * 2 * Math.PI + Math.random() * 0.4;
    const dist = 40 + Math.random() * 50;
    setTimeout(() => {
      el.style.transition = 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
      el.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`;
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 700);
    }, 10);
  }
}

function formatTime(t: number) {
  if (!t || isNaN(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
