export {};

declare global {
  interface Array<T> {
    first<T>(): T;
    last<T>(): T;
  }
}

// @ts-ignore
if (!Array.prototype.first) {
  // @ts-ignore
  Array.prototype.first = function<T>(this: T[]): T {
    return this[0];
  }
}

// @ts-ignore
if (!Array.prototype.last) {
  // @ts-ignore
  Array.prototype.last = function<T>(this: T[]): T {
    return this[this.length - 1];
  }
}



