'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { defaultSiteContent } from '@/data/defaultContent';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Globe, LogOut, Save, Loader2, Sparkles, Navigation, Layers, Menu, ChevronLeft, Eye, EyeOff, RefreshCw, X } from 'lucide-react';

export default function AdminDashboard() {
  const [content, setContent] = useState<Record<string, string>>(defaultSiteContent.home);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'hero' | 'navbar' | 'footer'>('hero');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_contents').select('section_key, content_value');
    if (!error && data) {
      const dbMap: Record<string, string> = {};
      data.forEach(item => {
        dbMap[item.section_key] = item.content_value;
      });
      setContent({ ...defaultSiteContent.home, ...dbMap });
    }
    setLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      for (const [key, value] of Object.entries(content)) {
        const { error } = await supabase
          .from('site_contents')
          .upsert(
            { section_key: key, content_value: value, page_name: 'home' },
            { onConflict: 'section_key' }
          );
        if (error) throw error;
      }
      setMessage('Changes published successfully!');
      setIframeKey(prev => prev + 1);
    } catch (err: any) {
      setMessage('Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#003B1D] text-white font-bold">Loading CMS Dashboard...</div>;
  }

  const keys = Object.keys(defaultSiteContent.home);
  const heroKeys = keys.filter(k => k.includes('hero') || k.includes('search') || k.includes('badge') || k.includes('section'));
  const navbarKeys = keys.filter(k => k.includes('nav') || k.includes('menu') || k.includes('header'));
  const footerKeys = keys.filter(k => k.includes('footer') || k.includes('copyright') || k.includes('disclaimer'));

  const currentKeys = activeTab === 'hero' ? heroKeys : activeTab === 'navbar' ? navbarKeys : footerKeys;

  return (
    <div className="min-h-screen bg-[#002B15] text-slate-800 flex flex-col md:flex-row">
      {/* Desktop Collapsible Green Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#003B1D] border-r border-emerald-950/30 transition-all duration-300 hidden md:flex flex-col justify-between p-5 text-white shadow-xl`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            {sidebarOpen && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-black text-slate-950 shrink-0">P</div>
                <div>
                  <h2 className="font-black text-sm tracking-wide text-white">CMS Admin</h2>
                  <p className="text-[10px] text-emerald-200/70">Prize Bond Pakistan</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 transition cursor-pointer mx-auto"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <nav className="space-y-1">
            <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-800/80 text-amber-300 font-bold text-xs transition border border-emerald-700/50 ${!sidebarOpen ? 'justify-center' : ''}`}>
              <LayoutDashboard className="w-4 h-4 text-amber-300 shrink-0" />
              {sidebarOpen && <span>Customizer</span>}
            </button>
          </nav>
        </div>

        <div className="border-t border-emerald-900/60 pt-4">
          <button
            onClick={() => router.push('/')}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-200 hover:text-white transition cursor-pointer ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>View Live Website</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden flex">
          <div className="w-72 bg-[#003B1D] h-full p-5 text-white flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-black text-slate-950 shrink-0">P</div>
                  <div>
                    <h2 className="font-black text-sm tracking-wide text-white">CMS Admin</h2>
                    <p className="text-[10px] text-emerald-200/70">Prize Bond Pakistan</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-emerald-900 text-emerald-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-800 text-amber-300 font-bold text-xs border border-emerald-700">
                  <LayoutDashboard className="w-4 h-4 text-amber-300" />
                  <span>Customizer</span>
                </button>
              </nav>
            </div>

            <div className="border-t border-emerald-900/60 pt-4 space-y-2">
              <button
                onClick={() => router.push('/')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-200 hover:text-white"
              >
                <Globe className="w-4 h-4" />
                <span>View Live Website</span>
              </button>
              <button
                onClick={async () => {
                  localStorage.removeItem('is_admin_logged_in');
                  await supabase.auth.signOut();
                  router.push('/admin/login');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-300 hover:text-white bg-red-600/20 rounded-lg"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)}></div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#002B15]">
        {/* Responsive Top Header */}
        <header className="bg-[#003B1D] border-b border-emerald-950/30 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white shadow-md">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden p-2 rounded-lg bg-emerald-900/80 text-emerald-200 hover:text-white cursor-pointer border border-emerald-700/50"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">Store Customizer</h1>
                <p className="text-[11px] text-emerald-200/80 hidden xs:block">Customize branding, header, hero, and footer.</p>
              </div>
            </div>
            
            {/* Mobile Logout/Preview Controls on top row */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 bg-emerald-800 text-amber-300 rounded-lg border border-emerald-600/50"
                title="Toggle Preview"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-amber-300 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer border border-emerald-600/50"
            >
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
            </button>
            <button
              onClick={async () => {
                localStorage.removeItem('is_admin_logged_in');
                await supabase.auth.signOut();
                router.push('/admin/login');
              }}
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer border border-red-500/30"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </header>

        {/* Split Screen Layout: Form & Live Website Iframe */}
        <div className="p-4 sm:p-8 flex flex-col lg:flex-row gap-8 items-start max-w-7xl w-full mx-auto">
          
          {/* Left Form Section */}
          <div className={`flex-1 w-full space-y-6 ${showPreview ? 'lg:max-w-xl' : 'max-w-4xl mx-auto'}`}>
            {/* Section Tabs */}
            <div className="flex items-center gap-2 border-b border-emerald-800/60 pb-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('hero')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 ${
                  activeTab === 'hero' ? 'bg-emerald-800 text-amber-300 shadow-md border border-emerald-700' : 'bg-[#003B1D]/80 text-emerald-100 hover:bg-emerald-900 border border-emerald-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Hero & Main Section
              </button>
              <button
                onClick={() => setActiveTab('navbar')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 ${
                  activeTab === 'navbar' ? 'bg-emerald-800 text-amber-300 shadow-md border border-emerald-700' : 'bg-[#003B1D]/80 text-emerald-100 hover:bg-emerald-900 border border-emerald-900'
                }`}
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Header & Navbar
              </button>
              <button
                onClick={() => setActiveTab('footer')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 ${
                  activeTab === 'footer' ? 'bg-emerald-800 text-amber-300 shadow-md border border-emerald-700' : 'bg-[#003B1D]/80 text-emerald-100 hover:bg-emerald-900 border border-emerald-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" /> Footer Content
              </button>
            </div>

            {message && (
              <div className={`p-3 rounded-xl text-xs font-bold ${message.includes('Error') ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6 bg-white p-5 sm:p-8 rounded-2xl border border-emerald-900/20 shadow-xl">
              <div className="space-y-5">
                {currentKeys.length > 0 ? (
                  currentKeys.map((key) => (
                    <div key={key} className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                        {key.replace(/_/g, ' ')}
                      </label>
                      <textarea
                        value={content[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        rows={key.includes('title') || key.includes('desc') || key.includes('subtitle') ? 3 : 1}
                        className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-[#006633] focus:outline-none text-slate-900 text-sm font-medium bg-emerald-50/20"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No configurable fields found for this section in default content.</p>
                )}
              </div>

              <div className="pt-4 border-t border-emerald-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#006633] hover:bg-[#004D26] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Publishing Changes...' : 'Save Configuration'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Live Website Iframe Preview Section */}
          {showPreview && (
            <div className="w-full lg:w-[480px] sticky top-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-200 px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE WEBSITE PREVIEW
                </span>
                <button
                  onClick={() => setIframeKey(prev => prev + 1)}
                  className="flex items-center gap-1 text-[10px] bg-emerald-900/80 hover:bg-emerald-800 px-2.5 py-1 rounded text-emerald-200 transition cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh Preview
                </button>
              </div>

              <div className="bg-white rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden text-slate-900">
                <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between text-white text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                  </div>
                  <span className="bg-slate-800 px-3 py-1 rounded text-slate-300 font-mono text-[10px]">localhost:3000</span>
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                </div>

                <div className="w-full h-[650px] bg-white overflow-hidden relative">
                  <iframe
                    key={iframeKey}
                    src="/"
                    title="Live Website Preview"
                    className="w-full h-full border-0 transform scale-95 origin-top"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}