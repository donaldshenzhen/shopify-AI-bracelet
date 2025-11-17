import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// PWA Service Worker 注册
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker 注册成功:', registration.scope);
        
        // 检查更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 新的 Service Worker 可用，提示用户刷新
              if (confirm('发现新版本，是否立即更新？')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('Service Worker 注册失败:', error);
      });
  });
} else {
  console.log('当前浏览器不支持 Service Worker');
}

// PWA 安装提示
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // 阻止默认的安装横幅
  e.preventDefault();
  // 保存事件以便稍后触发
  deferredPrompt = e;
  
  // 显示自定义安装按钮（可选）
  console.log('PWA 可以安装了');
  
  // 你可以在这里显示一个自定义的安装按钮
  const installButton = document.createElement('button');
  installButton.textContent = '安装应用';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #0f3460;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  
  installButton.addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('用户接受了 PWA 安装');
        } else {
          console.log('用户拒绝了 PWA 安装');
        }
        deferredPrompt = null;
        installButton.remove();
      });
    }
  });
  
  document.body.appendChild(installButton);
});

// 监听应用安装完成
window.addEventListener('appinstalled', (evt) => {
  console.log('PWA 安装成功');
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)