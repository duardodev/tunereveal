// // import * as youtubedl from 'youtube-dl-exec';

// export interface VideoMetadata {
//   thumbnail: string;
//   title: string;
//   duration: number;
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { videoUrl } = body;

//     console.log('Tentando obter metadata para:', videoUrl);

//     if (!videoUrl) {
//       return Response.json({ error: 'URL is required and must be a string' }, { status: 400 });
//     }

//     // Validação básica de URL do YouTube
//     if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
//       return Response.json({ error: 'Invalid YouTube URL' }, { status: 400 });
//     }

//     console.log('Tentando obter metadata para:', videoUrl);

//     try {
//       const metadata = await youtubedl.youtubeDl(videoUrl, {
//         dumpSingleJson: true,
//         noCheckCertificates: true,
//         noWarnings: true,
//         preferFreeFormats: true,
//         skipDownload: true,
//         addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
//       });

//       console.log('Metadata obtida:', metadata);

//       // Retorna apenas os dados necessários
//       const videoMetadata: VideoMetadata = {
//         thumbnail: (metadata as any).thumbnail,
//         title: (metadata as any).title,
//         duration: (metadata as any).duration,
//       };

//       return Response.json({ metadata: videoMetadata });
//     } catch (ytError) {
//       console.error('Erro específico do youtube-dl:', ytError);
//       return Response.json({ error: 'Failed to fetch video metadata' }, { status: 500 });
//     }
//   } catch (error) {
//     console.error('Erro geral na rota:', error);
//     return Response.json({ error: 'Error processing metadata' }, { status: 500 });
//   }
// }
