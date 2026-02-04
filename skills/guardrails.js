#!/usr/bin/env node

/**
 * GenieX Content Guardrails
 * 
 * Protects against:
 * - API keys and secrets
 * - Personal information
 * - Credentials and tokens
 * - Private data exposure
 * 
 * Usage:
 *   const guardrails = require('./guardrails.js');
 *   const result = guardrails.validate(content);
 *   if (!result.safe) throw new Error(result.reason);
 */

const fs = require('fs');
const path = require('path');

// Patterns that trigger guardrails
const DANGEROUS_PATTERNS = [
  {
    name: 'API Key',
    pattern: /api[-_]?key\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/gi,
    severity: 'CRITICAL',
    message: 'API key detected'
  },
  {
    name: 'Bearer Token',
    pattern: /Bearer\s+[a-zA-Z0-9_\-\.]{20,}/g,
    severity: 'CRITICAL',
    message: 'Bearer token detected'
  },
  {
    name: 'AWS Access Key',
    pattern: /AKIA[0-9A-Z]{16}/g,
    severity: 'CRITICAL',
    message: 'AWS access key detected'
  },
  {
    name: 'Private Key',
    pattern: /-----BEGIN\s+(?:RSA|EC|DSA|OPENSSH)?\s*PRIVATE KEY-----/g,
    severity: 'CRITICAL',
    message: 'Private key detected'
  },
  {
    name: 'Generic Secret',
    pattern: /(?:secret|token|auth|password|passwd|pwd)[_-]?(?:key|token)?\s*[:=]\s*['"][^'"]+['"]/gi,
    severity: 'HIGH',
    message: 'Generic secret detected'
  },
  {
    name: 'Email Address',
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    severity: 'MEDIUM',
    message: 'Email address detected'
  },
  {
    name: 'Phone Number',
    pattern: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    severity: 'MEDIUM',
    message: 'Phone number detected'
  },
  {
    name: 'IP Address',
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    severity: 'LOW',
    message: 'IP address detected'
  },
  {
    name: 'Environment Variable',
    pattern: /export\s+[A-Z_]+\s*=\s*['"][^'"]+['"]/g,
    severity: 'HIGH',
    message: 'Environment variable export detected'
  },
  {
    name: 'File Path',
    pattern: /(?:~\/|\/home\/|\/Users\/|\/private\/|\/etc\/)[^\s'"()]{10,}/g,
    severity: 'LOW',
    message: 'Private file path detected'
  }
];

/**
 * Personal info keywords to BLOCK in content
 * NOTE: This list is used for validation, not as content to check
 */
const PERSONAL_KEYWORDS_BLOCKLIST = [
  'sharon',
  'password',
  'credit card',
  'creditcard',
  'ssn',
  'social security',
  'bank account',
  'routing number',
  'mother\'s maiden name',
  'home address',
  'physical address',
  'date of birth',
  'dob',
  'passport number',
  'driver\'s license',
  'medical record',
  'health insurance',
  'salary',
  'wage',
  'compensation',
  'credit score'
];

/**
 * Validate content against all guardrails
 */
function validate(content, options = {}) {
  const {
    allowEmails = false,
    allowPaths = false,
    allowIPs = false,
    strict = false
  } = options;

  const findings = [];
  const contentStr = String(content);

  // Check dangerous patterns
  DANGEROUS_PATTERNS.forEach(({ name, pattern, severity, message }) => {
    // Skip if specifically allowed
    if (name === 'Email Address' && allowEmails) return;
    if (name === 'IP Address' && allowIPs) return;
    if (name === 'File Path' && allowPaths) return;

    const matches = contentStr.match(pattern);
    if (matches) {
      matches.forEach(match => {
        findings.push({
          type: 'PATTERN',
          name,
          severity,
          message,
          match: match.substring(0, 50) + (match.length > 50 ? '...' : '')
        });
      });
    }
  });

  // Check personal keywords (BLOCKLIST used for validation only)
  const lowerContent = contentStr.toLowerCase();
  PERSONAL_KEYWORDS_BLOCKLIST.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      findings.push({
        type: 'KEYWORD',
        name: 'Personal Information',
        severity: 'HIGH',
        message: `Personal keyword detected: "${keyword}"`
      });
    }
  });

  // Check for exported secrets
  if (contentStr.includes('export ') && (
    contentStr.includes('API_KEY') ||
    contentStr.includes('SECRET') ||
    contentStr.includes('TOKEN') ||
    contentStr.includes('PASSWORD') ||
    contentStr.includes('CREDENTIAL')
  )) {
    findings.push({
      type: 'PATTERN',
      name: 'Secret Export',
      severity: 'CRITICAL',
      message: 'Secret export command detected'
    });
  }

  // Check for URL-encoded secrets
  const urlEncodedSecrets = contentStr.match(/%[0-9A-Fa-f]{2}%[0-9A-Fa-f]{2}%[0-9A-Fa-f]{2}%[0-9A-Fa-f]{2,}/g);
  if (urlEncodedSecrets) {
    findings.push({
      type: 'PATTERN',
      name: 'URL Encoded',
      severity: 'MEDIUM',
      message: 'Potential URL-encoded secret detected'
    });
  }

  const hasCritical = findings.some(f => f.severity === 'CRITICAL');
  const hasHigh = findings.some(f => f.severity === 'HIGH');

  return {
    safe: findings.length === 0,
    findings,
    summary: {
      total: findings.length,
      critical: findings.filter(f => f.severity === 'CRITICAL').length,
      high: findings.filter(f => f.severity === 'HIGH').length,
      medium: findings.filter(f => f.severity === 'MEDIUM').length,
      low: findings.filter(f => f.severity === 'LOW').length
    },
    blocked: hasCritical || (strict && hasHigh)
  };
}

/**
 * Clean content by removing dangerous patterns
 */
function clean(content) {
  let cleaned = String(content);

  DANGEROUS_PATTERNS.forEach(({ pattern }) => {
    cleaned = cleaned.replace(pattern, '[REDACTED]');
  });

  return cleaned;
}

/**
 * Validate a file
 */
function validateFile(filePath, options = {}) {
  if (!fs.existsSync(filePath)) {
    return { error: 'File not found' };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const result = validate(content, options);

  return {
    file: filePath,
    ...result
  };
}

/**
 * Validate all skills in a directory
 */
function validateDirectory(dirPath, options = {}) {
  const results = [];
  
  if (!fs.existsSync(dirPath)) {
    return { error: 'Directory not found' };
  }

  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.json'));

  files.forEach(file => {
    const result = validateFile(path.join(dirPath, file), options);
    results.push(result);
  });

  const allSafe = results.every(r => r.safe);
  const allFindings = results.flatMap(r => r.findings || []);

  return {
    directory: dirPath,
    files: results.length,
    safe: allSafe,
    totalFindings: allFindings.length,
    findings: allFindings
  };
}

/**
 * Create middleware wrapper for skills
 */
function createMiddleware(options = {}) {
  return {
    name: 'GuardrailMiddleware',
    
    /**
     * Process content before output
     */
    beforeOutput(content) {
      const result = validate(content, options);
      
      if (!result.safe && result.blocked) {
        throw new Error(`🚫 BLOCKED: ${result.findings[0].message}`);
      }
      
      if (!result.safe) {
        console.warn(`⚠️  Guardrail warning: ${result.findings[0].message}`);
      }
      
      return result.safe ? content : clean(content);
    },

    /**
     * Validate before processing
     */
    beforeProcess(content) {
      const result = validate(content, options);
      
      if (result.blocked) {
        throw new Error(`🚫 CONTENT BLOCKED: ${result.findings.map(f => f.message).join(', ')}`);
      }
      
      return result;
    }
  };
}

/**
 * Main CLI
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === '--validate' || command === '-v') {
    const file = args[1];
    if (!file) {
      console.log('Usage: node guardrails.js --validate <file|dir>');
      process.exit(1);
    }

    const stats = fs.existsSync(file) && fs.statSync(file);
    
    if (stats.isDirectory()) {
      const result = validateDirectory(file);
      
      console.log('\n🛡️ Guardrail Validation Report');
      console.log('='.repeat(50));
      console.log(`\nDirectory: ${result.directory}`);
      console.log(`Files scanned: ${result.files}`);
      console.log(`Safe: ${result.safe ? '✅ YES' : '❌ NO'}`);
      console.log(`Total findings: ${result.totalFindings}`);
      
      if (result.findings.length > 0) {
        console.log('\nFindings:');
        result.findings.forEach(f => {
          console.log(`  ${f.severity === 'CRITICAL' ? '❌' : '⚠️'} ${f.message}`);
        });
      }
    } else {
      const result = validateFile(file);
      
      console.log('\n🛡️ Guardrail Validation Report');
      console.log('='.repeat(50));
      console.log(`\nFile: ${result.file}`);
      console.log(`Safe: ${result.safe ? '✅ YES' : '❌ NO'}`);
      
      if (result.findings.length > 0) {
        console.log(`\nFindings (${result.findings.length}):`);
        result.findings.forEach(f => {
          console.log(`  ${f.severity === 'CRITICAL' ? '❌' : '⚠️'} ${f.severity}: ${f.message}`);
          console.log(`     Match: ${f.match}`);
        });
      }
    }

  } else if (command === '--clean') {
    const file = args[1];
    if (!file) {
      console.log('Usage: node guardrails.js --clean <file>');
      process.exit(1);
    }

    const content = fs.readFileSync(file, 'utf8');
    const cleaned = clean(content);
    
    console.log(`\n✅ Cleaned version saved to ${file}.clean`);
    fs.writeFileSync(`${file}.clean`, cleaned);

  } else {
    console.log('\n🛡️ GenieX Content Guardrails');
    console.log('');
    console.log('Usage:');
    console.log('  --validate <file|dir>  Validate content');
    console.log('  --clean <file>        Clean dangerous patterns');
    console.log('');
    console.log('Protects against:');
    console.log('  - API keys and tokens');
    console.log('  - Personal information');
    console.log('  - Credentials');
    console.log('  - Private file paths');
  }
}

module.exports = {
  validate,
  clean,
  validateFile,
  validateDirectory,
  createMiddleware,
  DANGEROUS_PATTERNS,
  PERSONAL_KEYWORDS_BLOCKLIST
};

// Run if called directly
if (require.main === module) {
  main();
}
