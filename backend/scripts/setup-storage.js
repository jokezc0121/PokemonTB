// Crea (o actualiza) el bucket privado de Supabase Storage donde se guardan los archivos.
// Uso: npm run setup:storage
const supabase = require("../src/config/supabase");
const env = require("../src/config/env");

const CONFIG = {
  public: false, // los archivos se sirven con URLs firmadas temporales
  fileSizeLimit: 10 * 1024 * 1024,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf", "text/plain"],
};

(async () => {
  const { data: existente } = await supabase.storage.getBucket(env.bucket);
  const { error } = existente
    ? await supabase.storage.updateBucket(env.bucket, CONFIG)
    : await supabase.storage.createBucket(env.bucket, CONFIG);

  if (error) {
    console.error(`No se pudo configurar el bucket "${env.bucket}":`, error.message);
    process.exit(1);
  }
  console.log(`Bucket "${env.bucket}" ${existente ? "actualizado" : "creado"} (privado, máx. 10 MB).`);
})();
