import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";

// Tests must explicitly provide their external responses; never use live services.
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn((input: unknown) => {
    throw new Error(`Unexpected network request in test: ${String(input)}`);
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});
