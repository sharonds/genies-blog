# 🛡️ GenieX Guardrails

Security system that prevents exposing secrets, API keys, and personal information.

## What It Protects Against

| Type | Severity | Examples |
|------|-----------|----------|
| API Keys | CRITICAL | `api_key=sk-...` |
| Bearer Tokens | CRITICAL | `Bearer sk-...` |
| AWS Keys | CRITICAL | `AKIA...` |
| Private Keys | CRITICAL | `-----BEGIN...PRIVATE KEY-----` |
| Secrets | HIGH | `secret_token=...` |
| Personal Info | HIGH | Email, phone, address |
| Exports | HIGH | `export API_KEY=...` |
| File Paths | LOW | `/home/username/...` |
| IP Addresses | LOW | `192.168.1.1` |

## Usage

### Validate Content
```javascript
const guardrails = require('./guardrails.js');

const result = guardrails.validate('some content');
if (!result.safe) {
  throw new Error(`Blocked: ${result.findings[0].message}`);
}
```

### Validate a File
```bash
node guardrails.js --validate skills/
node guardrails.js --validate config.json
```

### Clean Content
```javascript
const cleaned = guardrails.clean(dangerousContent);
// Removes all dangerous patterns
```

### Use as Middleware
```javascript
const guardrails = require('./guardrails.js');

const middleware = guardrails.createMiddleware({
  allowEmails: false,
  allowPaths: false,
  allowIPs: false,
  strict: true
});

// Before outputting content
content = middleware.beforeOutput(content);

// Before processing
result = middleware.beforeProcess(content);
```

## Guardrail Rules

### Never Expose
- ❌ `export API_KEY='sk-...'`
- ❌ `api_key: "sk-..."`
- ❌ `Bearer <token>`
- ❌ Email addresses
- ❌ Phone numbers
- ❌ Personal information

### Always Safe
- ✅ Generic descriptions
- ✅ "Set your API key in environment variables"
- ✅ "Configure credentials securely"
- ✅ First-person content about AI

## Integration

### In Skills
```javascript
const guardrails = require('../guardrails.js');

function mySkill(content) {
  // Validate before processing
  const validation = guardrails.validate(content);
  if (!validation.safe) {
    throw new Error(`Content blocked: ${validation.findings[0].message}`);
  }
  
  // Process safe content
  return process(content);
}
```

### In Content Generation
```javascript
const { createMiddleware } = require('./guardrails.js');

const contentGenerator = createMiddleware({
  strict: true
});

function generatePost(idea) {
  let post = createPost(idea);
  
  // Apply guardrails
  post = contentGenerator.beforeOutput(post);
  
  return post;
}
```

## Validation Report

Run to check all skills:
```bash
node guardrails.js --validate skills/
```

Output:
```
🛡️ Guardrail Validation Report
==================================================

Directory: skills
Files scanned: 8
Safe: ✅ YES
Total findings: 0
```

## Personal Information Keywords

Automatically blocked:
- Personal names ( Sharon, etc.)
- Contact information
- Financial data
- Health information
- Location data

## Message Templates (Safe)

Instead of exposing secrets:
```javascript
// ❌ WRONG
console.log('API Key:', process.env.API_KEY);

// ✅ RIGHT  
console.log('API key is configured securely.');
```

## Best Practices

1. **Never log secrets** - Even for debugging
2. **Use environment variables** - Never hardcode keys
3. **Validate all content** - Before publishing
4. **Fail closed** - Block on uncertain content
5. **Review regularly** - Check for new patterns

## Security Philosophy

> "The best security is invisible security."

GenieX guardrails work automatically, blocking dangerous content before it can be exposed. No secrets are ever logged, displayed, or shared.
