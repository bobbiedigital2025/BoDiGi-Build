import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-indigo-400">BoDiGi</span>
          <span className="text-sm text-gray-400 font-medium">Build</span>
        </div>
        <nav className="flex gap-6 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <span className="inline-block bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full mb-6 border border-indigo-500/20">
          AI-Powered · MCP + A2A Secure
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Build SaaS Apps{' '}
          <span className="text-indigo-400">Faster</span> with AI
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mb-10">
          BoDiGi-Build is an AI-driven, automation-first application builder — combining
          voice &amp; text prompting, drag-and-drop editing, and secure MCP workflows to
          ship production apps in record time.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="#get-started"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Get Started Free
          </a>
          <a
            href="https://github.com/bobbiedigital2025/BoDiGi-Build"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold px-6 py-3 rounded-lg transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl text-left">
          {[
            {
              icon: '🤖',
              title: 'AI Agent Interface',
              desc: 'Text & voice prompts. Agent summarizes, asks clarifying questions, and waits for your approval before making changes.',
            },
            {
              icon: '🔒',
              title: 'MCP + A2A Security',
              desc: 'Model Context Protocol authentication and App-to-App token system keep every operation secure and auditable.',
            },
            {
              icon: '⚡',
              title: 'Vite + React + Tailwind',
              desc: 'Blazing-fast frontend on Netlify. Node.js + Express backend on Render. Supabase for auth and data.',
            },
            {
              icon: '💳',
              title: 'Stripe Billing',
              desc: 'Usage-based subscriptions with a live dashboard showing quotas, usage, and billing insights.',
            },
            {
              icon: '🗂️',
              title: 'VS Code-style Explorer',
              desc: 'Browse your project files in real time and download the whole project as a ZIP in one click.',
            },
            {
              icon: '🎨',
              title: 'Drag & Drop Editor',
              desc: 'Visually arrange and customise your app layout without touching a line of code.',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Bobbie Digital — <em>We make going digital easy.</em></p>
        <p className="mt-1">
          <a href="mailto:marketing-support@bobbiedigital.com" className="hover:text-gray-300 transition-colors">
            marketing-support@bobbiedigital.com
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
