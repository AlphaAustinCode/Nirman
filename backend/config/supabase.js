const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
}

function createSupabaseClient(key) {
  requireEnv("SUPABASE_URL", supabaseUrl);
  requireEnv("SUPABASE client key", key);

  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

function getSupabaseOtpClient() {
  return createSupabaseClient(supabaseAnonKey);
}

function getSupabaseAdminClient() {
  return createSupabaseClient(supabaseServiceRoleKey);
}

module.exports = {
  getSupabaseOtpClient,
  getSupabaseAdminClient,
};
