import fs from 'fs';
import { createCanvas } from 'canvas';

// 图标尺寸
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// 创建图标的函数
function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // 背景 - 渐变
  const bgGradient = ctx.createLinearGradient(0, 0, size, size);
  bgGradient.addColorStop(0, '#1a1a2e');
  bgGradient.addColorStop(1, '#16213e');
  
  // 绘制圆角矩形背景
  const radius = size * 0.15625; // 80/512 的比例
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fillStyle = bgGradient;
  ctx.fill();
  
  // 手环表示
  const braceletGradient = ctx.createLinearGradient(size * 0.195, size * 0.391, size * 0.805, size * 0.609);
  braceletGradient.addColorStop(0, '#0f3460');
  braceletGradient.addColorStop(1, '#533483');
  
  const braceletY = size * 0.391;
  const braceletHeight = size * 0.219;
  const braceletRadius = braceletHeight / 2;
  
  ctx.beginPath();
  ctx.moveTo(size * 0.195 + braceletRadius, braceletY);
  ctx.lineTo(size * 0.805 - braceletRadius, braceletY);
  ctx.quadraticCurveTo(size * 0.805, braceletY, size * 0.805, braceletY + braceletRadius);
  ctx.lineTo(size * 0.805, braceletY + braceletHeight - braceletRadius);
  ctx.quadraticCurveTo(size * 0.805, braceletY + braceletHeight, size * 0.805 - braceletRadius, braceletY + braceletHeight);
  ctx.lineTo(size * 0.195 + braceletRadius, braceletY + braceletHeight);
  ctx.quadraticCurveTo(size * 0.195, braceletY + braceletHeight, size * 0.195, braceletY + braceletHeight - braceletRadius);
  ctx.lineTo(size * 0.195, braceletY + braceletRadius);
  ctx.quadraticCurveTo(size * 0.195, braceletY, size * 0.195 + braceletRadius, braceletY);
  ctx.closePath();
  ctx.fillStyle = braceletGradient;
  ctx.fill();
  ctx.strokeStyle = '#e94560';
  ctx.lineWidth = size * 0.0078125; // 4/512 的比例
  ctx.stroke();
  
  // 冥想符号
  const centerX = size / 2;
  const centerY = size / 2;
  const centerRadius = size * 0.0586; // 30/512 的比例
  
  // 中心圆
  ctx.beginPath();
  ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#e94560';
  ctx.fill();
  
  // 冥想波浪
  const waveColors = ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.4)'];
  const waveOffsets = [-size * 0.117, -size * 0.098, -size * 0.078];
  const waveHeights = [size * 0.039, size * 0.039, size * 0.039];
  
  waveColors.forEach((color, index) => {
    ctx.beginPath();
    ctx.moveTo(centerX - size * 0.117, centerY + waveOffsets[index]);
    ctx.quadraticCurveTo(centerX - size * 0.059, centerY + waveOffsets[index] - waveHeights[index], centerX, centerY + waveOffsets[index]);
    ctx.quadraticCurveTo(centerX + size * 0.059, centerY + waveOffsets[index] - waveHeights[index], centerX + size * 0.117, centerY + waveOffsets[index]);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.00586; // 3/512 的比例
    ctx.stroke();
  });
  
  // 传感器点
  const sensorPositions = [
    { x: size * 0.273, y: centerY },
    { x: size * 0.352, y: centerY },
    { x: size * 0.648, y: centerY },
    { x: size * 0.727, y: centerY }
  ];
  
  sensorPositions.forEach(pos => {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size * 0.0156, 0, Math.PI * 2); // 8/512 的比例
    ctx.fillStyle = '#00ff88';
    ctx.fill();
  });
  
  return canvas;
}

// 生成所有图标
console.log('Generating PWA icons...');

iconSizes.forEach(size => {
  const canvas = createIcon(size);
  const buffer = canvas.toBuffer('image/png');
  const filename = `public/icons/icon-${size}x${size}.png`;
  
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename}`);
});

console.log('All icons generated successfully!');