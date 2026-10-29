export default function errorHandler(err, req, res, next) {
  console.error('Erro no servidor:', err.message);
  res.status(500).json({ error: 'Erro interno do servidor' });
}

