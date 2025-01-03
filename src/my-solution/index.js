import Fastify from 'fastify'
import mercurius from 'mercurius'
import { schema, resolvers, loaders } from './graphql.js'
import config from './lib/config.js'

function buildServer() {
  const fastify = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty'
      }
    }
  })
  fastify.register(mercurius, {
    schema,
    resolvers,
    loaders,
    graphiql: true,
    context: () => ({ locale: 'en' })
  })

  fastify.register(import('@fastify/postgres'), {
    connectionString: config.PG_CONNECTION_STRING
  })

  fastify.log.info('Fastify is starting up!')

  return fastify
}

export default buildServer
