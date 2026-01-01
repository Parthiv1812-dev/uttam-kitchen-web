import { useEffect, useMemo, useRef, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Award, Factory, Store, TrendingUp, ShieldCheck, Lightbulb, Play } from 'lucide-react';
import aboutLogo from '../assets/about_logo.svg';
import ourStoryImage from '../assets/our_story_image.jpeg';
import ourTeamImage from '../assets/our_team_image.jpeg';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function AboutPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null);

  const stats = [
    { icon: Award, label: 'Years of Excellence', value: '30+' },
    { icon: Factory, label: 'Major OEM Supplier', value: 'OEM' },
    { icon: Store, label: 'Modern Trade, Online & Quick Commerce Supplier', value: 'MT+' },
    { icon: TrendingUp, label: 'Annual production capacity', value: '2M+' },
  ];

  const commitmentVideoSrc = useMemo(() => {
    const baseUrl = 'https://www.youtube.com/embed/mrDsmg16Lhk';
    const queryParams = ['rel=0', 'modestbranding=1', 'playsinline=1', 'enablejsapi=1'];

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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative hero-section bg-black text-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center hero-content">
          <img
            src={aboutLogo}
            alt="About Uttam Kitchenware"
            className="mx-auto mb-6"
            style={{ width: 'clamp(6.5rem, 13vw, 10rem)' }}
          />
          <p className="text-xl text-gray-400">
            Innovating everyday essentials for over 30 years.
            Our commitment to quality and innovation drives everything we do.
          </p>
        </div>
        <div className="hero-floor-fade" aria-hidden="true" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-blue-600" />
                <div className="text-3xl md:text-4xl mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 uppercase tracking-widest text-xs mb-3">Who We Are</p>
            <h2 className="text-3xl font-semibold">Our Mission & Vision</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
              The principles that guide Ganesh Enterprise - Uttam Kitchenware and shape the way we serve homes,
              hotels, and professional kitchens around the world.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl shadow-lg bg-gradient-to-br from-gray-50 to-white border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                At Ganesh Enterprise - Uttam Kitchenware, our mission is to innovate, design, and deliver
                high-quality, durable, and affordable kitchenware that simplifies cooking and enhances everyday
                living. We are committed to maintaining excellence in craftsmanship, ensuring safety and hygiene,
                and building lasting trust with our customers through consistent quality and reliable service.
              </p>
            </div>
            <div className="p-8 rounded-2xl shadow-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                Our vision is to become a leading household name in kitchenware, known globally for our functional
                designs, Indian innovation, and value-driven products. We aim to empower every kitchen - from homes
                to hotels - with tools that bring ease, joy, and efficiency to cooking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="mb-6 text-3xl font-semibold">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 1994, Uttam Kitchenware started with a clear purpose: to manufacture everyday
                kitchen tools that professionals can rely on for consistent performance and long-lasting durability.
              </p>
              <p className="text-gray-600 mb-4">
                From a focused workshop to a modern manufacturing setup, we have continuously strengthened our
                capabilities through in-house engineering, precision tooling, and rigorous quality checks at
                every stage. Each product reflects our commitment to quality, innovation, and dependable execution.
              </p>
              <p className="text-gray-600">
                Today, Uttam is a trusted OEM manufacturing partner and a key supplier across modern
                trade, online marketplaces, and quick-commerce channels, serving customers with reliable products and
                consistent supply.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback 
                src={ourStoryImage}
                alt="Uttam location and story"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Team Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback 
                src={ourTeamImage}
                alt="Our team"
                className="w-full h-auto"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="mb-6 text-3xl font-semibold">Our Team</h2>
              <p className="text-gray-600 mb-4">
                Behind every product is a team of dedicated engineers, craftsmen, and quality 
                control specialists who take pride in their work. Our employees bring 
                decades of combined experience in kitchenware manufacturing.
              </p>
              <p className="text-gray-600 mb-4">
                We invest heavily in training, research and development, ensuring our team and machinary stays at 
                the forefront of manufacturing technology and techniques. This expertise 
                translates directly into the superior quality of our products.
              </p>
              <p className="text-gray-600">
                From designing to manufacturing, every step is handled by professionals who 
                understand the importance of quality in kitchen tools and houseware products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center mb-6">See Our Commitment</h2>
          <p className="text-center text-gray-600 mb-12">
            Watch how we bring precision to every product
          </p>
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              ref={iframeRef}
              src={commitmentVideoSrc}
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

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center mb-12 text-3xl font-semibold">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center p-8">
              <h3 className="mb-4 flex items-center justify-center gap-2 text-2xl font-semibold">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Quality First
              </h3>
              <p className="text-gray-600">
                Every tool undergoes rigorous testing and quality control before reaching our customers.
              </p>
            </div>
            <div className="text-center p-8">
              <h3 className="mb-4 flex items-center justify-center gap-2 text-2xl font-semibold">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                Innovation
              </h3>
              <p className="text-gray-600">
                We continuously invest in R&D to bring cutting-edge solutions to our customers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
