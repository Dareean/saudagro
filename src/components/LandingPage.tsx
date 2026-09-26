import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Sprout, 
  Wheat, 
  Egg, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Truck, 
  FileCheck2, 
  Scale, 
  Droplets, 
  Users, 
  LogIn, 
  HelpCircle,
  Calculator,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  ArrowUpRight,
  ArrowUp
} from 'lucide-react';
import { AuthModal } from './AuthModal';
import { TermsModal } from './TermsModal';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onOpenAssistedRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAssistedRegister }) => {
  const { loginAs, openProductDetail } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Interactive Calculator State
  const [calcType, setCalcType] = useState<'corn' | 'eggs'>('corn');
  const [cornVolume, setCornVolume] = useState<number>(2500); // in Kg
  const [eggVolume, setEggVolume] = useState<number>(100); // in Rak (30 butir)

  // Interactive Workflow Tab
  const [activeWorkflow, setActiveWorkflow] = useState<'flowA' | 'flowB'>('flowA');

  // Scroll State
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [activeNavSection, setActiveNavSection] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll listener for progress bar, back-to-top button, and active nav highlight
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100)));
      }

      setShowBackToTop(currentScroll > 380);

      // Active section detection
      const sections = ['pasar', 'kalkulator', 'alur', 'keunggulan', 'testimoni'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveNavSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP ScrollTrigger Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Entrance Timeline
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      heroTl.from('.hero-title', {
        opacity: 0,
        y: 28,
        duration: 0.7,
      })
      .from('.hero-desc', {
        opacity: 0,
        y: 18,
        duration: 0.55,
      }, '-=0.4')
      .from('.hero-cta-btn', {
        opacity: 0,
        y: 16,
        stagger: 0.1,
        duration: 0.5,
      }, '-=0.3')
      .from('.hero-trust-item', {
        opacity: 0,
        y: 12,
        stagger: 0.08,
        duration: 0.4,
      }, '-=0.25')
      .from('.hero-visual-card', {
        opacity: 0,
        scale: 0.95,
        y: 25,
        duration: 0.75,
        ease: 'back.out(1.1)'
      }, '-=0.5')
      .from('.hero-showcase-card', {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'back.out(1.15)'
      }, '-=0.35')
      .from('.hero-stat-card', {
        opacity: 0,
        y: 20,
        stagger: 0.09,
        duration: 0.45,
      }, '-=0.3');

      // 2. Parallax effect on Hero Visual Card during scroll
      gsap.to('.hero-visual-card', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.ambient-glow-wrapper',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      });

      // 3. Pasar Komoditas Section (#pasar)
      gsap.from('.market-header', {
        scrollTrigger: {
          trigger: '#pasar',
          start: 'top 85%',
        },
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: 'power2.out'
      });

      gsap.from('.ticker-card', {
        scrollTrigger: {
          trigger: '#pasar',
          start: 'top 80%',
        },
        opacity: 0,
        y: 35,
        scale: 0.96,
        stagger: 0.12,
        duration: 0.65,
        ease: 'back.out(1.2)'
      });

      // 4. Kalkulator Section (#kalkulator)
      gsap.from('.calc-header', {
        scrollTrigger: {
          trigger: '#kalkulator',
          start: 'top 85%',
        },
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: 'power2.out'
      });

      gsap.from('.calc-card-main', {
        scrollTrigger: {
          trigger: '#kalkulator',
          start: 'top 80%',
        },
        opacity: 0,
        y: 35,
        scale: 0.97,
        duration: 0.7,
        ease: 'power2.out'
      });

      // 5. Alur Rantai Pasok Section (#alur)
      gsap.from('.flow-header', {
        scrollTrigger: {
          trigger: '#alur',
          start: 'top 85%',
        },
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: 'power2.out'
      });

      gsap.from('.flow-step-item', {
        scrollTrigger: {
          trigger: '#alur',
          start: 'top 75%',
        },
        opacity: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.55,
        ease: 'back.out(1.1)'
      });

      // 6. Keunggulan Platform Section (#keunggulan)
      gsap.from('.keunggulan-header', {
        scrollTrigger: {
          trigger: '#keunggulan',
          start: 'top 85%',
        },
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: 'power2.out'
      });

      gsap.from('.advantage-card', {
        scrollTrigger: {
          trigger: '#keunggulan',
          start: 'top 80%',
        },
        opacity: 0,
        y: 35,
        scale: 0.94,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(1.15)'
      });

      // 7. Testimoni Section (#testimoni)
      gsap.from('.testimoni-header', {
        scrollTrigger: {
          trigger: '#testimoni',
          start: 'top 85%',
        },
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: 'power2.out'
      });

      gsap.from('.testimoni-card', {
        scrollTrigger: {
          trigger: '#testimoni',
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.65,
        ease: 'power2.out'
      });

      // 8. CTA Akhir Section (.cta-banner-section)
      gsap.from('.cta-banner-card', {
        scrollTrigger: {
          trigger: '.cta-banner-section',
          start: 'top 85%',
        },
        opacity: 0,
        scale: 0.95,
        y: 30,
        duration: 0.7,
        ease: 'power2.out'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Quick animate workflow steps when tab switches
  useEffect(() => {
    gsap.fromTo('.flow-step-item', 
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out' }
    );
  }, [activeWorkflow]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const openLogin = () => {
    setAuthInitialMode('login');
    setShowAuthModal(true);
  };

  const openRegister = () => {
    setAuthInitialMode('register');
    setShowAuthModal(true);
  };

  // Calculator computations
  // Corn: Tengkulak buys at ~Rp 4.400/kg, Saudagro fair price Rp 5.200/kg. Platform fee 3%.
  const cornMiddlemanPrice = 4400;
  const cornSaudagroPrice = 5200;
  const cornSaudagroGross = cornVolume * cornSaudagroPrice;
  const cornMiddlemanGross = cornVolume * cornMiddlemanPrice;
  const cornExtraEarnings = cornSaudagroGross - cornMiddlemanGross;
  const cornFee = Math.round(cornSaudagroGross * 0.03);
  const cornNetToFarmer = cornSaudagroGross - cornFee;

  // Eggs: Traditional volatile market price ~Rp 55.000/rak, Saudagro B2B locked contract Rp 51.000/rak.
  const eggMarketPrice = 55000;
  const eggSaudagroPrice = 51000;
  const eggSaudagroTotal = eggVolume * eggSaudagroPrice;
  const eggMarketTotal = eggVolume * eggMarketPrice;
  const eggSavings = eggMarketTotal - eggSaudagroTotal;
  const eggFee = Math.round(eggSaudagroTotal * 0.05);

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--slate-800)' }}>
      {/* Scroll Progress Bar at very top */}
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Landing Navbar */}
      <header style={{ 
        background: 'rgba(255, 255, 255, 0.92)', 
        backdropFilter: 'blur(16px)', 
        WebkitBackdropFilter: 'blur(16px)', 
        borderBottom: '1px solid var(--border-subtle)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
      }}>
        <div className="main-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', minHeight: '66px' }}>
          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div className="brand-icon-box" style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'white', border: '1px solid var(--border-subtle)', padding: '3px', boxShadow: '0 1px 4px rgba(15, 23, 42, 0.05)' }}>
              <img 
                src="/logo/saudagro-icon.png" 
                alt="Saudagro" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
            <div>
              <div className="brand-title" style={{ fontSize: '1.22rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Saudagro
                <span className="brand-badge" style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '2px 6px', borderRadius: '5px', fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                  SULTENG
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links (Pill Capsule with Scroll Spy & Smooth Scroll) */}
          <nav className="desktop-links">
            <a 
              href="#pasar" 
              onClick={(e) => scrollToSection(e, 'pasar')} 
              className={`desktop-link-item ${activeNavSection === 'pasar' ? 'active-nav' : ''}`}
            >
              Pasar Komoditas
            </a>
            <a 
              href="#kalkulator" 
              onClick={(e) => scrollToSection(e, 'kalkulator')} 
              className={`desktop-link-item ${activeNavSection === 'kalkulator' ? 'active-nav' : ''}`}
            >
              Simulasi Penghematan
            </a>
            <a 
              href="#alur" 
              onClick={(e) => scrollToSection(e, 'alur')} 
              className={`desktop-link-item ${activeNavSection === 'alur' ? 'active-nav' : ''}`}
            >
              Alur Rantai Pasok
            </a>
            <a 
              href="#keunggulan" 
              onClick={(e) => scrollToSection(e, 'keunggulan')} 
              className={`desktop-link-item ${activeNavSection === 'keunggulan' ? 'active-nav' : ''}`}
            >
              Keunggulan
            </a>
            <a 
              href="#testimoni" 
              onClick={(e) => scrollToSection(e, 'testimoni')} 
              className={`desktop-link-item ${activeNavSection === 'testimoni' ? 'active-nav' : ''}`}
            >
              Kisah Mitra
            </a>
          </nav>

          {/* Right Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="btn btn-sm btn-outline"
              onClick={onOpenAssistedRegister}
              title="Pendaftaran dibantu petugas lapangan"
              style={{ background: 'white', borderRadius: 'var(--radius-full)', padding: '7px 14px', fontSize: '0.82rem', fontWeight: 600, borderColor: 'var(--border-subtle)' }}
            >
              <HelpCircle size={15} style={{ color: 'var(--primary-600)' }} />
              <span>Bantuan Agen</span>
            </button>
            <button 
              className="btn btn-sm btn-primary"
              onClick={openRegister}
              style={{ fontWeight: 700, borderRadius: 'var(--radius-full)', padding: '8px 18px', fontSize: '0.84rem' }}
            >
              <span>Daftar Gratis</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Ambient Glow & Professional Split Layout */}
      <section className="ambient-glow-wrapper" style={{ padding: '56px 0 48px 0', borderBottom: '1px solid var(--border-subtle)', background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)' }}>
        <div className="main-wrapper" style={{ maxWidth: '1240px', position: 'relative', zIndex: 1 }}>
          <div className="hero-split-grid">
            {/* Left Column: Value Proposition & CTAs */}
            <div style={{ textAlign: 'left' }}>

              <h1 className="hero-title" style={{ 
                fontSize: 'clamp(2.1rem, 3.8vw, 3.1rem)', 
                fontWeight: 800, 
                color: 'var(--slate-900)', 
                lineHeight: 1.18, 
                letterSpacing: '-0.035em', 
                marginBottom: '16px' 
              }}>
                Rantai Pasok Agribisnis Sulteng <br />
                <span className="gradient-text-emerald">Terintegrasi Langsung</span>, <br />
                Tanpa Tengkulak
              </h1>

              <p className="hero-desc" style={{ 
                fontSize: '1.05rem', 
                color: 'var(--slate-600)', 
                lineHeight: 1.65, 
                marginBottom: '26px',
                maxWidth: '560px'
              }}>
                Menghubungkan langsung <strong>Petani Jagung Pipil</strong> (Sigi & Donggala) &rarr; <strong>Peternak Ayam Petelur</strong> &rarr; <strong>UMKM Bakery/Kuliner</strong> (Palu) dengan kepastian harga panen adil, uji kadar air terstandarisasi, dan kontrak pasokan bergaransi.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
                <button 
                  className="btn btn-primary hero-cta-btn" 
                  style={{ padding: '13px 26px', fontSize: '0.96rem', fontWeight: 700, borderRadius: 'var(--radius-lg)' }}
                  onClick={openRegister}
                >
                  Mulai Transaksi Sekarang <ArrowRight size={17} />
                </button>
                <button 
                  className="btn btn-secondary hero-cta-btn" 
                  style={{ padding: '13px 20px', fontSize: '0.96rem', fontWeight: 700, borderRadius: 'var(--radius-lg)', background: 'white', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}
                  onClick={openLogin}
                >
                  <LogIn size={17} style={{ color: 'var(--primary-600)' }} />
                  Masuk ke Akun Mitra
                </button>
              </div>

              {/* Regional Trust Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--slate-500)', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <span className="hero-trust-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} style={{ color: 'var(--primary-600)' }} /> 
                  Wilayah Palu, Sigi, Donggala
                </span>
                <span className="hero-trust-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Scale size={15} style={{ color: 'var(--primary-600)' }} /> 
                  Komisi Transparan (3% &bull; 5%)
                </span>
                <span className="hero-trust-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={15} style={{ color: 'var(--primary-600)' }} /> 
                  Logistik Pick-up Langsung
                </span>
              </div>
            </div>

            {/* Right Column: Visual Concept & Floating Badges */}
            <div className="hero-visual-card">
              <img 
                src="/images/hero-agriculture.jpg" 
                alt="Ekosistem Agribisnis Sulawesi Tengah Saudagro" 
                className="hero-visual-img"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6, 78, 59, 0.45) 0%, rgba(6, 78, 59, 0.05) 50%, transparent 100%)', pointerEvents: 'none' }} />

              {/* Floating Badge 2 (Bottom Right) */}
              <div className="glass-panel float-animation" style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.22)',
                background: 'rgba(255, 255, 255, 0.94)',
                maxWidth: '230px',
                animationDelay: '1.5s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck size={14} />
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--slate-900)' }}>Armada Palu & Sigi</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--slate-600)', lineHeight: 1.35 }}>
                  Pick-up langsung gudang tani &bull; Hemat biaya logistik calo
                </div>
              </div>

              {/* Floating Badge 3 (Bottom Left) */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(6, 78, 59, 0.9)',
                color: 'white',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                <ShieldCheck size={14} style={{ color: '#34D399' }} />
                <span>Garansi Mutu & Akad Sah 100%</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase: Live Transaction Card (Interactive Feature Highlight) */}
          <div className="hero-showcase-card glass-panel" style={{ 
            borderRadius: 'var(--radius-2xl)', 
            padding: '26px', 
            marginTop: '30px', 
            border: '1px solid rgba(16, 185, 129, 0.25)', 
            boxShadow: '0 20px 40px -10px rgba(5, 150, 105, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="live-dot" />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary-800)' }}>
                  Sorotan Transaksi Langsung (Live Matched Trade)
                </span>
                <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>Order #SAU-2026-0924</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                <Clock size={13} /> Baru saja dicocokkan • Rute Sigi &rarr; Palu
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px', alignItems: 'center' }}>
              {/* Seller */}
              <div style={{ background: 'white', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid #FEF3C7', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wheat size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>Penjual Jagung</div>
                    <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--slate-900)' }}>Pak Jufri Latandu</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} style={{ color: 'var(--amber-600)' }} /> Desa Lolu, Sigi Biromaru
                </div>
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #E2E8F0', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--slate-600)' }}>Volume Panen:</span>
                  <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>2.500 Kg Pipil Kering</span>
                </div>
              </div>

              {/* Transit & Quality Match Connector */}
              <div style={{ textAlign: 'center', padding: '10px 6px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-50)', border: '1px solid #A7F3D0', padding: '6px 14px', borderRadius: 'var(--radius-full)', marginBottom: '8px' }}>
                  <Truck size={15} style={{ color: 'var(--primary-600)' }} />
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--primary-800)' }}>Armada Pick-up Terjadwal</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', margin: '4px 0' }}>
                  Hasil Lab KA: <strong style={{ color: 'var(--primary-700)' }}>13.4% (Standar Pakan Unggul)</strong>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)', letterSpacing: '-0.02em' }}>
                  Rp 5.200 <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--slate-500)' }}>/Kg</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                  Petani dapat <strong>+Rp 800/kg</strong> dibanding harga tengkulak
                </div>
              </div>

              {/* Buyer */}
              <div style={{ background: 'white', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid #D1FAE5', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Egg size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>Pembeli Pakan</div>
                    <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--slate-900)' }}>Peternakan Berkah (Bu Rahma)</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} style={{ color: 'var(--primary-600)' }} /> Balaroa, Kota Palu
                </div>
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #E2E8F0', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--slate-600)' }}>Efisiensi Pakan:</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>Hemat Rp 600/kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Impact Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '24px' }}>
            <div className="hero-stat-card card" style={{ padding: '16px', border: '1px solid var(--border-subtle)', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--amber-600)', marginBottom: '4px' }}>
                <Wheat size={18} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Volume Jagung</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>38.5 Ton</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Terserap dari petani Sigi & Donggala</div>
            </div>

            <div className="hero-stat-card card" style={{ padding: '16px', border: '1px solid var(--border-subtle)', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-600)', marginBottom: '4px' }}>
                <Egg size={18} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Distribusi Telur</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>142.000+ Butir</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Dipasok rutin ke UMKM kuliner Palu</div>
            </div>

            <div className="hero-stat-card card" style={{ padding: '16px', border: '1px solid var(--border-subtle)', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563EB', marginBottom: '4px' }}>
                <Scale size={18} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Potongan Calo</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)' }}>0% Calo</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Hanya komisi platform 3% - 5% sah</div>
            </div>

            <div className="hero-stat-card card" style={{ padding: '16px', border: '1px solid var(--border-subtle)', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-700)', marginBottom: '4px' }}>
                <FileCheck2 size={18} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Kepastian Akad</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>100% Kontrak</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Garansi ganti telur retak dalam 24 jam</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Price Snapshot */}
      <section id="pasar" style={{ padding: '48px 0', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="main-wrapper">
          <div className="market-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                <TrendingUp size={22} style={{ color: 'var(--primary-600)' }} />
                Katalog Harga Komoditas Riil Hari Ini di Sulawesi Tengah
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                Data diperbarui berkala sesuai timbang riil petani & peternak • Zona WITA
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                🟢 Stok Siap Angkut Hari Ini
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            {/* Card 1: Jagung Pipil */}
            <div 
              className="card ticker-card scroll-card-reveal" 
              style={{ padding: '20px', background: 'white', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
              onClick={() => {
                loginAs('bu_rahma');
                openProductDetail('corn', 'crn_001');
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wheat size={16} style={{ color: 'var(--amber-600)' }} /> Jagung Pipil Kering Sigi
                </span>
                <span className="badge badge-success">KA &le; 14%</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)', letterSpacing: '-0.02em', margin: '4px 0' }}>
                Rp 5.200 <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--slate-500)' }}>/Kg</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '12px' }}>
                Desa Lolu, Sigi Biromaru • Stok 2.000 Kg • Uji Lab Sigi
              </div>
              <div style={{ background: '#ECFDF5', padding: '7px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.74rem', color: '#065F46', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> Lebih murah Rp 600/kg dibanding tengkulak
              </div>
              <button 
                className="btn btn-sm btn-harvest btn-full"
                onClick={(e) => {
                  e.stopPropagation();
                  loginAs('bu_rahma');
                  openProductDetail('corn', 'crn_001');
                }}
              >
                Lihat Spesifikasi & Pesan <ArrowRight size={14} />
              </button>
            </div>

            {/* Card 2: Telur Grade A Palu */}
            <div 
              className="card ticker-card scroll-card-reveal" 
              style={{ padding: '20px', background: 'white', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
              onClick={() => {
                loginAs('kak_dilla');
                openProductDetail('egg', 'egg_001');
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Egg size={16} style={{ color: 'var(--primary-600)' }} /> Telur Ayam Ras Balaroa
                </span>
                <span className="badge badge-success">Grade A (60-65g)</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)', letterSpacing: '-0.02em', margin: '4px 0' }}>
                Rp 52.000 <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--slate-500)' }}>/Rak (30 butir)</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '12px' }}>
                Peternakan Berkah, Balaroa • Kapasitas 150 Rak/hari
              </div>
              <div style={{ background: '#EFF6FF', padding: '7px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.74rem', color: '#1E40AF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Garansi retur ganti telur retak 24 jam
              </div>
              <button 
                className="btn btn-sm btn-primary btn-full"
                onClick={(e) => {
                  e.stopPropagation();
                  loginAs('kak_dilla');
                  openProductDetail('egg', 'egg_001');
                }}
              >
                Lihat Detail & Kontrak B2B <ArrowRight size={14} />
              </button>
            </div>

            {/* Card 3: Telur Segar Kiloan */}
            <div 
              className="card ticker-card scroll-card-reveal" 
              style={{ padding: '20px', background: 'white', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
              onClick={() => {
                loginAs('kak_dilla');
                openProductDetail('egg', 'egg_002');
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Egg size={16} style={{ color: '#2563eb' }} /> Telur Timbang Curah Sigi
                </span>
                <span className="badge badge-info">Per Kilogram</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)', letterSpacing: '-0.02em', margin: '4px 0' }}>
                Rp 28.500 <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--slate-500)' }}>/Kg</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '12px' }}>
                Peternakan Surya Sigi • Standar Hotel & Katering Palu
              </div>
              <div style={{ background: '#FFFBEB', padding: '7px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.74rem', color: '#92400E', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileCheck2 size={14} /> Akad pasokan fleksibel harian / mingguan
              </div>
              <button 
                className="btn btn-sm btn-secondary btn-full"
                onClick={(e) => {
                  e.stopPropagation();
                  loginAs('kak_dilla');
                  openProductDetail('egg', 'egg_002');
                }}
                style={{ background: 'var(--slate-50)' }}
              >
                Lihat Detail Komoditas <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Savings & Profit Calculator Section */}
      <section id="kalkulator" style={{ padding: '68px 0', background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="main-wrapper" style={{ maxWidth: '960px' }}>
          <div className="calc-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--amber-50)', border: '1px solid var(--amber-100)', color: 'var(--amber-700)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '12px' }}>
              <Calculator size={14} /> Simulasi Dampak Finansial Riil
            </div>
            <h2 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.025em' }}>
              Berapa Keuntungan & Penghematan yang Anda Dapatkan?
            </h2>
            <p style={{ fontSize: '0.94rem', color: 'var(--slate-600)', marginTop: '6px', maxWidth: '640px', margin: '6px auto 0 auto' }}>
              Geser nilai volume panen atau kebutuhan pasokan di bawah ini untuk melihat perbandingan riil bertransaksi via Saudagro dibanding tengkulak tradisional.
            </p>
          </div>

          {/* Calculator Container */}
          <div className="card calc-card-main" style={{ padding: '28px', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--slate-200)' }}>
            {/* Commodity Selector Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', background: 'var(--slate-100)', padding: '5px', borderRadius: 'var(--radius-md)' }}>
              <button 
                onClick={() => setCalcType('corn')}
                style={{ 
                  flex: 1, 
                  padding: '10px 14px', 
                  borderRadius: 'var(--radius-sm)', 
                  border: 'none', 
                  fontWeight: 700, 
                  fontSize: '0.86rem', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: calcType === 'corn' ? 'white' : 'transparent',
                  color: calcType === 'corn' ? 'var(--amber-700)' : 'var(--slate-600)',
                  boxShadow: calcType === 'corn' ? 'var(--shadow-xs)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <Wheat size={16} /> 1. Komoditas Jagung Pipil (Petani &rarr; Peternak)
              </button>
              <button 
                onClick={() => setCalcType('eggs')}
                style={{ 
                  flex: 1, 
                  padding: '10px 14px', 
                  borderRadius: 'var(--radius-sm)', 
                  border: 'none', 
                  fontWeight: 700, 
                  fontSize: '0.86rem', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: calcType === 'eggs' ? 'white' : 'transparent',
                  color: calcType === 'eggs' ? 'var(--primary-700)' : 'var(--slate-600)',
                  boxShadow: calcType === 'eggs' ? 'var(--shadow-xs)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <Egg size={16} /> 2. Pasokan Telur Rutin (Peternak &rarr; UMKM Bakery)
              </button>
            </div>

            {calcType === 'corn' ? (
              <div>
                {/* Corn Slider */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                      Volume Jagung Pipil Kering yang Ditransaksikan:
                    </label>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--amber-700)' }}>
                      {cornVolume.toLocaleString('id-ID')} Kg <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--slate-500)' }}>({(cornVolume / 1000).toFixed(1)} Ton)</span>
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min={500} 
                    max={10000} 
                    step={250} 
                    value={cornVolume} 
                    onChange={(e) => setCornVolume(Number(e.target.value))}
                    className="interactive-slider amber"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: '4px' }}>
                    <span>500 Kg (Skala Petani Mandiri)</span>
                    <span>5.000 Kg</span>
                    <span>10.000 Kg (Kelompok Tani Gabungan)</span>
                  </div>
                </div>

                {/* Comparative Output Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'var(--slate-50)', padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Lewat Tengkulak Tradisional
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '8px' }}>
                      Harga ditekan rendah: ~Rp 4.400 /Kg
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-700)' }}>
                      Rp {cornMiddlemanGross.toLocaleString('id-ID')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--danger-600)', marginTop: '6px' }}>
                      &times; Potongan tengkulak besar & pembayaran sering tertunda
                    </div>
                  </div>

                  <div style={{ background: 'white', padding: '18px', borderRadius: 'var(--radius-lg)', border: '2px solid #F59E0B', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--amber-700)', textTransform: 'uppercase' }}>
                        Lewat Saudagro Platform
                      </div>
                      <span className="badge badge-warning">Adil & Transparan</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '4px 0 8px 0' }}>
                      Harga pasar adil: Rp 5.200 /Kg (Komisi 3%)
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--amber-700)' }}>
                      Rp {cornNetToFarmer.toLocaleString('id-ID')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                      Biaya platform 3%: Rp {cornFee.toLocaleString('id-ID')} (Sudah termasuk uji lab KA)
                    </div>
                  </div>

                  <div style={{ background: '#ECFDF5', padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid #A7F3D0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Tambahan Penghasilan Petani
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#047857' }}>
                      +Rp {(cornNetToFarmer - cornMiddlemanGross).toLocaleString('id-ID')}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#065F46', marginTop: '6px', lineHeight: 1.4 }}>
                      Uang ekstra langsung masuk ke kantong petani jagung tanpa dipotong calo keliling!
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Eggs Slider */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                      Kebutuhan Pasokan Telur Berkala (Rak / Minggu):
                    </label>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                      {eggVolume.toLocaleString('id-ID')} Rak <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--slate-500)' }}>({(eggVolume * 30).toLocaleString('id-ID')} Butir)</span>
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min={20} 
                    max={500} 
                    step={10} 
                    value={eggVolume} 
                    onChange={(e) => setEggVolume(Number(e.target.value))}
                    className="interactive-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: '4px' }}>
                    <span>20 Rak (Kafe / Katering Rumahan)</span>
                    <span>250 Rak</span>
                    <span>500 Rak (Pabrik Roti / Bakery Skala Menengah)</span>
                  </div>
                </div>

                {/* Comparative Output Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'var(--slate-50)', padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Beli di Pasar Tradisional
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '8px' }}>
                      Harga fluktuatif: ~Rp 55.000 /Rak
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-700)' }}>
                      Rp {eggMarketTotal.toLocaleString('id-ID')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--danger-600)', marginTop: '6px' }}>
                      &times; Risiko harga melonjak saat hari raya & tanpa garansi retak
                    </div>
                  </div>

                  <div style={{ background: 'white', padding: '18px', borderRadius: 'var(--radius-lg)', border: '2px solid var(--primary-600)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-700)', textTransform: 'uppercase' }}>
                        Kontrak Terkunci Saudagro
                      </div>
                      <span className="badge badge-success">Garansi Pasokan</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '4px 0 8px 0' }}>
                      Harga stabil terkunci: Rp 51.000 /Rak
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                      Rp {eggSaudagroTotal.toLocaleString('id-ID')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                      Termasuk komisi platform 5% & garansi penggantian retak 24 jam
                    </div>
                  </div>

                  <div style={{ background: '#EFF6FF', padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid #BFDBFE' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Penghematan Biaya Bahan Baku UMKM
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563EB' }}>
                      Hemat Rp {eggSavings.toLocaleString('id-ID')}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#1E40AF', marginTop: '6px', lineHeight: 1.4 }}>
                      UMKM bakery bisa merencanakan HPP kue lebih akurat tanpa pusing fluktuasi pasar!
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dual Value Stream Workflow Section */}
      <section id="alur" style={{ padding: '68px 0', borderBottom: '1px solid var(--border-subtle)', background: 'white' }}>
        <div className="main-wrapper">
          <div className="flow-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px auto' }}>
            <h2 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
              Dua Alur Perdagangan Terintegrasi
            </h2>
            <p style={{ fontSize: '0.94rem', color: 'var(--slate-500)', marginTop: '6px' }}>
              Memutus rantai perantara berbelit dengan standardisasi uji mutu, keterbukaan harga, dan armada lokal.
            </p>

            {/* Workflow Mode Tabs */}
            <div style={{ display: 'inline-flex', gap: '8px', marginTop: '20px', background: 'var(--slate-100)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
              <button 
                onClick={() => setActiveWorkflow('flowA')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeWorkflow === 'flowA' ? 'white' : 'transparent',
                  color: activeWorkflow === 'flowA' ? 'var(--amber-700)' : 'var(--slate-600)',
                  boxShadow: activeWorkflow === 'flowA' ? 'var(--shadow-xs)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                🌾 Alur A: Petani Jagung &rarr; Peternak Ayam
              </button>
              <button 
                onClick={() => setActiveWorkflow('flowB')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeWorkflow === 'flowB' ? 'white' : 'transparent',
                  color: activeWorkflow === 'flowB' ? 'var(--primary-700)' : 'var(--slate-600)',
                  boxShadow: activeWorkflow === 'flowB' ? 'var(--shadow-xs)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                🥚 Alur B: Peternak Ayam &rarr; UMKM Bakery
              </button>
            </div>
          </div>

          {activeWorkflow === 'flowA' ? (
            /* Flow A Card */
            <div className="card" style={{ padding: '32px', borderTop: '5px solid var(--amber-600)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wheat size={26} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--amber-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Alur Rantai Pasok A</span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)' }}>Petani Jagung Pipil (Sigi) &rarr; Peternak Ayam Petelur (Palu)</h3>
                  </div>
                </div>
                <span className="badge badge-warning" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  Komisi Platform 3% Terbuka
                </span>
              </div>

              {/* 4 Step Process Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                <div className="flow-step-item" style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--amber-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', marginBottom: '10px' }}>1</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--slate-900)', marginBottom: '4px' }}>Panen & Uji Kadar Air (KA)</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>Petani mencatat stok panen. Tim lapangan memverifikasi kadar air &le; 14% aman jamur.</div>
                </div>

                <div className="flow-step-item" style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--amber-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', marginBottom: '10px' }}>2</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--slate-900)', marginBottom: '4px' }}>Matchmaking & Nego Langsung</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>Peternak ayam mencari jagung terdekat, menawar atau menerima harga pasar tanpa calo.</div>
                </div>

                <div className="flow-step-item" style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--amber-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', marginBottom: '10px' }}>3</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--slate-900)', marginBottom: '4px' }}>Armada Angkut Lokal Sigi</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>Pick-up menjemput langsung ke gudang tani, efisien memangkas ongkos logistik berulang.</div>
                </div>

                <div className="flow-step-item" style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--amber-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', marginBottom: '10px' }}>4</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--slate-900)', marginBottom: '4px' }}>Pencairan & Serah Terima</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>Timbangan sah terverifikasi, dana panen langsung diteruskan penuh ke petani.</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  className="btn btn-harvest"
                  onClick={openRegister}
                  style={{ padding: '10px 20px', fontWeight: 700 }}
                >
                  Daftar Sebagai Petani Jagung <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ) : (
            /* Flow B Card */
            <div className="card" style={{ padding: '32px', borderTop: '5px solid var(--primary-600)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Egg size={26} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Alur Rantai Pasok B</span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)' }}>Peternak Ayam Petelur &rarr; UMKM Bakery & Kuliner Palu</h3>
                  </div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  Komisi Platform 5% & Garansi Retur Telur
                </span>
              </div>

              {/* 4 Step Process Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                <div className="flow-step-item" style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-700)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', marginBottom: '10px' }}>1</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--slate-900)', marginBottom: '4px' }}>Akad Kontrak Pasokan B2B</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>UMKM mengunci jadwal pengiriman (misal 50 rak tiap Selasa & Jumat) dengan harga tetap.</div>
                </div>

                <div className="flow-step-item" style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-700)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', marginBottom: '10px' }}>2</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--slate-900)', marginBottom: '4px' }}>Sortir Mutu Grade A</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>Peternak memisahkan telur retak dan memastikan standar bobot seragam siap adonan kue.</div>
                </div>

                <div className="flow-step-item" style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-700)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', marginBottom: '10px' }}>3</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--slate-900)', marginBottom: '4px' }}>Pengantaran Tepat Waktu</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>Armada lokal mengantarkan rak telur terlindung tray standar langsung ke dapur produksi UMKM.</div>
                </div>

                <div className="flow-step-item" style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-700)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', marginBottom: '10px' }}>4</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--slate-900)', marginBottom: '4px' }}>Garansi Retur 24 Jam</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>Jika ditemukan telur retak selama transit, peternak mengganti penuh tanpa sengketa.</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  className="btn btn-primary"
                  onClick={openRegister}
                  style={{ padding: '10px 20px', fontWeight: 700 }}
                >
                  Daftar Sebagai Pembeli UMKM <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Saudagro (Platform Advantages) */}
      <section id="keunggulan" style={{ padding: '68px 0', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="main-wrapper">
          <div className="keunggulan-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px auto' }}>
            <h2 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
              Mengapa Pelaku Agribisnis Memilih Saudagro?
            </h2>
            <p style={{ fontSize: '0.94rem', color: 'var(--slate-500)', marginTop: '6px' }}>
              Solusi digital yang dibangun khusus sesuai karakteristik geografis dan budaya transaksi di Sulawesi Tengah.
            </p>
          </div>

          <div className="grid-4" style={{ gap: '16px' }}>
            <div className="card advantage-card scroll-card-reveal" style={{ padding: '22px', border: '1px solid var(--border-subtle)', background: 'white' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Scale size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
                Transparansi Komisi
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Struktur biaya transparan: 3% untuk pakan jagung dan 5% untuk telur. Tanpa biaya siluman dan potongan calo liar.
              </p>
            </div>

            <div className="card advantage-card scroll-card-reveal" style={{ padding: '22px', border: '1px solid var(--border-subtle)', background: 'white' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--blue-50)', color: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Droplets size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
                Uji Mutu Terverifikasi
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Klasifikasi kadar air jagung otomatis (&le; 14% aman pakan) dan sortir grade telur terstandarisasi bebas sengketa mutu.
              </p>
            </div>

            <div className="card advantage-card scroll-card-reveal" style={{ padding: '22px', border: '1px solid var(--border-subtle)', background: 'white' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--amber-50)', color: 'var(--amber-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <FileCheck2 size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
                Harga Terkunci (Fixed Contract)
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Melindungi UMKM kuliner dari inflasi harga telur saat hari besar dan menjamin kepastian pembeli tetap bagi peternak.
              </p>
            </div>

            <div className="card advantage-card scroll-card-reveal" style={{ padding: '22px', border: '1px solid var(--border-subtle)', background: 'white' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Users size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
                Pendampingan Agen Lapangan
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Fitur pendaftaran dibantu tim fasilitator lapangan dan Mode Santai bersahabat bagi petani pedesaan tanpa hambatan teknologi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials with Verified Badges */}
      <section id="testimoni" style={{ padding: '68px 0', borderBottom: '1px solid var(--border-subtle)', background: '#F8FAFC' }}>
        <div className="main-wrapper">
          <div className="testimoni-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px auto' }}>
            <h2 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
              Kisah Nyata Mitra Agribisnis Sulawesi Tengah
            </h2>
            <p style={{ fontSize: '0.94rem', color: 'var(--slate-500)', marginTop: '6px' }}>
              Pengalaman langsung petani jagung, peternak ayam, dan pengusaha kuliner di Palu & Sigi.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '20px' }}>
            <div className="card testimoni-card scroll-card-reveal" style={{ padding: '24px', background: 'white', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', marginBottom: '12px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#F59E0B" />
                ))}
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--slate-700)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '18px' }}>
                "Dulu hasil panen jagung saya sering ditekan murah oleh tengkulak keliling di bawah Rp 4.500. Lewat Saudagro, saya jual langsung ke peternak ayam Palu di harga Rp 5.200/kg. Timbangan sah dan pembayaran transparan."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" 
                  alt="Pak Jufri" 
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-600)' }} 
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--slate-900)' }}>Pak Jufri Latandu</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>Petani Jagung — Sigi Biromaru</div>
                </div>
              </div>
            </div>

            <div className="card testimoni-card scroll-card-reveal" style={{ padding: '24px', background: 'white', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', marginBottom: '12px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#F59E0B" />
                ))}
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--slate-700)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '18px' }}>
                "Sangat terbantu! Saya bisa beli jagung pakan berkualitas KA &le; 14% langsung dari petani Sigi, sekaligus mengikat kontrak pasokan rutin 50 rak telur per minggu ke Dilla Bakery Palu tanpa cemas telur menumpuk."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80" 
                  alt="Bu Rahma" 
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-600)' }} 
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--slate-900)' }}>Bu Rahmawati</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>Peternakan Berkah — Balaroa, Palu</div>
                </div>
              </div>
            </div>

            <div className="card testimoni-card scroll-card-reveal" style={{ padding: '24px', background: 'white', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', marginBottom: '12px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#F59E0B" />
                ))}
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--slate-700)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '18px' }}>
                "Harga telur di pasar eceran sering melonjak tak menentu menjelang akhir pekan. Dengan kontrak pasokan Saudagro, biaya bahan baku toko kue kami stabil di Rp 51.000/rak dan ada garansi retur jika ada telur retak."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80" 
                  alt="Kak Dilla" 
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-600)' }} 
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--slate-900)' }}>Kak Dilla</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>Owner Dilla Bakery & Catering Palu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="cta-banner-section" style={{ 
        padding: '72px 0', 
        background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)', 
        color: 'white', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="main-wrapper cta-banner-card" style={{ maxWidth: '760px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '16px' }}>
            <Sparkles size={14} /> Mari Majukan Agribisnis Daerah Bersama
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.025em' }}>
            Siap Mengoptimalkan Rantai Pasok Usaha Anda?
          </h2>
          <p style={{ fontSize: '1rem', color: '#D1FAE5', lineHeight: 1.6, marginBottom: '32px' }}>
            Bergabunglah dengan ratusan petani jagung, peternak ayam, dan UMKM kuliner se-Sulawesi Tengah. Daftar gratis dan rasakan transaksi langsung yang adil.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-harvest" 
              style={{ padding: '14px 32px', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-lg)' }}
              onClick={openRegister}
            >
              Daftar Akun Baru Sekarang <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--slate-900)', color: 'var(--slate-400)', padding: '48px 0 36px 0', fontSize: '0.82rem', borderTop: '1px solid var(--slate-800)' }}>
        <div className="main-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px', marginBottom: '32px' }}>
            <div style={{ maxWidth: '420px' }}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3px' }}>
                  <img 
                    src="/logo/saudagro-icon.png" 
                    alt="Saudagro" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
                Saudagro Platform Sulteng
              </div>
              <p style={{ margin: '0 0 12px 0', lineHeight: 1.6, color: 'var(--slate-400)' }}>
                Pusat Mediasi & Rantai Pasok Agribisnis Terintegrasi Pertama di Sulawesi Tengah. Menghubungkan langsung Petani Jagung Sigi/Donggala, Peternak Ayam, dan Pelaku Usaha Kuliner Palu secara transparan dan amanah.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.12)', color: '#34D399', padding: '4px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700 }}>
                <ShieldCheck size={14} /> Akad Terbuka & Bebas Tengkulak Monopoli
              </div>
            </div>

            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '0.9rem', marginBottom: '14px' }}>
                Navigasi & Ketentuan
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>
                  <button 
                    type="button" 
                    onClick={() => setShowTermsModal(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--slate-300)', cursor: 'pointer', padding: 0, fontSize: '0.82rem', textAlign: 'left', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#34D399')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--slate-300)')}
                  >
                    📄 Ketentuan Layanan & Akad Transparan
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => setShowTermsModal(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--slate-300)', cursor: 'pointer', padding: 0, fontSize: '0.82rem', textAlign: 'left', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#34D399')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--slate-300)')}
                  >
                    🛡️ Standar Mutu, QC & Garansi Penggantian
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={onOpenAssistedRegister}
                    style={{ background: 'none', border: 'none', color: 'var(--slate-300)', cursor: 'pointer', padding: 0, fontSize: '0.82rem', textAlign: 'left', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#34D399')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--slate-300)')}
                  >
                    🤝 Bantuan Pendaftaran Fasilitator Lapangan
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '0.9rem', marginBottom: '14px' }}>
                Wilayah Operasional
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--slate-400)', fontSize: '0.8rem' }}>
                <div>📍 Kota Palu (Pusat Mediasi & UMKM)</div>
                <div>📍 Kabupaten Sigi (Sentra Jagung & Ternak)</div>
                <div>📍 Kabupaten Donggala (Lumbung Pangan)</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--slate-800)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.78rem' }}>
            <div>
              &copy; 2026 Saudagro Platform Sulawesi Tengah. Seluruh Hak Cipta Dilindungi Undang-Undang.
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                type="button" 
                onClick={() => setShowTermsModal(true)}
                style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: 0, fontSize: '0.78rem' }}
              >
                Ketentuan Layanan
              </button>
              <button 
                type="button" 
                onClick={() => setShowTermsModal(true)}
                style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: 0, fontSize: '0.78rem' }}
              >
                Rekening Bersama (Escrow)
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <button 
        className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Kembali ke atas"
        aria-label="Kembali ke atas"
      >
        <ArrowUp size={20} />
      </button>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authInitialMode}
        onOpenAssistedRegister={onOpenAssistedRegister}
      />

      {/* Terms of Service Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
};

