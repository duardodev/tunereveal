import fastifyCors from '@fastify/cors';
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { health } from '../../routes/health';
import { analyze } from '../../routes/analyze';

export async function buildApp() {
  const app = fastify({
    logger: false,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifyCors, {
    origin: '*',
  });

  await app.register(health);
  await app.register(analyze);

  await app.ready();

  return app;
}
