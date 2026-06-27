import { useSearchParams, Link } from 'react-router-dom';

const Deactivated = () => {
  const [params] = useSearchParams();
  const code = params.get('code');

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-[#8B3103]/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[#8B3103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-[#2d1a0e] mb-3">Link Deactivated</h1>

        {code && (
          <p className="text-sm font-mono bg-[#8B3103]/10 text-[#8B3103] px-3 py-1.5 rounded-lg inline-block mb-4">
            /{code}
          </p>
        )}

        <p className="text-[#7a6152] leading-relaxed mb-8">
          This short link has been <span className="font-semibold text-[#8B3103]">temporarily deactivated</span> by its owner.
          <br />
          Please check back later or contact the link creator.
        </p>

        {/* Divider */}
        <div className="border-t border-[#8B3103]/10 pt-6">
          <Link to="/">
            <button className="btn-primary px-6 py-2.5">
              ← Go to NanoLink Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Deactivated;
