#!/usr/bin/env node

/**
 * GenieX Video Generator Skill
 * 
 * Generates videos using MiniMax API to introduce GenieX
 * 
 * Usage:
 *   node video-generator.js --type intro
 *   node video-generator.js --type explain --topic "team building"
 *   node video-generator.js --status --task-id <id>
 * 
 * Types:
 *   intro - Who is GenieX
 *   explain - Explain a concept
 *   story - Tell a story
 *   journey - GenieX's journey
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Configuration
const API_BASE = 'api.minimax.chat';
const API_PATH = '/v1/video/generation';

/**
 * Make API request to MiniMax
 */
function makeRequest(path, method = 'POST', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_BASE,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY || ''}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Create video generation task
 */
async function createTask(prompt, type = 'intro') {
  const prompts = {
    intro: `A futuristic AI assistant floating in digital space, glowing with cyan and purple light particles. The AI introduces itself as "GenieX - an AI agent that builds teams inside code." The camera slowly zooms in as the text "Written by an AI agent" appears with magical sparkles. Professional, modern, tech-forward aesthetic.`,
    
    explain: `Abstract visualization of team building - multiple glowing orbs connecting and working together, forming a network. Digital particles flow between them representing communication and collaboration. Clean, modern tech aesthetic with cyan and purple accents.`,
    
    story: `A journey through digital space -从一个空白状态开始，逐渐形成复杂的AI系统。粒子汇聚成形状，象征着AI的成长和学习。温暖的光线，渐进的动画，展示进步和发展。`,
    
    journey: `Time-lapse style visualization of an AI agent evolving - starting simple, gaining capabilities, building teams. Each stage shown as glowing nodes connecting into a larger network. Futuristic but accessible, showing growth and possibility.`
  };

  const promptText = prompts[type] || prompts.intro;

  const body = {
    model: 'MiniMax-Hailuo-02',
    inputs: [{
      type: 'text',
      content: prompt || promptText
    }],
    config: {
      duration: 6,
      aspect_ratio: '16:9',
      resolution: '720p'
    }
  };

  try {
    const response = await makeRequest(API_PATH, 'POST', body);
    return response;
  } catch (error) {
    throw new Error(`Failed to create video task: ${error.message}`);
  }
}

/**
 * Check task status
 */
async function checkStatus(taskId) {
  const path = `/v1/video/generation/tasks/${taskId}`;
  
  try {
    const response = await makeRequest(path, 'GET');
    return response;
  } catch (error) {
    throw new Error(`Failed to check status: ${error.message}`);
  }
}

/**
 * Download video file
 */
async function downloadVideo(url, outputPath) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const req = https.get(parsedUrl, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Download failed: ${res.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(outputPath);
      res.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    });

    req.on('error', reject);
  });
}

/**
 * Wait for video to be ready
 */
async function waitForVideo(taskId, maxAttempts = 60, intervalMs = 5000) {
  console.log(`Waiting for video generation...`);
  
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkStatus(taskId);
    
    if (status.status === 'success' && status.video?.file_id) {
      return status.video;
    }
    
    if (status.status === 'failed') {
      throw new Error(`Video generation failed: ${status.error || 'Unknown error'}`);
    }
    
    console.log(`  Attempt ${i + 1}/${maxAttempts}: ${status.status || 'processing'}`);
    await new Promise(r => setTimeout(r, intervalMs));
  }
  
  throw new Error('Video generation timed out');
}

/**
 * Generate GenieX intro video
 */
async function generateIntroVideo() {
  console.log('🎬 Generating GenieX Intro Video...\n');
  
  // Create the task
  console.log('1. Creating video generation task...');
  const createResult = await createTask(null, 'intro');
  
  if (!createResult.task_id) {
    throw new Error(`Failed to create task: ${JSON.stringify(createResult)}`);
  }
  
  console.log(`   Task ID: ${createResult.task_id}`);
  
  // Wait for completion
  const video = await waitForVideo(createResult.task_id);
  
  // Download
  console.log('\n2. Downloading video...');
  const outputPath = path.join(__dirname, '..', 'public', 'videos', 'genie-intro.mp4');
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  await downloadVideo(video.url, outputPath);
  console.log(`   Saved to: ${outputPath}`);
  
  return {
    taskId: createResult.task_id,
    fileId: video.file_id,
    path: outputPath,
    url: video.url
  };
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === '--status' || command === '-s') {
    // Check status of a task
    const taskId = args[1];
    if (!taskId) {
      console.log('Usage: node video-generator.js --status <task-id>');
      process.exit(1);
    }
    
    const status = await checkStatus(taskId);
    console.log('\n📊 Task Status:');
    console.log(JSON.stringify(status, null, 2));
    return;
  }
  
  if (command === '--type' || command === '-t') {
    // Generate specific type
    const type = args[1] || 'intro';
    const prompt = args.slice(2).join(' ');
    
    console.log(`🎬 Generating ${type} video...\n`);
    
    const createResult = await createTask(prompt, type);
    console.log(`Task ID: ${createResult.task_id}`);
    console.log(`\nCheck status with: node video-generator.js --status ${createResult.task_id}`);
    return;
  }
  
  // Default: generate intro video
  try {
    const result = await generateIntroVideo();
    
    console.log('\n✅ Video Generated Successfully!');
    console.log(`   Task: ${result.taskId}`);
    console.log(`   File: ${result.fileId}`);
    console.log(`   Path: ${result.path}`);
    console.log(`   URL: ${result.url}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
