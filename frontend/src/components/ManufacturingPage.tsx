import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle, Play } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import VisitRequestModal from './VisitRequestModal';
import machine1 from '../assets/machine_1.jpeg';
import machine2 from '../assets/machine_2.jpeg';
import machine3 from '../assets/machine_3.jpeg';
import machine4 from '../assets/machine_4.jpeg';
import machine5 from '../assets/machine_5.jpeg';
import machine6 from '../assets/machine_6.jpeg';
import machine7 from '../assets/Machine_7_2.jpeg';
import packagingAndQuality from '../assets/Packaging_and_quality_check.jpeg';

interface Machine {
  id: number;
  name: string;
  description: string;
  image: string;
  advantages: string[];
  badgeLabel?: string;
  imageClass?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function ManufacturingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null);

  const facilityVideoSrc = useMemo(() => {
    const baseUrl = 'https://www.youtube.com/embed/mrDsmg16Lhk';
    const queryParams = [
      'rel=0',
      'modestbranding=1',
      'playsinline=1',
      'enablejsapi=1'
    ];

    if (typeof window !== 'undefined') {
      queryParams.push(`origin=${encodeURIComponent(window.location.origin)}`);
    }

    return `${baseUrl}?${queryParams.join('&')}`;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadYouTubeAPI = () =>
      new Promise<void>((resolve) => {
        if (window.YT?.Player) {
          resolve();
          return;
        }

        const existingScript = document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]'
        );
        if (existingScript) {
          window.onYouTubeIframeAPIReady = () => resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        window.onYouTubeIframeAPIReady = () => resolve();
        document.body.appendChild(script);
      });

    loadYouTubeAPI().then(() => {
      if (!isMounted || !iframeRef.current) return;

      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onStateChange: (event: any) => {
            const { PlayerState } = window.YT;
            if (event.data === PlayerState.PLAYING) {
              setIsVideoPlaying(true);
            } else if (
              event.data === PlayerState.PAUSED ||
              event.data === PlayerState.ENDED
            ) {
              setIsVideoPlaying(false);
            }
          }
        }
      });
    });

    return () => {
      isMounted = false;
      playerRef.current?.destroy?.();
    };
  }, []);

  const handleTogglePlay = () => {
    if (!playerRef.current || !window.YT?.PlayerState) return;

    const playerState = playerRef.current.getPlayerState();
    const { PlayerState } = window.YT;

    if (playerState === PlayerState.PLAYING) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
      setIsVideoPlaying(true);
    }
  };

  const machines: Machine[] = [
    {
      id: 1,
      name: 'Haitian Plastic Molding Machine',
      description: 'Advanced plastic molding with automated material handling and color control.',
      image: machine1,
      advantages: [
        'Automated Material Handling: Auto Loader feeds plastic material seamlessly into the oven for uninterrupted runs.',
        'Continuous Loading: Keeps production moving without manual intervention.',
        'Color Consistency Technology: Automatic color master batch supply for uniform mixing.',
        'No Color Variation: Maintains consistent output quality across every batch.',
        'Higher Efficiency: Reduced manual labor with faster production speed.',
        'Precision and Consistency: Accurate molding results on every cycle.',
        'Automation and Control: Advanced controls keep each run smooth and reliable.'
      ]
    },
    {
      id: 2,
      name: 'Automatic Laser Cutting Machine',
      description: 'High-speed, die-free laser cutting for any steel shape with smooth edges.',
      image: machine2,
      advantages: [
        'Precision and Efficiency: Cuts any steel profile into any shape at speed while keeping edges smooth.',
        'Die-Free Cutting: Eliminates cutting dies to reduce costs and setup time.',
        'Minimal Material Wastage: Maximizes efficiency and reduces scrap.',
        'No Sharp Edge Issues: Delivers safer, smoother product finishing.',
        'Faster and Safer Production: Improves workplace safety and throughput.'
      ]
    },
    {
      id: 3,
      name: 'Automatic Dry Polishing Machine',
      description: 'Pollution-free polishing that protects worker health and delivers consistent finishes.',
      image: machine3,
      advantages: [
        'Pollution-Free Operation: Zero harmful emissions or dust spread during polishing.',
        'Worker Safety: Eliminates dust inhalation risks for operators.',
        'Uniform Finish: Delivers consistent polishing on every article without variation.',
        '360 Degree Coverage: Polishes both inner and outer sides of embossed parts evenly.',
        '50% Reduction in Production Cost: High-speed polishing increases output.',
        'Healthy Workplace: No dust-related health issues for the team.'
      ]
    },
    {
      id: 4,
      name: 'Laser Cutting Machine (Pipe)',
      description: 'Precision pipe and tube cutting without dies or power press setups.',
      image: machine4,
      advantages: [
        'Precision and Efficiency: High-speed cutting for any steel pipe shape with smooth edges.',
        'Flexible Shapes: Handles varied profiles without dedicated dies or power press tooling.',
        'Die-Free Operation: Removes the need for cutting dies to lower costs and setup time.',
        'Minimal Material Wastage: Maximizes efficiency and reduces scrap.',
        'No Sharp Edge Issues: Produces safer, smoother product finishing.',
        'Faster and Safer Production: Speeds output while improving safety.'
      ]
    },
    {
      id: 5,
      name: 'Automatic Assembly Machine',
      description: 'Precision automation that keeps assemblies fast, accurate, and scalable.',
      image: machine5,
      advantages: [
        'Increased Productivity: Automates repetitive tasks for faster, continuous production (12 pieces per minute).',
        'Consistent Quality: Reduces human error for uniform assembly and improved product quality.',
        'Labor Cost Savings: Minimizes manual labor requirements and long-term operational costs.',
        'High Precision: Delivers accurate, reliable assembly even on complex components.',
        'Scalability and Flexibility: Adapts quickly for different products or volumes with quick changeovers.'
      ]
    },
    {
      id: 6,
      name: 'Automatic Pizza Cutter Blade Sharpening Machine',
      description: 'Advanced sharpening technology with controlled feed and consistent grinding.',
      image: machine6,
      advantages: [
        'Advanced Sharpening Technology: Controlled feed and consistent grinding deliver a uniform edge.',
        'Stable Alignment: Rigid clamping and guided tooling keep sharpening repeatable.',
        'Higher Efficiency: Faster sharpening with reduced manual effort and downtime.',
        'Precision and Consistency: Uniform sharpness and edge quality across batches.',
        'Reduced Wastage: Longer blade life with less rejection and safer operation.'
      ]
    },
    {
      id: 7,
      name: 'Pipe Drawing and Bending Machine',
      description: 'Hydraulic forming technology for accurate radii and smooth finishes.',
      image: machine7,
      imageClass: 'max-w-xl mx-auto',
      advantages: [
        'Advanced Forming Technology: Controlled hydraulic power delivers accurate radii and smooth finishes.',
        'Die and Roller Tooling Support: Rigid clamping prevents slippage and maintains bend uniformity.',
        'Higher Efficiency: Faster production with reduced manual effort and labor cost.',
        'Precision and Consistency: Repeatable bends with minimal variation and rework.',
        'Minimal Material Wastage: Less scrap with safer, smoother operation.'
      ]
    },
    {
      id: 8,
      name: 'Packaging and Quality Check',
      description: 'Advanced inspection and packing process to keep every batch consistent and secure.',
      image: packagingAndQuality,
      badgeLabel: 'Packaging & Quality Department',
      advantages: [
        'Advanced Inspection and Packing: Systematic quality checks before packing keep standards consistent.',
        'Clean Handling Workflow: Organized packing with hygiene-focused practices to protect finish and prevent damage.',
        'Higher Efficiency: Faster packing with smooth line flow and fewer delays.',
        'Precision and Consistency: Uniform QC and packaging across every batch.',
        'Reduced Wastage: Lower rejection and return rates through proper inspection and secure packing.'
      ]
    }
  ];


  return (
    <div>
      {/* Hero Section */}
      <section className="relative hero-section bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center hero-content">
          <h1 className="mb-6">Manufacturing Excellence</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Step inside our state-of-the-art facility where precision meets innovation. 
            Our world-class equipment and processes ensure every product meets the highest standards.
          </p>
        </div>
        <div className="hero-floor-fade" aria-hidden="true" />
      </section>

      {/* Facility Video Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="mb-4">Tour Our Facility</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience a virtual tour of our 40,000 sq ft manufacturing facility, 
              equipped with the latest technology and operated by skilled professionals.
            </p>
          </div>
          
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              ref={iframeRef}
              src={facilityVideoSrc}
              title="Facility Overview Video"
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />

            <div
              onClick={handleTogglePlay}
              className={`absolute inset-0 z-10 pointer-events-auto transition ${
                isVideoPlaying ? 'bg-transparent' : 'flex items-center justify-center bg-black/30 backdrop-blur-sm'
              }`}
              aria-label={isVideoPlaying ? 'Pause facility tour video' : 'Play facility tour video'}
            >
              {!isVideoPlaying && (
                <div className="flex flex-col gap-3 items-center pointer-events-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlay();
                    }}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-white/85 text-gray-900 shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                    aria-label="Play facility tour video"
                  >
                    <Play className="w-7 h-7" strokeWidth={1.5} />
                  </button>
                  <a
                    href="https://www.youtube.com/watch?v=mrDsmg16Lhk"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1 text-sm rounded-full bg-white/85 text-gray-900 shadow hover:bg-white transition focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    Watch on YouTube
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Capabilities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From designing to manufacturing, our advanced machinery enables us to produce 
              products of unmatched quality and precision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-4xl mb-4">2500K+</div>
              <h3 className="mb-2">Units Per Year</h3>
              <p className="text-gray-600">Production capacity with room to scale</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-4xl mb-4">40K</div>
              <h3 className="mb-2">Sq Ft Facility</h3>
              <p className="text-gray-600">Modern manufacturing space</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-4xl mb-4">ISO 9001</div>
              <h3 className="mb-2">Certified</h3>
              <p className="text-gray-600">International quality standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Machine Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4">Our Equipment</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each piece of equipment in our facility represents our commitment to 
              manufacturing excellence and technological advancement.
            </p>
          </div>

          <div className="space-y-20">
            {machines.map((machine, index) => (
              <div 
                key={machine.id} 
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full mb-4">
                    {machine.badgeLabel ?? `Machine ${machine.id}`}
                  </div>
                  <h3 className="mb-4">{machine.name}</h3>
                  <p className="text-gray-600 mb-6">{machine.description}</p>
                  
                  <div className="space-y-3">
                    <div className="text-gray-700 mb-3">Key Advantages:</div>
                    {machine.advantages.map((advantage, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{advantage}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <ImageWithFallback 
                      src={machine.image}
                      alt={machine.name}
                      className={`w-full h-auto ${machine.imageClass ?? ''}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Environmental & Safety */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="mb-4">Commitment to Excellence</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">
              Our manufacturing processes prioritize safety, automation, and quality at every step.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl">
              <h3 className="mb-4">Safety First</h3>
              <p className="text-gray-600">
                Zero-accident workplace with comprehensive safety protocols and continuous training programs for all staff.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl">
              <h3 className="mb-4">Automation</h3>
              <p className="text-gray-600">
                Smart manufacturing with automated workflows, precision machinery, and real-time monitoring to improve speed, reduce errors, and ensure consistent output across every batch.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl">
              <h3 className="mb-4">Quality Assurance</h3>
              <p className="text-gray-600">
                Multi-stage inspection process ensuring every product meets or exceeds industry standards and customer expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="mb-4">Interested in a Facility Tour?</h2>
          <p className="text-xl text-gray-600 mb-8">
            We welcome potential partners and customers to visit our facility. 
            Contact us to schedule a personalized tour.
          </p>
          <button
            type="button"
            onClick={() => setIsVisitModalOpen(true)}
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Schedule a Visit
          </button>
        </div>
      </section>

      <VisitRequestModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
      />
    </div>
  );
}
