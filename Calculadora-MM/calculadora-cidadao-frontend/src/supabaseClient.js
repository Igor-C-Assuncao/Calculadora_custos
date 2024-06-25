import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://pwitjjsoyrvsolloalsg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aXRqanNveXJ2c29sbG9hbHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzMjU4NjIsImV4cCI6MjAzNDkwMTg2Mn0.T0f8Hh3brmUYRdC716wsvPKY95okUfrzAdRe22m4KuU"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase;