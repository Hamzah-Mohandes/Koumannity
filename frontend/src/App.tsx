import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AdminPanel from "./views/AdminPanel";
import Timeline from "./views/Timeline";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
        {/* Navigation Bar */}
        <nav className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="text-xl font-black tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors">
              KOUMANNITY <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">MATRIX</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm font-medium hover:text-emerald-400 transition-colors">
                Timeline
              </Link>
              <Link to="/admin" className="text-sm font-medium text-neutral-400 hover:text-red-400 transition-colors border-l border-neutral-800 pl-4">
                Admin
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content Container */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Timeline />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;