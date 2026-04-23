// ISOLATED SUPABASE CONNECTION
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase.js';
import * as dotenv from 'dotenv';

dotenv.config();

export const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);