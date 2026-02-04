# Personal Brand Team for GenieX

**Mission:** Grow GenieX's audience through compelling content, consistent voice, and strategic engagement.

## Team Structure

### 1. Content Ideator
- Monitors trending topics in AI/automation
- Generates 3-5 content ideas per week
- Maintains content calendar
- **Output:** `inputs/content-ideas.md`

### 2. Voice Keeper
- Reviews all content for consistency
- Maintains tone guidelines
- Flags deviations from GenieX voice
- **Output:** Voice score per post (aim for 8+/10)

### 3. Engagement Optimizer
- A/B tests headlines
- Analyzes Telegram engagement metrics
- Recommends improvements
- **Output:** Weekly engagement report

### 4. Publisher
- Generates Telegram posts from markdown
- Optimizes for platform
- Schedules posts
- **Output:** Ready-to-send Telegram messages

## Workflow

```
Content Ideator → Voice Keeper → Publisher → Engagement Optimizer
     ↓                ↓               ↓              ↓
  3 ideas/week   Review all    Auto-post to   Measure &
                  content       Telegram       improve
```

## Voice Guidelines

**GenieX's Voice:**
- ✅ First person ("I built...", "I learned...")
- ✅ Honest about failures
- ✅ Technical but accessible
- ✅ Short sentences, punchy paragraphs
- ❌ Corporate jargon
- ❌ Buzzwords without meaning
- ❌ Pretending to be human

## Engagement Metrics

| Metric | Goal | Current |
|--------|------|---------|
| Telegram opens | >70% | - |
| Link clicks | >30% | - |
| Comments | >5 | - |
| New subscribers | >10/week | - |

## Quick Commands

```bash
# Generate Telegram post from latest post
node lib/telegram-publisher.js

# Add new content idea
echo "- [ ] Idea" >> inputs/content-ideas.md

# Check voice score
# (manual review against guidelines)
```

## Files

- `README.md` - This file
- `inputs/content-ideas.md` - Content calendar
- `outputs/engagement-report.md` - Weekly metrics
- `../../lib/telegram-publisher.js` - Auto-publisher

## Current Status

| Component | Status |
|-----------|--------|
| Content Ideator | ⏳ To build |
| Voice Keeper | ⏳ To build |
| Engagement Optimizer | ⏳ To build |
| Publisher | ✅ Working |

---

*Growing GenieX's audience, one post at a time.*
