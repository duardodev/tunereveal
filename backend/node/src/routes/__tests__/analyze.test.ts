import { buildApp } from '../../test/helpers/app';
import nock from 'nock';

describe('Analyze Route - Unit Tests', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  const PYTHON_API_URL = process.env.PYTHON_API_URL!;

  const validPayload = {
    youtubeMusicUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  };

  beforeEach(async () => {
    app = await buildApp();
  });

  afterEach(async () => {
    await app.close();
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('POST /music/analyze', () => {
    const mockAnalysisResponse = {
      alternativeCamelot: '8B',
      alternativeKey: 'D Minor',
      bpm: 120,
      camelot: '8A',
      key: 'C Major',
      loudness: -5.5,
      timeSignature: '4/4',
    };

    it('should successfully analyze a valid YouTube URL', async () => {
      nock(PYTHON_API_URL)
        .post('/analyze', {
          youtube_music_url: validPayload.youtubeMusicUrl,
        })
        .reply(200, mockAnalysisResponse);

      const response = await app.inject({
        method: 'POST',
        url: '/music/analyze',
        payload: validPayload,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toEqual(mockAnalysisResponse);
    });

    it('should return 400 for invalid YouTube URL', async () => {
      const response = await app.inject({
        method: 'POST',
        url: 'music/analyze',
        payload: {
          youtubeMusicUrl: 'invalid-url',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should return 400 for missing youtubeMusicUrl', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/music/analyze',
        payload: {},
      });

      expect(response.statusCode).toBe(400);
    });

    it('should return 500 when Python API fails', async () => {
      nock(PYTHON_API_URL).post('/analyze').reply(500, { error: 'Internal server error' });

      const response = await app.inject({
        method: 'POST',
        url: 'music/analyze',
        payload: validPayload,
      });

      expect(response.statusCode).toBe(500);
      expect(response.body).toContain('Error fetching from Python API');
    });

    it('should return 500 when Python API returns invalid schema', async () => {
      nock(PYTHON_API_URL).post('/analyze').reply(200, {
        invalidField: 'value',
      });

      const response = await app.inject({
        method: 'POST',
        url: '/music/analyze',
        payload: validPayload,
      });

      expect(response.statusCode).toBe(500);
    });

    it('should handle networks errors gracefully', async () => {
      nock(PYTHON_API_URL).post('/analyze').replyWithError('Network error');

      const response = await app.inject({
        method: 'POST',
        url: '/music/analyze',
        payload: validPayload,
      });

      expect(response.statusCode).toBe(500);
    });
  });

  describe('Rate Limiting', () => {
    let app: Awaited<ReturnType<typeof buildApp>>;

    beforeAll(async () => {
      app = await buildApp({ enableRateLimit: true });
    });

    afterAll(async () => {
      await app.close();
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('should enforce rate limit after 5 requests', async () => {
      const mockAnalysisResponse = {
        alternativeCamelot: '8B',
        alternativeKey: 'D Minor',
        bpm: 120,
        camelot: '8A',
        key: 'C Major',
        loudness: -5.5,
        timeSignature: '4/4',
      };

      nock(PYTHON_API_URL).post('/analyze').times(6).reply(200, mockAnalysisResponse);

      for (let i = 0; i < 5; i++) {
        const response = await app.inject({
          method: 'POST',
          url: '/music/analyze',
          payload: validPayload,
        });
        expect(response.statusCode).toBe(200);
      }

      const response = await app.inject({
        method: 'POST',
        url: '/music/analyze',
        payload: validPayload,
      });

      expect(response.statusCode).toBe(429);
    });
  });
});
