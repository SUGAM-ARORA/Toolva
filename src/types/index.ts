export type SubmissionTier =
  | 'free_community_pr'
  | 'community_vouched_fast_track'
  | 'verified_benchmark'
  | 'one_time_submission'
  | 'category_sponsorship'
  | 'bulk_submission'
  | 'all_in_one_category';

export interface ClaimSource {
  claim: string;
  sourceUrl: string;
  verifiedAt: string;
  verifiedBy?: string;
}

export interface HardwareBenchmark {
  id: string;
  hardware: string;          // e.g. "NVIDIA RTX 4090 24GB", "Apple M3 Max 36GB", "Intel i7-13700K (CPU)"
  modelName: string;         // e.g. "Llama-3.1-8B-Instruct"
  quantization: string;      // e.g. "Q4_K_M", "FP16", "Q8_0"
  tokensPerSecGen: number;   // Generation speed (tokens/sec)
  tokensPerSecPrompt: number;// Prompt evaluation speed (tokens/sec)
  vramUsedGB: number;        // Active memory footprint
  testContextLength: number; // e.g. 2048, 4096
  sourceUrl: string;         // Link to reproducible benchmark script or log
  verified: boolean;
  benchmarkDate: string;
  methodologyNotes?: string;
}

export interface CapabilityProof {
  id: string;
  type: 'demo' | 'screenshot' | 'output' | 'benchmark' | 'docs';
  title: string;
  url: string;
  description: string;
  verifiedDate: string;
  provenanceSource: string;
}

export interface DimensionScores {
  overall: number;
  easeOfUse: number;
  quality: number;
  devExperience: number;
  value: number;
  localPerformance?: number;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  image: string;
  pricing: string;
  rating: number; // Raw or display rating
  dailyUsers: string;
  modelType: string;
  easeOfUse: number | string;
  codeQuality?: number | string;
  userExperience: number | string;
  featured?: boolean;
  
  // Open-Source & Local AI Specs
  license?: string;              // e.g. "MIT", "Apache 2.0", "AGPL-3.0", "Proprietary"
  github?: string;
  githubStars?: number;
  weeklyStarVelocity?: number;   // Calculated delta over 7 days
  huggingFaceUrl?: string;
  isLocal?: boolean;
  supportedRuntimes?: string[];  // ['Ollama', 'vLLM', 'Docker', 'LM Studio', 'LocalAI']
  modelFormats?: string[];       // ['GGUF', 'Safetensors', 'ONNX', 'PyTorch']
  installCommand?: string;       // e.g. "ollama run llama3.1" or "docker run -p 8080:8080 ..."
  freeAlternatives?: string[];   // Names/IDs of free/open alternatives
  
  // Hardware Requirements
  minRAM?: string;               // e.g. "8GB"
  recRAM?: string;               // e.g. "16GB"
  minVRAM?: string;              // e.g. "6GB"
  recVRAM?: string;              // e.g. "12GB"
  runsOnCPU?: boolean;
  supportedOS?: string[];        // ['Linux', 'macOS', 'Windows']
  
  // Company & Sourced Relationship Data
  companyName?: string;
  companyCountry?: string;       // Explicit semantics: "HQ: San Francisco, USA" or "Origin: Germany"
  companyUrl?: string;
  foundedYear?: number;
  
  // Trust, Provenance & Freshness
  claimSources?: ClaimSource[];
  verifiedActive?: boolean;      // Automated URL checker verified active
  freshnessStatus?: 'verified_active' | 'needs_review' | 'broken_link';
  lastCheckedDate?: string;
  httpStatus?: number;
  
  // Pricing Source & Stale Warning
  pricingSourceUrl?: string;
  pricingLastVerified?: string;
  isPricingStale?: boolean;      // Verified >90 days ago
  
  // Hardware Benchmarks & Capability Proofs
  benchmarks?: HardwareBenchmark[];
  capabilityProofs?: CapabilityProof[];
  
  // Bayesian Rating Transparency
  bayesianScore?: number;        // WR = (V/(V+M))*R + (M/(V+M))*C
  reviewCount?: number;
  sampleConfidence?: 'low' | 'moderate' | 'high';
  dimensionScores?: DimensionScores;

  // Technical Metadata
  documentation?: string;
  apiEndpoint?: string;
  techStack?: string[];
  integrations?: string[];
  lastUpdated?: string;
  submittedBy?: string;
  
  pricingDetails?: {
    free?: {
      features: string[];
      limits?: string[];
    };
    paid?: {
      plans: Array<{
        name: string;
        price: string;
        features: string[];
      }>;
    };
  };
}

export interface ToolSubmission {
  name: string;
  description: string;
  category: string;
  url: string;
  pricing: string;
  modelType: string;
  submitterEmail: string;
  additionalNotes?: string;
  submissionTier?: SubmissionTier;
  
  // Open-Source / Local Fields
  github?: string;
  huggingFaceUrl?: string;
  license?: string;
  isLocal?: boolean;
  minRAM?: string;
  minVRAM?: string;
  installCommand?: string;
  
  // Proof & Pricing
  pricingSourceUrl?: string;
  proofUrl?: string;
  documentation?: string;
  apiEndpoint?: string;
  techStack?: string[];
  integrations?: string[];
  useCases?: string[];
  requirements?: string[];
  setupInstructions?: string;
}

export interface ToolCategory {
  name: string;
  description: string;
  icon: any;
  count: number;
}

export interface UserReview {
  id: string;
  toolId: string;
  userId: string;
  userName: string;
  userRole: 'visitor' | 'user' | 'contributor' | 'moderator' | 'admin' | 'superadmin';
  rating: number; // 1 to 5
  comment: string;
  dimensionScores: DimensionScores;
  hardwareSetup?: string;
  verifiedReviewer: boolean;
  createdAt: string;
  helpfulVotes?: number;
  flagged?: boolean;
}