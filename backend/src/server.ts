import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRouter from './routes/api.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Parsing Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for inline Next.js scripts & recharts SVG renderers
  })
);

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express API Router
app.use('/api', apiRouter);

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'UP',
    service: 'AgriPrice SL Unified Express API & Web Server',
    timestamp: new Date().toISOString(),
  });
});

// Serving Static Next.js Assets if present (_next/static)
const standaloneDir = path.resolve(__dirname, '../../frontend/.next/standalone');
const staticAssetsDir = path.resolve(__dirname, '../../frontend/.next/static');
const publicAssetsDir = path.resolve(__dirname, '../../frontend/public');

if (fs.existsSync(staticAssetsDir)) {
  app.use('/_next/static', express.static(staticAssetsDir));
}
if (fs.existsSync(publicAssetsDir)) {
  app.use(express.static(publicAssetsDir));
}

// Next.js standalone request handler fallback for SPA/SSR frontend routing
let nextHandler: any = null;
if (fs.existsSync(path.join(standaloneDir, 'server.js'))) {
  try {
    const nextServer = require(path.join(standaloneDir, 'server.js'));
    nextHandler = nextServer.default || nextServer;
    console.log('[AgriPrice Backend] Next.js standalone server integrated successfully.');
  } catch (err: any) {
    console.warn('[AgriPrice Backend] Notice: Standalone Next.js handler loading deferred until frontend build:', err.message);
  }
}

// Wildcard routing to handle frontend pages or API 404s
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: `API route ${req.method} ${req.path} not found` });
  }

  if (nextHandler) {
    return nextHandler(req, res);
  }

  // Fallback dev response when Next.js standalone server isn't built yet
  return res.send(`
    <!Valid HTML>
    <html lang="en">
      <head>
        <title>AgriPrice SL - Unified Monorepo Server</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; height: 100vh; align-items: center; justify-content: center; margin: 0; }
          .card { background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #334155; max-width: 540px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          h1 { color: #22c55e; margin-top: 0; font-size: 1.75rem; }
          code { background: #0f172a; padding: 0.2rem 0.4rem; border-radius: 4px; color: #38bdf8; font-size: 0.9rem; }
          .badge { display: inline-block; background: #166534; color: #86efac; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; margin-bottom: 1rem; }
          a { color: #38bdf8; text-decoration: none; font-weight: 500; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">Express API Server Active</span>
          <h1>AgriPrice SL Monorepo API</h1>
          <p>The Express backend is running on <code>Port ${PORT}</code>. Next.js standalone frontend handler can be served directly from this entry point after building frontend.</p>
          <hr style="border-color: #334155; margin: 1.5rem 0;" />
          <p><strong>Available REST API Endpoints:</strong></p>
          <ul>
            <li><a href="/api/forecast?crop=CARROT&center=DAMBULLA&horizon=14" target="_blank">GET /api/forecast</a></li>
            <li><a href="/api/market-prices/daily?center=DAMBULLA" target="_blank">GET /api/market-prices/daily</a></li>
            <li><a href="/api/market-prices/centers" target="_blank">GET /api/market-prices/centers</a></li>
            <li><a href="/api/listings" target="_blank">GET /api/listings</a></li>
            <li><a href="/health" target="_blank">GET /health</a></li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🌾 AgriPrice SL Unified Monorepo Server Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`⚡ API Routes: http://localhost:${PORT}/api/*`);
  console.log(`==================================================`);
});
