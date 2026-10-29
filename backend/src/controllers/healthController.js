import { testConnection } from '../db/connection.js';

export async function checkHealth(req, res, next) {
  try {
    await testConnection();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Erro na verificação de saúde:', error.message);
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
}

