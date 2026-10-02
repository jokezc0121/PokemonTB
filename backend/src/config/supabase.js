const { createClient } = require("@supabase/supabase-js");
const env = require("./env");

// Cliente de servidor: usa la secret key, por eso nunca se expone al navegador.
const supabase = createClient(env.supabaseUrl, env.supabaseSecretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

module.exports = supabase;
