const { errores } = require("../utils/errores");

// Convierte los errores de Zod a [{ campo, mensaje }] para mostrarlos junto a cada campo en el cliente.
function formatearIssues(issues) {
  return issues.map((issue) => ({
    campo: issue.path.reduce((acc, parte) => (typeof parte === "number" ? `${acc}[${parte}]` : acc ? `${acc}.${parte}` : parte), ""),
    mensaje: issue.message,
  }));
}

// Valida req.body / req.query / req.params con un esquema Zod y deja el resultado limpio en req.datos.
function validar(esquema, origen = "body") {
  return (req, res, next) => {
    const resultado = esquema.safeParse(req[origen] ?? {});
    if (!resultado.success) {
      throw errores.validacion("Los datos enviados no son válidos.", formatearIssues(resultado.error.issues));
    }
    req.datos = { ...req.datos, [origen]: resultado.data };
    next();
  };
}

module.exports = { validar, formatearIssues };
