import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { health } from './routes/health';
import { analyze } from './routes/analyze';
import { fastifySwagger } from '@fastify/swagger';
import scalarFastify from '@scalar/fastify-api-reference';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: '*',
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'TuneReveal API',
      description: 'API for analyzing and extracting information from music tracks',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(scalarFastify, {
  routePrefix: '/docs',
  configuration: {
    theme: 'kepler',
  },
});

app.register(health);
app.register(analyze);

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('Server running!');
});
