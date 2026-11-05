import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

const unexpectedRequests: string[] = [];

function blockNetwork() {
  vi.stubGlobal("fetch", vi.fn((input: unknown) => {
    unexpectedRequests.push(String(input));
    throw new Error(`Unexpected network request in test: ${String(input)}`);
  }));
}

// Install before test imports as well as before each test; responses are explicit fixtures.
blockNetwork();
beforeEach(blockNetwork);

afterEach(() => {
  vi.unstubAllGlobals();
  expect(unexpectedRequests.splice(0), "Tests must mock their external network boundaries").toEqual([]);
});
