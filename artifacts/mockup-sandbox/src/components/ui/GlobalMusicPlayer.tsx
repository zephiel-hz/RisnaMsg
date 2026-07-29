import React, { useEffect, useRef, useState } from 'react';

function Player() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlist = [
    { url: '/audio/lagu1.mp3', title: 'Best Part', artist: 'H.E.R. ft. Daniel Caesar' },
    { url: '/audio/lagu2.mp3', title: 'Double Take', artist: 'Dhruv' },
    { url: '/audio/lagu3.mp3', title: 'P.S. I Love You', artist: 'Paul Partohap' },
    { url: '/audio/lagu4.mp3', title: 'Photograph', artist: 'Ed Sheeran' },
    { url: '/audio/lagu5.mp3', title: 'Old Love', artist: 'Yuji ft Putri Dahlia' },
  ];
  const randomStartIndex = Math.floor(Math.random() * playlist.length);
  const [trackUrl, setTrackUrl] = useState(() => playlist[randomStartIndex].url);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(randomStartIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoplayAttempted = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationState, setDurationState] = useState(0);
  const [volume, setVolume] = useState(1);
  const [visible, setVisible] = useState(true);
  const [hoveredControl, setHoveredControl] = useState<string | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);

  const iconBtnStyle = () => ({
    background: 'transparent',
    border: 'none',
    padding: 6,
    borderRadius: 8,
    cursor: 'pointer',
  });

  const hoverableButtonStyle = (key: string) => ({
    transition: 'all 0.2s ease',
    ...(hoveredControl === key ? {
      transform: 'translateY(-2px)',
      background: 'rgba(255,255,255,0.95)',
      boxShadow: '0 10px 24px rgba(176,75,86,0.16)',
    } : {}),
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onLoaded = () => {
      setDurationState(audio.duration || 0);
      setPlayError(null);
    };
    const onEnded = () => setIsPlaying(false);
    audio.volume = volume;
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.src = trackUrl;
    audio.currentTime = 0;
    audio.load();
    audio.volume = volume;

    if (isPlaying) {
      audio.play().then(() => {
        setPlayError(null);
      }).catch(() => {
        setIsPlaying(false);
        setPlayError('Browser blocked playback. Coba klik play lagi.');
      });
    }
  }, [trackUrl, volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    if (isPlaying) {
      audio.play().then(() => {
        setPlayError(null);
      }).catch(() => {
        setIsPlaying(false);
        setPlayError('Browser blocked playback. Coba klik play lagi.');
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (autoplayAttempted.current) return;
    const audio = audioRef.current;
    if (!audio) return;

    autoplayAttempted.current = true;
    const playPromise = audio.play();
    if (playPromise) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setPlayError(null);
        })
        .catch(() => {
          setIsPlaying(false);
          setPlayError('Autoplay diblokir; klik play untuk memulai.');
        });
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
      setPlayError(null);
    } else {
      const playPromise = a.play();
      if (playPromise) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setPlayError(null);
          })
          .catch(() => {
            setIsPlaying(false);
            setPlayError('Browser blocked playback. Coba klik play lagi.');
          });
      } else {
        setIsPlaying(true);
      }
    }
  }

  function switchTrack(index: number) {
    const nextIndex = (index + playlist.length) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    setTrackUrl(playlist[nextIndex].url);
    setIsPlaying(true);
  }

  const currentTrack = playlist[currentTrackIndex];

  const wrapperStyle = {
    width: visible ? 320 : 'auto',
    padding: visible ? 20 : '12px 16px',
    borderRadius: visible ? 22 : 999,
    background: visible ? 'linear-gradient(180deg,#ffd8df,#ffe3e9)' : 'linear-gradient(180deg,#ffd6de,#ffe9ef)',
    boxShadow: visible ? '0 24px 60px rgba(176,75,86,0.14)' : '0 16px 40px rgba(176,75,86,0.1)',
    fontFamily: "'Caveat', cursive",
    color: '#8a2f33',
    position: 'fixed' as const,
    right: 20,
    bottom: 20,
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 14,
    transition: 'all 0.28s ease',
    cursor: visible ? 'default' : 'pointer',
  };

  return (
    <div style={wrapperStyle} onClick={visible ? undefined : () => setVisible(true)}>
      <audio ref={audioRef} src={trackUrl} preload="auto" playsInline />
      {visible ? (
        <>
          <button onClick={() => setVisible(false)} aria-label="hide player" onMouseEnter={() => setHoveredControl('hide')} onMouseLeave={() => setHoveredControl(null)} style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: 12,
            border: 'none',
            background: 'rgba(255,255,255,0.95)',
            color: '#b04b56',
            boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            transition: 'all 0.2s ease',
            ...(hoveredControl === 'hide' ? {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 26px rgba(176,75,86,0.18)',
            } : {}),
          }}>
            <span style={{fontSize: 18, lineHeight: 1}}>×</span>
          </button>

          <div style={{fontSize: 20, fontWeight: 700}}>{currentTrack.title}</div>
          <div style={{fontSize: 13, color: '#7a3b3f'}}>{currentTrack.artist}</div>
          {playError ? <div style={{fontSize: 11, color: '#b04b56', marginTop: -2}}>{playError}</div> : null}

          <div style={{width: 124, height: 124, borderRadius: 16, background: 'linear-gradient(180deg,#fff,#ffeef2)', boxShadow: '0 12px 30px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img src="https://images.unsplash.com/photo-1526178611718-0ae777ef8d9a?w=300&q=80&auto=format&fit=crop" alt="art" style={{width: 104, height: 104, borderRadius: 12, objectFit: 'cover'}} />
          </div>

          <div style={{display: 'flex', width: '100%', alignItems: 'center', gap: 10}}>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{height: 8, background: 'rgba(255,255,255,0.75)', borderRadius: 8, position: 'relative', cursor: 'pointer'}} onClick={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                const rect = el.getBoundingClientRect();
                const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                if (audioRef.current && audioRef.current.duration) audioRef.current.currentTime = pct * audioRef.current.duration;
              }}>
                <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${durationState ? (currentTime / durationState) * 100 : 0}%`, background: 'linear-gradient(90deg,#ffe066,#ffb86b)', borderRadius: 8, transition: 'width 0.12s linear'}} />
              </div>
            </div>
            <span style={{fontSize: 11, color: '#8a2f33', opacity: 0.7, whiteSpace: 'nowrap'}}>{formatTime(currentTime)} / {formatTime(durationState)}</span>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', justifyContent: 'center'}}>
            <button aria-label="prev" style={{...iconBtnStyle(), ...hoverableButtonStyle('prev')}} onMouseEnter={() => setHoveredControl('prev')} onMouseLeave={() => setHoveredControl(null)} onClick={() => switchTrack(currentTrackIndex - 1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-8 6 8 6V6z" fill="#b04b56"/><path d="M7 6H5v12h2V6z" fill="#b04b56"/></svg>
            </button>

            <button onClick={toggle} onMouseEnter={() => setHoveredControl('play')} onMouseLeave={() => setHoveredControl(null)} style={{...hoverableButtonStyle('play'), width: 64, height: 64, borderRadius: 64, border: 'none', background: 'linear-gradient(180deg,#ffd54d,#ffd86b)', boxShadow: '0 8px 20px rgba(255,182,60,0.2)', fontSize: 22, cursor: 'pointer', transition: 'all 0.2s ease'}}>{isPlaying ? '⏸' : '▶'}</button>

            <button aria-label="next" style={{...iconBtnStyle(), ...hoverableButtonStyle('next')}} onMouseEnter={() => setHoveredControl('next')} onMouseLeave={() => setHoveredControl(null)} onClick={() => switchTrack(currentTrackIndex + 1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l8 6-8 6V6z" fill="#b04b56"/><path d="M17 6h2v12h-2V6z" fill="#b04b56"/></svg>
            </button>
          </div>
          <div style={{display: 'flex', alignItems: 'center', width: '100%', gap: 10}}>
            <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e)=>{const v=Number(e.target.value); setVolume(v); if (audioRef.current) audioRef.current.volume=v;}} style={{flex: 1, WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', height: 8, borderRadius: 999, background: 'linear-gradient(90deg,#ffe066,#ffb86b)', outline: 'none', cursor: 'pointer', accentColor: '#b04b56'}} />
            <span style={{fontSize: 11, color: '#8a2f33', opacity: 0.8, minWidth: 38, textAlign: 'right'}}>{Math.round(volume * 100)}%</span>
          </div>
        </>
      ) : (
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', gap: 12}}>
          <div style={{display:'flex', alignItems:'center', gap: 12}}>
            <div style={{width: 36, height: 36, borderRadius: 14, background: 'rgba(255,255,255,0.95)', display: 'grid', placeItems: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.08)'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v18" stroke="#b04b56" strokeWidth="1.8" strokeLinecap="round"/><path d="M7 8.5v7a2.5 2.5 0 005 0v-7" stroke="#b04b56" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap: 2}}>
              <span style={{fontSize: 13, fontWeight: 700}}>Mini Player</span>
              <span style={{fontSize: 11, color: '#8a2f33', opacity: 0.75}}>{isPlaying ? 'Now playing' : 'Tap to open'}</span>
            </div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap: 6}}>
            <span style={{fontSize: 11, color: '#8a2f33', opacity: 0.75}}>{formatTime(currentTime)}</span>
            <button aria-label="open player" onMouseEnter={() => setHoveredControl('open')} onMouseLeave={() => setHoveredControl(null)} onClick={(e) => { e.stopPropagation(); setVisible(true); }} style={{...iconBtnStyle(), width: 34, height: 34, borderRadius: 14, background: 'rgba(255,255,255,0.95)', boxShadow: '0 10px 24px rgba(0,0,0,0.08)', transition: 'all 0.2s ease', ...(hoveredControl === 'open' ? { transform: 'translateY(-2px)', boxShadow: '0 12px 24px rgba(176,75,86,0.16)' } : {})}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 10l6-6 6 6" stroke="#b04b56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 14l6 6 6-6" stroke="#b04b56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(t: number) {
  if (!t || isNaN(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default Player;
