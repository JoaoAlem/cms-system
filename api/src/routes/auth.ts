import { Hono } from 'hono'
import { auth } from '../lib/auth.js'
import type { AppEnv } from '../types/env.js'

const router = new Hono<AppEnv>({
  strict: false,
})

router.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

export default router
