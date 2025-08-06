import { FastifyTypedInstace } from '../types';
import rateLimit from '@fastify/rate-limit';
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
  await app.register(rateLimit, {
    global: false,
  });

  app.post(
    '/music/analyze',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
      schema: {
        description: `Analyzes a music track from a YouTube video URL.
        This endpoint sends the provided video URL to an internal Python microservice, which handles downloading, converting, and analyzing the audio. The result includes details such as BPM, key, Camelot notation, and loudness.`,
        tags: ['music'],
        body: z.object({
          videoUrl: z.url().describe('A YouTube video URL containing the track to be analyzed.'),
        }),
        response: {
          200: analysisResponseSchema.describe('Audio analysis result returned from the Python microservice.'),
          500: z.string().describe('Error while fetching or processing from the Python microservice.'),
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
