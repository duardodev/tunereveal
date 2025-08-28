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
        description: `Analyzes a music track from a YouTube URL to extract musical characteristics.
        This endpoint processes the provided YouTube music URL through an internal Python microservice that downloads, converts, and analyzes the audio. Returns comprehensive musical analysis including BPM, musical key (with Camelot notation), time signature, and loudness measurements.`,
        tags: ['music'],
        body: z.object({
          youtubeMusicUrl: z.url().describe('YouTube URL containing the music track to be analyzed.'),
        }),
        response: {
          200: analysisResponseSchema.describe(
            'Successful music analysis with BPM, key, time signature, and loudness data.'
          ),
          500: z.string().describe('Internal server error during music analysis processing.'),
        },
      },
    },
    async (request, reply) => {
      const { youtubeMusicUrl } = request.body;

      try {
        const response = await fetch(`${process.env.PYTHON_API_URL}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ youtube_music_url: youtubeMusicUrl }),
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
