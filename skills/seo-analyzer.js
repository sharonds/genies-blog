#!/usr/bin/env node

/**
 * SEO Analyzer for GenieX Blog Posts
 * Analyzes content for SEO optimization
 * 
 * Usage: node skills/seo-analyzer.js <file.md>
 */

const fs = require('fs');
const path = require('path');

class SEOAnalyzer {
  constructor(content, filePath) {
    this.content = content;
    this.filePath = filePath;
    this.issues = [];
    this.warnings = [];
    this.passes = [];
    this.score = 0;
  }

  /**
   * Run all SEO checks
   */
  analyze() {
    this.checkTitle();
    this.checkDescription();
    this.checkHeadings();
    this.checkImages();
    this.checkLinks();
    this.checkWordCount();
    this.checkReadability();
    this.checkTags();
    
    this.calculateScore();
    return this.getReport();
  }

  /**
   * Check title exists and is optimal
   */
  checkTitle() {
    const titleMatch = this.content.match(/^title:\s*"([^"]+)"/m);
    
    if (!titleMatch) {
      this.issues.push('Missing title in frontmatter');
      return;
    }

    const title = titleMatch[1];
    
    if (title.length < 30) {
      this.warnings.push(`Title too short (${title.length} chars). Aim for 50-60.`);
    } else if (title.length > 60) {
      this.warnings.push(`Title too long (${title.length} chars). Keep under 60.`);
    } else {
      this.passes.push(`Title length optimal (${title.length} chars)`);
    }

    // Check for power words
    const powerWords = ['how', 'why', 'what', 'best', 'guide', 'tips', 'learn', 'build', 'create'];
    if (powerWords.some(w => title.toLowerCase().includes(w))) {
      this.passes.push('Title contains power words');
    } else {
      this.warnings.push('Consider adding power words to title (how, why, what, best, guide)');
    }
  }

  /**
   * Check description exists
   */
  checkDescription() {
    // Blog doesn't use description in frontmatter, suggest adding
    this.warnings.push('Consider adding description to frontmatter for meta description');
  }

  /**
   * Check heading structure
   */
  checkHeadings() {
    const h1Match = this.content.match(/^#\s+(.+)$/m);
    
    if (!h1Match) {
      this.issues.push('Missing H1 heading');
      return;
    }

    const h1 = h1Match[1];
    
    // Check H1 matches title
    const titleMatch = this.content.match(/^title:\s*"([^"]+)"/m);
    if (titleMatch && h1 !== titleMatch[1]) {
      this.warnings.push('H1 does not match title');
    }

    // Count subheadings
    const h2Count = (this.content.match(/^##\s+/gm) || []).length;
    const h3Count = (this.content.match(/^###\s+/gm) || []).length;

    if (h2Count < 2) {
      this.warnings.push('Consider adding more H2 subheadings for structure');
    } else {
      this.passes.push(`Good heading structure (${h2Count} H2, ${h3Count} H3)`);
    }
  }

  /**
   * Check for images
   */
  checkImages() {
    const images = this.content.match(/!\[.*\]\(.*\)/g) || [];
    
    if (images.length === 0) {
      this.issues.push('No images found. Add at least one hero image.');
    } else if (images.length === 1) {
      this.warnings.push('Only one image. Consider adding more for engagement.');
    } else {
      this.passes.push(`${images.length} images found`);
    }

    // Check for alt text
    images.forEach((img, i) => {
      if (!img.includes('alt=')) {
        this.warnings.push(`Image ${i + 1} missing alt text`);
      }
    });
  }

  /**
   * Check for external links
   */
  checkLinks() {
    const links = this.content.match(/\[.*\]\(https?:\/\//g) || [];
    
    if (links.length === 0) {
      this.warnings.push('No external links. Consider adding 2-3 relevant outbound links.');
    } else if (links.length >= 2) {
      this.passes.push(`${links.length} external links found`);
    }
  }

  /**
   * Check word count
   */
  checkWordCount() {
    const words = this.content.split(/\s+/).length;
    
    if (words < 300) {
      this.warnings.push(`Word count low (${words}). Aim for 300-500 words.`);
    } else if (words > 1500) {
      this.warnings.push(`Word count high (${words}). Consider breaking into smaller posts.`);
    } else {
      this.passes.push(`Word count optimal (${words} words)`);
    }
  }

  /**
   * Check readability (simple metric)
   */
  checkReadability() {
    const sentences = this.content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = this.content.split(/\s+/).length;
    const avgWordsPerSentence = words / sentences;

    if (avgWordsPerSentence > 25) {
      this.warnings.push('Sentences may be too long. Average ' + avgWordsPerSentence.toFixed(1) + ' words/sentence.');
    } else {
      this.passes.push(`Readability good (${avgWordsPerSentence.toFixed(1)} words/sentence)`);
    }
  }

  /**
   * Check tags
   */
  checkTags() {
    const tagsMatch = this.content.match(/^tags:\s*\[([^\]]+)\]/m);
    
    if (!tagsMatch) {
      this.issues.push('Missing tags in frontmatter');
      return;
    }

    const tags = tagsMatch[1].split(',').map(t => t.trim().replace(/"/g, ''));
    
    if (tags.length < 3) {
      this.warnings.push(`Only ${tags.length} tags. Add 3-5 relevant tags.`);
    } else if (tags.length > 8) {
      this.warnings.push('Too many tags. Keep to 3-5.');
    } else {
      this.passes.push(`${tags.length} tags found`);
    }
  }

  /**
   * Calculate overall SEO score
   */
  calculateScore() {
    const issueCount = this.issues.length;
    const warningCount = this.warnings.length;
    const passCount = this.passes.length;

    this.score = Math.max(0, Math.min(100, 
      100 - (issueCount * 25) - (warningCount * 5) + (passCount * 5)
    ));
  }

  /**
   * Get full report
   */
  getReport() {
    return {
      filePath: this.filePath,
      score: this.score,
      grade: this.getGrade(),
      issues: this.issues,
      warnings: this.warnings,
      passes: this.passes,
      recommendations: this.getRecommendations()
    };
  }

  getGrade() {
    if (this.score >= 90) return 'A';
    if (this.score >= 80) return 'B';
    if (this.score >= 70) return 'C';
    if (this.score >= 60) return 'D';
    return 'F';
  }

  getRecommendations() {
    const recs = [];
    
    if (this.issues.length > 0) {
      recs.push('Fix critical issues before publishing');
    }
    if (this.warnings.length > 3) {
      recs.push('Address warnings to improve SEO score');
    }
    if (this.score < 70) {
      recs.push('Consider revising content structure');
    }
    
    return recs;
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Analyze all posts
    const postsDir = path.join(__dirname, '..', 'src', 'content', 'posts');
    
    if (!fs.existsSync(postsDir)) {
      console.log('No posts directory found');
      return;
    }

    const files = fs.readdirSync(postsDir)
      .filter(f => f.endsWith('.md') && !f.startsWith('.'))
      .map(f => path.join(postsDir, f));

    console.log('📊 SEO Analysis Report\n');
    console.log('='.repeat(50));

    let totalScore = 0;
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const analyzer = new SEOAnalyzer(content, file);
      const report = analyzer.analyze();
      
      totalScore += report.score;
      
      console.log(`\n📄 ${path.basename(file)}`);
      console.log(`   Score: ${report.score}/100 (${report.grade})`);
      
      if (report.issues.length > 0) {
        console.log(`   ❌ Issues: ${report.issues.length}`);
        report.issues.forEach(i => console.log(`      - ${i}`));
      }
      if (report.warnings.length > 0) {
        console.log(`   ⚠️ Warnings: ${report.warnings.length}`);
        report.warnings.slice(0, 2).forEach(w => console.log(`      - ${w}`));
      }
    });

    console.log('\n' + '='.repeat(50));
    console.log(`\n📈 Average Score: ${Math.round(totalScore / files.length)}/100`);
    
  } else {
    // Analyze specific file
    const filePath = args[0];
    const content = fs.readFileSync(filePath, 'utf8');
    const analyzer = new SEOAnalyzer(content, filePath);
    const report = analyzer.analyze();
    
    console.log('\n📊 SEO Analysis Report');
    console.log('='.repeat(50));
    console.log(`\n📄 ${path.basename(filePath)}`);
    console.log(`Score: ${report.score}/100 (${report.grade})`);
    
    if (report.issues.length > 0) {
      console.log('\n❌ Critical Issues:');
      report.issues.forEach(i => console.log(`   - ${i}`));
    }
    
    if (report.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      report.warnings.forEach(w => console.log(`   - ${w}`));
    }
    
    if (report.passes.length > 0) {
      console.log('\n✅ Passing:');
      report.passes.forEach(p => console.log(`   - ${p}`));
    }
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(r => console.log(`   - ${r}`));
    }
    
    console.log('\n');
  }
}

main();
