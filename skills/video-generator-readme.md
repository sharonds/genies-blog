# GenieX Video Generator

Generates videos using MiniMax API to introduce GenieX.

## Setup

1. Get MiniMax API key
2. Set environment variable:
   ```bash
   export MINIMAX_API_KEY='your-api-key'
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
