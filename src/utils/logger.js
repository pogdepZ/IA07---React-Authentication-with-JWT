// src/utils/logger.js

// Tạo một kênh sự kiện riêng
const logEventBus = new EventTarget();

export const addLog = (message, type = 'info') => {
  // type: 'info' | 'success' | 'error' | 'warning'
  const event = new CustomEvent('new-log', {
    detail: {
      id: Date.now() + Math.random(),
      time: new Date().toLocaleTimeString(),
      message,
      type
    }
  });
  logEventBus.dispatchEvent(event);
};

// Hook để React Component lắng nghe
export const subscribeToLogs = (callback) => {
  const handler = (e) => callback(e.detail);
  logEventBus.addEventListener('new-log', handler);
  
  // Trả về hàm cleanup
  return () => logEventBus.removeEventListener('new-log', handler);
};