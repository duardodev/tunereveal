import nock from 'nock';
import { buildApp } from '../../test/helpers/app';

describe('App Integration Tests', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Complete Music Analysis Flow', () => {
    it('should handle full analysis successfully', async () => {
      const mockResponse = {
        alternativeCamelot: '1A',
        alternativeKey: 'A Minor',
        bpm: 128,
        camelot: '1B',
        key: 'C Major',
        loudness: -6.2,
        timeSignature: '4/4',
      };

      nock(process.env.PYTHON_API_URL!).post('/analyze').reply(200, mockResponse);

      const response = await app.inject({
        method: 'POST',
        url: '/music/analyze',
        payload: {
          youtubeMusicUrl: 'https://www.youtube.com/watch?v=example',
        },
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('bpm');
      expect(body).toHaveProperty('key');
      expect(body).toHaveProperty('camelot');
      expect(body).toHaveProperty('alternativeKey');
      expect(body).toHaveProperty('alternativeCamelot');
      expect(body).toHaveProperty('loudness');
      expect(body).toHaveProperty('timeSignature');
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS header in response', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/health',
        headers: {
          origin: 'http://example.com',
        },
      });

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });
});
