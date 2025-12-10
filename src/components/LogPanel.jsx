// src/components/LogPanel.jsx
import React, { useEffect, useState, useRef } from 'react';
import { subscribeToLogs } from '../utils/logger';

const LogPanel = () => {
  const [logs, setLogs] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    // Đăng ký lắng nghe sự kiện log
    const unsubscribe = subscribeToLogs((newLog) => {
      setLogs((prev) => [...prev, newLog]);
    });
    return unsubscribe;
  }, []);

  // Tự động cuộn xuống dưới cùng khi có log mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="bg-gray-900 text-sm font-mono p-4 rounded-lg shadow-xl h-[500px] flex flex-col border border-gray-700 w-full max-w-md">
      <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-2">
        <span className="text-gray-400 font-bold uppercase tracking-wider">System Logs</span>
        <button 
          onClick={() => setLogs([])} 
          className="text-xs text-gray-500 hover:text-white border border-gray-600 px-2 py-1 rounded"
        >
          Clear
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {logs.length === 0 && (
          <p className="text-gray-600 italic text-center mt-10">Waiting for events...</p>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 animate-fade-in">
            <span className="text-gray-500 shrink-0">[{log.time}]</span>
            <span className={`${getColor(log.type)} break-all`}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default LogPanel;