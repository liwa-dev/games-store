import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'youre url here';
const supabaseKey = 'youre key here';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
