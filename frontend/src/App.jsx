import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import {
  ShoppingCart, Search, MapPin, Phone, ShieldCheck, Zap, Flame, Award,
  Sparkles, Gift, Upload, Trash2, Plus, Minus, ShoppingBag, Edit, Save,
  ImageIcon as ImageIconIcon, User, CreditCard, LayoutGrid, PlusCircle, FileImage,
  UploadCloud, CheckCircle2, RefreshCw, AlertTriangle, Download, FileSpreadsheet,
  Camera, Layers, Wand2, Home, Package, ListOrdered, Settings,
  ChevronRight, MoreVertical, X, LogOut, Check, MousePointer2, Receipt, Inbox, History, Heart,
  Truck, Lock, AlertCircle, DollarSign, Calendar, MessageCircle
} from 'lucide-react';
import Bill from './Bill';
import logo from './assets/logo.jpeg';
import heroCrackers from './assets/hero-crackers.png';

const API_BASE = (import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`) + '/api';
const BACKEND_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`;

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://cdn-icons-png.flaticon.com/512/3067/3067527.png";
  if (imagePath.startsWith('data:') || imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return encodeURI(`${BACKEND_URL}${imagePath}`);
};

const CATEGORY_ICONS = {
  "All": "✨", "Single Sound": "💥", "Garlands": "🧨", "Sparklers": "🌟", "Chakkars": "🌀", "Pots": "🏺", "Gift Boxes": "🎁", "Kids Selection": "🧸", "Bijili": "⚡", "Aerial Fancy": "🚀"
};

const SLIDES_DATA = [
  {
    subtitle: "Celebrate the Festival of Lights 🪔",
    title: "Premium Green Crackers\nfor a Joyous Diwali",
    p: "Direct from Sivakasi's authorized green cracker manufacturers. Order eco-friendly fireworks online and enjoy a safe, grand, and joyful celebration.",
    features: [
      { icon: "ShieldCheck", text: "CSIR-NEERI Green Crackers" },
      { icon: "Award", text: "Sivakasi Direct Pricing" },
      { icon: "Truck", text: "Secure Same-Day Dispatch" }
    ],
    btnText: "SHOP NOW →",
    btnLink: "#shop-section",
    image: heroCrackers
  },
  {
    subtitle: "Festive Dhamaka Offers 💥",
    title: "Up To 80% Off On\nAll Selected Items",
    p: "Get premium quality Sivakasi sparklers, ground chakkars, flower pots, and fancy rockets at unmatched wholesale prices.",
    features: [
      { icon: "Gift", text: "Amazing Gift Box Packs" },
      { icon: "Zap", text: "Sitewide Festive Discounts" },
      { icon: "Award", text: "100% Quality Guaranteed" }
    ],
    btnText: "EXPLORE OFFERS →",
    btnLink: "#shop-section",
    image: heroCrackers
  },
  {
    subtitle: "Diwali 2-Week Deadline Alert 🚚",
    title: "Fast & Secure Lorry\nTransport Dispatch",
    p: "To guarantee delivery before the festival, our online booking closes exactly 2 weeks before Diwali. Order now to secure your stock!",
    features: [
      { icon: "Truck", text: "Lorry Transport (To-Pay)" },
      { icon: "Calendar", text: "Book Before Deadline" },
      { icon: "ShieldCheck", text: "Safe & Insured Delivery" }
    ],
    btnText: "PLACE ORDER EARLY →",
    btnLink: "#shop-section",
    image: heroCrackers
  }
];

const SlideIcon = ({ name }) => {
  if (name === "ShieldCheck") return <ShieldCheck size={16} className="hero-feature-icon" />;
  if (name === "Award") return <Award size={16} className="hero-feature-icon" />;
  if (name === "Truck") return <Truck size={16} className="hero-feature-icon" />;
  if (name === "Gift") return <Gift size={16} className="hero-feature-icon" />;
  if (name === "Zap") return <Zap size={16} className="hero-feature-icon" />;
  if (name === "Calendar") return <Calendar size={16} className="hero-feature-icon" />;
  return null;
};

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 2800; // Complete slightly before 3s timer

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(percentage);
      if (percentage >= 100) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-screen-wrapper">
      <div className="loader-card">
        {/* Glow Ring containing ONLY the giant logo */}
        <div className="loader-glow-ring">
          <img src={logo} className="loader-logo-img" alt="Logo" />
        </div>

        {/* Brand details and diya placed outside/below the ring */}
        <h1 className="loader-brand-name">DURGA AGENCIES</h1>
        <h2 className="loader-welcome-text">Welcome to Durga Agencies</h2>

        {/* Glowing SVG Diya Vector */}
        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '15px 0' }}>
          <path d="M5 18C5 24.6274 11.7157 28 20 28C28.2843 28 35 24.6274 35 18C35 18 35 16 20 16C5 16 5 18 5 18Z" fill="url(#diyaBaseGrad)" stroke="#ffb700" strokeWidth="2" />
          <path d="M20 2C20 2 24 10 24 13C24 15.2091 22.2091 17 20 17C17.7909 17 16 15.2091 16 13C16 10 20 2 20 2Z" fill="url(#flameGrad)" filter="url(#glow)" />
          <defs>
            <linearGradient id="diyaBaseGrad" x1="20" y1="16" x2="20" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#003b95" />
              <stop offset="1" stopColor="#001845" />
            </linearGradient>
            <linearGradient id="flameGrad" x1="20" y1="2" x2="20" y2="17" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffe066" />
              <stop offset="0.5" stopColor="#ffb700" />
              <stop offset="1" stopColor="#ff3b30" />
            </linearGradient>
            <filter id="glow" x="12" y="-2" width="16" height="23" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        <p className="loader-subtext" style={{ marginBottom: '1.5rem' }}>Preparing your festive shopping experience...</p>

        {/* Progress Bar Container */}
        <div className="loader-progress-section">
          <div className="loader-progress-info">
            <span>Loading joyful celebrations...</span>
            <span>{progress}%</span>
          </div>
          <div className="loader-progress-bar-bg">
            <div className="loader-progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="loader-badges">
          <div className="loader-badge-item">
            <ShieldCheck size={16} className="loader-badge-icon" />
            <span>Safe & Certified</span>
          </div>
          <div className="loader-badge-item">
            <Award size={16} className="loader-badge-icon" />
            <span>Premium Quality</span>
          </div>
          <div className="loader-badge-item">
            <Truck size={16} className="loader-badge-icon" />
            <span>Fast & Reliable Delivery</span>
          </div>
          <div className="loader-badge-item">
            <Lock size={16} className="loader-badge-icon" />
            <span>Secure Shopping</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Promo slider items (no emojis)
const PROMO_ITEMS = [
  { title: 'LORRY TRANSPORT', desc: 'Pay delivery charges at lorry office (To-Pay)' },
  { title: 'DIWALI DEADLINE', desc: 'Online orders close 2 weeks before festival' },
  { title: 'SIVAKASI DIRECT PRICE', desc: 'Best wholesale rates guaranteed' },
];

const PromoTicker = ({ discountPercent }) => {
  const items = discountPercent > 0
    ? [...PROMO_ITEMS.slice(0, 2), { title: 'SITEWIDE DISCOUNT', desc: `${discountPercent}% off on total bill` }]
    : PROMO_ITEMS;
  const [active, setActive] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % items.length), 3200);
    return () => clearInterval(t);
  }, [items.length]);
  return (
    <div className="promo-ticker-wrap">
      {items.map((item, i) => (
        <div key={i} className={`promo-ticker-item ${active === i ? 'ticker-active' : ''}`}>
          <div className="ticker-title">{item.title}</div>
          <div className="ticker-desc">{item.desc}</div>
        </div>
      ))}
      <div className="ticker-dots">
        {items.map((_, i) => (
          <button key={i} className={`ticker-dot ${active === i ? 'dot-active' : ''}`} onClick={() => setActive(i)} />
        ))}
      </div>
    </div>
  );
};

const CRACKER_PALETTES = [
  ['#D4AF37', '#FFDF00', '#DAA520', '#FFFFFF'],
  ['#C0C0C0', '#E5E4E2', '#B0C4DE', '#FFFFFF'],
  ['#FF7F50', '#FF6347', '#FF4500', '#FFFFFF'],
  ['#DDA0DD', '#EE82EE', '#BA55D3', '#FFFFFF'],
  ['#40E0D0', '#48D1CC', '#00CED1', '#FFFFFF'],
];

// ---- Random Cracker Bursts only (no mouse trail) ----
const SparklerCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // --- Random cracker rockets only ---
    let rockets = [];
    let burstParticles = [];
    let lastRocketTime = 0;
    let nextRocketDelay = 900 + Math.random() * 1800;
    let lastDirectBurst = 0;
    let nextDirectDelay = 3000 + Math.random() * 4000;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();



    const addBurstParticles = (x, y, palette) => {
      // Main firework burst
      const count = 70 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const speed = 3 + Math.random() * 6;
        const color = palette[Math.floor(Math.random() * palette.length)];
        burstParticles.push({
          x, y,
          px: x, py: y, // Store previous position for trails
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          size: Math.random() * 1.2 + 0.3, color, alpha: 1,
          decay: Math.random() * 0.015 + 0.005, gravity: 0.04, friction: 0.94,
        });
      }
      // Glowing center ring
      for (let j = 0; j < 15; j++) {
        const angle = (j / 15) * Math.PI * 2;
        burstParticles.push({
          x, y,
          px: x, py: y,
          vx: Math.cos(angle) * (8 + Math.random() * 3), vy: Math.sin(angle) * (8 + Math.random() * 3),
          size: 0.5 + Math.random() * 1, color: '#FFFFFF', alpha: 1,
          decay: 0.03 + Math.random() * 0.02, gravity: 0.02, friction: 0.90,
        });
      }
    };


    const spawnRocket = () => {
      const palette = CRACKER_PALETTES[Math.floor(Math.random() * CRACKER_PALETTES.length)];
      const x = 80 + Math.random() * (canvas.width - 160);
      const targetY = canvas.height * (0.12 + Math.random() * 0.52);
      rockets.push({ x, y: canvas.height + 10, targetY, vy: -(8 + Math.random() * 6), vx: (Math.random() - 0.5) * 2, palette, trail: [], done: false });
    };

    const spawnDirectBurst = () => {
      const palette = CRACKER_PALETTES[Math.floor(Math.random() * CRACKER_PALETTES.length)];
      const x = 60 + Math.random() * (canvas.width - 120);
      const y = canvas.height * (0.15 + Math.random() * 0.65);
      addBurstParticles(x, y, palette);
    };


    const animate = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (timestamp - lastRocketTime > nextRocketDelay) {
        spawnRocket();
        if (Math.random() < 0.3) spawnRocket();
        lastRocketTime = timestamp;
        nextRocketDelay = 900 + Math.random() * 2000;
      }

      if (timestamp - lastDirectBurst > nextDirectDelay) {
        spawnDirectBurst();
        lastDirectBurst = timestamp;
        nextDirectDelay = 3500 + Math.random() * 4500;
      }

      rockets = rockets.filter(r => !r.done);
      rockets.forEach(r => {
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 14) r.trail.shift();
        r.trail.forEach((t, idx) => {
          ctx.save();
          ctx.globalAlpha = (idx / r.trail.length) * 0.55;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = r.palette[0];
          ctx.fill();
          ctx.restore();
        });
        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();
        r.y += r.vy; r.x += r.vx; r.vy *= 0.984;
        if (r.y <= r.targetY || r.vy >= 0) {
          addBurstParticles(r.x, r.y, r.palette);
          r.done = true;
        }
      });

      burstParticles = burstParticles.filter(p => p.alpha > 0);
      burstParticles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;

        // Draw trailing lines for real firework look
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.lineWidth = p.size;
        ctx.strokeStyle = p.color;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw bright head
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();

        p.px = p.x; p.py = p.y;
        p.vx *= p.friction; p.vy *= p.friction; p.vy += p.gravity;
        p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    />
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [view, setView] = useState('shop');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const renderProductImage = (p, isOutOfStock = false) => {
    const imageUrl = getImageUrl(p.image);
    const isDefaultPlaceholder = !p.image || imageUrl.includes("3067527.png");

    if (isDefaultPlaceholder) {
      return (
        <div className="festive-placeholder-wrapper" style={{ filter: isOutOfStock ? 'grayscale(0.8) contrast(0.8)' : 'none' }}>
          <div className="festive-gradient-bg"></div>
          <div className="festive-icon-container">
            <svg className="festive-spark-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="4" fill="#ffb700" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
                const rad = (angle * Math.PI) / 180;
                const x1 = 50 + Math.cos(rad) * 10;
                const y1 = 50 + Math.sin(rad) * 10;
                const x2 = 50 + Math.cos(rad) * 28;
                const y2 = 50 + Math.sin(rad) * 28;
                return (
                  <line
                    key={idx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#ffb700"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        className="product-card-img"
        alt={p.name}
        loading="lazy"
        style={{ filter: isOutOfStock ? 'grayscale(0.8) contrast(0.8)' : 'none' }}
      />
    );
  };

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderData, setOrderData] = useState({ name: '', phone: '', address: 'Provided via WhatsApp/Phone' });
  const [lastOrder, setLastOrder] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!localStorage.getItem('adminToken'));
  const [adminPassword, setAdminPassword] = useState('');
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));
  const [toast, setToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [settings, setSettings] = useState({
    promo_title: '',
    promo_subtitle: '',
    free_shipping_threshold: '999',
    global_discount_percent: '0',
    shipping_cost: '100',
    upi_name: 'Durga Agencies'
  });
  const [shopOpen, setShopOpen] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(null);

  const dynamicSlides = SLIDES_DATA.map((slide, idx) => {
    if (idx === 1) {
      const pct = parseFloat(settings?.global_discount_percent || 0) || 80;
      return {
        ...slide,
        title: `Up To ${pct}% Off On\nAll Selected Items`
      };
    }
    return slide;
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleWishlist = (product) => {
    const pId = product.id || product._id;
    setWishlist(prev => {
      const exists = prev.find(i => (i.id || i._id) === pId);
      const next = exists ? prev.filter(i => (i.id || i._id) !== pId) : [...prev, product];
      localStorage.setItem('wishlist', JSON.stringify(next));
      showToast(exists ? `Removed from wishlist` : `❤️ ${product.name} added to wishlist!`);
      return next;
    });
  };

  const handleNewsletterSubscribe = async () => {
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email!', 'error'); return;
    }
    try {
      await axios.post(`${API_BASE}/newsletter`, { email: newsletterEmail });
      showToast('✅ Subscribed! Thank you.');
      setNewsletterEmail('');
    } catch {
      // Even if backend doesn't have endpoint, show success to user
      showToast('✅ Subscribed! Thank you.');
      setNewsletterEmail('');
    }
  };

  const trackOrder = async () => {
    if (!trackOrderId.trim()) { showToast('Enter your Order ID!', 'error'); return; }
    try {
      const res = await axios.get(`${API_BASE}/bill/${trackOrderId.trim()}`);
      setTrackedOrder(res.data);
    } catch {
      showToast('Order not found. Check your Order ID.', 'error');
      setTrackedOrder(null);
    }
  };

  const fetchProducts = async () => {
    try { const res = await axios.get(`${API_BASE}/products`); setProducts(res.data); } catch (err) { }
  };

  const fetchSettings = async () => {
    try { const res = await axios.get(`${API_BASE}/settings`); setSettings(res.data); } catch (err) { }
  };

  const fetchSessionStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/session/status`);
      setShopOpen(res.data.isOpen);
      setSessionInfo(res.data);
    } catch (e) { setShopOpen(true); }
  };

  useEffect(() => {
    fetchProducts();
    fetchSettings();
    fetchSessionStatus();
    const timer = setTimeout(() => setLoading(false), 3000);
    const hash = window.location.hash;
    if (window.location.pathname === '/admin' || hash === '#/admin') {
      setView('admin');
    } else if (hash.startsWith('#/')) {
      setView(hash.replace('#/', ''));
    }

    // Set up Axios interceptors for handling admin authentication headers globally
    const reqInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('adminToken');
          setIsAdminAuthenticated(false);
        }
        return Promise.reject(error);
      }
    );

    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.href = logo;
    document.getElementsByTagName('head')[0].appendChild(link);

    return () => {
      clearTimeout(timer);
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/admin') {
        setView('admin');
      } else if (hash.startsWith('#/')) {
        setView(hash.replace('#/', ''));
      } else {
        setView('shop');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const currentHash = window.location.hash;
    const expectedHash = view === 'shop' ? '' : `#/${view}`;
    if (currentHash !== expectedHash) {
      if (expectedHash === '') {
        window.history.replaceState(null, '', window.location.pathname);
      } else {
        window.location.hash = expectedHash;
      }
    }
  }, [view]);

  useEffect(() => {
    if (view !== 'shop' || loading) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % dynamicSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [view, loading, dynamicSlides.length]);

  useEffect(() => {
    if (view !== 'shop' || loading) return;
    const canvas = document.getElementById('hero-fireworks-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.06;
        this.friction = 0.97;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.008;
        this.size = Math.random() * 2 + 1;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
    }

    class Firework {
      constructor() {
        this.x = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height * 0.5) + canvas.height * 0.15;
        this.speed = Math.random() * 4 + 6;
        this.vy = -this.speed;
        this.vx = (Math.random() - 0.5) * 2;
        this.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
        this.exploded = false;
        this.particles = [];
      }

      draw() {
        if (!this.exploded) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = this.color;
          ctx.fill();
          ctx.restore();
        }
        this.particles.forEach(p => p.draw());
      }

      update() {
        if (!this.exploded) {
          this.y += this.vy;
          this.x += this.vx;
          if (this.vy >= 0 || this.y <= this.targetY) {
            this.exploded = true;
            this.explode();
          }
        }
        this.particles.forEach((p, idx) => {
          p.update();
          if (p.alpha <= 0) this.particles.splice(idx, 1);
        });
      }

      explode() {
        const pCount = 50;
        const colors = [this.color, '#FFD700', '#FFFFFF', '#FF3366', '#00FFFF'];
        for (let i = 0; i < pCount; i++) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          this.particles.push(new Particle(this.x, this.y, color));
        }
      }
    }

    let fireworks = [];
    const animate = () => {
      ctx.fillStyle = 'rgba(5, 20, 45, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.025 && fireworks.length < 4) {
        fireworks.push(new Firework());
      }

      fireworks.forEach((fw, idx) => {
        fw.update();
        fw.draw();
        if (fw.exploded && fw.particles.length === 0) {
          fireworks.splice(idx, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [view, loading]);

  const dynamicCategories = useMemo(() => {
    const cats = ['All', ...new Set(products.map(p => p.category))];
    if (cats.length <= 1) return ['All', 'Single Sound', 'Garlands', 'Sparklers', 'Ground Chakkars', 'Flower Pots', 'Kids Special'];
    return cats;
  }, [products]);

  const getProductDisplay = (p) => {
    const globalOffer = parseFloat(settings?.global_discount_percent || 0);
    const finalOffer = globalOffer > 0 ? globalOffer : parseFloat(p.offer || 0);
    const price = parseFloat(p.price || 0);
    const mrp = (finalOffer > 0 && finalOffer < 100) 
      ? Math.round(price / (1 - (finalOffer / 100))) 
      : price;
    return { price, mrp, offer: finalOffer };
  };

  const addToCart = (product) => {
    setCart(prev => {
      const pId = product.id || product._id;
      const existing = prev.find(i => (i.id || i._id) === pId);
      if (existing) return prev.map(i => (i.id || i._id) === pId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const decrementCart = (product) => {
    setCart(prev => {
      const pId = product.id || product._id;
      const existing = prev.find(i => (i.id || i._id) === pId);
      if (!existing) return prev;
      if (existing.qty <= 1) return prev.filter(i => (i.id || i._id) !== pId);
      return prev.map(i => (i.id || i._id) === pId ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const fakeOriginalSubtotal = cart.reduce((sum, item) => sum + (getProductDisplay(item).mrp * item.qty), 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  // Total Amount is strictly the Fixed Real Rate. No extra cuts!
  const totalAmount = subtotal;
  const discountAmount = fakeOriginalSubtotal - subtotal;

  const MIN_ORDER = 3000;
  const [activeBill, setActiveBill] = useState(null);

  const placeOrder = async () => {
    if (subtotal < MIN_ORDER) { alert(`Minimum order value is ₹${MIN_ORDER}.`); return; }
    if (!orderData.name || !orderData.phone) { alert("Please fill in your contact details!"); return; }

    const orderObj = {
      customerName: orderData.name,
      phone: orderData.phone,
      address: orderData.address || 'Provided via WhatsApp/Phone',
      items: cart.map(item => {
        const display = getProductDisplay(item);
        return {
          ...item,
          originalPrice: display.mrp,
          offer: display.offer
        };
      }),
      totalAmount,
      orderType: 'online'
    };

    try {
      const res = await axios.post(`${API_BASE}/orders`, orderObj);
      const bill = res.data.bill || { billNumber: 'DA-' + Date.now() };

      setLastOrder({ ...bill, totalAmount });
      setCart([]);
      setOrderData({ name: '', phone: '', address: 'Provided via WhatsApp/Phone' });
      setView('success');
      window.scrollTo(0, 0);
    } catch (err) {
      alert("Error placing order. Please try again or contact support.");
    }
  };

  const downloadPriceList = () => {
    if (products.length === 0) { alert("No products available to export."); return; }
    // Construct CSV Header
    const headers = ["Product Name", "Category", "MRP (INR)", "Discount (%)", "Wholesale Price (INR)"];

    // Construct CSV Rows
    const rows = products.map(p => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${(p.category || 'General').replace(/"/g, '""')}"`,
      p.originalPrice,
      `${p.offer}%`,
      p.price
    ]);

    // Create CSV content and download trigger
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Durga_Agencies_Price_List_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const groupedProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== 'All') filtered = products.filter(p => p.category === selectedCategory);
    if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const groups = filtered.reduce((acc, p) => {
      const cat = p.category || 'Single Sound';
      acc[cat] = acc[cat] || [];
      acc[cat].push(p);
      return acc;
    }, {});
    return groups;
  }, [products, selectedCategory, searchQuery]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="site-wrapper">
      {/* Ambient CSS cracker sparkle background elements removed for cleaner firework canvas theme */}
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 99999,
          background: toast.type === 'error' ? '#8B0000' : '#0a2e6b',
          color: 'white', padding: '1rem 1.8rem', borderRadius: '14px',
          fontWeight: '800', fontSize: '0.9rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          border: '2px solid rgba(255,255,255,0.15)', animation: 'slideInToast 0.3s ease',
          maxWidth: '320px'
        }}>
          {toast.msg}
        </div>
      )}

      {view !== 'admin' && (
        <>
          <div className="top-bar" style={{ background: '#8B0000', padding: '8px 0' }}>
            <div className="container top-bar-inner" style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="top-bar-left" style={{ fontSize: '0.78rem', fontWeight: '800', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                <span>{shopOpen ? '🪔 Online Orders close 2 weeks before Diwali!' : '🚫 Online ordering is currently CLOSED'}</span>
                <span style={{ color: '#FFD700' }}>{shopOpen ? '🚚 Parcels dispatched only after payment confirmation' : sessionInfo?.nextSession ? `📅 Next opening: ${new Date(sessionInfo.nextSession.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : '📅 Stay tuned for next season!'}</span>
              </div>
            </div>
          </div>

          <nav className="navbar">
            <div className="container navbar-inner">
              <a href="/" className="logo-container" onClick={(e) => { e.preventDefault(); setView('shop'); window.history.pushState({}, '', '/'); }}>
                <img src={logo} className="logo-img" alt="Logo" />
                <div>
                  <span className="brand-name">DURGA AGENCIES</span>
                  <span className="brand-subtitle">PREMIUM CRACKERS</span>
                </div>
              </a>
              {/* Desktop Search Bar (Centered) */}
              <div className="navbar-search-wrapper">
                <div className="search-container">
                  <label htmlFor="searchQuery" style={{ display: 'none' }}>Search Crackers</label>
                  <input
                    id="searchQuery"
                    name="searchQuery"
                    type="text"
                    autoComplete="off"
                    placeholder="Search crackers..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="search-btn"><Search size={16} /></button>
                </div>
              </div>

              {/* Desktop Nav Links (Right Aligned) */}
              <div className="nav-links">
                <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setView('shop'); }}>Home</a>
                <a href="#" className="nav-link-wishlist" onClick={(e) => { e.preventDefault(); setView('wishlist'); }}>
                  <Heart size={16} className={`wishlist-nav-icon ${wishlist.length > 0 ? 'heart-pulse' : ''}`} fill={wishlist.length > 0 ? '#e63946' : 'none'} stroke={wishlist.length > 0 ? '#e63946' : 'currentColor'} />
                  <span>Wishlist</span>
                  {wishlist.length > 0 && <span className="wishlist-badge">{wishlist.length}</span>}
                </a>

                <a href="#" className="nav-cart-btn" onClick={(e) => { e.preventDefault(); setView('cart'); }}>
                  <ShoppingCart size={18} />
                  <span>Cart</span>
                  {cart.length > 0 && <span className="cart-badge">{cart.reduce((s, i) => s + i.qty, 0)}</span>}
                </a>
              </div>

              {/* Mobile actions (Cart & Hamburger) */}
              <div className="mobile-nav-actions">
                <button 
                  className="mobile-cart-icon-btn" 
                  onClick={() => setView('cart')} 
                  aria-label="View Cart"
                >
                  <ShoppingCart size={22} />
                  {cart.length > 0 && (
                    <span className="mobile-cart-badge">
                      {cart.reduce((s, i) => s + i.qty, 0)}
                    </span>
                  )}
                </button>
                <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X size={24} /> : <span style={{ fontSize: '1.5rem' }}>☰</span>}
                </button>
              </div>
            </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
              <div className="mobile-menu-drawer">
                <div className="search-container" style={{ width: '100%', margin: '0 0 1rem' }}>
                  <label htmlFor="mobileSearchQuery" style={{ display: 'none' }}>Search Crackers Mobile</label>
                  <input id="mobileSearchQuery" name="mobileSearchQuery" type="text" autoComplete="off" placeholder="Search crackers..." className="search-input"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <button className="search-btn"><Search size={16} /></button>
                </div>
                <a href="#" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); setView('shop'); setMobileMenuOpen(false); }}>🏠 Home</a>
                <a href="#" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); setView('wishlist'); setMobileMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={16} fill={wishlist.length > 0 ? '#e63946' : 'none'} stroke={wishlist.length > 0 ? '#e63946' : 'currentColor'} className={wishlist.length > 0 ? 'heart-pulse' : ''} />
                  <span>Wishlist</span>
                  {wishlist.length > 0 && <span className="wishlist-badge" style={{ display: 'inline-flex' }}>{wishlist.length}</span>}
                </a>
                <a href="#" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); setView('cart'); setMobileMenuOpen(false); }}>
                  🛒 Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)
                </a>
              </div>
            )}
          </nav>
        </>
      )}

      {view === 'admin' ? (
        <AdminPortal isAdminAuthenticated={isAdminAuthenticated} setIsAdminAuthenticated={setIsAdminAuthenticated} adminPassword={adminPassword} setAdminPassword={setAdminPassword} fetchProducts={fetchProducts} products={products} dynamicCategories={dynamicCategories} setParentView={setView} />
      ) : (
        <div className="site-content">
          {view === 'shop' && (
            <main className="fade-in">
              <section className="hero">
                <div className="container">
                  <div className="hero-slider-container">
                    {/* HTML5 Canvas for Realistic Particle Fireworks */}
                    <canvas id="hero-fireworks-canvas"></canvas>

                    {/* Floating Festive Sparkles */}
                    <div className="hero-sparkle-ember ember-1"></div>
                    <div className="hero-sparkle-ember ember-2"></div>
                    <div className="hero-sparkle-ember ember-3"></div>
                    <div className="hero-sparkle-ember ember-4"></div>
                    <div className="hero-sparkle-ember ember-5"></div>
                    <div className="hero-sparkle-ember ember-6"></div>

                    {/* Slides */}
                    {dynamicSlides.map((slide, idx) => (
                      <div
                        key={idx}
                        className={`hero-slide ${currentSlide === idx ? 'active' : ''}`}
                      >
                        <div className="hero-slide-bg"></div>
                        <div className="hero-inner">
                          <div className="hero-content">
                            <div className="hero-subtitle-cursive">{slide.subtitle}</div>
                            <h1 className="hero-h1">
                              {slide.title.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                  {line}
                                  {i < slide.title.split('\n').length - 1 && <br />}
                                </React.Fragment>
                              ))}
                            </h1>
                            <p className="hero-p">{slide.p}</p>

                            <div className="hero-features">
                              {slide.features.map((feat, fidx) => (
                                <div key={fidx} className="hero-feature-item">
                                  <SlideIcon name={feat.icon} />
                                  <span>{feat.text}</span>
                                </div>
                              ))}
                            </div>

                            <a href={slide.btnLink} className="hero-btn" style={{ textDecoration: 'none' }}>
                              {slide.btnText}
                            </a>
                          </div>
                          <div className="hero-image-wrapper">
                            <img src={slide.image} className="hero-image" alt="Premium Crackers Showcase" />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Slider Controls */}
                    <button
                      className="slider-control-btn prev"
                      onClick={() => setCurrentSlide(prev => (prev - 1 + dynamicSlides.length) % dynamicSlides.length)}
                      aria-label="Previous Slide"
                    >
                      ‹
                    </button>
                    <button
                      className="slider-control-btn next"
                      onClick={() => setCurrentSlide(prev => (prev + 1) % dynamicSlides.length)}
                      aria-label="Next Slide"
                    >
                      ›
                    </button>

                    {/* Slide Dots */}
                    <div className="slider-dots">
                      {dynamicSlides.map((_, idx) => (
                        <button
                          key={idx}
                          className={`slider-dot ${currentSlide === idx ? 'active' : ''}`}
                          onClick={() => setCurrentSlide(idx)}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <div id="shop-section" className="container py-20">
                <div className="section-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <h2 className="section-title">{selectedCategory === 'All' ? 'All Products' : `${selectedCategory}`}</h2>
                  </div>
                  <div className="category-filter-scroll">
                    {dynamicCategories.map(cat => (
                      <button
                        key={cat}
                        className={`filter-chip ${selectedCategory === cat ? 'active-chip' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="product-grid">
                  {Object.entries(groupedProducts).flatMap(([category, items]) =>
                    items.map(p => {
                      const pId = p.id || p._id;
                      const isOutOfStock = p.stock !== undefined && p.stock !== null && p.stock <= 0;
                      const isWishlisted = wishlist.some(i => (i.id || i._id) === pId);
                      const displayData = getProductDisplay(p);
                      const cartItem = cart.find(i => (i.id || i._id) === pId);
                      return (
                        <div key={pId} className={`product-card ${isOutOfStock ? 'out-of-stock-card' : ''}`}>
                          <button
                            className="wishlist-btn"
                            onClick={() => toggleWishlist(p)}
                            style={{ color: isWishlisted ? '#e63946' : '#888', background: isWishlisted ? '#ffe5e8' : '#f1f4f9' }}
                            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                          >
                            <Heart size={16} fill={isWishlisted ? '#e63946' : 'none'} />
                          </button>
                          <div className="product-card-img-wrapper" style={{ position: 'relative' }}>
                            {renderProductImage(p, isOutOfStock)}
                            {isOutOfStock && (
                              <div className="out-of-stock-badge-overlay">
                                OUT OF STOCK
                              </div>
                            )}
                          </div>
                          <div className="product-card-details">
                            <div className="product-card-category">{p.category || 'Single Sound'}</div>
                            <h3 className="product-card-name">{p.name}</h3>

                            <div className="product-card-prices">
                              <span className="product-card-price">₹{displayData.price}</span>
                              <span className="product-card-mrp">₹{displayData.mrp}</span>
                              <span className="product-card-offer">{displayData.offer}% OFF</span>
                            </div>

                            {isOutOfStock ? (
                              <button className="product-card-btn out-of-stock-btn" disabled>
                                <ShoppingCart size={16} /> Out of Stock
                              </button>
                            ) : cartItem ? (
                              <div className="product-qty-selector">
                                <button
                                  className="qty-btn minus"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    decrementCart(p);
                                  }}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="qty-display">{cartItem.qty}</span>
                                <button
                                  className="qty-btn plus"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(p);
                                  }}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(p)}
                                className="product-card-btn"
                              >
                                <ShoppingCart size={16} /> Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="container">
                <div className="promo-banner">
                  {/* Floating animated background sparks */}
                  <span className="promo-spark" style={{ left: '10%', bottom: '-10px', animationDelay: '0s', animationDuration: '4.5s' }}></span>
                  <span className="promo-spark" style={{ left: '25%', bottom: '-10px', animationDelay: '1.2s', animationDuration: '5.2s' }}></span>
                  <span className="promo-spark" style={{ left: '45%', bottom: '-10px', animationDelay: '0.5s', animationDuration: '6s' }}></span>
                  <span className="promo-spark" style={{ left: '60%', bottom: '-10px', animationDelay: '2.3s', animationDuration: '4.8s' }}></span>
                  <span className="promo-spark" style={{ left: '75%', bottom: '-10px', animationDelay: '1.8s', animationDuration: '5.5s' }}></span>
                  <span className="promo-spark" style={{ left: '90%', bottom: '-10px', animationDelay: '0.8s', animationDuration: '5s' }}></span>
                  <span className="promo-spark" style={{ left: '35%', bottom: '-10px', animationDelay: '3s', animationDuration: '5.8s' }}></span>
                  <span className="promo-spark" style={{ left: '80%', bottom: '-10px', animationDelay: '2.7s', animationDuration: '6.2s' }}></span>

                  <div className="promo-left">
                    <span className="promo-diya">🪔</span>
                    <div>
                      <div className="promo-title">{settings.promo_title || 'FESTIVE DHAMAKA OFFERS!'}</div>
                      <div className="promo-subtitle">{settings.promo_subtitle || `UP TO ${parseFloat(settings.global_discount_percent || 0) || 80}% OFF ON SELECTED ITEMS`}</div>
                    </div>
                  </div>
                  <PromoTicker discountPercent={parseFloat(settings.global_discount_percent || 0)} />
                  <button className="promo-btn" onClick={() => document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' })}>SHOP OFFERS →</button>
                </div>
              </div>

            </main>

          )}
          {view === 'cart' && (
            <section className="container fade-in" style={{ padding: '6rem 0' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                  <ShoppingBag size={80} color="#ddd" />
                  <p style={{ marginTop: '20px', fontWeight: '900', fontSize: '1.2rem' }}>Your cart is empty!</p>
                  <button className="btn-primary" style={{ marginTop: '1.5rem', padding: '0.8rem 2rem' }} onClick={() => setView('shop')}>Browse Products</button>
                </div>
              ) : (
                <div className="cart-layout">
                  <div className="price-list-container">
                    <h2 className="section-title" style={{ textAlign: 'left', margin: '0 0 2rem' }}>Basket</h2>
                    {cart.map(item => (
                      <div key={item.id || item._id} className="product-row">
                        <div style={{ fontWeight: '800', flex: 1, paddingRight: '1rem' }}>{item.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', width: '120px', flexShrink: 0 }}>
                          <button onClick={() => setCart(prev => prev.map(i => (i.id || i._id) === (item.id || item._id) ? { ...i, qty: Math.max(0, i.qty - 1) } : i).filter(i => i.qty > 0))} style={{ border: '1px solid #ddd', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                          <span style={{ fontWeight: '900', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                          <button onClick={() => addToCart(item)} style={{ border: '1px solid #ddd', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                        </div>
                        <div style={{ fontWeight: '900', color: '#8B0000', width: '80px', textAlign: 'right', flexShrink: 0 }}>₹{item.price * item.qty}</div>
                      </div>
                    ))}

                    {/* Important purchase conditions alert */}
                    <div style={{ marginTop: '2.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem', textAlign: 'left', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#121212', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={20} color="#8B0000" /> IMPORTANT SHOPPING TERMS
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ background: '#fff5f5', padding: '10px', borderRadius: '12px', color: '#8B0000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <DollarSign size={18} />
                          </div>
                          <div>
                            <h4 style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: '800', color: '#121212' }}>Payment Dispatch Policy</h4>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: '#666', lineHeight: '1.4' }}>Parcels will only be dispatched after payment is fully confirmed in our account.</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ background: '#fff9f0', padding: '10px', borderRadius: '12px', color: '#dd6b20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Calendar size={18} />
                          </div>
                          <div>
                            <h4 style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: '800', color: '#121212' }}>Diwali Order Cut-Off</h4>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: '#666', lineHeight: '1.4' }}>To ensure timely delivery, all online order bookings close exactly 2 weeks before Diwali festival.</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ background: '#ebf8ff', padding: '10px', borderRadius: '12px', color: '#2b6cb0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Truck size={18} />
                          </div>
                          <div>
                            <h4 style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: '800', color: '#121212' }}>Lorry Transport Delivery</h4>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: '#666', lineHeight: '1.4' }}>All delivery charges are on a "To-Pay" basis. You will pay the lorry transport office directly upon parcel collection.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="price-list-container">
                    <h3 style={{ marginBottom: '2.5rem', fontWeight: '900' }}>DELIVERY DETAILS</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'left' }}>
                        <label htmlFor="customerName" style={{ fontSize: '0.65rem', fontWeight: '900', color: '#888', letterSpacing: '1.5px', marginBottom: '8px', display: 'block' }}>FULL NAME</label>
                        <input id="customerName" name="customerName" autoComplete="name" className="checkout-input" placeholder="Your Name" value={orderData.name} onChange={e => setOrderData({ ...orderData, name: e.target.value })} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <label htmlFor="phone" style={{ fontSize: '0.65rem', fontWeight: '900', color: '#888', letterSpacing: '1.5px', marginBottom: '8px', display: 'block' }}>PHONE NUMBER</label>
                        <input id="phone" name="phone" autoComplete="tel" className="checkout-input" placeholder="10 Digit Mobile No" value={orderData.phone} onChange={e => setOrderData({ ...orderData, phone: e.target.value })} />
                      </div>
                    </div>
                    <div style={{ marginTop: '2.5rem', background: '#121212', color: 'white', padding: '2.5rem', borderRadius: '32px', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: '700', color: '#a0aec0' }}>TOTAL MRP</span>
                        <span style={{ fontWeight: '700', color: '#a0aec0', textDecoration: 'line-through' }}>₹{fakeOriginalSubtotal}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <span style={{ fontWeight: '800', color: '#48bb78', fontSize: '1.1rem' }}>🎉 YOU SAVED</span>
                          <span style={{ fontWeight: '800', color: '#48bb78', fontSize: '1.1rem' }}>₹{discountAmount}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #2d3748', paddingBottom: '1.5rem' }}>
                        <span style={{ fontWeight: '700', color: '#a0aec0' }}>SHIPPING</span>
                        <span style={{ fontWeight: '700', color: '#FFD700', fontSize: '0.85rem' }}>
                          Lorry Transport (To-Pay)
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <span style={{ fontWeight: '700', color: '#a0aec0' }}>FINAL AMOUNT</span>
                        <span style={{ color: '#FFD700', fontSize: '2.2rem', fontWeight: '900' }}>₹{totalAmount}</span>
                      </div>



                      {!shopOpen && (
                        <div style={{ background: '#fff5f5', border: '2px solid #e53e3e', borderRadius: '16px', padding: '1.2rem 1.5rem', marginBottom: '1.2rem', textAlign: 'center' }}>
                          <AlertTriangle size={24} color="#e53e3e" style={{ marginBottom: '6px' }} />
                          <p style={{ fontWeight: '800', color: '#9b2c2c', margin: '0 0 4px', fontSize: '0.95rem' }}>Online Ordering is Currently Closed</p>
                          <p style={{ fontSize: '0.8rem', color: '#e53e3e', margin: 0 }}>
                            {sessionInfo?.nextSession ? `Orders open on ${new Date(sessionInfo.nextSession.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Please check back later or contact us on WhatsApp'}
                          </p>
                        </div>
                      )}
                      {totalAmount < MIN_ORDER && shopOpen && (
                        <div style={{ background: '#fff5f5', border: '2px solid #e53e3e', borderRadius: '16px', padding: '1.2rem', marginBottom: '1.2rem', textAlign: 'center' }}>
                          <AlertTriangle size={24} color="#e53e3e" style={{ marginBottom: '6px' }} />
                          <p style={{ fontWeight: '800', color: '#9b2c2c', margin: 0, fontSize: '0.95rem' }}>Minimum Order: ₹{MIN_ORDER}</p>
                          <p style={{ fontSize: '0.8rem', color: '#e53e3e', margin: '4px 0 0' }}>Add ₹{MIN_ORDER - totalAmount} more to checkout</p>
                        </div>
                      )}
                      <button onClick={placeOrder} disabled={!shopOpen || totalAmount < MIN_ORDER} className="btn-primary" style={{ width: '100%', height: '65px', background: (shopOpen && totalAmount >= MIN_ORDER) ? '#FFD700' : '#ccc', color: (shopOpen && totalAmount >= MIN_ORDER) ? '#121212' : '#888', borderRadius: '50px', fontSize: '1.1rem', letterSpacing: '1px', cursor: (shopOpen && totalAmount >= MIN_ORDER) ? 'pointer' : 'not-allowed', opacity: (shopOpen && totalAmount >= MIN_ORDER) ? 1 : 0.6 }}>{shopOpen ? 'PLACE ORDER' : 'ORDERING CLOSED'}</button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* TRACK ORDER VIEW */}
          {view === 'track' && (() => {
            const STATUS_STEPS = ['Pending Payment', 'Payment Received', 'Packing', 'Out for Delivery', 'Delivered'];
            const currentStep = trackedOrder ? STATUS_STEPS.indexOf(trackedOrder.orderStatus || 'Pending Payment') : -1;
            return (
              <section className="container fade-in" style={{ padding: '6rem 0', minHeight: '60vh' }}>
                <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📦</div>
                  <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Track Your Order</h2>
                  <p style={{ color: '#888', marginBottom: '2.5rem' }}>Enter your Order ID (e.g. DA-2026-0001)</p>
                  <div style={{ display: 'flex', gap: '12px', maxWidth: '480px', margin: '0 auto 2.5rem' }}>
                    <input
                      id="trackOrderId"
                      name="trackOrderId"
                      className="checkout-input"
                      placeholder="e.g. DA-2026-0001"
                      value={trackOrderId}
                      onChange={e => setTrackOrderId(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && trackOrder()}
                      style={{ flex: 1 }}
                    />
                    <button className="btn-primary" style={{ padding: '0 1.8rem', borderRadius: '14px' }} onClick={trackOrder}>TRACK</button>
                  </div>
                  {trackedOrder && (
                    <div className="price-list-container" style={{ textAlign: 'left', padding: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <h3 style={{ fontWeight: '900', fontSize: '1.3rem' }}>Order #{trackedOrder.billNumber}</h3>
                          <p style={{ color: '#888', fontSize: '0.82rem', marginTop: '2px' }}>{new Date(trackedOrder.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <span style={{ background: '#e6f2ff', color: '#0a2e6b', padding: '6px 16px', borderRadius: '20px', fontWeight: '800', fontSize: '0.78rem' }}>
                          {trackedOrder.paymentStatus || 'Pending'}
                        </span>
                      </div>

                      {/* Status Timeline */}
                      <div style={{ margin: '1.5rem 0 2rem', padding: '1.5rem', background: '#f8faff', borderRadius: '16px', border: '1px solid #e5eaf4' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', marginBottom: '1.5rem' }}>ORDER STATUS</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: '4px' }}>
                          {STATUS_STEPS.map((step, idx) => {
                            const isDone = currentStep > idx;
                            const isCurrent = currentStep === idx;
                            return (
                              <React.Fragment key={step}>
                                <div style={{ textAlign: 'center', minWidth: '80px', flex: 1 }}>
                                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? '#25D366' : isCurrent ? '#0a2e6b' : '#e5eaf4', color: (isDone || isCurrent) ? 'white' : '#aaa', fontWeight: '900', fontSize: '0.85rem', boxShadow: isCurrent ? '0 0 0 4px rgba(10,46,107,0.15)' : 'none', transition: 'all 0.3s' }}>
                                    {isDone ? '✓' : idx + 1}
                                  </div>
                                  <p style={{ fontSize: '0.62rem', fontWeight: '700', color: isCurrent ? '#0a2e6b' : isDone ? '#25D366' : '#aaa', lineHeight: '1.2' }}>{step}</p>
                                </div>
                                {idx < STATUS_STEPS.length - 1 && (
                                  <div style={{ height: '3px', flex: 1, background: isDone ? '#25D366' : '#e5eaf4', minWidth: '16px', marginBottom: '24px', transition: 'background 0.3s' }} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>

                      {/* Delivery Note from Admin */}
                      {trackedOrder.deliveryNote && (
                        <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '12px', padding: '1rem 1.2rem', marginBottom: '1.5rem' }}>
                          <p style={{ fontSize: '0.72rem', fontWeight: '800', color: '#7c6000', letterSpacing: '1px', marginBottom: '4px' }}>DELIVERY NOTE FROM US</p>
                          <p style={{ fontWeight: '700', color: '#5c4400' }}>{trackedOrder.deliveryNote}</p>
                        </div>
                      )}

                      <p style={{ color: '#555', marginBottom: '6px', fontSize: '0.9rem' }}><b>Customer:</b> {trackedOrder.customerName}</p>
                      <p style={{ color: '#555', marginBottom: '6px', fontSize: '0.9rem' }}><b>Address:</b> {trackedOrder.address}</p>
                      <div style={{ borderTop: '1px solid #eee', marginTop: '1.2rem', paddingTop: '1.2rem' }}>
                        {trackedOrder.items && trackedOrder.items.map((item, i) => (
                          <div key={i} className="product-row">
                            <span style={{ fontWeight: '700' }}>{item.name}</span>
                            <span style={{ color: '#888' }}>x{item.qty}</span>
                            <span style={{ fontWeight: '900', color: '#8B0000' }}>Rs.{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '1.3rem', borderTop: '2px solid #eee', paddingTop: '1rem', marginTop: '1rem' }}>
                        <span>TOTAL</span>
                        <span style={{ color: '#0a2e6b' }}>Rs.{trackedOrder.totalAmount}</span>
                      </div>
                      <p style={{ textAlign: 'center', marginTop: '1.2rem', color: '#888', fontSize: '0.82rem' }}>
                        Questions? WhatsApp us: +91 {settings.whatsapp_number ? settings.whatsapp_number.replace('91', '') : '76048 49468'}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            );
          })()}

          {/* WISHLIST VIEW */}
          {view === 'wishlist' && (
            <section className="container fade-in" style={{ padding: '6rem 0', minHeight: '60vh' }}>
              <div className="section-header">
                <h2 className="section-title">❤️ Your Wishlist</h2>
              </div>
              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <Heart size={80} color="#ddd" />
                  <p style={{ marginTop: '20px', fontWeight: '900', fontSize: '1.2rem', color: '#888' }}>Your wishlist is empty</p>
                  <button className="btn-primary" style={{ marginTop: '1.5rem', padding: '0.8rem 2rem' }} onClick={() => setView('shop')}>Browse Products</button>
                </div>
              ) : (
                <div className="product-grid">
                  {wishlist.map(p => (
                    <div key={p.id || p._id} className="product-card">
                      <button className="wishlist-btn" onClick={() => toggleWishlist(p)}
                        style={{ color: '#e63946', background: '#ffe5e8' }}>
                        <Heart size={16} fill="#e63946" />
                      </button>
                      <div className="product-card-img-wrapper">
                        {renderProductImage(p)}
                      </div>
                      <div className="product-card-category">{p.category}</div>
                      <h3 className="product-card-name">{p.name}</h3>
                      <div className="product-card-prices">
                        <span className="product-card-price">₹{p.price}</span>
                        <span className="product-card-mrp">₹{p.originalPrice}</span>
                        <span className="product-card-offer">{p.offer}% OFF</span>
                      </div>
                      <button onClick={() => { addToCart(p); showToast(`${p.name} added to cart!`); }} className="product-card-btn">
                        <ShoppingCart size={16} /> Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {/* SUCCESS / UPI PAYMENT PAGE */}
      {view === 'success' && lastOrder && view !== 'admin' && (
        <section className="container fade-in" style={{ padding: '4rem 0', minHeight: '70vh' }}>
          <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>

            {/* Success Header */}
            <div style={{ width: '90px', height: '90px', background: 'linear-gradient(135deg, #25D366, #128C7E)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 20px 50px rgba(37,211,102,0.3)' }}>
              <Check size={44} color="white" strokeWidth={3} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0a2e6b', marginBottom: '1.5rem' }}>Order Placed Successfully</h2>
            
            {/* ── WHAT HAPPENS NEXT GUIDE ── */}
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem 2rem', marginBottom: '2rem', textAlign: 'left', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '900', color: '#0a2e6b', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: '#0a2e6b', color: 'white', borderRadius: '6px', padding: '4px 10px', fontSize: '0.65rem' }}>NEXT STEPS</span>
                Order Processing Workflow
              </p>

              {/* Step 1 — Order Received */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '1.5rem' }}>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0a2e6b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem', color: 'white', boxShadow: '0 4px 12px rgba(10,46,107,0.15)' }}>1</div>
                  <div style={{ width: '2px', height: '35px', background: '#e2e8f0', margin: '4px 0' }} />
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <p style={{ fontWeight: '800', color: '#1a202c', fontSize: '1rem', margin: '0 0 4px' }}>Order Registration</p>
                  <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0, lineHeight: '1.5' }}>Your request has been securely recorded. Our team will review the submitted details shortly.</p>
                </div>
              </div>

              {/* Step 2 — Verification & Payment */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '1.5rem' }}>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0a2e6b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem', color: 'white' }}>2</div>
                  <div style={{ width: '2px', height: '35px', background: '#e2e8f0', margin: '4px 0' }} />
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <p style={{ fontWeight: '800', color: '#1a202c', fontSize: '1rem', margin: '0 0 4px' }}>Verification & Payment</p>
                  <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0, lineHeight: '1.5' }}>Our team will contact you directly via phone or WhatsApp to verify your delivery address and share official payment details.</p>
                </div>
              </div>

              {/* Step 3 — Processing */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '1.5rem' }}>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0a2e6b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem', color: 'white' }}>3</div>
                  <div style={{ width: '2px', height: '35px', background: '#e2e8f0', margin: '4px 0' }} />
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <p style={{ fontWeight: '800', color: '#1a202c', fontSize: '1rem', margin: '0 0 4px' }}>Processing</p>
                  <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0, lineHeight: '1.5' }}>Upon payment confirmation, your order will be professionally packed and prepared for secure dispatch.</p>
                </div>
              </div>

              {/* Step 4 — Dispatch */}
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0a2e6b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem', color: 'white' }}>4</div>
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <p style={{ fontWeight: '800', color: '#1a202c', fontSize: '1rem', margin: '0 0 4px' }}>Dispatch</p>
                  <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0, lineHeight: '1.5' }}>Consignment will be shipped via authorized lorry transport on a To-Pay basis. Transport receipt details will be shared.</p>
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => setView('shop')} style={{ padding: '0.9rem 2.5rem', background: '#0a2e6b', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', color: 'white', letterSpacing: '0.5px' }}>
                Return to Shop
              </button>
            </div>
          </div>
        </section>
      )}


      {activeBill && <Bill bill={activeBill} onClose={() => setActiveBill(null)} />}

      {view !== 'admin' && (
        <footer>
          <div className="container">
            <div className="footer-grid">
              <div>
                <div className="footer-logo" style={{ color: 'var(--gold)', fontWeight: '900', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                  DURGA AGENCIES
                </div>
                <p style={{ color: '#a0aec0', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  Lighting up celebrations with joy, safety & premium quality. Handpicked luxury crackers directly from Sivakasi.
                </p>
              </div>

              <div>
                <h4 className="footer-col-title">Quick Links</h4>
                <ul className="footer-links-list">
                  <li><a href="#" className="footer-link" onClick={() => setView('shop')}>Home</a></li>
                  <li><a href="#shop-section" className="footer-link" onClick={() => setView('shop')}>Price List</a></li>
                  <li><a href="#" className="footer-link" onClick={() => setView('shop')}>Offers</a></li>
                  <li><a href="#" className="footer-link" onClick={() => setView('shop')}>Safety Tips</a></li>
                </ul>
              </div>

              <div>
                <h4 className="footer-col-title">Customer Service</h4>
                <ul className="footer-links-list">
                  <li><a href="#" className="footer-link" onClick={() => setView('shop')}>Help & Support</a></li>
                  <li><a href="#" className="footer-link" onClick={() => setView('shop')}>Shipping Policy</a></li>
                  <li><a href="#" className="footer-link" onClick={() => setView('shop')}>Returns & Refunds</a></li>
                  <li><a href="#" className="footer-link" onClick={() => setView('shop')}>Privacy Policy</a></li>
                </ul>
              </div>

              <div>
                <h4 className="footer-col-title">Contact Us</h4>
                <p style={{ color: '#a0aec0', fontSize: '0.85rem', lineHeight: '1.6' }}>
                  📞 {settings.shop_phone || '+91 76048 49468'}<br />
                  📍 {settings.shop_address || '2/553D, Mettamalai, Sivakasi - 626 230'}
                </p>
              </div>

              <div>
                <h4 className="footer-col-title">Stay Updated</h4>
                <p style={{ color: '#a0aec0', fontSize: '0.82rem' }}>Subscribe to get the latest offers and price list updates.</p>
                <div className="newsletter-input-box">
                  <label htmlFor="newsletterEmail" style={{ display: 'none' }}>Newsletter Email Address</label>
                  <input
                    id="newsletterEmail"
                    name="newsletterEmail"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    className="newsletter-input"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleNewsletterSubscribe()}
                  />
                  <button className="newsletter-btn" onClick={handleNewsletterSubscribe}>Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Floating Bottom Cart Bar for Mobile */}
      {view === 'shop' && cart.length > 0 && (
        <a 
          href="#" 
          className="mobile-bottom-cart-bar" 
          onClick={(e) => { 
            e.preventDefault(); 
            setView('cart'); 
          }}
        >
          <div className="mobile-cart-bar-info">
            <span className="mobile-cart-bar-qty">
              {cart.reduce((s, i) => s + i.qty, 0)} {cart.reduce((s, i) => s + i.qty, 0) === 1 ? 'Item' : 'Items'} Added
            </span>
            <span className="mobile-cart-bar-total">₹{totalAmount}</span>
          </div>
          <div className="mobile-cart-bar-btn">
            <span>View Cart</span>
            <ShoppingCart size={16} />
          </div>
        </a>
      )}
    </div>
  );
};

// FULL PROFESSIONAL REDESIGN OF ADMIN
const AdminPortal = ({ isAdminAuthenticated, setIsAdminAuthenticated, adminPassword, setAdminPassword, fetchProducts, products, dynamicCategories, setParentView }) => {
  const [activeTab, setActiveTab] = useState('pos');
  const [orders, setOrders] = useState([]);
  const [lastBill, setLastBill] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { if (isAdminAuthenticated) fetchOrders(); }, [isAdminAuthenticated]);
  const fetchOrders = async () => { try { const token = localStorage.getItem('adminToken'); const res = await axios.get(`${API_BASE}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } }); setOrders(res.data); } catch (e) { } };

  if (!isAdminAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f7fc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="price-list-container" style={{ maxWidth: '420px', width: '100%', textAlign: 'center', border: '1px solid #e2e8f0', background: '#ffffff', padding: '4rem 2.5rem', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
          <div style={{ background: '#fdfbf7', width: '80px', height: '80px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '3px solid #8B0000' }}>
            <ShieldCheck size={40} color="#8B0000" />
          </div>
          <h2 style={{ color: '#121212', fontWeight: '900', fontSize: '1.8rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>COMMAND CENTER</h2>
          <p style={{ color: '#666', marginBottom: '3rem', fontSize: '0.85rem', fontWeight: '600' }}>AUTHORIZED ACCESS ONLY</p>

          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              const res = await axios.post(`${API_BASE}/admin/login`, { password: adminPassword });
              if (res.data.success && res.data.token) {
                localStorage.setItem('adminToken', res.data.token);
                setIsAdminAuthenticated(true);
              } else {
                alert('Access Denied!');
              }
            } catch (err) {
              alert(err.response?.data?.message || 'Access Denied!');
            }
          }}>
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
              <label htmlFor="adminPassword" style={{ display: 'none' }}>Portal Access Key</label>
              <Zap size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#8B0000' }} />
              <input
                id="adminPassword"
                name="adminPassword"
                type="password"
                autoComplete="current-password"
                placeholder="PORTAL ACCESS KEY"
                className="qty-input"
                style={{ width: '100%', padding: '1.4rem 1.5rem 1.4rem 3.5rem', background: '#f8fafc', border: '2px solid #e2e8f0', color: '#121212', fontSize: '1rem', fontWeight: '800', borderRadius: '18px', transition: 'all 0.3s' }}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#8B0000'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', height: '65px', fontSize: '1.1rem', borderRadius: '18px', background: 'linear-gradient(to right, #8B0000, #ff4c4c)', border: 'none', color: 'white' }}>UNLOCK VAULT</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div className="admin-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Header Bar */}
      <div className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} style={{ width: '32px', height: '32px', borderRadius: '6px' }} alt="Logo" />
          <span style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--dark)' }}>DURGA ADMIN</span>
        </div>
        <button className="admin-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <span style={{ fontSize: '1.5rem' }}>☰</span>}
        </button>
      </div>

      {/* Sidebar - FIXED & ALIGNED */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem', flexShrink: 0 }}><img src={logo} style={{ width: '40px', height: '40px', borderRadius: '8px' }} /><span style={{ fontWeight: '900', letterSpacing: '1px', fontSize: '1rem' }}>DURGA<br />AGENCIES</span></div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <AdminMenuItem icon={<Receipt size={20} />} label="POS Billing" active={activeTab === 'pos'} onClick={() => { setActiveTab('pos'); setSidebarOpen(false); }} />
          <AdminMenuItem icon={<History size={20} />} label="Orders History" active={activeTab === 'orders'} onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }} />
          <AdminMenuItem icon={<Inbox size={20} />} label="Full Inventory" active={activeTab === 'products'} onClick={() => { setActiveTab('products'); setSidebarOpen(false); }} />
          <AdminMenuItem icon={<Wand2 size={20} />} label="Bulk Operations" active={activeTab === 'bulk'} onClick={() => { setActiveTab('bulk'); setSidebarOpen(false); }} />
          <AdminMenuItem icon={<Calendar size={20} />} label="Order Sessions" active={activeTab === 'sessions'} onClick={() => { setActiveTab('sessions'); setSidebarOpen(false); }} />
          <AdminMenuItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }} />
          <div style={{ flex: 1 }}></div>
          <AdminMenuItem icon={<Home size={20} />} label="Exit to Store" onClick={() => { setParentView('shop'); setSidebarOpen(false); }} />
        </nav>
        <button onClick={() => { localStorage.removeItem('adminToken'); setIsAdminAuthenticated(false); }} style={{ marginTop: '0.8rem', flexShrink: 0, width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '700' }}><LogOut size={16} /> Logout</button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {lastBill && <Bill bill={lastBill} onClose={() => setLastBill(null)} />}
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#121212' }}>{activeTab.toUpperCase().replace('_', ' ')}</h1>
          <div style={{ width: '60px', height: '4px', background: '#8B0000', marginTop: '10px' }}></div>
        </header>

        {activeTab === 'pos' && <POSPanel products={products} setLastBill={setLastBill} fetchOrders={fetchOrders} />}
        {activeTab === 'products' && <InventoryPanel products={products} fetchProducts={fetchProducts} dynamicCategories={dynamicCategories} />}
        {activeTab === 'orders' && <OrdersPanel orders={orders} setLastBill={setLastBill} fetchOrders={fetchOrders} />}
        {activeTab === 'bulk' && <BulkPanel products={products} fetchProducts={fetchProducts} />}
        {activeTab === 'sessions' && <SessionsPanel />}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  );
};

const AdminMenuItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem 1.5rem', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s',
    background: active ? '#8B0000' : 'transparent', color: active ? 'white' : '#777', fontWeight: '800'
  }}>
    {icon} <span>{label}</span>
    {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
  </div>
);

const POSPanel = ({ products, setLastBill, fetchOrders }) => {
  const [posCart, setPosCart] = useState([]);
  const [cust, setCust] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [src, setSrc] = useState('');
  const filtered = products.filter(p => p.name.toLowerCase().includes(src.toLowerCase()));
  const total = posCart.reduce((s, i) => s + (i.price * i.qty), 0);
  const finish = async () => {
    if (posCart.length === 0) return alert('Cart is empty!');
    const fb = {
      customerName: cust || 'Walk-in Customer',
      phone: custPhone || '',
      address: custAddress || 'Shop',
      items: posCart,
      totalAmount: total,
      paymentMethod: 'Cash'
    };
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post(`${API_BASE}/admin/walkin-order`, fb, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.bill) {
        setLastBill(res.data.bill);
      }
      fetchOrders();
      setPosCart([]);
      setCust('');
      setCustPhone('');
      setCustAddress('');
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to create POS bill.');
    }
  };
  return (
    <div className="fade-in pos-layout">
      <div className="price-list-container">
        <div style={{ border: '1px solid #eee', padding: '1.2rem', borderRadius: '14px', display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <label htmlFor="posSearch" style={{ display: 'none' }}>Search POS Products</label>
          <Search color="#8B0000" />
          <input id="posSearch" name="posSearch" autoComplete="off" placeholder="Search product..." style={{ border: 'none', background: 'none', width: '100%', outline: 'none', fontWeight: '700' }} value={src} onChange={e => setSrc(e.target.value)} />
        </div>
        <div style={{ height: '550px', overflowY: 'auto' }}>
          {filtered.map(p => (<div key={p.id || p._id} className="product-row" style={{ padding: '1rem' }}><b style={{ fontSize: '1rem' }}>{p.name}</b><span style={{ fontWeight: '900', color: '#8B0000' }}>₹{p.price}</span><button onClick={() => setPosCart(prev => { const ex = prev.find(i => (i.id || i._id) === (p.id || p._id)); if (ex) return prev.map(i => (i.id || i._id) === (p.id || p._id) ? { ...i, qty: i.qty + 1 } : i); return [...prev, { ...p, qty: 1 }]; })} className="btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '10px' }}>ADD</button></div>))}
        </div>
      </div>
      <div style={{ background: '#ffffff', color: '#121212', borderRadius: '32px', padding: '3.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '2.5rem', letterSpacing: '1px' }}>TICKET SUMMARY</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
          <label htmlFor="posCustomerName" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#8B0000', letterSpacing: '2px', textTransform: 'uppercase' }}>Customer Name</label>
          <input id="posCustomerName" name="posCustomerName" autoComplete="name" placeholder="Enter customer name..." value={cust} onChange={e => setCust(e.target.value)} style={{ padding: '1.2rem', border: '2px solid #e2e8f0', background: '#f8fafc', color: '#121212', borderRadius: '16px', fontWeight: '800', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }} className="pos-input" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
          <label htmlFor="posCustomerPhone" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#8B0000', letterSpacing: '2px', textTransform: 'uppercase' }}>Phone Number <span style={{ color: '#aaa', fontWeight: '400' }}>(optional)</span></label>
          <input id="posCustomerPhone" name="posCustomerPhone" autoComplete="tel" type="tel" placeholder="e.g. 9876543210" value={custPhone} onChange={e => setCustPhone(e.target.value)} style={{ padding: '1rem 1.2rem', border: '2px solid #e2e8f0', background: '#f8fafc', color: '#121212', borderRadius: '16px', fontWeight: '700', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s' }} className="pos-input" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2.5rem' }}>
          <label htmlFor="posCustomerAddress" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#8B0000', letterSpacing: '2px', textTransform: 'uppercase' }}>Delivery Address <span style={{ color: '#aaa', fontWeight: '400' }}>(optional)</span></label>
          <input id="posCustomerAddress" name="posCustomerAddress" autoComplete="street-address" placeholder="e.g. 12, Gandhi Nagar, Chennai" value={custAddress} onChange={e => setCustAddress(e.target.value)} style={{ padding: '1rem 1.2rem', border: '2px solid #e2e8f0', background: '#f8fafc', color: '#121212', borderRadius: '16px', fontWeight: '700', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s' }} className="pos-input" />
        </div>
        <div style={{ flex: 1, minHeight: '350px' }}>{posCart.map(i => <div key={i.id || i._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', fontWeight: '600' }}><span>{i.name} x {i.qty}</span><span style={{ color: '#8B0000', fontWeight: '900' }}>₹{i.price * i.qty}</span></div>)}</div>
        <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '2rem', textAlign: 'center' }}><h2 style={{ fontSize: '2.5rem', color: '#121212', fontWeight: '900', marginBottom: '1.5rem' }}>₹{total.toLocaleString()}</h2><button onClick={finish} className="btn-primary" style={{ width: '100%', height: '65px', background: '#8B0000', color: 'white', fontSize: '1.2rem' }}>SAVE & PRINT</button></div>
      </div>
    </div>
  );
};

const InventoryPanel = ({ products, fetchProducts, dynamicCategories }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [isNewCat, setIsNewCat] = useState(false);
  const [newP, setNewP] = useState({ name: '', category: dynamicCategories[1] || '', price: '', offer: '', image: '', stock: 100, tempCat: '' });
  const [editP, setEditP] = useState(null);

  // Search & Filter States
  const [srcQuery, setSrcQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'low' | 'out'

  // Summary Metrics
  const totalItems = products.length;
  const lowStockCount = products.filter(p => p.stock !== undefined && p.stock !== null && p.stock > 0 && p.stock < 20).length;
  const outOfStockCount = products.filter(p => p.stock === undefined || p.stock === null || p.stock <= 0).length;

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(srcQuery.toLowerCase());
      const matchesCategory = selectedCat === 'All' || p.category === selectedCat;
      let matchesStock = true;
      if (stockFilter === 'low') {
        matchesStock = p.stock !== undefined && p.stock !== null && p.stock > 0 && p.stock < 20;
      } else if (stockFilter === 'out') {
        matchesStock = p.stock === undefined || p.stock === null || p.stock <= 0;
      }
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, srcQuery, selectedCat, stockFilter]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const finalProd = { ...newP, category: isNewCat ? newP.tempCat : newP.category };
    if (!finalProd.name || !finalProd.category) return alert('Fill all fields!');
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${API_BASE}/admin/add-product`, finalProd, { headers: { Authorization: `Bearer ${token}` } });
      setShowAdd(false); setIsNewCat(false);
      setNewP({ name: '', category: dynamicCategories[1] || '', price: '', offer: '', image: '', stock: 100, tempCat: '' });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add product.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editP.name || !editP.category) return alert('Fill all fields!');
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${API_BASE}/admin/products/${editP.id || editP._id}`, {
        name: editP.name,
        category: editP.category,
        price: parseFloat(editP.price || 0),
        offer: parseInt(editP.offer || 0),
        stock: parseInt(editP.stock || 0)
      }, { headers: { Authorization: `Bearer ${token}` } });
      setEditP(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update product.');
    }
  };

  const adjustStock = async (p, amt) => {
    const currentStock = p.stock !== undefined && p.stock !== null ? p.stock : 100;
    const newStock = Math.max(0, currentStock + amt);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${API_BASE}/admin/products/${p.id || p._id}`, { stock: newStock }, { headers: { Authorization: `Bearer ${token}` } });
      fetchProducts();
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="fade-in">

      {/* SUMMARY WIDGETS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#888', letterSpacing: '1px' }}>TOTAL PRODUCTS</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#121212' }}>{totalItems}</span>
        </div>
        <div onClick={() => setStockFilter(stockFilter === 'low' ? 'all' : 'low')} style={{ background: '#fffbeb', border: stockFilter === 'low' ? '2px solid #dd6b20' : '1px solid #fde68a', borderRadius: '18px', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(221,107,32,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#dd6b20', letterSpacing: '1px' }}>⚠️ LOW STOCK (&lt;20)</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#b45309' }}>{lowStockCount} Items</span>
        </div>
        <div onClick={() => setStockFilter(stockFilter === 'out' ? 'all' : 'out')} style={{ background: '#fff5f5', border: stockFilter === 'out' ? '2px solid #e53e3e' : '1px solid #fed7d7', borderRadius: '18px', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(229,62,62,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#e53e3e', letterSpacing: '1px' }}>🚨 OUT OF STOCK (0)</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#9b2c2c' }}>{outOfStockCount} Items</span>
        </div>
      </div>

      {/* FILTER CONTROL BAR */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ flex: '1 1 250px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '14px', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={18} color="#aaa" />
          <input id="invSearch" name="invSearch" autoComplete="off" placeholder="Search product name..." value={srcQuery} onChange={e => setSrcQuery(e.target.value)} style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontWeight: '700', fontSize: '0.9rem' }} />
        </div>

        {/* Category */}
        <div style={{ flex: '1 1 200px' }}>
          <select id="invCatSelect" name="invCatSelect" value={selectedCat} onChange={e => setSelectedCat(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1.2rem', border: '2px solid #e2e8f0', borderRadius: '14px', background: 'white', fontWeight: '700', outline: 'none', fontSize: '0.9rem' }}>
            <option value="All">All Categories</option>
            {dynamicCategories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Add Product Button */}
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ padding: '0.8rem 2rem', background: '#8B0000', borderRadius: '14px', fontSize: '0.9rem', marginLeft: 'auto' }}>
          + New Product
        </button>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="desktop-only price-list-container" style={{ padding: 0 }}>
        <div className="table-responsive">
          <table style={{ width: '100%', textAlign: 'left' }}>
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '1.5rem' }}>PRODUCT</th>
                <th>MRP</th>
                <th>OFFER</th>
                <th>SELLING PRICE</th>
                <th>STOCK LEVEL (ADJUST)</th>
                <th style={{ textAlign: 'right', paddingRight: '2rem' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id || p._id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <b>{p.name}</b><br />
                    <small style={{ color: '#888', fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase' }}>{p.category}</small>
                  </td>
                  <td style={{ color: '#aaa', fontSize: '0.9rem' }}>₹{p.originalPrice}</td>
                  <td style={{ color: 'green', fontWeight: '800', fontSize: '0.9rem' }}>{p.offer}% Off</td>
                  <td style={{ fontWeight: '900', color: '#8B0000' }}>₹{p.price}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => adjustStock(p, -10)} style={{ border: 'none', background: '#fee2e2', color: '#9b2c2c', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '900', fontSize: '0.75rem' }}>-10</button>
                      <button onClick={() => adjustStock(p, -1)} style={{ border: 'none', background: '#f3f4f6', color: '#1f2937', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '900', fontSize: '0.85rem' }}>-</button>
                      
                      <span style={{
                        display: 'inline-block',
                        minWidth: '55px',
                        textAlign: 'center',
                        fontWeight: '800',
                        fontSize: '0.92rem',
                        color: p.stock <= 0 ? '#e53e3e' : p.stock < 20 ? '#dd6b20' : '#121212',
                        background: p.stock <= 0 ? '#fff5f5' : p.stock < 20 ? '#fffbeb' : 'transparent',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        {p.stock !== undefined && p.stock !== null ? p.stock : 100} pcs
                      </span>

                      <button onClick={() => adjustStock(p, 1)} style={{ border: 'none', background: '#f3f4f6', color: '#1f2937', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '900', fontSize: '0.85rem' }}>+</button>
                      <button onClick={() => adjustStock(p, 10)} style={{ border: 'none', background: '#dcfce7', color: '#15803d', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '900', fontSize: '0.75rem' }}>+10</button>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setEditP(p)} style={{ color: '#64748b', cursor: 'pointer', background: 'none', border: 'none' }} title="Edit Product">
                        <Edit size={18} />
                      </button>
                      <button onClick={async () => { if (window.confirm("Delete product?")) { const token = localStorage.getItem('adminToken'); await axios.delete(`${API_BASE}/admin/products/${p.id || p._id}`, { headers: { Authorization: `Bearer ${token}` } }); fetchProducts(); } }} style={{ color: '#cbd5e1', cursor: 'pointer', background: 'none', border: 'none' }} onMouseOver={e => e.currentTarget.style.color = 'red'} onMouseOut={e => e.currentTarget.style.color = '#cbd5e1'} title="Delete Product">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE LIST VIEW */}
      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredProducts.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888', background: 'white', borderRadius: '18px', border: '1px solid #eef2f9' }}>No items found.</div>
        )}
        {filteredProducts.map(p => (
          <div key={p.id || p._id} style={{ background: 'white', borderRadius: '18px', padding: '1.2rem', border: '1px solid #eef2f9', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <b style={{ fontSize: '0.98rem', color: '#121212' }}>{p.name}</b>
                <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: '#888', textTransform: 'uppercase', marginTop: '2px' }}>{p.category}</span>
              </div>
              <span style={{ fontWeight: '900', color: '#8B0000', fontSize: '1.05rem' }}>₹{p.price}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.78rem', marginBottom: '12px' }}>
              <span>MRP: <span style={{ textDecoration: 'line-through' }}>₹{p.originalPrice}</span></span>
              <span style={{ color: '#16a34a', fontWeight: '800' }}>{p.offer}% Off</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>STOCK QUANTITY</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button onClick={() => adjustStock(p, -10)} style={{ border: 'none', background: '#fee2e2', color: '#9b2c2c', width: '26px', height: '26px', borderRadius: '6px', fontWeight: '900', fontSize: '0.7rem' }}>-10</button>
                <button onClick={() => adjustStock(p, -1)} style={{ border: 'none', background: '#e2e8f0', color: '#1f2937', width: '26px', height: '26px', borderRadius: '6px', fontWeight: '900', fontSize: '0.8rem' }}>-</button>
                <span style={{
                  minWidth: '50px',
                  textAlign: 'center',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  color: p.stock <= 0 ? '#e53e3e' : p.stock < 20 ? '#dd6b20' : '#121212'
                }}>{p.stock !== undefined && p.stock !== null ? p.stock : 100} pcs</span>
                <button onClick={() => adjustStock(p, 1)} style={{ border: 'none', background: '#e2e8f0', color: '#1f2937', width: '26px', height: '26px', borderRadius: '6px', fontWeight: '900', fontSize: '0.8rem' }}>+</button>
                <button onClick={() => adjustStock(p, 10)} style={{ border: 'none', background: '#dcfce7', color: '#15803d', width: '26px', height: '26px', borderRadius: '6px', fontWeight: '900', fontSize: '0.7rem' }}>+10</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setEditP(p)} style={{ flex: 1, padding: '8px', border: '1px solid #e2e8f0', background: 'none', borderRadius: '10px', color: '#64748b', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Edit size={14} /> Edit details
              </button>
              <button onClick={async () => { if (window.confirm("Delete product?")) { const token = localStorage.getItem('adminToken'); await axios.delete(`${API_BASE}/admin/products/${p.id || p._id}`, { headers: { Authorization: `Bearer ${token}` } }); fetchProducts(); } }}
                style={{ padding: '8px 12px', border: '1px solid #fee2e2', background: 'none', borderRadius: '10px', color: '#ef4444', cursor: 'pointer' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD POPUP */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div className="admin-modal-content">
            <h2 style={{ marginBottom: '2rem', fontWeight: '900', fontSize: '1.6rem', color: '#121212', letterSpacing: '1px' }}>NEW PRODUCT</h2>

            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ textAlign: 'left' }}>
                <label htmlFor="newProductName" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Product Name</label>
                <input id="newProductName" name="newProductName" autoComplete="off" placeholder="Ex: Laksmi 2.5 Inch" value={newP.name} onChange={e => setNewP({ ...newP, name: e.target.value })} style={{ width: '100%', padding: '1rem', border: '2px solid #f0f0f0', background: '#fff', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', outline: 'none' }} required />
              </div>

              <div style={{ textAlign: 'left' }}>
                <label htmlFor="newProductCategory" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Category</label>
                {!isNewCat ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select id="newProductCategory" name="newProductCategory" value={newP.category} onChange={e => setNewP({ ...newP, category: e.target.value })} style={{ flex: 1, padding: '1rem', border: '2px solid #f0f0f0', background: '#fff', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', outline: 'none' }}>
                      {dynamicCategories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button type="button" onClick={() => setIsNewCat(true)} style={{ background: '#f5f5f5', border: 'none', padding: '0 1.2rem', borderRadius: '14px', color: '#8B0000', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer' }}>+</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input id="newProductCategoryTemp" name="newProductCategoryTemp" autoComplete="off" placeholder="Type new category..." value={newP.tempCat} onChange={e => setNewP({ ...newP, tempCat: e.target.value })} style={{ flex: 1, padding: '1rem', border: '2px solid #8B0000', background: '#fff', borderRadius: '14px', fontWeight: '700', fontSize: '0.95rem', outline: 'none' }} autoFocus />
                    <button type="button" onClick={() => setIsNewCat(false)} style={{ background: '#f5f5f5', border: 'none', padding: '0 1.2rem', borderRadius: '14px', color: '#888', fontWeight: '900', cursor: 'pointer' }}>X</button>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ textAlign: 'left' }}>
                  <label htmlFor="newProductPrice" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Selling Price (₹)</label>
                  <input id="newProductPrice" name="newProductPrice" placeholder="0.00" type="number" step="0.01" value={newP.price} onChange={e => setNewP({ ...newP, price: e.target.value })} style={{ width: '100%', padding: '1rem', border: '2px solid #f0f0f0', background: '#fff', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', outline: 'none' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <label htmlFor="newProductOffer" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Offer (%)</label>
                  <input id="newProductOffer" name="newProductOffer" placeholder="0" type="number" value={newP.offer} onChange={e => setNewP({ ...newP, offer: e.target.value })} style={{ width: '100%', padding: '1rem', border: '2px solid #f0f0f0', background: '#fff', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', outline: 'none' }} />
                </div>
              </div>

              <div style={{ textAlign: 'left' }}>
                <label htmlFor="newProductStock" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Initial Stock (pcs)</label>
                <input id="newProductStock" name="newProductStock" placeholder="100" type="number" value={newP.stock} onChange={e => setNewP({ ...newP, stock: e.target.value })} style={{ width: '100%', padding: '1rem', border: '2px solid #f0f0f0', background: '#fff', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', outline: 'none' }} />
              </div>

              <button type="submit" className="btn-primary" style={{ height: '55px', fontSize: '1.1rem', background: '#8B0000', borderRadius: '14px', marginTop: '1rem' }}>SAVE PRODUCT</button>
              <button type="button" onClick={() => { setShowAdd(false); setIsNewCat(false); }} style={{ border: 'none', background: 'none', color: '#888', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}>CANCEL</button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT POPUP */}
      {editP && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div className="admin-modal-content">
            <h2 style={{ marginBottom: '2rem', fontWeight: '900', fontSize: '1.6rem', color: '#121212', letterSpacing: '1px' }}>EDIT PRODUCT</h2>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ textAlign: 'left' }}>
                <label htmlFor="editProductName" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Product Name</label>
                <input id="editProductName" name="editProductName" autoComplete="off" placeholder="Ex: Laksmi 2.5 Inch" value={editP.name} onChange={e => setEditP({ ...editP, name: e.target.value })} style={{ width: '100%', padding: '1rem', border: '2px solid #f0f0f0', background: '#fff', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', outline: 'none' }} required />
              </div>

              <div style={{ textAlign: 'left' }}>
                <label htmlFor="editProductCategory" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Category</label>
                <select id="editProductCategory" name="editProductCategory" value={editP.category} onChange={e => setEditP({ ...editP, category: e.target.value })} style={{ width: '100%', padding: '1rem', border: '2px solid #f0f0f0', background: '#fff', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', outline: 'none' }}>
                  {dynamicCategories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ textAlign: 'left' }}>
                  <label htmlFor="editProductPrice" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Selling Price (₹)</label>
                  <input id="editProductPrice" name="editProductPrice" placeholder="0.00" type="number" step="0.01" value={editP.price} onChange={e => setEditP({ ...editP, price: e.target.value })} style={{ width: '100%', padding: '1rem', border: '2px solid #f0f0f0', background: '#fff', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', outline: 'none' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <label htmlFor="editProductOffer" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Offer (%)</label>
                  <input id="editProductOffer" name="editProductOffer" placeholder="0" type="number" value={editP.offer} onChange={e => setEditP({ ...editP, offer: e.target.value })} style={{ width: '100%', padding: '1rem', border: '2px solid #f0f0f0', background: '#fff', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', outline: 'none' }} />
                </div>
              </div>

              <div style={{ textAlign: 'left' }}>
                <label htmlFor="editProductStock" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Stock Quantity (pcs)</label>
                <input id="editProductStock" name="editProductStock" placeholder="100" type="number" value={editP.stock} onChange={e => setEditP({ ...editP, stock: e.target.value })} style={{ width: '100%', padding: '1rem', border: '2px solid #f0f0f0', background: '#fff', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', outline: 'none' }} />
              </div>

              <button type="submit" className="btn-primary" style={{ height: '55px', fontSize: '1.1rem', background: '#8B0000', borderRadius: '14px', marginTop: '1rem' }}>SAVE CHANGES</button>
              <button type="button" onClick={() => setEditP(null)} style={{ border: 'none', background: 'none', color: '#888', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}>CANCEL</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

const OrdersPanel = ({ orders, fetchOrders }) => {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [statusEdits, setStatusEdits] = useState({});
  const [waSending, setWaSending] = useState({});
  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderType === filter);

  const STATUS_OPTIONS = ['Pending Payment', 'Payment Received', 'Packing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const getStatusColor = (s) => {
    if (s === 'Delivered') return '#25D366';
    if (s === 'Out for Delivery') return '#0288D1';
    if (s === 'Packing') return '#7B1FA2';
    if (s === 'Payment Received') return '#F57C00';
    if (s === 'Cancelled') return '#e53e3e';
    return '#888';
  };

  const saveStatus = async (o) => {
    const edit = statusEdits[o.id || o._id] || {};
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${API_BASE}/admin/orders/${o.id || o._id}/status`, {
        orderStatus: edit.orderStatus || o.orderStatus || 'Pending Payment',
        deliveryNote: edit.deliveryNote !== undefined ? edit.deliveryNote : (o.deliveryNote || ''),
        paymentStatus: ['Payment Received', 'Packing', 'Out for Delivery', 'Delivered'].includes(edit.orderStatus) ? 'Paid' : o.paymentStatus
      }, { headers: { Authorization: `Bearer ${token}` } });
      fetchOrders();
      setExpandedId(null);
      setStatusEdits(prev => { const n = { ...prev }; delete n[o.id || o._id]; return n; });
    } catch (e) { alert('Failed to update: ' + (e.response?.data?.error || e.message)); }
  };

  const sendWhatsApp = async (o, messageType) => {
    let msg = '';
    if (messageType === 'payment_request') {
      const items = o.items ? (typeof o.items === 'string' ? JSON.parse(o.items) : o.items) : [];
      const itemsList = items.map(i => `- ${i.name} x ${i.qty} = Rs.${i.price * i.qty}`).join('%0A');
      msg = `*DURGA AGENCIES — Order Received!*%0A%0AHi *${o.customerName}*,%0A%0A📦 Order ID: %23${o.billNumber || o.id}%0A💰 Total: Rs.${o.totalAmount}%0A%0A*Items:*%0A${itemsList}%0A%0A✅ Please reply with "YES" to confirm your order.%0AWe will guide you with the payment details after your confirmation.%0A%0AThank you! 🙏🪔`;
    } else if (messageType === 'packing') {
      msg = `*DURGA AGENCIES — Payment Confirmed!*%0A%0AHi *${o.customerName}*,%0AYour payment is confirmed. We are now PACKING your order! 🎉%0A%0AOrder ID: %23${o.billNumber || o.id}%0AAmount: Rs.${o.totalAmount}%0A%0AThank you! 🪔`;
    } else if (messageType === 'dispatched') {
      msg = `*DURGA AGENCIES — Parcel Dispatched!*%0A%0AHi *${o.customerName}*,%0AYour order has been DISPATCHED! 🚚%0A%0AOrder ID: %23${o.billNumber || o.id}${o.deliveryNote ? `%0AVan Info: ${o.deliveryNote}` : ''}%0A%0AThank you! 🪔`;
    }
    const phone = (o.phone || '').replace(/\D/g, '');
    window.open(`https://wa.me/${phone.length === 10 ? '91' + phone : phone}?text=${msg}`, '_blank');
  };

  const getSmartActions = (o) => {
    const status = o.orderStatus || 'Pending Payment';
    const oid = o.id || o._id;
    const actions = [];

    if (status === 'Pending Payment') {
      actions.push(
        <button key="pay" onClick={() => sendWhatsApp(o, 'payment_request')} disabled={waSending[oid + 'payment_request']}
          style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: '10px', padding: '0.6rem 1.2rem', fontSize: '0.82rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: waSending[oid + 'payment_request'] ? 0.7 : 1 }}>
          <MessageCircle size={16} /> {waSending[oid + 'payment_request'] ? 'Opening...' : 'WhatsApp: Confirm Order'}
        </button>
      );
    }
    if (status === 'Payment Received' || status === 'Packing') {
      actions.push(
        <button key="pack" onClick={() => sendWhatsApp(o, 'packing')} disabled={waSending[oid + 'packing']}
          style={{ background: '#7B1FA2', color: 'white', border: 'none', borderRadius: '10px', padding: '0.6rem 1.2rem', fontSize: '0.82rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: waSending[oid + 'packing'] ? 0.7 : 1 }}>
          <MessageCircle size={16} /> {waSending[oid + 'packing'] ? 'Opening...' : 'WhatsApp: Packing Started'}
        </button>
      );
    }
    if (status === 'Out for Delivery') {
      actions.push(
        <button key="dispatch" onClick={() => sendWhatsApp(o, 'dispatched')} disabled={waSending[oid + 'dispatched']}
          style={{ background: '#0288D1', color: 'white', border: 'none', borderRadius: '10px', padding: '0.6rem 1.2rem', fontSize: '0.82rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: waSending[oid + 'dispatched'] ? 0.7 : 1 }}>
          <MessageCircle size={16} /> {waSending[oid + 'dispatched'] ? 'Opening...' : 'WhatsApp: Dispatched'}
        </button>
      );
    }

    // Always show a generic WhatsApp update button
    actions.push(
      <button key="generic" onClick={() => sendWhatsApp(o, 'generic')} disabled={waSending[oid + 'generic']}
        style={{ background: '#128C7E', color: 'white', border: 'none', borderRadius: '10px', padding: '0.6rem 1.2rem', fontSize: '0.82rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: waSending[oid + 'generic'] ? 0.7 : 1 }}>
        <MessageCircle size={16} /> {waSending[oid + 'generic'] ? 'Opening...' : 'WhatsApp: Status Update'}
      </button>
    );

    return actions;
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{ background: filter === 'all' ? '#8B0000' : '#f5f5f5', color: filter === 'all' ? 'white' : '#666', border: 'none', padding: '0.6rem 2rem', borderRadius: '50px', fontWeight: '800' }}>ALL ({orders.length})</button>
        <button onClick={() => setFilter('online')} style={{ background: filter === 'online' ? '#8B0000' : '#f5f5f5', color: filter === 'online' ? 'white' : '#666', border: 'none', padding: '0.6rem 2rem', borderRadius: '50px', fontWeight: '800' }}>ONLINE</button>
        <button onClick={() => setFilter('walkin')} style={{ background: filter === 'walkin' ? '#8B0000' : '#f5f5f5', color: filter === 'walkin' ? 'white' : '#666', border: 'none', padding: '0.6rem 2rem', borderRadius: '50px', fontWeight: '800' }}>WALK-IN</button>
      </div>

      <div className="price-list-container" style={{ padding: 0 }}>
        {filtered.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#aaa' }}>No orders found.</div>
        )}
        {filtered.slice().reverse().map(o => {
          const oid = o.id || o._id;
          const isExpanded = expandedId === oid;
          const edit = statusEdits[oid] || {};
          const currentStatus = edit.orderStatus !== undefined ? edit.orderStatus : (o.orderStatus || 'Pending Payment');
          const currentNote = edit.deliveryNote !== undefined ? edit.deliveryNote : (o.deliveryNote || '');
          const orderItems = o.items ? (typeof o.items === 'string' ? JSON.parse(o.items) : o.items) : [];

          return (
            <div key={oid} style={{ borderBottom: '1px solid #f0f0f0' }}>
              {/* Main Row */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', gap: '1rem', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => setExpandedId(isExpanded ? null : oid)}>
                <div style={{ flex: '0 0 90px', fontSize: '0.8rem', color: '#888', fontWeight: '700' }}>{new Date(o.orderDate || o.order_date).toLocaleDateString('en-IN')}</div>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{o.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#aaa' }}>#{o.billNumber || o.id} · 📞 {o.phone || '—'}</div>
                </div>
                <div style={{ fontWeight: '900', color: '#8B0000', fontSize: '1.05rem', flex: '0 0 auto' }}>Rs.{o.totalAmount}</div>
                <span style={{ background: `${getStatusColor(o.orderStatus || 'Pending Payment')}22`, color: getStatusColor(o.orderStatus || 'Pending Payment'), padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', flex: '0 0 auto' }}>
                  {o.orderStatus || 'Pending Payment'}
                </span>
                <span style={{ color: '#ccc', fontSize: '1.2rem', marginLeft: 'auto' }}>{isExpanded ? '▲' : '▼'}</span>
              </div>

              {/* Expanded Panel */}
              {isExpanded && (
                <div style={{ padding: '1.2rem 1.5rem 1.5rem', background: '#f8faff', borderTop: '1px solid #eef2f9' }}>

                  {/* Order Items */}
                  {orderItems.length > 0 && (
                    <div style={{ marginBottom: '1.5rem', background: 'white', borderRadius: '12px', border: '1px solid #eef2f9', padding: '1rem 1.2rem' }}>
                      <p style={{ fontSize: '0.68rem', fontWeight: '800', color: '#888', letterSpacing: '1px', marginBottom: '10px' }}>ORDER ITEMS</p>
                      {orderItems.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '600', padding: '4px 0', borderBottom: i < orderItems.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                          <span>{item.name} × {item.qty}</span>
                          <span style={{ fontWeight: '900', color: '#8B0000' }}>Rs.{item.price * item.qty}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', marginTop: '10px', paddingTop: '8px', borderTop: '2px solid #f0f0f0' }}>
                        <span>TOTAL</span><span style={{ color: '#8B0000' }}>Rs.{o.totalAmount}</span>
                      </div>
                    </div>
                  )}

                  {/* Status & Note Editors */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label htmlFor={`order-status-${oid}`} style={{ fontSize: '0.68rem', fontWeight: '800', color: '#888', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>UPDATE STATUS</label>
                      <select id={`order-status-${oid}`} name="orderStatus" value={currentStatus}
                        onChange={e => setStatusEdits(prev => ({ ...prev, [oid]: { ...prev[oid], orderStatus: e.target.value } }))}
                        style={{ width: '100%', padding: '0.8rem 1rem', border: '2px solid #e5eaf4', borderRadius: '10px', fontWeight: '700', background: 'white', fontSize: '0.9rem', outline: 'none' }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`delivery-note-${oid}`} style={{ fontSize: '0.68rem', fontWeight: '800', color: '#888', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>DELIVERY NOTE</label>
                      <input id={`delivery-note-${oid}`} name="deliveryNote" value={currentNote}
                        onChange={e => setStatusEdits(prev => ({ ...prev, [oid]: { ...prev[oid], deliveryNote: e.target.value } }))}
                        placeholder="e.g. Van arriving 4-6 PM today"
                        style={{ width: '100%', padding: '0.8rem 1rem', border: '2px solid #e5eaf4', borderRadius: '10px', fontWeight: '600', background: 'white', fontSize: '0.88rem', outline: 'none' }} />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button onClick={() => saveStatus(o)} className="btn-primary" style={{ padding: '0.6rem 1.8rem', background: '#0a2e6b', borderRadius: '10px', fontSize: '0.85rem' }}>
                      💾 Save Status
                    </button>
                    {getSmartActions(o)}
                    <button onClick={async () => { if (window.confirm('Delete this order?')) { const token = localStorage.getItem('adminToken'); await axios.delete(`${API_BASE}/admin/orders/${oid}`, { headers: { Authorization: `Bearer ${token}` } }); fetchOrders(); } }}
                      style={{ color: '#e53e3e', background: 'none', border: '1px solid #e53e3e', borderRadius: '10px', padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', marginLeft: 'auto' }}>
                      🗑 Delete
                    </button>
                  </div>

                  {/* Workflow Guide */}
                  <div style={{ marginTop: '1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '0.8rem 1.2rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#92400e', marginBottom: '4px' }}>⚡ ORDER WORKFLOW</p>
                    <p style={{ fontSize: '0.72rem', color: '#78350f', lineHeight: '1.6', margin: 0 }}>
                      1️⃣ <b>Pending Payment</b> → Send "Payment Request" via WhatsApp → Customer pays UPI<br/>
                      2️⃣ Customer sends screenshot → Change status to <b>Payment Received</b> → Save<br/>
                      3️⃣ Send "Packing Started" notification → Change to <b>Packing</b><br/>
                      4️⃣ Change to <b>Out for Delivery</b> → Send "Dispatched" notification<br/>
                      5️⃣ Mark as <b>Delivered</b> when complete ✅
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BulkPanel = ({ products, fetchProducts }) => {
  const [msg, setMsg] = useState('');
  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const fd = new FormData();
    files.forEach(f => fd.append('images', f));

    setMsg(`🔄 MAGIC MATCHING: ATTEMPTING TO LINK ${files.length} PHOTOS...`);
    try {
      const res = await axios.post(`${API_BASE}/admin/bulk-link-images`, fd);
      setMsg(`✨ MAGIC LINK SUCCESS: ${res.data.count} PRODUCTS MATCHED AND UPDATED!`);
      fetchProducts();
    } catch (err) {
      setMsg('❌ MAGIC LINK FAILED. CHECK FILE NAMES.');
    }
  };

  const handleCSV = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const fd = new FormData(); fd.append('file', f);
    setMsg('🔄 INITIALIZING MASTER SYNC... PLEASE WAIT');

    try {
      const res = await axios.post(`${API_BASE}/admin/upload-csv`, fd);
      setMsg(`✅ EXCEL SYNC SUCCESSFUL: ${res.data.count} PRODUCTS UPDATED!`);
      fetchProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'CRITICAL SYNC FAILURE';
      setMsg(`❌ ERROR: ${errorMsg}`);
    }

    e.target.value = '';
    setTimeout(() => setMsg(''), 15000);
  };

  return (
    <div className="fade-in" style={{ position: 'relative' }}>
      {/* High-Visibility Overlay Message */}
      {msg && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: msg.includes('❌') ? '#8B0000' : '#121212',
          color: '#FFD700', padding: '2rem 4rem', borderRadius: '24px',
          zIndex: 10000, textAlign: 'center', fontWeight: '900', fontSize: '1.2rem',
          boxShadow: '0 50px 150px rgba(0,0,0,0.8)', border: '4px solid #FFD700',
          display: 'flex', flexDirection: 'column', gap: '15px'
        }}>
          {msg.includes('🔄') ? <div className="chakkar-loader" style={{ margin: '0 auto' }}></div> : null}
          {msg}
          {!msg.includes('🔄') && <button onClick={() => setMsg('')} style={{ background: '#FFD700', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '900', marginTop: '10px' }}>CLOSE</button>}
        </div>
      )}
      <div className="admin-grid-2" style={{ marginBottom: '2.5rem' }}>
        <div className="price-list-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}><FileSpreadsheet size={64} color="#8B0000" style={{ marginBottom: '2rem' }} /><h3>Excel Master Sync</h3><p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '2.5rem' }}>Upload Excel file to populate 100+ items instantly.</p><label className="btn-primary" style={{ cursor: 'pointer', padding: '1rem 2rem', display: 'inline-block', whiteSpace: 'nowrap' }}>SELECT CSV FILE<input id="bulk-csv-upload" name="bulkCsvUpload" type="file" style={{ display: 'none' }} onChange={handleCSV} /></label></div>
        <div className="price-list-container" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#121212', color: 'white' }}><Wand2 size={64} color="#FFD700" style={{ marginBottom: '2rem' }} /><h3>Magic Photo Auto-Link</h3><p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '2.5rem' }}>Automatically link 100+ photos via filenames.</p><label className="btn-primary" style={{ cursor: 'pointer', background: '#FFD700', color: 'black', padding: '1rem 2rem', display: 'inline-block', whiteSpace: 'nowrap' }}>LOAD PHOTOS<input id="bulk-photos-upload" name="bulkPhotosUpload" type="file" multiple style={{ display: 'none' }} onChange={handleImages} /></label></div>
      </div>
      {msg && <div style={{ background: '#8B0000', color: 'white', padding: '1.5rem', borderRadius: '18px', textAlign: 'center', fontWeight: '900', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>{msg}</div>}
    </div>
  );
};

const SessionsPanel = () => {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({ label: '', startDate: '', endDate: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [statusInfo, setStatusInfo] = useState(null);

  const fetchSessions = async () => {
    try { const res = await axios.get(`${API_BASE}/admin/sessions`); setSessions(res.data); } catch (e) { }
  };
  const fetchStatus = async () => {
    try { const res = await axios.get(`${API_BASE}/session/status`); setStatusInfo(res.data); } catch (e) { }
  };
  useEffect(() => { fetchSessions(); fetchStatus(); }, []);

  const createSession = async () => {
    if (!newSession.label || !newSession.startDate || !newSession.endDate) return alert('Fill all fields!');
    try {
      await axios.post(`${API_BASE}/admin/sessions`, newSession);
      setNewSession({ label: '', startDate: '', endDate: '' });
      setShowAdd(false);
      fetchSessions(); fetchStatus();
    } catch (e) { alert(e.response?.data?.error || 'Failed'); }
  };

  const toggleSession = async (id, currentActive) => {
    try {
      await axios.patch(`${API_BASE}/admin/sessions/${id}`, { isActive: currentActive ? 0 : 1 });
      fetchSessions(); fetchStatus();
    } catch (e) { alert('Failed'); }
  };

  const deleteSession = async (id) => {
    if (!window.confirm('Delete this session?')) return;
    try { await axios.delete(`${API_BASE}/admin/sessions/${id}`); fetchSessions(); fetchStatus(); } catch (e) { alert('Failed'); }
  };

  return (
    <div className="fade-in">
      {/* Live Status Banner */}
      <div style={{ background: statusInfo?.isOpen ? '#f0fff4' : '#fff5f5', border: `2px solid ${statusInfo?.isOpen ? '#48bb78' : '#e53e3e'}`, borderRadius: '20px', padding: '2rem 2.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: statusInfo?.isOpen ? '#48bb78' : '#e53e3e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {statusInfo?.isOpen ? <CheckCircle2 size={26} color="white" /> : <AlertTriangle size={26} color="white" />}
        </div>
        <div>
          <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.2rem', color: statusInfo?.isOpen ? '#276749' : '#9b2c2c' }}>
            Online Ordering is {statusInfo?.isOpen ? 'OPEN ✅' : 'CLOSED ❌'}
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#666' }}>
            {statusInfo?.isOpen && statusInfo?.session ? `Active: ${statusInfo.session.label} (ends ${new Date(statusInfo.session.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})` : statusInfo?.isOpen ? 'No sessions created — shop open by default (demo mode)' : statusInfo?.nextSession ? `Next opening: ${new Date(statusInfo.nextSession.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'No upcoming sessions scheduled'}
          </p>
        </div>
      </div>

      {/* Create New Session */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontWeight: '900' }}>Ordering Windows</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary" style={{ padding: '0.8rem 2rem', background: '#8B0000' }}>{showAdd ? 'CANCEL' : '+ NEW SESSION'}</button>
      </div>

      {showAdd && (
        <div className="price-list-container" style={{ padding: '2.5rem', marginBottom: '2rem', border: '2px solid #8B0000' }}>
          <h4 style={{ fontWeight: '900', marginBottom: '1.5rem', color: '#8B0000' }}>🪔 Create New Order Window</h4>
          <div className="admin-grid-3" style={{ marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'left' }}>
              <label htmlFor="session-label" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', display: 'block', marginBottom: '8px' }}>SESSION LABEL</label>
              <input id="session-label" name="sessionLabel" autoComplete="off" placeholder="e.g. Diwali 2026 Orders" value={newSession.label} onChange={e => setNewSession({ ...newSession, label: e.target.value })} style={{ width: '100%', padding: '1rem', border: '2px solid #f0f0f0', borderRadius: '14px', fontWeight: '700', outline: 'none' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label htmlFor="session-start-date" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', display: 'block', marginBottom: '8px' }}>START DATE</label>
              <input id="session-start-date" name="sessionStartDate" type="datetime-local" value={newSession.startDate} onChange={e => setNewSession({ ...newSession, startDate: e.target.value })} style={{ width: '100%', padding: '1rem', border: '2px solid #f0f0f0', borderRadius: '14px', fontWeight: '700', outline: 'none' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label htmlFor="session-end-date" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', display: 'block', marginBottom: '8px' }}>END DATE (Close orders before Diwali)</label>
              <input id="session-end-date" name="sessionEndDate" type="datetime-local" value={newSession.endDate} onChange={e => setNewSession({ ...newSession, endDate: e.target.value })} style={{ width: '100%', padding: '1rem', border: '2px solid #f0f0f0', borderRadius: '14px', fontWeight: '700', outline: 'none' }} />
            </div>
          </div>
          <button onClick={createSession} className="btn-primary" style={{ padding: '0.8rem 3rem', background: '#8B0000' }}>CREATE SESSION</button>
        </div>
      )}

      {/* Sessions List */}
      <div className="price-list-container" style={{ padding: 0 }}>
        {sessions.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#888' }}>
            <Calendar size={48} color="#ddd" style={{ marginBottom: '1rem' }} />
            <p style={{ fontWeight: '800' }}>No sessions created yet</p>
            <p style={{ fontSize: '0.85rem' }}>Create a session to control when customers can order online</p>
          </div>
        ) : (
          <table style={{ width: '100%', textAlign: 'left' }}>
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '1.2rem 1.5rem' }}>LABEL</th>
                <th>START</th>
                <th>END</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right', paddingRight: '2rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => {
                const now = new Date();
                const isLive = s.isActive && new Date(s.startDate) <= now && new Date(s.endDate) >= now;
                const isPast = new Date(s.endDate) < now;
                const isFuture = new Date(s.startDate) > now;
                return (
                  <tr key={s.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>{s.label}</td>
                    <td style={{ fontSize: '0.88rem', color: '#555' }}>{new Date(s.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td style={{ fontSize: '0.88rem', color: '#555' }}>{new Date(s.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>
                      {isLive && <span style={{ background: '#f0fff4', color: '#276749', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>🟢 LIVE</span>}
                      {isPast && <span style={{ background: '#f5f5f5', color: '#888', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>Ended</span>}
                      {isFuture && s.isActive && <span style={{ background: '#fffaf0', color: '#dd6b20', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>Upcoming</span>}
                      {!s.isActive && <span style={{ background: '#fff5f5', color: '#e53e3e', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>Disabled</span>}
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button onClick={() => toggleSession(s.id, s.isActive)} style={{ background: s.isActive ? '#fff5f5' : '#f0fff4', border: 'none', padding: '6px 16px', borderRadius: '8px', fontWeight: '800', fontSize: '0.78rem', color: s.isActive ? '#e53e3e' : '#276749', cursor: 'pointer' }}>
                          {s.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => deleteSession(s.id)} style={{ background: 'none', border: '1px solid #e53e3e', color: '#e53e3e', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Help Text */}
      <div style={{ marginTop: '2rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', padding: '1.5rem 2rem' }}>
        <h4 style={{ fontWeight: '800', color: '#92400e', marginBottom: '8px' }}>💡 How Sessions Work</h4>
        <ul style={{ color: '#78350f', fontSize: '0.85rem', lineHeight: '1.8', paddingLeft: '1.2rem', margin: 0 }}>
          <li><b>No sessions exist</b> → Shop is always OPEN (demo mode)</li>
          <li><b>Active session with today inside start–end range</b> → Shop is OPEN</li>
          <li><b>Sessions exist but none cover today</b> → Shop is CLOSED, customers see countdown</li>
          <li><b>Example:</b> Diwali Oct 20 → Set end date to Oct 6 (2 weeks before) to auto-close orders</li>
        </ul>
      </div>
    </div>
  );
};

const Field = ({ label, k, type = 'text', placeholder, form, setForm }) => (
  <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
    <label htmlFor={k} style={{ fontSize: '0.7rem', fontWeight: '800', color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>{label}</label>
    <input id={k} name={k} type={type} autoComplete="off" placeholder={placeholder} value={form[k] || ''}
      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
      style={{ width: '100%', padding: '1rem 1.2rem', border: '2px solid #f0f0f0', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', outline: 'none' }}
      onFocus={e => e.target.style.borderColor = '#8B0000'}
      onBlur={e => e.target.style.borderColor = '#f0f0f0'}
    />
  </div>
);

const SettingsPanel = () => {
  const [form, setForm] = useState({
    promo_title: '', promo_subtitle: '',
    free_shipping_threshold: '999',
    global_discount_percent: '0',
    shipping_cost: '100',
    whatsapp_number: '917604849468',
    admin_whatsapp_number: '917604849468',
    shop_phone: '+91 76048 49468, +91 91760 48494',
    shop_address: '2/553D, Mettamalai, Sivakasi - 626 230',
    shop_email: 'durgaagenciessvk@gmail.com',
    gst_number: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/settings`).then(r => setForm(f => ({ ...f, ...r.data }))).catch(() => { });
  }, []);

  const save = async () => {
    try {
      await axios.post(`${API_BASE}/admin/settings`, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to save settings.');
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '700px' }}>
      <div className="admin-grid-settings">
        <div className="price-list-container" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontWeight: '900', marginBottom: '2rem', color: '#121212' }}>🎉 Promo Banner</h3>
          <Field label="Promo Title" k="promo_title" placeholder="FESTIVE DHAMAKA OFFERS!" form={form} setForm={setForm} />
          <Field label="Promo Subtitle" k="promo_subtitle" placeholder="UP TO 80% OFF ON SELECTED ITEMS" form={form} setForm={setForm} />
        </div>
        <div className="price-list-container" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontWeight: '900', marginBottom: '2rem', color: '#121212' }}>💰 Discount Configurations</h3>
          <Field label="Sitewide Discount (%)" k="global_discount_percent" type="number" placeholder="0" form={form} setForm={setForm} />
          <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '1rem', lineHeight: '1.4' }}>
            ℹ️ <b>Shipping Note:</b> Shipping/Delivery charges are handled on a "To-Pay" basis where the customer pays the lorry transport office directly during collection.
          </p>
        </div>

        {/* ── Business Details ── */}
        <div className="price-list-container" style={{ padding: '2.5rem', gridColumn: '1 / -1' }}>
          <h3 style={{ fontWeight: '900', marginBottom: '0.5rem', color: '#121212' }}>🏢 Business Details</h3>
          <p style={{ color: '#888', fontSize: '0.78rem', marginBottom: '1.5rem' }}>
            These appear on the printed bill header and website footer.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Shop Phone Number(s)" k="shop_phone" placeholder="+91 76048 49468, +91 91760 48494" form={form} setForm={setForm} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Shop Address (for bill)" k="shop_address" placeholder="2/553D, Mettamalai, Sivakasi - 626 230" form={form} setForm={setForm} />
            </div>
            <Field label="Shop Email" k="shop_email" placeholder="durgaagenciessvk@gmail.com" form={form} setForm={setForm} />
            <Field label="GST Number (optional)" k="gst_number" placeholder="e.g. 33XXXXX1234X1ZX" form={form} setForm={setForm} />
          </div>
        </div>

        {/* ── Contact / WhatsApp ── */}
        <div className="price-list-container" style={{ padding: '2.5rem', gridColumn: '1 / -1' }}>
          <h3 style={{ fontWeight: '900', marginBottom: '2rem', color: '#121212' }}>📱 WhatsApp Numbers</h3>
          <Field label="Customer Support WhatsApp (with country code, no +)" k="whatsapp_number" placeholder="917604849468" form={form} setForm={setForm} />
          <Field label="Admin WhatsApp for Order Alerts (with country code)" k="admin_whatsapp_number" placeholder="917604849468" form={form} setForm={setForm} />
        </div>
      </div>
      <button onClick={save} className="btn-primary" style={{ marginTop: '2rem', height: '60px', minWidth: '220px', background: saved ? '#25D366' : '#8B0000', fontSize: '1rem' }}>
        {saved ? '✅ Settings Saved!' : 'SAVE ALL SETTINGS'}
      </button>
    </div>
  );
};



export default App;
