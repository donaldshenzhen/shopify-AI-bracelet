import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  // 计时器状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 默认10分钟
  const audioRef = useRef(null);

  // 格式化时间显示
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 处理播放/暂停
  const handlePlayPause = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    // 控制音乐播放
    if (audioRef.current) {
      if (newIsPlaying) {
        audioRef.current.play().catch(error => {
          console.warn('无法自动播放音乐:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  };

  // 计时器效果和音乐控制
  useEffect(() => {
    let interval = null;
    
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      // 计时结束时停止音乐
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, timeLeft]);
  
  // 初始化音频元素
  useEffect(() => {
    // 创建音频元素并设置本地冥想音乐源
    const audio = new Audio('/Users/donald/Downloads/meditation-background-434654.mp3');
    audio.loop = true; // 设置循环播放
    audio.volume = 0.3; // 设置默认音量
    audioRef.current = audio;
    
    // 组件卸载时清理音频资源
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="meditation-container">
      <div className="timer-display">
        <h1>{formatTime(timeLeft)}</h1>
      </div>
      
      <div className="timer-controls">
        <button
          className="play-pause-button"
          onClick={handlePlayPause}
          aria-label={isPlaying ? '暂停' : '播放'}
        >
          {isPlaying ? '暂停' : '开始'}
        </button>
      </div>
      
      {/* 音频元素 - 隐藏在DOM中但可被控制 */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
}

export default App;