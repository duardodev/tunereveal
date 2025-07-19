import { LinkIcon, Play, BarChart3, Eye, ArrowUp } from 'lucide-react';
import { Step } from './step';
import { Button } from './ui/button';
import Link from 'next/link';

export function HowItWorks() {
  const steps = [
    {
      icon: <LinkIcon className="w-8 h-8 text-primary" />,
      title: 'Paste YouTube Link',
      description: 'Simply paste any YouTube music video URL into our analyzer.',
      number: '1',
    },
    {
      icon: <Play className="w-8 h-8 text-primary" />,
      title: 'Audio Processing',
      description: 'Our system extracts and processes the audio directly from the video.',
      number: '2',
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: 'Musical Analysis',
      description: 'Advanced algorithms detect BPM, key, loudness and more.',
      number: '3',
    },
    {
      icon: <Eye className="w-8 h-8 text-primary" />,
      title: 'View Results',
      description: 'Get comprehensive musical data displayed in a clean, organized format.',
      number: '4',
    },
  ];

  return (
    <section id="how-it-works" className="w-full pb-14 pt-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient">How It Works</h2>
            <p className="text-lg text-foreground/80 max-w-2xl leading-relaxed">
              Analyze any YouTube music video in seconds. Get professional-grade musical insights with just a link.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
            {steps.map((step, index) => (
              <Step
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                number={step.number}
              />
            ))}
          </div>

          <Button
            asChild
            className="bg-primary hover:bg-primary/90 cursor-pointer text-primary-foreground p-5 rounded-lg flex items-center gap-3 mx-auto font-medium transition-colors"
          >
            <Link href="#hero">
              Start Analyzing <ArrowUp className="w-[18px] h-[18px]" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
