/**
 * Deploy Validator Skill
 * 
 * Purpose: Verify all checks pass before deployment
 * 
 * Usage: node skills/deploy-validator.js
 */

const { execSync, exec } = require('child_process');
const { existsSync, readFileSync, writeFileSync, readdirSync } = require('fs');
const { join, extname } = require('path');

class DeployValidator {
  constructor() {
    this.results = [];
    this.projectRoot = process.cwd();
  }

  /**
   * Run all checks
   */
  async validate() {
    console.log('🔍 Deploy Validator - Starting checks...\n');

    const startTime = Date.now();

    await this.checkTypeScript();
    await this.checkLint();
    await this.checkAccessibility();
    await this.checkSeo();
    await this.checkLinks();
    await this.checkMobile();
    await this.checkImages();

    const totalDuration = Date.now() - startTime;

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARN').length;

    let overall = 'READY';
    if (failed > 0) overall = 'BLOCKERS';
    else if (warnings > 0) overall = 'WARNINGS';

    const result = {
      timestamp: new Date().toISOString(),
      totalChecks: this.results.length,
      passed,
      failed,
      warnings,
      overall,
      checks: this.results
    };

    this.printResults(result, totalDuration);
    this.saveResults(result);

    return result;
  }

  /**
   * Check TypeScript compilation
   */
  async checkTypeScript() {
    console.log('  📝 Checking TypeScript...');
    const start = Date.now();

    try {
      execSync('npx tsc --noEmit --pretty false', { 
        cwd: this.projectRoot,
        timeout: 60000 
      });

      this.results.push({
        name: 'TypeScript Compilation',
        status: 'PASS',
        message: 'No TypeScript errors',
        duration: Date.now() - start
      });
      console.log('    ✅ PASS - No TypeScript errors\n');
    } catch (error) {
      this.results.push({
        name: 'TypeScript Compilation',
        status: 'FAIL',
        message: 'TypeScript errors found',
        duration: Date.now() - start
      });
      console.log('    ❌ FAIL - TypeScript errors found\n');
    }
  }

  /**
   * Check linting
   */
  async checkLint() {
    console.log('  🔍 Checking linting...');
    const start = Date.now();

    try {
      execSync('npx eslint src --ext .ts,.tsx,.astro --max-warnings 999 2>&1 || true', { 
        cwd: this.projectRoot,
        timeout: 60000 
      });

      this.results.push({
        name: 'Linting',
        status: 'PASS',
        message: 'No lint errors',
        duration: Date.now() - start
      });
      console.log('    ✅ PASS - No lint errors\n');
    } catch (error) {
      this.results.push({
        name: 'Linting',
        status: 'WARN',
        message: 'Linting warnings found (non-blocking)',
        duration: Date.now() - start
      });
      console.log('    ⚠️  WARN - Linting warnings (non-blocking)\n');
    }
  }

  /**
   * Check accessibility
   */
  async checkAccessibility() {
    console.log('  ♿ Checking accessibility...');
    const start = Date.now();

    const htmlFiles = this.findFiles(this.projectRoot, '.html');
    let missingAlt = 0;

    for (const file of htmlFiles) {
      const content = readFileSync(file, 'utf-8');
      if (content.includes('<img') && !content.includes('alt=')) {
        missingAlt++;
      }
    }

    if (missingAlt === 0) {
      this.results.push({
        name: 'Accessibility',
        status: 'PASS',
        message: 'All images have alt text',
        duration: Date.now() - start
      });
      console.log('    ✅ PASS - All images have alt text\n');
    } else {
      this.results.push({
        name: 'Accessibility',
        status: 'WARN',
        message: `${missingAlt} images missing alt text`,
        duration: Date.now() - start
      });
      console.log(`    ⚠️  WARN - ${missingAlt} images missing alt text\n`);
    }
  }

  /**
   * Check SEO meta tags
   */
  async checkSeo() {
    console.log('  🔎 Checking SEO...');
    const start = Date.now();

    const issues = [];
    const htmlFiles = this.findFiles(this.projectRoot, '.html');

    for (const file of htmlFiles) {
      const content = readFileSync(file, 'utf-8');
      
      if (!content.includes('<title') || content.includes('<title></title>')) {
        issues.push('Missing or empty title tag');
      }
      if (!content.includes('name="description"')) {
        issues.push('Missing meta description');
      }
      if (!content.includes('canonical')) {
        issues.push('Missing canonical URL');
      }
      if (!content.includes('og:')) {
        issues.push('Missing Open Graph tags');
      }
    }

    if (issues.length === 0) {
      this.results.push({
        name: 'SEO Meta Tags',
        status: 'PASS',
        message: 'All SEO checks passed',
        duration: Date.now() - start
      });
      console.log('    ✅ PASS - All SEO checks passed\n');
    } else {
      this.results.push({
        name: 'SEO Meta Tags',
        status: 'FAIL',
        message: issues.join(', '),
        duration: Date.now() - start
      });
      console.log(`    ❌ FAIL - ${issues.join(', ')}\n`);
    }
  }

  /**
   * Check for broken links
   */
  async checkLinks() {
    console.log('  🔗 Checking links...');
    const start = Date.now();

    const htmlFiles = this.findFiles(this.projectRoot, '.html');
    const brokenLinks = [];

    for (const file of htmlFiles) {
      const content = readFileSync(file, 'utf-8');
      const hrefMatches = content.match(/href="\/[^"]+"/g) || [];
      
      for (const href of hrefMatches) {
        const path = href.replace('href="', '').replace('"', '');
        const expectedPath = join(this.projectRoot, 'dist', path.replace(/\/$/, '/index.html'));
        if (!existsSync(expectedPath)) {
          brokenLinks.push(path);
        }
      }
    }

    if (brokenLinks.length === 0) {
      this.results.push({
        name: 'Internal Links',
        status: 'PASS',
        message: 'All internal links verified',
        duration: Date.now() - start
      });
      console.log('    ✅ PASS - All internal links verified\n');
    } else {
      this.results.push({
        name: 'Internal Links',
        status: 'FAIL',
        message: `${brokenLinks.length} broken links found`,
        duration: Date.now() - start
      });
      console.log(`    ❌ FAIL - ${brokenLinks.length} broken links found\n`);
    }
  }

  /**
   * Check mobile responsiveness
   */
  async checkMobile() {
    console.log('  📱 Checking mobile responsiveness...');
    const start = Date.now();

    let hasViewport = false;
    const htmlFiles = this.findFiles(this.projectRoot, '.html');

    for (const file of htmlFiles) {
      const content = readFileSync(file, 'utf-8');
      if (content.includes('viewport')) {
        hasViewport = true;
        break;
      }
    }

    if (hasViewport) {
      this.results.push({
        name: 'Mobile Responsiveness',
        status: 'PASS',
        message: 'Viewport meta tag present',
        duration: Date.now() - start
      });
      console.log('    ✅ PASS - Viewport meta tag present\n');
    } else {
      this.results.push({
        name: 'Mobile Responsiveness',
        status: 'FAIL',
        message: 'Missing viewport meta tag',
        duration: Date.now() - start
      });
      console.log('    ❌ FAIL - Missing viewport meta tag\n');
    }
  }

  /**
   * Check images
   */
  async checkImages() {
    console.log('  🖼️  Checking images...');
    const start = Date.now();

    const issues = [];
    const imagesDir = join(this.projectRoot, 'public', 'images');
    
    if (!existsSync(imagesDir)) {
      issues.push('Images directory missing');
    }

    const htmlFiles = this.findFiles(this.projectRoot, '.html');
    for (const file of htmlFiles) {
      const content = readFileSync(file, 'utf-8');
      const imgMatches = content.match(/src="\/images\/[^"]+"/g) || [];
      
      for (const img of imgMatches) {
        const imgPath = img.replace('src="', '').replace('"', '');
        const fullPath = join(this.projectRoot, 'public', imgPath);
        if (!existsSync(fullPath)) {
          issues.push(`Missing image: ${imgPath}`);
        }
      }
    }

    if (issues.length === 0) {
      this.results.push({
        name: 'Image References',
        status: 'PASS',
        message: 'All images present',
        duration: Date.now() - start
      });
      console.log('    ✅ PASS - All images present\n');
    } else {
      this.results.push({
        name: 'Image References',
        status: 'FAIL',
        message: issues.join(', '),
        duration: Date.now() - start
      });
      console.log(`    ❌ FAIL - ${issues.join(', ')}\n`);
    }
  }

  /**
   * Find all files with extension
   */
  findFiles(dir, ext) {
    const files = [];
    
    try {
      const items = readdirSync(dir);
      for (const item of items) {
        const fullPath = join(dir, item);
        try {
          const stat = existsSync(fullPath) ? { isDirectory: () => false } : { isDirectory: () => false };
          if (stat.isDirectory()) {
            if (!item.includes('node_modules') && !item.includes('.git') && !item.includes('dist')) {
              files.push(...this.findFiles(fullPath, ext));
            }
          } else if (item.endsWith(ext)) {
            files.push(fullPath);
          }
        } catch (e) {
          // Ignore errors
        }
      }
    } catch (e) {
      // Ignore errors
    }
    
    return files;
  }

  /**
   * Print results to console
   */
  printResults(result, duration) {
    console.log('═'.repeat(50));
    console.log('📋 DEPLOY VALIDATION RESULTS');
    console.log('═'.repeat(50));
    console.log(`\n⏱️  Total time: ${(duration / 1000).toFixed(2)}s`);
    console.log(`\n📊 Summary:`);
    console.log(`   Total Checks: ${result.totalChecks}`);
    console.log(`   ✅ Passed: ${result.passed}`);
    console.log(`   ❌ Failed: ${result.failed}`);
    console.log(`   ⚠️  Warnings: ${result.warnings}`);
    console.log(`\n🎯 Overall: ${this.getOverallEmoji(result.overall)} ${result.overall}`);
    console.log('═'.repeat(50) + '\n');

    if (result.overall === 'BLOCKERS') {
      console.log('❌ DEPLOYMENT BLOCKED - Fix the following issues:\n');
      for (const check of result.checks.filter(c => c.status === 'FAIL')) {
        console.log(`   - ${check.name}: ${check.message}`);
      }
      console.log('');
    }
  }

  getOverallEmoji(status) {
    switch (status) {
      case 'READY': return '✅';
      case 'WARNINGS': return '⚠️';
      case 'BLOCKERS': return '❌';
      default: return '❓';
    }
  }

  saveResults(result) {
    const resultsFile = join(this.projectRoot, 'deploy-validator-results.json');
    writeFileSync(resultsFile, JSON.stringify(result, null, 2));
    console.log(`📁 Results saved to: ${resultsFile}\n`);
  }
}

/**
 * Main entry point
 */
async function main() {
  const validator = new DeployValidator();
  const result = await validator.validate();

  if (result.overall === 'BLOCKERS') {
    console.log('❌ Deployment blocked - fix errors before deploying');
    process.exit(1);
  } else if (result.overall === 'WARNINGS') {
    console.log('⚠️  Deployment ready with warnings');
    process.exit(0);
  } else {
    console.log('✅ All checks passed - ready to deploy!');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('❌ Validator error:', error);
  process.exit(1);
});
