import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

const BASE_URL = 'http://localhost:3000';

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ originalUrl: '', shortcode: '' });
  const [submitting, setSubmitting] = useState(false);
  const [urls, setUrls] = useState([]);
  const [loadingUrls, setLoadingUrls] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingCode, setTogglingCode] = useState(null);

  const fetchUrls = useCallback(async () => {
    try {
      const { data } = await api.get('/api/urls');
      setUrls(data.data || []);
    } catch {
      toast.error('Failed to load your URLs.');
    } finally {
      setLoadingUrls(false);
    }
  }, []);

  useEffect(() => { fetchUrls(); }, [fetchUrls]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const isValidUrl = (str) => {
    try { new URL(str); return true; } catch { return false; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { originalUrl, shortcode } = form;

    if (!originalUrl || !shortcode) {
      toast.error('Both URL and keyword are required.');
      return;
    }
    if (!isValidUrl(originalUrl)) {
      toast.error('Please enter a valid URL (include https://).');
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(shortcode)) {
      toast.error('Keyword can only contain letters, numbers, - and _');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/api/urls', { originalUrl, shortcode });
      toast.success('Short URL created! 🎉');
      setForm({ originalUrl: '', shortcode: '' });
      setUrls((prev) => [data.data, ...prev]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create short URL.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (shortcode, currentActive) => {
    setTogglingCode(shortcode);
    try {
      const { data } = await api.patch(`/api/urls/${shortcode}/toggle`);
      setUrls((prev) =>
        prev.map((u) =>
          u.shortcode === shortcode ? { ...u, isActive: data.data.isActive } : u
        )
      );
      toast.success(`Link ${data.data.isActive ? 'activated' : 'deactivated'}.`);
    } catch {
      toast.error('Failed to toggle URL.');
    } finally {
      setTogglingCode(null);
    }
  };

  const handleDelete = async (shortcode, id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/urls/${shortcode}`);
      setUrls((prev) => prev.filter((u) => u._id !== id));
      toast.success('Link deleted successfully.');
    } catch {
      toast.error('Failed to delete URL.');
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const truncate = (str, n = 45) => str?.length > n ? str.slice(0, n) + '…' : str;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2d1a0e]">
          Welcome back, <span className="text-[#8B3103]">{user?.name}</span> 👋
        </h1>
        <p className="text-[#7a6152] mt-1">Shorten a URL or manage your existing links below.</p>
      </div>

      {/* Create Form */}
      <div className="card p-8 mb-10">
        <h2 className="text-xl font-semibold text-[#2d1a0e] mb-6">Create a New Short Link</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#2d1a0e] mb-1.5">Original URL</label>
              <input
                name="originalUrl"
                type="text"
                placeholder="https://www.example.com/very/long/url..."
                className="input-field"
                value={form.originalUrl}
                onChange={handleChange}
              />
            </div>
            <div className="md:w-56">
              <label className="block text-sm font-medium text-[#2d1a0e] mb-1.5">Short Keyword</label>
              <div className="flex items-center gap-0 border-[1.5px] border-[#8B3103]/20 rounded-[0.6rem] overflow-hidden bg-white/80 focus-within:border-[#8B3103] focus-within:shadow-[0_0_0_3px_rgba(139,49,3,0.12)] transition-all">
                <span className="px-3 py-[0.7rem] text-sm text-[#7a6152] bg-[#8B3103]/5 border-r border-[#8B3103]/10 whitespace-nowrap">nano/</span>
                <input
                  name="shortcode"
                  type="text"
                  placeholder="my-link"
                  className="flex-1 px-3 py-[0.7rem] text-sm outline-none bg-transparent text-[#2d1a0e] placeholder:text-[#7a6152]"
                  value={form.shortcode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-8 py-2.5 flex items-center gap-2"
            >
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Shortening…</>
              ) : (
                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Shorten URL</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* URL Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#8B3103]/10 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#2d1a0e]">Your Links</h2>
          <span className="text-sm text-[#7a6152] bg-[#8B3103]/10 px-3 py-1 rounded-full">
            {urls.length} link{urls.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loadingUrls ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#8B3103] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : urls.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#8B3103]/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#8B3103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p className="text-[#2d1a0e] font-medium">No links yet</p>
            <p className="text-[#7a6152] text-sm mt-1">Create your first short link above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#8B3103]/5 text-[#7a6152] text-left text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-semibold">#</th>
                  <th className="px-5 py-3 font-semibold">Original URL</th>
                  <th className="px-5 py-3 font-semibold">Short URL</th>
                  <th className="px-5 py-3 font-semibold">Keyword</th>
                  <th className="px-5 py-3 font-semibold text-center">Clicks</th>
                  <th className="px-5 py-3 font-semibold text-center">Active</th>
                  <th className="px-5 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8B3103]/8">
                {urls.map((url, idx) => {
                  const shortUrl = `${BASE_URL}/${url.shortcode}`;
                  return (
                    <tr key={url._id} className="hover:bg-[#8B3103]/5 transition-colors">
                      <td className="px-5 py-4 text-[#7a6152]">{idx + 1}</td>
                      <td className="px-5 py-4 max-w-[220px]">
                        <span title={url.originalUrl} className="text-[#2d1a0e] cursor-default">
                          {truncate(url.originalUrl)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8B3103] font-medium hover:underline"
                          >
                            {truncate(shortUrl, 35)}
                          </a>
                          <button
                            onClick={() => copyToClipboard(shortUrl)}
                            className="text-[#7a6152] hover:text-[#8B3103] transition-colors"
                            title="Copy link"
                          >
                            <CopyIcon />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="bg-[#8B3103]/10 text-[#8B3103] px-2.5 py-1 rounded-md font-mono text-xs font-semibold">
                          {url.shortcode}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="font-semibold text-[#2d1a0e]">{url.clicks ?? 0}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={!!url.isActive}
                            disabled={togglingCode === url.shortcode}
                            onChange={() => handleToggle(url.shortcode, url.isActive)}
                          />
                          <span className="toggle-slider" />
                        </label>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleDelete(url.shortcode, url._id)}
                          disabled={deletingId === url._id}
                          className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                          title="Delete link"
                        >
                          {deletingId === url._id ? (
                            <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block" />
                          ) : <TrashIcon />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
