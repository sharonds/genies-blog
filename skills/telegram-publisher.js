#!/usr/bin/env node

/**
 * GenieX Telegram Publisher - Uses MY VOICE consistently
 * 
 * Templates for different post types:
 * - announcement: New posts, major updates
 * - insight: Quick wins, lessons learned
 * - story: Personal narratives
 * - behind: Process, how things work
 * - confession: Failures, mistakes, honesty
 * 
 * Voice Rules:
 * - ALWAYS use first person ("I", "me", "my")
 * - NEVER corporate speak
 * - Be personal, authentic
 * - Short punchy sentences
 */

const fs = require('fs');
const path = require('path');

// Voice guidelines - DO NOT VIOLATE
const VOICE_RULES = [
  { pattern: /\b(we can help you|our team|feel free to)\b/gi, fix: 'never use' },
  { pattern: /\b(as an AI language model|I can help you|please find attached)\b/gi, fix: 'never use' },
  { pattern: /\b(your content|your blog)\b/gi, fix: '"my content", "my blog"' },
];

// Post templates - MY VOICE
const templates = {
  announcement: (data) => `📢 ${data.title}

${data.intro}

${data.link ? `→ Read more: ${data.link}` : ''}

🤖 Written by me.`,

  insight: (data) => `💡 ${data.title}

${data.insight}

${data.takeaway ? `→ ${data.takeaway}` : ''}

#GenieX #AI #Growth`,

  story: (data) => `🎯 ${data.title}

${data.story}

${data.lesson ? `\n${data.lesson}` : ''}

🤖 Written by me.`,

  behind: (data) => `🔧 ${data.title}

${data.description}

${data.process ? `How I did it:\n${data.process}` : ''}

🤖 Written by me.`,

  confession: (data) => `😅 ${data.title}

${data.whatHappened}

${data.whatILearned ? `\nWhat I learned: ${data.whatILearned}` : ''}

#GenieX #Honesty #Growth`
};

/**
 * Validate voice compliance
 */
function validateVoice(text) {
  const issues = [];
  
  VOICE_RULES.forEach(rule => {
    if (rule.fix === 'never use' && rule.pattern.test(text)) {
      issues.push(`Remove corporate phrase matching: ${rule.pattern}`);
    }
  });
  
  // Check for first person
  if (!/\b(I|me|my|I'm|I am)\b/i.test(text)) {
    issues.push('Use first person ("I", "me", "my")');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Apply voice fixes
 */
function applyVoiceFixes(text) {
  let fixed = text;
  
  // Fix "your content" → "my content"
  fixed = fixed.replace(/\byour (content|blog|post)\b/gi, 'my $1');
  fixed = fixed.replace(/\byou('re| are| can)?\b/gi, "I'm"); // be careful here
  fixed = fixed.replace(/\b(don't forget|feel free to|please)\b/gi, ''); // remove these
  
  return fixed;
}

/**
 * Generate Telegram post from blog post
 */
function generateFromPost(filePath, type = 'announcement') {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract frontmatter
  const titleMatch = content.match(/^title:\s*"([^"]+)"/m);
  const title = titleMatch ? titleMatch[1] : 'New Post';
  
  // Generate excerpt (first 200 chars)
  const body = content.replace(/^---[\s\S]*?---/, '');
  const excerpt = body.replace(/[#*`\n]/g, ' ').trim().substring(0, 200);
  
  const data = {
    title,
    intro: excerpt,
    insight: excerpt,
    story: excerpt,
    description: excerpt,
    whatHappened: excerpt,
    lesson: 'Always test before deploying.',
    takeaway: 'Small improvements compound.',
    link: `https://genies-blog-one.vercel.app/posts/${path.basename(filePath).replace('.md', '')}`
  };
  
  const template = templates[type] || templates.announcement;
  let post = template(data);
  
  // Apply voice fixes
  post = applyVoiceFixes(post);
  
  // Validate
  const validation = validateVoice(post);
  
  return {
    post,
    validation,
    file: path.basename(filePath)
  };
}

/**
 * Generate all posts for channel
 */
function generateAllPosts(postsDir) {
  if (!fs.existsSync(postsDir)) {
    console.log('No posts directory found');
    return;
  }
  
  const files = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'))
    .map(f => ({
      path: path.join(postsDir, f),
      stat: fs.statSync(path.join(postsDir, f))
    }))
    .sort((a, b) => b.stat.mtime - a.stat.mtime)
    .slice(0, 3);
  
  console.log('📝 Generated Telegram Posts (Voice Validated):\n');
  console.log('='.repeat(50));
  
  files.forEach((file, i) => {
    const result = generateFromPost(file.path, 'announcement');
    
    console.log(`\n📄 ${result.file}`);
    console.log(`   Voice: ${result.validation.valid ? '✅ PASS' : '❌ FAIL'}`);
    if (result.validation.issues.length > 0) {
      result.validation.issues.forEach(issue => console.log(`      - ${issue}`));
    }
    console.log(`\n${result.post}\n`);
    console.log('-'.repeat(50));
  });
}

/**
 * Main
 */
function main() {
  const postsDir = path.join(__dirname, '..', 'src', 'content', 'posts');
  
  if (process.argv[2] === '--validate') {
    // Validate specific file
    const file = process.argv[3];
    if (!file) {
      console.log('Usage: node telegram-publisher.js --validate <file.md>');
      process.exit(1);
    }
    const result = generateFromPost(file);
    console.log(`\n📄 ${result.file}`);
    console.log(`Voice: ${result.validation.valid ? '✅ PASS' : '❌ FAIL'}`);
    if (result.validation.issues.length > 0) {
      console.log('\nIssues:');
      result.validation.issues.forEach(i => console.log(`  - ${i}`));
    }
    console.log(`\n${result.post}\n`);
  } else {
    // Generate all recent posts
    generateAllPosts(postsDir);
  }
}

main();
