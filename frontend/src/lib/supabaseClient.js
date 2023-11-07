import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://ghiirvfsirhkwggyjnyn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaWlydmZzaXJoa3dnZ3lqbnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwNDI5MDEsImV4cCI6MjAxNDYxODkwMX0.qMZW7mccYl6oEBEOElpeFKP4gD2VTYaEBllf_-b1b68'
)
