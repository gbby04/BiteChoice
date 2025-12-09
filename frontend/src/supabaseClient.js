import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vmkihbwdtjdookdrlibf.supabase.co' 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZta2loYndkdGpkb29rZHJsaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NDUxMTMsImV4cCI6MjA4MDQyMTExM30.uZ9f0utHXw1IGtqdXPIPL2iwSMxwrJBFjlY8HokS3Uo'

export const supabase = createClient(supabaseUrl, supabaseKey)
