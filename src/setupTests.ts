import { expect } from "vitest";

// Jest DOM matchers for better assertions
globalThis.expect = expect;

await import("@testing-library/jest-dom");
