import { FastifyTypedInstace } from '../types';
import z from 'zod';

const analysisResponseSchema = z.object({
  alternativeCamelot: z.string(),
  alternativeKey: z.string(),
  bpm: z.number(),
  camelot: z.string(),
  key: z.string(),
  loudness: z.number(),
  timeSignature: z.string(),
});

export async function analyze(app: FastifyTypedInstace) {
  app.post(
    '/analyze',
    {
      schema: {
        body: z.object({
          videoUrl: z.url(),
        }),
        response: {
          200: analysisResponseSchema.describe('Analysis result'),
          500: z.string().describe('Error fetching from Python API'),
        },
      },
    },
    async (request, reply) => {
      const { videoUrl } = request.body;

      try {
        const response = await fetch(`${process.env.PYTHON_API_URL}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ video_url: videoUrl }),
        });

        const data = await response.json();
        const analysisResult = analysisResponseSchema.parse(data);

        return reply.status(200).send(analysisResult);
      } catch (error) {
        console.log('Error fetching from Python API:', error);
        return reply.status(500).send('Error fetching from Python API');
      }
    }
  );
}
