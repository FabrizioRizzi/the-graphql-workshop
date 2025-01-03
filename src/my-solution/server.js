import buildServer from './index.js'

const fastify = buildServer()

const startServer = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

startServer()
