import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  // 计时器状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 默认10分钟
  const audioRef = useRef(null);
  
  // PWA 相关状态
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

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

  // PWA 安装处理
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('用户接受了 PWA 安装');
      } else {
        console.log('用户拒绝了 PWA 安装');
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  // 监听网络状态
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 监听 PWA 安装提示
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

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
      
      // 发送通知（如果支持）
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('冥想时间结束', {
          body: '您的冥想时间已经结束，希望您感到放松和愉悦！',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-96x96.png',
          vibrate: [200, 100, 200]
        });
      }
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, timeLeft]);
  
  // 初始化音频元素和通知权限
  useEffect(() => {
    // 创建音频元素并设置项目内的音乐源
    const audio = new Audio('/music/meditation-background-434654.mp3');
    audio.loop = true; // 设置循环播放
    audio.volume = 0.3; // 设置默认音量
    audioRef.current = audio;
    
    // 请求通知权限
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('通知权限已授予');
        }
      });
    }
    
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
      {/* PWA 状态指示器 */}
      <div className="pwa-status">
        {!isOnline && (
          <div className="offline-indicator">
            📱 离线模式
          </div>
        )}
        {showInstallPrompt && (
          <button 
            className="install-button" 
            onClick={handleInstallClick}
            aria-label="安装应用"
          >
            📱 安装应用
          </button>
        )}
      </div>
      
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
      
      {/* PWA 功能说明 */}
      <div className="pwa-info">
        <p>💡 支持离线使用 • 可安装到主屏幕 • 后台运行</p>
      </div>
      
      {/* 音频元素 - 隐藏在DOM中但可被控制 */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
}

export default App;