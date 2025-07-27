import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.PUBLIC_SUPABASE_ANON_KEY!
);

// public/lib/spClient.js

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabase = createClient(
  'https://uapfvdwbwfwhlwsqokbs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcGZ2ZHdid2Z3aGx3c3Fva2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNzgyNTMsImV4cCI6MjA2ODc1NDI1M30.6MRmvrUNzP-sk-Msp7ckrEvRYh04vyeWIcQ5jI57Zpc'
);


