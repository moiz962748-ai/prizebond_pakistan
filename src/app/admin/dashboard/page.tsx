'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { defaultSiteContent } from '@/data/defaultContent'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [content, setContent] = useState<Record<string, string>>(defaultSiteContent.home)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchContent()
  }, [])

  // Database se current text uthana
  const fetchContent = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('site_contents').select('section_key, content_value')
    if (!error && data) {
      const dbMap: Record<string, string> = {}
      data.forEach(item => {
        dbMap[item.section_key] = item.content_value
      })
      setContent({ ...defaultSiteContent.home, ...dbMap })
    }
    setLoading(false)
  }

  // Input change handle karna
  const handleChange = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }))
  }

  // Database me changes save/update karna
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      for (const [key, value] of Object.entries(content)) {
        const { error } = await supabase
          .from('site_contents')
          .upsert(
            { section_key: key, content_value: value, page_name: 'home' },
            { onConflict: 'section_key' }
          )
        if (error) throw error
      }
      setMessage('Changes published successfully!')
    } catch (err: any) {
      setMessage('Error saving: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 font-bold">Loading CMS Dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Website Content CMS</h1>
            <p className="text-xs text-gray-500">Manage all your website texts from one single place.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg transition"
            >
              View Live Website
            </button>
            <button
              onClick={async () => {
                localStorage.removeItem('is_admin_logged_in')
                await supabase.auth.signOut()
                router.push('/admin/login')
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-xl text-xs font-bold ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {Object.keys(defaultSiteContent.home).map((key) => (
            <div key={key} className="space-y-1.5">
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                {key.replace(/_/g, ' ')}
              </label>
              <textarea
                value={content[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                rows={key.includes('title') || key.includes('desc') || key.includes('subtitle') ? 3 : 1}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-black text-sm font-medium bg-gray-50"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-[#006633] hover:bg-[#004D26] text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            {saving ? 'Publishing Changes...' : 'Publish Changes to Website'}
          </button>
        </form>
      </div>
    </div>
  )
}