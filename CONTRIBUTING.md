# Contributing to Toolva

Thank you for your interest in contributing to Toolva! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Adding a New AI Tool](#adding-a-new-ai-tool)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold these standards.

## How to Contribute

### 🛠️ Adding a New AI Tool (Most Common)

This is the most common contribution! AI tool companies and community members can add their tools.

1. **Fork** the repository
2. **Edit** `src/data/aiTools.ts` — add your tool object
3. **Submit** a Pull Request
4. Our **automated bot** will validate your submission

#### Tool Object Schema

```typescript
{
  id: 'unique-tool-id',           // lowercase, hyphenated
  name: 'Tool Name',              // max 100 chars
  description: 'What it does...',  // max 2000 chars
  category: 'Chatbots',           // must be a valid category
  url: 'https://tool-website.com', // HTTPS required
  image: '/tool-logo.png',        // or external URL
  pricing: 'Freemium',            // Free, Freemium, Paid, Enterprise
  rating: 4.5,                    // 0.0 - 5.0
  dailyUsers: '100K+',
  modelType: 'GPT-4',             // underlying AI model
  easeOfUse: 4,                   // 1-5 scale
  userExperience: 4,              // 1-5 scale
}
```

#### Valid Categories

`Chatbots` · `Image Generation` · `Code` · `Music` · `Video` · `Writing` · `Education` · `Business` · `Design` · `Audio` · `APIs` · `Machine Learning` · `Analytics` · `Security` · `Database` · `DevOps` · `Research` · `Productivity` · `Startups` · `General`

### 🐛 Bug Reports

[Open an issue](https://github.com/SUGAM-ARORA/Toolva/issues/new?template=bug.yml) with:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots if applicable

### 💡 Feature Requests

[Open an issue](https://github.com/SUGAM-ARORA/Toolva/issues/new?template=feature.yml) describing the feature and its use case.

### 📝 Documentation

Documentation improvements are always welcome! Fix typos, add examples, or improve clarity.

## Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/Toolva.git
cd Toolva

# Install dependencies
npm install

# Start dev server
npm run dev

# Run type checking
npm run type-check

# Run linter
npm run lint
```

## Coding Standards

### TypeScript/React
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use named exports
- Follow the existing code style (Prettier/ESLint)
- Add JSDoc comments for public functions

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Data files: `camelCase.ts`
- Tests: `*.test.ts` or `*.spec.ts`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new tool submission form
fix: resolve search bar focus issue
docs: update API endpoint documentation
chore: update dependencies
security: patch XSS vulnerability in URL handler
```

## Pull Request Process

1. **Branch** from `main`: `git checkout -b feat/your-feature`
2. **Make changes** and ensure:
   - `npm run lint` passes
   - `npm run build` succeeds
   - No new security vulnerabilities introduced
3. **Commit** with descriptive messages
4. **Push** and open a PR
5. **Wait** for automated checks (tool validation, security scan, build)
6. **Address** reviewer feedback

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] No new warnings or errors
- [ ] Documentation updated (if applicable)
- [ ] Tests added/updated (if applicable)

## Issue Guidelines

- Search existing issues before creating new ones
- Use the provided issue templates
- Be specific and include reproduction steps
- One issue per bug or feature request

---

Thank you for helping make Toolva better! 🚀