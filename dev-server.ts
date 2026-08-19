import path from 'path';
import { createServer as createViteServer } from 'vite';
import { setupApp } from './server.ts';

async function startDevServer() {
  const app = await setupApp();
  const PORT = parseInt(process.env.PORT || '3000');

  // Vite middleware for development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dev server running on http://localhost:${PORT}`);
  });
}

startDevServer();
