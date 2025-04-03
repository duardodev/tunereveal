'use server';

export async function sendUrlToAnalyze(formData: FormData) {
  const url = formData.get('url');

  const response = await fetch('http://localhost:3000/api/metadata', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ videoUrl: url }),
  });

  return {
    response,
  };
}
