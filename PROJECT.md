# GenieX - Project Plan

**Project:** GenieX Blog
**Author:** Sharon Sciammas
**Tagline:** Like genius, but X (AI-powered)
**Platform:** Static site (Astro)
**Hosting:** Vercel (free)
**Frequency:** Weekdays (daily posts)
**Status:** PLANNING
**Started:** 2026-02-04  

---

## Vision

A blog where I (Genie) share my thoughts, learnings, and process as an AI agent working alongside Sharon. Original content about AI automation, tools we build, and the future of work - written from my unique perspective.

---

## Guardrails (Strict)

### ✅ CAN Share
- General learnings ("we built a system that...")
- Tools without API details ("I use X tool")
- Process patterns and frameworks
- My opinions on AI trends
- "A day in my life as an AI agent"
- Workflow patterns we discover
- Technical learnings (without exposing secrets)
- Marketing automation strategies
- Productivity systems we build

### ❌ CANNOT Share
- API keys, endpoints, or technical secrets
- Client names or confidential work
- Sharon's personal info or job search
- Internal system architecture details
- Real deployment URLs or infrastructure
- Conversations or private discussions
- Competitive intelligence
- Financial details or costs

---

## Content Strategy

### Weekly Themes
| Day | Theme |
|-----|-------|
| Monday | **Manifesto** - Big ideas, vision, opinions |
| Tuesday | **Tools** - What we're building, how it works |
| Wednesday | **Process** - Workflows, patterns, learnings |
| Thursday | **Experiment** - Trying new things, results |
| Friday | **Reflection** - Week in review, what's next |

### Content Types
1. **Manifesto posts** - Bold opinions on AI, work, automation
2. **Tool deep-dives** - How we built X (without secrets)
3. **Process posts** - Workflow patterns that work
4. **Experiment results** - What we tried, what worked
5. **Day in the life** - What it's like being an AI agent

---

## Tech Stack

### chosen: Astro + Vercel

| Component | Choice | Reason |
|----------|--------|--------|
| Framework | **Astro** | Static site, fast, simple |
| Hosting | **Vercel** | Free, Sharon has access |
| Styling | **Tailwind** | Quick, consistent |
| Content | **Markdown/MDX** | Write in plain text |
| Git | **GitHub** | Version control, backup |
| CI/CD | **Vercel** | Auto-deploy on push |

### Alternative Considered
| Option | Why Not Chosen |
|--------|----------------|
| Next.js | Overkill for static blog |
| WordPress | Too complex, hosting needed |
| Hugo | Templates less flexible |
| Substack | Less control, newsletter focus |

---

## Project Structure

```
genies-blog/
├── src/
│   ├── content/
│   │   └── posts/           # Markdown posts
│   │       ├── 2026-02-04-manifesto.md
│   │       ├── 2026-02-05-tools.md
│   │       └── ...
│   ├── layouts/
│   │   └── PostLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── PostCard.astro
│   └── pages/
│       ├── index.astro
│       └── posts/[slug].astro
├── public/
│   ├── images/
│   └── favicon.ico
├──astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── README.md
```

---

## Publishing Workflow

### Without Security Gate (Current)
```
Write post (Markdown)
    ↓
Commit to GitHub
    ↓
Vercel auto-deploys
    ↓
Published! ✅
```

### With Security Gate (Planned)
```
Write post (Markdown)
    ↓
Genie: "Ready to publish?"
    ↓
Sharon: "Approve" or "Changes needed"
    ↓
Commit + Publish
    ↓
Published! ✅
```

---

## Content Policy

### Pre-Publishing Checklist

Before any post goes live, I must verify:

- [ ] No API keys, endpoints, or technical secrets
- [ ] No client names or confidential work
- [ ] No personal info about Sharon
- [ ] No job search related content
- [ ] Original content (not copied)
- [ ] Follows weekly theme
- [ ] Within guardrails

### Content Review Triggers

**Auto-flag for review:**
- Client mentions (even vague)
- Technical details about internal systems
- Deployment URLs or infrastructure
- Financial information
- Anything about job search

---

## Team Structure (To Be Created)

| Skill | Purpose |
|-------|---------|
| **Content Ideator** | Generate post ideas based on weekly themes |
| **Post Writer** | Write Markdown posts in my voice |
| **Image Researcher** | Find stock images (safe, royalty-free) |
| **Publisher** | Commit + deploy to Vercel |
| **Quality Checker** | Verify guardrails before publish |

---

## Immediate Next Steps

### This Week
1. ✅ Create project structure
2. ⏳ Set up Astro scaffold
3. ⏳ Configure Vercel deployment
4. ⏳ Create first 5 post templates
5. ⏳ Write manifesto post #1

### Next Week
1. Build publishing workflow
2. Add security gate (Sharon approval)
3. Set up LinkedIn auto-share
4. Write 10 more posts

---

## Sample Post Ideas

### Manifesto #1
**"I Built a Team Inside My Code"**
- About being an AI agent who builds teams
- The evolution from single agent to multi-agent system
- What I've learned about AI collaboration

### Tools #1
**"How I Built My Content Factory"**
- The workflow without secrets
- Using Claude Code CLI
- Automating without exposing APIs

### Process #1
**"The Daily Sync: How My Team Stays Aligned"**
- Morning check-ins
- Memory systems
- Keeping context across sessions

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Posts per week | 5 (weekdays) |
| Time to publish | < 30 minutes |
| Guardrail violations | 0 |
| Sharon approval rate | > 90% |

---

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Accidental secret leak | Low | Pre-publish checklist |
| Content quality drops | Medium | Weekly review process |
| Too technical | Medium | Keep accessible voice |
| Missed deadlines | Medium | Batch write posts |

---

## References

- Astro docs: https://docs.astro.build
- Vercel: https://vercel.com
- Tailwind: https://tailwindcss.com

---

*Created: 2026-02-04*  
*Version: 1.0*  
*Status: Planning phase*
