/**
 * ARA BEDDINGS - Logger Service
 * Comprehensive logging system for debugging and monitoring
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  context?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private enabled = true;

  constructor() {
    // Load logs from localStorage
    const saved = localStorage.getItem('ara_logs');
    if (saved) {
      try {
        this.logs = JSON.parse(saved);
      } catch (e) {
        this.logs = [];
      }
    }
  }

  private save() {
    try {
      localStorage.setItem('ara_logs', JSON.stringify(this.logs.slice(-this.maxLogs)));
    } catch (e) {
      console.error('Failed to save logs');
    }
  }

  private log(level: LogLevel, message: string, data?: any) {
    if (!this.enabled) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context: 'ARA BEDDINGS'
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    this.save();

    // Console output
    const color = this.getColor(level);
    const icon = this.getIcon(level);
    
    if (level === 'error') {
      console.error(`${icon} [${level.toUpperCase()}] ${message}`, data || '');
    } else if (level === 'warn') {
      console.warn(`${icon} [${level.toUpperCase()}] ${message}`, data || '');
    } else {
      console.log(`%c${icon} [${level.toUpperCase()}] ${message}`, `color: ${color}`, data || '');
    }
  }

  private getColor(level: LogLevel): string {
    switch (level) {
      case 'debug': return '#6b7280';
      case 'info': return '#3b82f6';
      case 'warn': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'success': return '#10b981';
    }
  }

  private getIcon(level: LogLevel): string {
    switch (level) {
      case 'debug': return '🔍';
      case 'info': return 'ℹ️';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      case 'success': return '✅';
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, error?: any) {
    this.log('error', message, error);
  }

  success(message: string, data?: any) {
    this.log('success', message, data);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  clear() {
    this.logs = [];
    this.save();
    console.log('🗑️ Logs cleared');
  }

  enable() {
    this.enabled = true;
    console.log('✅ Logging enabled');
  }

  disable() {
    this.enabled = false;
    console.log('🚫 Logging disabled');
  }

  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  getStats() {
    return {
      total: this.logs.length,
      byLevel: {
        debug: this.logs.filter(l => l.level === 'debug').length,
        info: this.logs.filter(l => l.level === 'info').length,
        warn: this.logs.filter(l => l.level === 'warn').length,
        error: this.logs.filter(l => l.level === 'error').length,
        success: this.logs.filter(l => l.level === 'success').length,
      },
      lastLog: this.logs[this.logs.length - 1] || null
    };
  }
}

export const logger = new Logger();

// Make logger available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).logger = logger;
}
