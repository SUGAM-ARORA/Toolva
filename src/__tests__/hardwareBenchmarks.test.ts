import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  HARDWARE_BENCHMARK_CATALOG,
  filterBenchmarks,
  compareHardwareSpeed,
} from '../lib/hardwareBenchmarkData.js';

describe('Hardware Benchmarks Quality & Comparison Tests', () => {
  test('Catalog records contain full provenance and valid numbers', () => {
    assert.strictEqual(HARDWARE_BENCHMARK_CATALOG.length >= 5, true);
    for (const bm of HARDWARE_BENCHMARK_CATALOG) {
      assert.strictEqual(bm.tokensPerSecGen > 0, true);
      assert.strictEqual(bm.vramUsedGB >= 0, true);
      assert.strictEqual(bm.sourceUrl.startsWith('http'), true);
      assert.strictEqual(bm.methodologyNotes !== undefined && bm.methodologyNotes.length > 10, true);
    }
  });

  test('Filter returns correct hardware subset', () => {
    const rtxOnly = filterBenchmarks({ hardwareQuery: '4090' });
    assert.strictEqual(rtxOnly.length >= 2, true);
    for (const b of rtxOnly) {
      assert.strictEqual(b.hardware.includes('4090'), true);
    }
  });

  test('Hardware comparison calculates accurate speedup ratio', () => {
    const comparison = compareHardwareSpeed('Llama-3.1-8B', '4090', 'i7-13700K');
    assert.notStrictEqual(comparison, null);
    if (comparison) {
      assert.strictEqual(comparison.hw1Speed > comparison.hw2Speed, true);
      assert.strictEqual(comparison.ratio > 5, true, 'RTX 4090 should be >5x faster than CPU inference');
    }
  });
});
