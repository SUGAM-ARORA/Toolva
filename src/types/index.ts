export interface AITool {
  name: string;
  description: string;
  category: string;
  url: string;
  image: string;
  pricing: string;
  rating: number;
  dailyUsers: string;
  modelType: string;
  easeOfUse: number | string;
  codeQuality?: number | string;
  userExperience: number | string;
  featured?: boolean;
  github?: string;
  documentation?: string;
  apiEndpoint?: string;
  techStack?: string[];
  integrations?: string[];
  lastUpdated?: string;
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
  github?: string;
  documentation?: string;
  apiEndpoint?: string;
  techStack?: string[];
  integrations?: string[];
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
  screenshots?: File[];
  demoVideo?: string;
  useCases?: string[];
  requirements?: string[];
  setupInstructions?: string;
}

export interface ToolCategory {
  name: string;
  description: string;
  icon: string;
  count: number;
} 