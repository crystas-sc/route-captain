import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';
import { callGemini } from './gemini.js';


// Load environment variables from project .env
dotenv.config();

function aiProxyPlugin() {
  return {
    name: 'vite:ai-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        console.log('AI Proxy Plugin: Received request', req.method, req.url);
        // Only handle POST /api/ai
        if ((req.url === '/api/ai' || req.url === '/api/ai/') && req.method === 'POST') {
          try {
            // Collect raw body
            let body = '';
            for await (const chunk of req) {
              body += chunk;
            }

            let parsed;
            try {
              parsed = body ? JSON.parse(body) : {};
            } catch (e) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON body' }));
              return;
            }

            const prompt = parsed.prompt || parsed.userprompt || parsed.userPrompt;
            if (!prompt) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing "prompt" in request body' }));
              return;
            }

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY not configured in .env' }));
              return;
            }

            // Call the gemini helper and return its parsed response
            const result = await callGemini(apiKey, prompt);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (err) {
            server.config.logger.error('Error in /api/ai proxy: %o', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: String(err) }));
          }
        } else {
          next();
        }
      });
    }
  };
}


// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), aiProxyPlugin()],
})
