import { beforeAll, afterEach, afterAll, vi } from "vitest";
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

// eslint-disable-next-line no-undef
global.localStorage = localStorageMock;
