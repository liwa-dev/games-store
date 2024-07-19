import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rtjvfpkuyiwvywklhsbc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0anZmcGt1eWl3dnl3a2xoc2JjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMDg2NzAxMywiZXhwIjoyMDM2NDQzMDEzfQ.adSMdNP0h1MTu_LlX6eh-96BlsuQ4aSHV5J2bzklTXY';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
