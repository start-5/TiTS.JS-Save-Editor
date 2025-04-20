import { log } from '#src/utils/log.js';

function format(duration: number) {
  if (duration < 1) {
    return '<1 millisecond';
  }

  const units = {
    minute: Math.floor(duration / 60000) % 60,
    second: Math.floor(duration / 1000) % 60,
    millisecond: Math.floor(duration) % 1000
  };

  return Object.entries(units)
    .filter(function ([_, value]) {
      return value !== 0;
    })
    .map(function ([key, value]) {
      return `${value} ${key}${value !== 1 ? 's' : ''}`;
    })
    .join(', ');
}

class Timer {
  private _start = 0;
  private _end = 0;

  private _label: string;

  private _logStart = true;

  constructor(label: string);
  constructor(label: string, logStart: boolean);
  constructor(label: string, logStart: boolean = true) {
    this._label = label;
    this._logStart = logStart;
  }

  start() {
    this._start = performance.now();

    if (this._logStart) {
      log(`Started ${this._label}`);
    }
  }

  end() {
    this._end = performance.now();

    log(`Finished ${this._label} in ${format(this._end - this._start)}`);
  }
}

export function track<T>(label: string, action: () => T, logStart?: boolean): T;
export function track<T>(label: string, action: () => Promise<T>, logStart?: boolean): Promise<T>;
export function track<T>(label: string, action: () => T | Promise<T>, logStart: boolean = true): T | Promise<T> {
  const timer = new Timer(label, logStart);

  timer.start();

  const value = action();

  if (value instanceof Promise) {
    return value
      .then(function (result) {
        timer.end();
        return result;
      }).catch(function (error) {
        timer.end();
        throw error;
      });
  }

  timer.end();

  return value;
}
