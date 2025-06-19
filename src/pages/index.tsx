import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import CryptoNetworkBackground from "../CryptoNetworkBackground";

const PUMPFUN_URL = "https://pump.fun/"; // Replace with your actual Pump.fun link
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE"; // Replace when available
const SOCIAL_LINKS = {
  twitter: "https://twitter.com/TariffCoin",
  telegram: "https://t.me/TariffCoin",
  discord: "https://discord.gg/TariffCoin",
};

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Contract Address", href: "#contract" },
  { label: "How to Buy", href: "#how-to-buy" },
  { label: "About", href: "#about" },
  { label: "Community", href: "#community" },
];

// const TEAM_MEMBERS = [
//   {
//     name: "Commander Tariff",
//     role: "CEO & Founder",
//     bio: "Former Wall Street trader, MAGA patriot, crypto visionary",
//     avatar: "🇺🇸",
//   },
//   {
//     name: "Liberty Dev",
//     role: "Lead Developer",
//     bio: "Blockchain architect with 10+ years experience",
//     avatar: "⚡",
//   },
//   {
//     name: "Eagle Marketing",
//     role: "CMO",
//     bio: "Meme marketing genius, viral campaign expert",
//     avatar: "🦅",
//   },
// ];

// const FAQ_ITEMS = [
//   {
//     q: "What is Tariff Memecoin?",
//     a: "Tariff is the most patriotic memecoin on Solana, inspired by economic strength and American values!",
//   },
//   {
//     q: "How do I buy Tariff?",
//     a: "Simply get some SOL, go to Pump.fun, search for Tariff, and swap your SOL for TARIFF tokens!",
//   },
//   {
//     q: "Is this an official government project?",
//     a: "No! This is a community-driven memecoin for entertainment purposes only. Not affiliated with any government.",
//   },
//   {
//     q: "What's the contract address?",
//     a: "Contract will be available on Pump.fun after launch. Always verify official links!",
//   },
//   { q: "When moon?", a: "Tomorrow! 🚀 (This is not financial advice)" },
// ];

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible] as const;
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  // Create a modern toast notification effect
  const toast = document.createElement("div");
  toast.innerHTML = "✅ Contract Address Copied!";
  toast.className =
    "fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
};

type ButtonVariant = "primary" | "secondary" | "outline";

interface ProfessionalButtonProps {
  href?: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: (e: any) => void | Promise<void>;
  [key: string]: any;
}

const ProfessionalButton = ({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
  ...props
}: ProfessionalButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: any) => {
    if (onClick) {
      setIsLoading(true);
      await onClick(e);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const baseClasses = `
    relative overflow-hidden group px-8 py-4 rounded-full font-black text-xl
    transform transition-all duration-300 hover:scale-110 hover:shadow-2xl
    border-4 border-white backdrop-blur-sm
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
    before:via-white/20 before:to-transparent before:translate-x-[-100%] 
    hover:before:translate-x-[100%] before:transition-transform before:duration-700
    active:scale-95 cursor-pointer
  `;

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white shadow-red-500/30",
    secondary:
      "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white shadow-blue-500/30",
    outline:
      "bg-transparent border-red-700 text-red-700 hover:bg-red-700 hover:text-white",
  };

  const Component = href ? "a" : "button";

  return (
    <Component
      href={href}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      <span
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </Component>
  );
};

const AnimatedCard = ({
  children,
  delay = 0,
  className = "",
  ...props
}: any) => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`
        transform transition-all duration-1000 ease-out
        ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-20 opacity-0 scale-95"
        }
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`
      fixed top-0 left-0 w-full z-50 transition-all duration-500 
      ${
        scrolled
          ? "backdrop-blur-xl bg-blue-900/95 shadow-2xl shadow-blue-900/20"
          : "bg-blue-900/70 backdrop-blur-md"
      } 
      border-b-2 border-red-700
    `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border-4 border-transparent bg-[conic-gradient(at_top_left,_#bf0a30_0%,_#002868_33%,_#fff_66%,_#bf0a30_100%)] animate-spin-slow"></span>
            <Image
              src="/tariff-logo.png"
              alt="Tariff Logo"
              width={50}
              height={50}
              className="rounded-full drop-shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white relative z-10"
            />
          </div>
          <span className="text-2xl font-black text-white tracking-tight group-hover:text-red-300 transition-colors duration-300">
            TARIFF
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className="
                relative text-lg font-bold text-white hover:text-red-300 
                transition-all duration-300 py-2 px-1
                before:absolute before:bottom-0 before:left-0 before:w-0 
                before:h-0.5 before:bg-red-400 before:transition-all before:duration-300
                hover:before:w-full
              "
              onClick={(e) => handleNavClick(e, link.href.replace("#", ""))}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Buy Button */}
        <ProfessionalButton
          href={PUMPFUN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:block"
        >
          BUY NOW 🚀
        </ProfessionalButton>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white hover:text-red-300 text-2xl font-bold p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div
            className={`transform transition-transform duration-300 ${
              mobileMenuOpen ? "rotate-90" : ""
            }`}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
        lg:hidden overflow-hidden transition-all duration-500 ease-out
        ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        bg-blue-900/98 backdrop-blur-xl border-t-2 border-red-700
      `}
      >
        <nav className="flex flex-col p-6 gap-4">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className="text-lg font-bold text-white hover:text-red-300 transition-all duration-300 py-3 hover:pl-4"
              onClick={(e) => handleNavClick(e, link.href.replace("#", ""))}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
          <ProfessionalButton
            href={PUMPFUN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full text-center"
          >
            BUY NOW 🚀
          </ProfessionalButton>
        </nav>
      </div>
    </header>
  );
};

const Home = () => {
  const [heroRef, heroVisible] = useScrollAnimation();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-x-hidden">
      <CryptoNetworkBackground />
      <div className="animated-gradient-bg" />
      <Header />

      <div className="pt-24 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section
          id="hero"
          className="w-full flex flex-col items-center justify-center py-24 px-4 relative z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-transparent to-red-900/90 backdrop-blur-md"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          <div
            ref={heroRef}
            className={`
              relative z-10 flex flex-col items-center gap-12 max-w-7xl text-center
              transform transition-all duration-1500 ease-out
              ${
                heroVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }
            `}
          >
            <div className="relative group flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border-8 border-transparent bg-[conic-gradient(at_top_left,_#bf0a30_0%,_#002868_33%,_#fff_66%,_#bf0a30_100%)] animate-spin-slow"></span>
              <Image
                src="/tariff-logo.png"
                alt="Tariff Logo"
                width={240}
                height={240}
                className="rounded-full relative drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 border-8 border-white z-10"
              />
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl md:text-9xl font-black text-white tracking-tight drop-shadow-2xl">
                <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent animate-pulse">
                  THE ONLY
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-400 via-red-300 to-red-400 bg-clip-text text-transparent">
                  OFFICIAL
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
                  TARIFF MEME
                </span>
              </h1>

              <p className="text-2xl md:text-5xl text-white font-bold drop-shadow-lg max-w-5xl mx-auto leading-tight">
                Join the{" "}
                <span className="text-red-300">Economic Revolution</span>.
                <br />
                This is{" "}
                <span className="text-blue-300">History in the Making!</span>
              </p>

              <div className="relative">
                <p className="text-4xl md:text-6xl text-red-300 font-black drop-shadow-xl animate-pulse">
                  "MAKE TARIFFS GREAT AGAIN!"
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 pt-8">
              <ProfessionalButton
                href={PUMPFUN_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                className="text-2xl md:text-3xl px-16 py-6 shadow-2xl shadow-red-500/40"
              >
                BUY NOW WITH CRYPTO
              </ProfessionalButton>
              <ProfessionalButton
                href={PUMPFUN_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="text-2xl md:text-3xl px-16 py-6 shadow-2xl shadow-blue-500/40"
              >
                BUY NOW WITH DEBIT CARD
              </ProfessionalButton>
            </div>
          </div>
        </section>

        {/* Contract Address Section */}
        <section
          id="contract"
          className="w-full py-20 px-4 flex flex-col items-center relative z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-blue-50/90 to-white/95 backdrop-blur-sm"></div>

          <AnimatedCard className="relative max-w-5xl w-full text-center">
            <h2 className="text-4xl md:text-6xl font-black text-blue-900 mb-12 drop-shadow">
              SOLANA CONTRACT ADDRESS
            </h2>

            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white p-8 rounded-2xl shadow-2xl border-4 border-red-700 hover:shadow-red-500/30 transition-all duration-500 hover:scale-105">
              <p className="text-2xl font-bold mb-6 text-red-300">CA:</p>
              <div className="flex flex-col xl:flex-row items-center gap-6">
                <code className="text-lg md:text-xl font-mono break-all flex-1 bg-blue-800/50 p-6 rounded-xl border-2 border-blue-600 backdrop-blur-sm">
                  {CONTRACT_ADDRESS}
                </code>
                <ProfessionalButton
                  onClick={() => copyToClipboard(CONTRACT_ADDRESS)}
                  variant="outline"
                  className="border-red-400 text-red-300 hover:bg-red-700 hover:text-white hover:border-white shrink-0"
                >
                  COPY ADDRESS
                </ProfessionalButton>
              </div>
            </div>
          </AnimatedCard>
        </section>

        {/* How to Buy Section */}
        <section
          id="how-to-buy"
          className="w-full py-24 px-4 flex flex-col items-center relative z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-red-900/95 backdrop-blur-md"></div>

          <div className="relative max-w-7xl w-full">
            <AnimatedCard className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl">
                HOW TO BUY <span className="text-red-300">$TARIFF</span>
              </h2>
            </AnimatedCard>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
              {[
                {
                  step: "STEP 1",
                  title: "Create a Wallet",
                  desc: "Download Phantom or your wallet of choice from the App Store or Google Play for free.",
                  button: "GET PHANTOM",
                  icon: "👛",
                },
                {
                  step: "STEP 2",
                  title: "Get Some SOL",
                  desc: "Fund your wallet with SOL to swap for $TARIFF. Buy SOL directly on Phantom or transfer from another wallet.",
                  button: "BUY SOL",
                  icon: "💎",
                },
                {
                  step: "STEP 3",
                  title: "Go to Pump.fun",
                  desc: "Connect your wallet to Pump.fun. Search for TARIFF, select trade, and confirm.",
                  button: "CONNECT PUMP.FUN",
                  icon: "🔗",
                },
                {
                  step: "STEP 4",
                  title: "Swap for $TARIFF",
                  desc: "Use your SOL to trade for $TARIFF and join the economic revolution!",
                  button: "SWAP NOW",
                  icon: "🚀",
                },
              ].map((item, i) => (
                <AnimatedCard
                  key={i}
                  delay={i * 200}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border-4 border-red-700 hover:border-blue-700 transition-all duration-500 hover:scale-105 hover:shadow-blue-500/30">
                    <div className="text-6xl mb-4">{item.icon}</div>
                    <div className="text-red-700 font-black text-xl mb-4 tracking-wide">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-black text-blue-900 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-blue-800 mb-8 text-lg leading-relaxed">
                      {item.desc}
                    </p>
                    <ProfessionalButton
                      variant="secondary"
                      className="w-full text-lg py-4 shadow-lg"
                    >
                      {item.button}
                    </ProfessionalButton>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="w-full py-24 px-4 flex flex-col items-center relative z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-blue-50/95 to-white/98 backdrop-blur-sm"></div>

          <div className="relative max-w-7xl w-full text-center">
            <AnimatedCard>
              <h2 className="text-5xl md:text-7xl font-black text-blue-900 mb-16 drop-shadow">
                TARIFF: THE <span className="text-red-700">ECONOMIC</span>
                <br />
                <span className="text-red-700">PRESIDENT'S MEME</span>
              </h2>
            </AnimatedCard>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <AnimatedCard delay={200} className="text-left space-y-8">
                <h3 className="text-4xl font-black text-blue-900 mb-8">
                  ECONOMIC FACTS:
                </h3>
                {[
                  {
                    fact: "FACT 1",
                    text: "This is the ONLY Official Tariff Meme celebrating economic strength and American trade policy!",
                    bg: "from-blue-900 to-blue-800",
                    accent: "text-red-300",
                  },
                  {
                    fact: "FACT 2",
                    text: "Built on Solana for lightning-fast transactions - Trade at the speed of freedom!",
                    bg: "from-red-700 to-red-800",
                    accent: "text-blue-200",
                  },
                  {
                    fact: "FACT 3",
                    text: "Join the economic revolution and own a piece of history. MAKE TARIFFS GREAT AGAIN!",
                    bg: "from-blue-900 to-blue-800",
                    accent: "text-red-300",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`
                      bg-gradient-to-r ${item.bg} text-white p-6 rounded-xl shadow-xl 
                      hover:scale-105 transition-all duration-500 hover:shadow-2xl
                      border-2 border-white/20 backdrop-blur-sm
                    `}
                    style={{ animationDelay: `${i * 300}ms` }}
                  >
                    <h4 className={`text-xl font-bold mb-3 ${item.accent}`}>
                      {item.fact}
                    </h4>
                    <p className="text-lg leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </AnimatedCard>

              <AnimatedCard delay={400} className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-red-700 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-red-700 p-12 rounded-2xl text-white text-center shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                  <div className="relative">
                    <h3 className="text-6xl font-black mb-6 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                      1,000,000,000
                    </h3>
                    <p className="text-3xl font-bold mb-6 text-red-300">
                      TOTAL SUPPLY
                    </p>
                    <p className="text-xl mb-10 leading-relaxed">
                      Fixed forever! 100% community owned, 0% team allocation!
                    </p>
                    <ProfessionalButton
                      href={PUMPFUN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-blue-900 hover:bg-red-100 border-white text-2xl px-12 py-4 shadow-2xl"
                    >
                      BUY $TARIFF NOW!
                    </ProfessionalButton>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section
          id="community"
          className="w-full py-24 px-4 flex flex-col items-center relative z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-red-900/90 to-blue-900/95 backdrop-blur-md"></div>

          <div className="relative max-w-5xl w-full text-center">
            <AnimatedCard>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 drop-shadow-2xl">
                JOIN THE <span className="text-red-300">TARIFF</span>
                <br />
                <span className="text-red-300">COMMUNITY!</span>
              </h2>

              <p className="text-2xl text-white font-bold mb-16 drop-shadow max-w-3xl mx-auto leading-relaxed">
                This is YOUR chance to join a community that's all about
                fighting for economic strength!
              </p>
            </AnimatedCard>

            <AnimatedCard delay={300} className="mb-16">
              <div className="flex flex-wrap gap-8 justify-center">
                {[
                  {
                    name: "TWITTER",
                    icon: "🐦",
                    bg: "from-blue-500 to-blue-600",
                    link: SOCIAL_LINKS.twitter,
                  },
                  {
                    name: "TELEGRAM",
                    icon: "📱",
                    bg: "from-blue-600 to-blue-700",
                    link: SOCIAL_LINKS.telegram,
                  },
                  {
                    name: "DISCORD",
                    icon: "💬",
                    bg: "from-indigo-600 to-indigo-700",
                    link: SOCIAL_LINKS.discord,
                  },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group relative flex items-center gap-4 bg-gradient-to-r ${social.bg} 
                      text-white px-10 py-6 rounded-full font-black text-xl 
                      hover:scale-110 transition-all duration-500 shadow-2xl
                      border-4 border-white/20 backdrop-blur-sm overflow-hidden
                    `}
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="text-3xl relative z-10">
                      {social.icon}
                    </span>
                    <span className="relative z-10">{social.name}</span>
                  </a>
                ))}
              </div>
            </AnimatedCard>

            <AnimatedCard delay={600}>
              <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border-4 border-red-700 hover:border-blue-700 transition-all duration-500">
                <h3 className="text-4xl font-black text-blue-900 mb-8 flex items-center justify-center gap-4">
                  🇺🇸 MISSION 🇺🇸
                </h3>
                <p className="text-xl text-blue-800 font-bold leading-relaxed max-w-3xl mx-auto">
                  This is YOUR chance to join a community that's all about
                  fighting for what matters. The TARIFF Meme encourages a
                  culture of success & optimism to make America's economy great
                  again!
                </p>
              </div>
            </AnimatedCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-16 text-center text-white bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 shadow-inner relative z-10 border-t-4 border-red-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
              <div className="flex items-center gap-4 group">
                <div className="relative flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full border-4 border-transparent bg-[conic-gradient(at_top_left,_#bf0a30_0%,_#002868_33%,_#fff_66%,_#bf0a30_100%)] animate-spin-slow"></span>
                  <Image
                    src="/tariff-logo.png"
                    alt="Tariff Logo"
                    width={60}
                    height={60}
                    className="rounded-full group-hover:scale-110 transition-transform duration-300 border-4 border-white relative z-10"
                  />
                </div>
                <span className="text-3xl font-black group-hover:text-red-300 transition-colors duration-300">
                  TARIFF MEME
                </span>
              </div>
              <div className="flex gap-8">
                {["Twitter", "Telegram", "Discord"].map((platform, i) => (
                  <a
                    key={platform}
                    href={Object.values(SOCIAL_LINKS)[i]}
                    className="
                      relative text-lg font-bold hover:text-red-300 transition-all duration-300 py-2 px-4
                      before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 
                      before:bg-red-400 before:transition-all before:duration-300
                      hover:before:w-full hover:scale-110
                    "
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>

            <div className="border-t border-red-700/50 pt-8 space-y-4">
              <p className="text-sm leading-relaxed max-w-5xl mx-auto opacity-90">
                Tariff Memes are intended to function as an expression of
                support for, and engagement with, economic strength and American
                trade policies, and are not intended to be, or to be the subject
                of, an investment opportunity, investment contract, or security
                of any type. This website is not political and has nothing to do
                with any political campaign or governmental agency.
              </p>
              <p className="text-xs opacity-70">
                &copy; {new Date().getFullYear()} Tariff Meme. All rights
                reserved. For entertainment purposes only. MAKE TARIFFS GREAT
                AGAIN! 🇺🇸
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .animate-gradient-bg {
          position: fixed;
          inset: 0;
          z-index: -50;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(
            90deg,
            #002868 0%,
            #002868 20%,
            #fff 40%,
            #bf0a30 60%,
            #fff 80%,
            #bf0a30 100%
          );
          background-size: 300% 100%;
          animation: flagLeftRight 8s linear infinite;
        }

        @keyframes flagLeftRight {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        .header-buy-btn {
          background: linear-gradient(135deg, #bf0a30, #dc2626, #bf0a30);
          transition: all 0.3s ease;
        }

        .header-buy-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 0 0 4px rgba(191, 10, 48, 0.3),
            0 8px 32px 0 rgba(191, 10, 48, 0.4);
          border-color: #bf0a30;
        }

        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        html {
          scroll-behavior: smooth;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Home;
