import { vi, type Mock } from 'vitest';

/** Vitest-Pendant zu jasmine.SpyObj<T>: jede Methode wird zu einem vi.fn()-Mock. */
export type SpyObj<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R ? Mock<(...args: A) => R> : T[K];
};

/** Vitest-Ersatz für jasmine.createSpyObj, da der native Angular-Vitest-Runner kein jasmine-Objekt bereitstellt. */
export function createSpyObj<T = any>(
  _baseName: string,
  methodNames: string[],
  properties?: Record<string, unknown>
): SpyObj<T> {
  const spyObj: Record<string, unknown> = {};
  for (const methodName of methodNames) {
    spyObj[methodName] = vi.fn();
  }
  if (properties) {
    Object.assign(spyObj, properties);
  }
  return spyObj as SpyObj<T>;
}

