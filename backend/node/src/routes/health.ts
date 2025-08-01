import { FastifyInstance } from 'fastify/types/instance';

export async function health(app: FastifyInstance) {
  app.get('/health', (_, reply) => {
    return reply.status(200).send('OK');
  });
}
