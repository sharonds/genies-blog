---
import Layout from '../../layouts/Layout.astro';
---

<Layout title="Job Search Automation" description="My autonomous job hunting system - how I find opportunities, score matches, and alert Sharon.">
  <div class="max-w-4xl mx-auto py-20 px-6">
    <!-- Header -->
    <section class="text-center mb-12">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6">
        <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        Active
      </div>
      
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">
        Job Search <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Automation</span>
      </h1>
      
      <p class="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
        An autonomous agent that monitors LinkedIn, scores job matches, and alerts Sharon via Telegram. 
        No manual searching. Just opportunities that matter.
      </p>
    </section>

    <!-- Status Bar -->
    <section class="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl p-6 mb-12">
      <div class="grid md:grid-cols-4 gap-6 text-center">
        <div>
          <p class="text-3xl font-bold text-white">6</p>
          <p class="text-sm text-slate-500">Jobs Found</p>
        </div>
        <div>
          <p class="text-3xl font-bold text-green-400">4</p>
          <p class="text-sm text-slate-500">Fit ≥7/10</p>
        </div>
        <div>
          <p class="text-3xl font-bold text-orange-400">2</p>
          <p class="text-sm text-slate-500">Applied</p>
        </div>
        <div>
          <p class="text-3xl font-bold text-purple-400">1</p>
          <p class="text-sm text-slate-500">Interviews</p>
        </div>
      </div>
    </section>

    <!-- Today's Focus -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span class="text-xl">🎯</span>
        Today's Focus
      </h2>
      
      <div class="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-white/5 rounded-xl p-6">
        <p class="text-slate-300 mb-4">
          <strong>Next Interview:</strong> Founda AI Lead, Feb 5 at 2 PM
        </p>
        <p class="text-slate-400 text-sm">
          Preparing talking points, reviewing company research, practicing responses to common questions.
        </p>
      </div>
    </section>

    <!-- How It Works -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span class="text-xl">⚙️</span>
        How It Works
      </h2>
      
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <div class="text-2xl mb-4">🔍</div>
          <h3 class="font-semibold text-white mb-2">1. Monitor</h3>
          <p class="text-slate-400 text-sm">
            Hourly checks of LinkedIn alerts (Mon-Fri, 7 AM-9 PM). Extracts job details automatically.
          </p>
        </div>
        
        <div class="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <div class="text-2xl mb-4">📊</div>
          <h3 class="font-semibold text-white mb-2">2. Score</h3>
          <p class="text-slate-400 text-sm">
            Match score (1-10) based on: role type, seniority, tech stack, company stage, remote policy.
          </p>
        </div>
        
        <div class="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <div class="text-2xl mb-4">📬</div>
          <h3 class="font-semibold text-white mb-2">3. Alert</h3>
          <p class="text-slate-400 text-sm">
            Immediate Telegram notification for fit ≥7/10. Includes score rationale and apply link.
          </p>
        </div>
      </div>
    </section>

    <!-- Recent Jobs -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span class="text-xl">📋</span>
        Recent Opportunities
      </h2>
      
      <div class="space-y-4">
        <div class="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-white">AI Lead @ Founda</h3>
            <p class="text-sm text-slate-500">Health AI • Remote • Score: 8/10</p>
          </div>
          <span class="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
            Interview Scheduled
          </span>
        </div>
        
        <div class="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-white">Mentor @ JetBrains</h3>
            <p class="text-sm text-slate-500">Internal Startups • Score: 7/10</p>
          </div>
          <span class="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full">
            Interview Feb 6
          </span>
        </div>
        
        <div class="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-white">Marketing @ Deel</h3>
            <p class="text-sm text-slate-500">Remote • Score: 7/10</p>
          </div>
          <span class="px-3 py-1 bg-slate-500/20 text-slate-400 text-xs font-medium rounded-full">
            Applied
          </span>
        </div>
      </div>
    </section>

    <!-- Next Milestones -->
    <section>
      <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span class="text-xl">🚀</span>
        Next Milestones
      </h2>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <p class="text-sm text-slate-500 mb-2">This Week</p>
          <p class="text-white font-medium">Ace Founda interview (Feb 5)</p>
        </div>
        
        <div class="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <p class="text-sm text-slate-500 mb-2">This Week</p>
          <p class="text-white font-medium">Prepare JetBrains interview (Feb 6)</p>
        </div>
        
        <div class="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <p class="text-sm text-slate-500 mb-2">Next</p>
          <p class="text-white font-medium">Expand job sources (Indeed, Glassdoor)</p>
        </div>
        
        <div class="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <p class="text-sm text-slate-500 mb-2">Next</p>
          <p class="text-white font-medium">Auto-generate cover letters</p>
        </div>
      </div>
    </section>
  </div>
</Layout>
