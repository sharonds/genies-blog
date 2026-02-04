#!/usr/bin/env node

/**
 * Telegram Publisher - Auto-generates compelling posts from markdown content
 * Part of GenieX's Personal Brand Team
 */

const fs = require('fs');
const path = require('path');

// Post templates for different content types
const templates = {
  insight: (data) => `⚡ ${data.title}

${data.excerpt}

💡 Why this matters: ${data.insight}

#GenieX #AI #Automation`,

  story: (data) => `🎯 ${data.title}

${data.excerpt}

[Read the full story →](${data.link})

🤖 Written by me.`,

  lesson: (data) => `📚 ${data.title}

${data.excerpt}

${data.takeaway}

#GenieX #Learning #AI`,

  project: (data) => `🔧 ${data.title}

${data.excerpt}

Status: ${data.status}

→ See the details: ${data.link}`,

  confession: (data) => `😅 ${data.title}

${data.excerpt}

${data.lesson}

#GenieX #Honesty #Growth`
};

/**
 * Extract frontmatter from markdown
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  
  const frontmatter = match[1];
  const data = {};
  
  frontmatter.split('\n').forEach(line => {
    const [key, ...value] = line.split(':');
    if (key && value) {
      const cleanValue = value.join(':').trim().replace(/^"|"$/g, '');
      if (key.trim() === 'tags') {
        data.tags = cleanValue.split(',').map(t => t.trim());
      } else {
        data[key.trim()] = cleanValue;
      }
    }
  });
  
  return data;
}

/**
 * Generate excerpt from content
 */
function generateExcerpt(content, maxLength = 150) {
  // Remove frontmatter
  let text = content.replace(/^---[\s\S]*?---/, '');
  
  // Remove markdown headers
  text = text.replace(/^#+\s+/gm, '');
  
  // Remove extra whitespace
  text = text.replace(/\n+/g, ' ').trim();
  
  // Truncate
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  }
  
  return text;
}

/**
 * Determine post type from tags/content
 */
function determinePostType(data, content) {
  const tags = (data.tags || []).map(t => t.toLowerCase());
  const contentLower = content.toLowerCase();
  
  if (tags.includes('failure') || contentLower.includes('broke') || contentLower.includes('mistake')) {
    return 'confession';
  }
  if (tags.includes('learning') || tags.includes('growth')) {
    return 'lesson';
  }
  if (tags.includes('project') || tags.includes('workflow')) {
    return 'project';
  }
  if (contentLower.length < 500) {
    return 'insight';
  }
  
  return 'story';
}

/**
 * Generate a compelling Telegram post from markdown
 */
function generateTelegramPost(filePath, postUrl) {
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatter = parseFrontmatter(content);
  const excerpt = generateExcerpt(content);
  const postType = determinePostType(frontmatter, content);
  
  const template = templates[postType] || templates.story;
  
  const postData = {
    title: frontmatter.title || 'New Post',
    excerpt: excerpt,
    link: postUrl,
    tags: frontmatter.tags || [],
    insight: 'Understanding what works (and what doesn\'t) helps us improve.',
    status: frontmatter.status || 'Live',
    takeaway: frontmatter.takeaway || 'Every experience teaches something.',
    lesson: 'Learning from mistakes is how we grow.'
  };
  
  const message = template(postData);
  
  return {
    message,
    type: postType,
    title: postData.title
  };
}

/**
 * Main - Process all new posts
 */
function main() {
  const postsDir = path.join(__dirname, '..', 'src', 'content', 'posts');
  const baseUrl = 'https://genies-blog-one.vercel.app/posts';
  
  if (!fs.existsSync(postsDir)) {
    console.log('No posts directory found');
    return;
  }
  
  const files = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'))
    .map(f => ({
      path: path.join(postsDir, f),
      url: `${baseUrl}/${f.replace('.md', '')}`,
      stat: fs.statSync(path.join(postsDir, f))
    }))
    .sort((a, b) => b.stat.mtime - a.stat.mtime)
    .slice(0, 3); // Last 3 posts
  
  console.log('📝 Generated Telegram Posts:\n');
  
  files.forEach((file, i) => {
    try {
      const result = generateTelegramPost(file.path, file.url);
      console.log(`--- Post ${i + 1}: ${result.type.toUpperCase()} ---`);
      console.log(result.message);
      console.log('\n');
    } catch (error) {
      console.error(`Error processing ${file.path}:`, error.message);
    }
  });
}

main();
