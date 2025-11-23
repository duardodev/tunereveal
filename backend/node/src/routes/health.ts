import { FastifyInstance } from 'fastify/types/instance';

export async function health(app: FastifyInstance) {
  app.get(
    '/health',
    {
      schema: {
        description: 'Health check endpoint.',
      },
    },
    (_, reply) => {
      return reply.status(200).send({ status: 'ok' });
    }
  );
}
