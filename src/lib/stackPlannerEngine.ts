/**
 * Toolva — AI Stack Planner Engine (Phase 3: Tasks 3.14, 3.15, 3.26)
 * 
 * Generates structured, compatible multi-tool workflow blueprints from natural language intent.
 * Evaluates hardware constraints (RAM, VRAM), cloud vs local tradeoffs, and monthly costs.
 */

export interface StackOption {
  type: 'cloud' | 'local' | 'hybrid';
  toolName: string;
  category: string;
  description: string;
  pricing: string;
  minVRAM?: string;
  minRAM?: string;
  notes?: string;
}

export interface WorkflowStage {
  stageNumber: number;
  name: string;
  purpose: string;
  inputType: string;
  outputType: string;
  options: StackOption[];
  selectedOptionIndex: number;
}

export interface GeneratedStackBlueprint {
  id: string;
  intent: string;
  title: string;
  summary: string;
  totalEstimatedCost: string;
  hardwareRequirements: {
    minRAM: string;
    minVRAM: string;
    canRunCPUOnly: boolean;
  };
  stages: WorkflowStage[];
}

export function generateStackBlueprint(userIntent: string): GeneratedStackBlueprint {
  const query = (userIntent || '').toLowerCase();

  // Intent 1: Voice / Audio / Podcasting / Assistant
  if (query.includes('voice') || query.includes('speech') || query.includes('assistant') || query.includes('audio') || query.includes('podcast')) {
    return {
      id: 'blueprint-voice-assistant',
      intent: userIntent,
      title: '🎙️ Private Local / Cloud Voice Assistant',
      summary: 'End-to-end voice processing pipeline: real-time speech recognition, fast reasoning LLM, and natural speech synthesis.',
      totalEstimatedCost: '$0 (local) to $15/month (cloud API)',
      hardwareRequirements: {
        minRAM: '8GB',
        minVRAM: '6GB',
        canRunCPUOnly: true,
      },
      stages: [
        {
          stageNumber: 1,
          name: 'Speech-to-Text (STT)',
          purpose: 'Transcribe spoken audio with high accuracy and low latency',
          inputType: 'Audio Stream (WAV/MP3)',
          outputType: 'Text String',
          selectedOptionIndex: 0,
          options: [
            {
              type: 'local',
              toolName: 'Whisper.cpp / Faster-Whisper',
              category: 'Audio',
              description: 'High-performance C++ port of OpenAI Whisper running locally on CPU/GPU',
              pricing: 'FREE (Open Source)',
              minRAM: '4GB',
              minVRAM: '2GB',
              notes: 'Runs efficiently even on modest hardware',
            },
            {
              type: 'cloud',
              toolName: 'Deepgram Nova-2',
              category: 'Audio',
              description: 'Ultra-fast cloud speech recognition API with 300ms latency',
              pricing: '$0.0043/minute',
              notes: 'Best for low-latency production applications',
            },
          ],
        },
        {
          stageNumber: 2,
          name: 'Core Reasoning & LLM',
          purpose: 'Process user intent, formulate conversational responses, or execute function calls',
          inputType: 'Text Prompt',
          outputType: 'Response Text',
          selectedOptionIndex: 0,
          options: [
            {
              type: 'local',
              toolName: 'Ollama (Llama 3.1 8B Instruct)',
              category: 'Chatbots',
              description: 'Quantized 8B parameter model running locally with full privacy',
              pricing: 'FREE (Open Source)',
              minRAM: '8GB',
              minVRAM: '6GB',
              notes: 'Recommended Q4_K_M quantization',
            },
            {
              type: 'cloud',
              toolName: 'Anthropic Claude 3.5 Sonnet',
              category: 'Chatbots',
              description: 'Top-tier cloud LLM with strong nuanced reasoning and tool use',
              pricing: '$3 / 1M input tokens',
            },
          ],
        },
        {
          stageNumber: 3,
          name: 'Text-to-Speech (TTS)',
          purpose: 'Synthesize conversational response into natural human voice',
          inputType: 'Text String',
          outputType: 'Audio Output',
          selectedOptionIndex: 0,
          options: [
            {
              type: 'local',
              toolName: 'Kokoro-TTS / Piper',
              category: 'Audio',
              description: 'Lightweight neural TTS running on CPU in under 50ms',
              pricing: 'FREE (Apache 2.0)',
              minRAM: '2GB',
              canRunCPUOnly: true,
              notes: 'State-of-the-art open source voice quality',
            },
            {
              type: 'cloud',
              toolName: 'ElevenLabs',
              category: 'Audio',
              description: 'Market-leading ultra-realistic voice cloning and emotional inflection',
              pricing: '$5 - $22/month',
            },
          ],
        },
      ],
    };
  }

  // Intent 2: Video / YouTube / Marketing Automation
  if (query.includes('video') || query.includes('youtube') || query.includes('tiktok') || query.includes('content') || query.includes('faceless')) {
    return {
      id: 'blueprint-video-generation',
      intent: userIntent,
      title: '🎬 Automated Video & Content Pipeline',
      summary: 'Autonomous video production stack: scriptwriting, AI voiceover, visuals generation, and video composition.',
      totalEstimatedCost: '$0 to $35/month',
      hardwareRequirements: {
        minRAM: '16GB',
        minVRAM: '12GB',
        canRunCPUOnly: false,
      },
      stages: [
        {
          stageNumber: 1,
          name: 'Script & Storyboard',
          purpose: 'Generate structured hook, outline, and narrative script with visual cues',
          inputType: 'Topic Idea',
          outputType: 'JSON Script & Prompts',
          selectedOptionIndex: 0,
          options: [
            {
              type: 'cloud',
              toolName: 'Claude 3.5 Sonnet',
              category: 'Writing',
              description: 'Best narrative pacing and natural storytelling tone',
              pricing: '$3 / 1M tokens',
            },
            {
              type: 'local',
              toolName: 'Ollama (Mistral Nemo 12B)',
              category: 'Chatbots',
              description: 'Private local script generation with 128k context support',
              pricing: 'FREE',
              minRAM: '16GB',
              minVRAM: '8GB',
            },
          ],
        },
        {
          stageNumber: 2,
          name: 'Voice Narration',
          purpose: 'Produce studio-quality voice track with proper pacing',
          inputType: 'Text Script',
          outputType: 'WAV Audio File',
          selectedOptionIndex: 0,
          options: [
            {
              type: 'cloud',
              toolName: 'ElevenLabs',
              category: 'Audio',
              description: 'Lifelike emotional inflections and pacing for narration',
              pricing: '$5/month',
            },
            {
              type: 'local',
              toolName: 'Coqui TTS / Kokoro',
              category: 'Audio',
              description: 'Open source offline narration generator',
              pricing: 'FREE',
            },
          ],
        },
        {
          stageNumber: 3,
          name: 'Visual Asset Generation',
          purpose: 'Generate contextual scenes and illustrations matching each timestamp',
          inputType: 'Image Prompts',
          outputType: 'PNG / MP4 Clips',
          selectedOptionIndex: 0,
          options: [
            {
              type: 'local',
              toolName: 'ComfyUI + Flux.1 Schnell',
              category: 'Image Generation',
              description: 'Next-gen open-weights image generator with prompt fidelity',
              pricing: 'FREE (Apache 2.0)',
              minVRAM: '12GB',
            },
            {
              type: 'cloud',
              toolName: 'Midjourney v6.1 / Ideogram',
              category: 'Image Generation',
              description: 'High aesthetics cloud image synthesis',
              pricing: '$10 - $30/month',
            },
          ],
        },
        {
          stageNumber: 4,
          name: 'Programmatic Video Assembly',
          purpose: 'Combine voice, visuals, subtitles, and motion effects',
          inputType: 'Audio + Visual Assets',
          outputType: 'Final MP4 Video',
          selectedOptionIndex: 0,
          options: [
            {
              type: 'local',
              toolName: 'Remotion (React Video)',
              category: 'Video',
              description: 'Programmatic React-based video rendering engine',
              pricing: 'FREE (Open Source)',
              notes: 'Automate rendering via Node.js CLI',
            },
            {
              type: 'cloud',
              toolName: 'Runway Gen-3 Alpha',
              category: 'Video',
              description: 'Cloud video-to-video and text-to-video synthesis',
              pricing: '$15/month',
            },
          ],
        },
      ],
    };
  }

  // Default: Private Local Coding Assistant / Developer Stack
  return {
    id: 'blueprint-coding-assistant',
    intent: userIntent,
    title: '💻 Private Developer & Coding Stack',
    summary: 'Full-stack AI developer setup: IDE completions, repository-wide embeddings, and offline debugging.',
    totalEstimatedCost: '$0 (local) to $20/month',
    hardwareRequirements: {
      minRAM: '16GB',
      minVRAM: '8GB',
      canRunCPUOnly: true,
    },
    stages: [
      {
        stageNumber: 1,
        name: 'IDE Integration & Autocomplete',
        purpose: 'Inline code tab completions and interactive chat inside VS Code/JetBrains',
        inputType: 'Code Context & Cursor Position',
        outputType: 'Inline Code Suggestions',
        selectedOptionIndex: 0,
        options: [
          {
            type: 'local',
            toolName: 'Continue.dev',
            category: 'Code',
            description: 'Open source autopilot extension connecting to local or cloud models',
            pricing: 'FREE (Apache 2.0)',
            notes: 'Zero telemetry mode available',
          },
          {
            type: 'cloud',
            toolName: 'GitHub Copilot',
            category: 'Code',
            description: 'Standard cloud autocomplete subscription',
            pricing: '$10/month',
          },
        ],
      },
      {
        stageNumber: 2,
        name: 'Inference Engine & Model',
        purpose: 'Execute code generation with large token context and FIM (Fill-in-the-Middle)',
        inputType: 'AST / Context Chunks',
        outputType: 'Syntactically Valid Code',
        selectedOptionIndex: 0,
        options: [
          {
            type: 'local',
            toolName: 'Ollama (Qwen 2.5 Coder 7B)',
            category: 'Code',
            description: 'State-of-the-art coding model with 32k context, runs on 6GB VRAM',
            pricing: 'FREE (Apache 2.0)',
            minRAM: '8GB',
            minVRAM: '6GB',
          },
          {
            type: 'cloud',
            toolName: 'Claude 3.5 Sonnet API',
            category: 'Code',
            description: 'Highest ranked benchmark score on SWE-bench for complex refactoring',
            pricing: '$3 / 1M tokens',
          },
        ],
      },
      {
        stageNumber: 3,
        name: 'Codebase Vector Indexing (RAG)',
        purpose: 'Semantic search across documentation, git commits, and repo files',
        inputType: 'Source Code Directory',
        outputType: 'Relevant Code Chunks',
        selectedOptionIndex: 0,
        options: [
          {
            type: 'local',
            toolName: 'LanceDB / Chroma + Nomic Embed',
            category: 'Database',
            description: 'Embedded, serverless vector database running in-memory or on local disk',
            pricing: 'FREE (Open Source)',
            canRunCPUOnly: true,
          },
        ],
      },
    ],
  };
}
