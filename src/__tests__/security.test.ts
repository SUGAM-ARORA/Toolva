import { test, describe } from 'node:test';
import assert from 'node:assert';
import { isSsrfSafeUrl, sanitizeUrl, escapeHtml, stripHtml, validateToolSubmission } from '../lib/security.js';

describe('Security & SSRF Protection Tests', () => {
  test('Blocks loopback localhost addresses', () => {
    assert.strictEqual(isSsrfSafeUrl('http://localhost:8080/admin').safe, false);
    assert.strictEqual(isSsrfSafeUrl('http://127.0.0.1:3000').safe, false);
    assert.strictEqual(isSsrfSafeUrl('http://127.0.0.2:80').safe, false);
    assert.strictEqual(isSsrfSafeUrl('http://0.0.0.0:8000').safe, false);
  });

  test('Blocks private RFC 1918 IPv4 ranges', () => {
    assert.strictEqual(isSsrfSafeUrl('http://10.0.0.1/secrets').safe, false);
    assert.strictEqual(isSsrfSafeUrl('http://172.16.0.1/api').safe, false);
    assert.strictEqual(isSsrfSafeUrl('http://172.31.255.255/internal').safe, false);
    assert.strictEqual(isSsrfSafeUrl('http://192.168.1.1/router').safe, false);
  });

  test('Blocks AWS/GCP cloud metadata services', () => {
    assert.strictEqual(isSsrfSafeUrl('http://169.254.169.254/latest/meta-data/').safe, false);
    assert.strictEqual(isSsrfSafeUrl('http://metadata.google.internal/computeMetadata/v1/').safe, false);
  });

  test('Allows legitimate public HTTPS URLs', () => {
    assert.strictEqual(isSsrfSafeUrl('https://github.com/ollama/ollama').safe, true);
    assert.strictEqual(isSsrfSafeUrl('https://huggingface.co/models').safe, true);
    assert.strictEqual(isSsrfSafeUrl('https://vllm.ai').safe, true);
  });

  test('SanitizeUrl neutralizes javascript: and data: protocol exploits', () => {
    assert.strictEqual(sanitizeUrl('javascript:alert(1)'), '#');
    assert.strictEqual(sanitizeUrl('JAVASCRIPT:alert(document.cookie)'), '#');
    assert.strictEqual(sanitizeUrl('file:///etc/passwd'), '#');
    assert.strictEqual(sanitizeUrl('https://toolva.ai'), 'https://toolva.ai/');
  });

  test('EscapeHtml correctly encodes dangerous characters', () => {
    const raw = '<script>alert("XSS & danger")</script>';
    const escaped = escapeHtml(raw);
    assert.strictEqual(escaped.includes('<script>'), false);
    assert.strictEqual(escaped.includes('&lt;script&gt;'), true);
  });
});
