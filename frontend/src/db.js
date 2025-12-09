import { createClient } from '@supabase/supabase-js'

// PASTE YOUR REAL KEYS HERE
const supabaseUrl = 'https://vmkihbwdtjdookdrlibf.supabase.co' 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZta2loYndkdGpkb29rZHJsaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NDUxMTMsImV4cCI6MjA4MDQyMTExM30.uZ9f0utHXw1IGtqdXPIPL2iwSMxwrJBFjlY8HokS3Uo'

// 🔍 DEBUGGING LINES (This will show up in your browser console)
console.log("🚀 DEBUGGING SUPABASE 🚀")
console.log("URL:", supabaseUrl)
console.log("KEY Length:", supabaseKey ? supabaseKey.length : 0)

if (!supabaseUrl || !supabaseKey) {
    console.error("🚨 CRITICAL ERROR: Keys are missing!")
}

export const supabase = createClient(supabaseUrl, supabaseKey)
