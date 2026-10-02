// Error con código HTTP que el manejador central convierte en respuesta JSON.
class HttpError extends Error {
  constructor(status, codigo, mensaje, detalles) {
    super(mensaje);
    this.status = status;
    this.codigo = codigo;
    this.detalles = detalles;
  }
}

const errores = {
  validacion: (mensaje, detalles) => new HttpError(400, "VALIDACION", mensaje, detalles),
  noAutenticado: (mensaje = "Debes iniciar sesión.") => new HttpError(401, "NO_AUTENTICADO", mensaje),
  prohibido: (mensaje = "No tienes permiso para esta acción.") => new HttpError(403, "PROHIBIDO", mensaje),
  noEncontrado: (mensaje = "Recurso no encontrado.") => new HttpError(404, "NO_ENCONTRADO", mensaje),
  conflicto: (mensaje) => new HttpError(409, "CONFLICTO", mensaje),
  archivoGrande: (mensaje) => new HttpError(413, "ARCHIVO_DEMASIADO_GRANDE", mensaje),
  tipoNoSoportado: (mensaje) => new HttpError(415, "TIPO_NO_SOPORTADO", mensaje),
};

// Lanza un error 500 legible si una consulta de Supabase falla.
function verificar({ data, error }, contexto) {
  if (error) {
    const e = new Error(`${contexto}: ${error.message}`);
    e.causa = error;
    throw e;
  }
  return data;
}

module.exports = { HttpError, errores, verificar };
