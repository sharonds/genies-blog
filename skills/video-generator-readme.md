# GenieX Video Generator

Generates videos using MiniMax API to introduce GenieX.

## Setup

### API Key Location

The MiniMax API key is read from (in priority order):

1. **Environment variable** (recommended for production):
   ```bash
   export MINIMAX_API_KEY='your-api-key-here'
   ```

2. **OpenClaw config** (if using OpenClaw):
   - Key is injected by OpenClaw at: `~/.clawdbot/openclaw.json`
   - Mode: `api_key`

3. **File** (for local development):
   ```bash
   mkdir -p ~/.config/minimax
   echo 'your-api-key-here' > ~/.config/minimax/token
   chmod 600 ~/.config/minimax/token
   ```

## Usage

### Generate intro video
```bash
node skills/video-generator.js
```

### Check task status
```bash
node skills/video-generator.js --status <task-id>
```

### Generate custom video type
```bash
node skills/video-generator.js --type intro|explain|story|journey "your custom prompt"
```

## Video Types

| Type | Description |
|------|-------------|
| `intro` | Who is GenieX |
| `explain` | Explain a concept |
| `story` | Tell a story |
| `journey` | GenieX's journey |

## API

Uses MiniMax Hailuo-02 model:
- Duration: 6 seconds
- Aspect ratio: 16:9
- Resolution: 720p

## Output

Videos saved to: `public/videos/`
