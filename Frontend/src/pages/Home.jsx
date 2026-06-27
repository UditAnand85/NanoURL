import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Blazing Fast',
    desc: 'Shorten any URL instantly with a custom keyword — no waiting, no friction.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Click Analytics',
    desc: 'Track how many times each link has been clicked — simple, clean insights.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure & Private',
    desc: 'Your links are protected under your account. Enable or disable them anytime.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'Custom Keywords',
    desc: 'Pick a memorable keyword that reflects your brand or content.',
  },
];

const Home = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(isLoggedIn ? '/dashboard' : '/login');
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#8B3103]/8 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/70 border border-[#8B3103]/20 rounded-full px-4 py-1.5 text-sm font-medium text-[#8B3103] mb-8 shadow-sm">
            <span className="w-2 h-2 bg-[#8B3103] rounded-full animate-pulse" />
            Simple. Fast. Powerful.
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#2d1a0e] leading-tight mb-6">
            Shorten Links,<br />
            <span className="text-[#8B3103]">Amplify Reach.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#7a6152] max-w-2xl mx-auto mb-10 leading-relaxed">
            NanoLink transforms long, ugly URLs into clean, memorable short links.
            Track clicks, manage your links, and share with confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="btn-primary text-base px-8 py-3 shadow-lg shadow-[#8B3103]/25"
            >
              Get Started Free →
            </button>
            <Link to="/register">
              <button className="btn-outline text-base px-8 py-3">
                Create Account
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-8">
            {[['Fast Redirects', 'Sub-100ms'], ['Custom Keywords', 'Your Choice'], ['Uptime', '99.9%']].map(([label, val]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-[#8B3103]">{val}</p>
                <p className="text-sm text-[#7a6152] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <h2 className="text-3xl font-bold text-center text-[#2d1a0e] mb-3">
          Everything you need
        </h2>
        <p className="text-center text-[#7a6152] mb-12">
          Built for developers, creators, and everyone in between.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-[#8B3103]/10 flex items-center justify-center text-[#8B3103] mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-[#2d1a0e] mb-2">{f.title}</h3>
              <p className="text-sm text-[#7a6152] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="card p-10 text-center bg-[#8B3103] border-none">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-amber-200 mb-8">Join NanoLink and take control of your links today.</p>
          <button onClick={handleGetStarted} className="bg-[#EAE0CB] text-[#8B3103] font-bold px-8 py-3 rounded-lg hover:bg-white transition-colors shadow-lg">
            Start Shortening →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#8B3103]/10 py-6 text-center text-sm text-[#7a6152]">
        © {new Date().getFullYear()} NanoLink — Built with ❤️
      </footer>
    </div>
  );
};

export default Home;
