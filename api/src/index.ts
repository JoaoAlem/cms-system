import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { auth } from "./routes/auth.js";

const app = new Hono().basePath('v1')

app.all("/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const server = serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

// graceful shutdown
process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})

