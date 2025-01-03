import buildServer from './index.js'

const startServer = async () => {
  const fastify = buildServer()
  await fastify.ready()

  fastify.graphql.addHook('preParsing', async function () {
    fastify.log.info('preParsing called')
  })

  fastify.graphql.addHook('preValidation', async function () {
    fastify.log.info('preValidation called')
  })

  fastify.graphql.addHook('preExecution', async function (schema, document) {
    fastify.log.info('preExecution called')
    /* return {
      document,
      errors: [new Error('foo')]
    } */
  })

  fastify.graphql.addHook('onResolution', async function () {
    fastify.log.info('onResolution called')
  })

  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

startServer()
