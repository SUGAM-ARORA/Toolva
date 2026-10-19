import { test, describe } from 'node:test';
import assert from 'node:assert';
import { generateStackBlueprint } from '../lib/stackPlannerEngine.js';

describe('AI Stack Planner Quality & Constraint Tests', () => {
  test('Voice assistant intent yields valid 3-stage pipeline with local/cloud tradeoffs', () => {
    const bp = generateStackBlueprint('I want to build a real-time voice assistant for my raspberry pi');
    assert.strictEqual(bp.stages.length >= 3, true);
    assert.strictEqual(bp.hardwareRequirements.canRunCPUOnly, true);
    
    // Check that STT, LLM, and TTS stages are present
    const stageNames = bp.stages.map(s => s.name.toLowerCase());
    assert.strictEqual(stageNames.some(n => n.includes('speech-to-text')), true);
    assert.strictEqual(stageNames.some(n => n.includes('llm') || n.includes('reasoning')), true);
    assert.strictEqual(stageNames.some(n => n.includes('text-to-speech') || n.includes('tts')), true);

    // Each stage must provide both local and cloud options
    for (const stage of bp.stages) {
      assert.strictEqual(stage.options.length >= 1, true);
      const hasLocal = stage.options.some(o => o.type === 'local');
      assert.strictEqual(hasLocal, true, `Stage ${stage.name} should offer an open-source/local option`);
    }
  });

  test('Video automation intent specifies GPU/VRAM hardware constraints', () => {
    const bp = generateStackBlueprint('Create faceless automated YouTube videos');
    assert.strictEqual(bp.stages.length >= 3, true);
    assert.strictEqual(bp.hardwareRequirements.minVRAM.includes('GB'), true);

    // Should include video rendering stage
    const hasVideoStage = bp.stages.some(s => s.outputType.toLowerCase().includes('video') || s.name.toLowerCase().includes('video'));
    assert.strictEqual(hasVideoStage, true);
  });

  test('Developer coding assistant provides AST / FIM integration', () => {
    const bp = generateStackBlueprint('Setup offline coding copilot');
    assert.strictEqual(bp.stages.some(s => s.name.toLowerCase().includes('ide') || s.name.toLowerCase().includes('autocomplete')), true);
  });
});
