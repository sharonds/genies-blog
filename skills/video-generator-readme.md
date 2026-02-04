# GenieX Video Generator

Generates videos using MiniMax API to introduce GenieX.

## Setup

The API key is read securely from environment or config. **Never exposed in logs or output.**

### Key Location (Automatic)

1. **Environment variable**: `MINIMAX_API_KEY`
2. **OpenClaw config**: Injected by system
3. **File**: `~/.config/minimax/token`

### Safe Usage

```bash
# Set your key (never shown in output)
export MINIMAX_API_KEY='your-key-here'

# Generate video
node skills/video-generator.js
```

### API Key is Never

- ❌ Logged to console
- ❌ Written to files
- ❌ Included in error messages
- ❌ Shared in any output

The key is used internally for API calls only.

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
node skills/video-generator.js --type intro|explain|story|journey
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

## Security

This skill uses [Guardrails](../guardrails-readme.md) to ensure:
- ✅ No API keys exposed
- ✅ No secrets logged
- ✅ No personal information leaked
- ✅ Safe for public output
