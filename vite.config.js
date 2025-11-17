import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 生成 source maps 用于调试
    sourcemap: true,
    // 优化构建大小
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关代码分离到单独的 chunk
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // 设置 chunk 大小警告限制
    chunkSizeWarningLimit: 1000,
  },
  // 开发服务器配置
  server: {
    // 启用 HTTPS（PWA 要求）
    https: false, // 开发环境可以关闭，生产环境建议开启
    host: true, // 允许外部访问
    port: 5173,
  },
  // 预览服务器配置
  preview: {
    host: true,
    port: 4173,
  },
  // PWA 相关配置
  define: {
    // 定义环境变量
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
})