import { supabase } from './supabase'
import { defaultSiteContent } from '@/data/defaultContent'

// Database se content uthane ka function (Server & Client dono ke liye safe)
export async function getSiteContent() {
  try {
    const { data, error } = await supabase
      .from('site_contents')
      .select('section_key, content_value')

    if (error || !data) {
      return defaultSiteContent.home
    }

    // Database records ko object me convert karna
    const dbContent: Record<string, string> = {}
    data.forEach((item) => {
      dbContent[item.section_key] = item.content_value
    })

    // Default content ke sath merge karna (fallback ke taur par)
    return {
      ...defaultSiteContent.home,
      ...dbContent,
    }
  } catch (err) {
    console.error('Error fetching CMS content:', err)
    return defaultSiteContent.home
  }
}