import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FadeIn = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const farmerBenefits = [
  {
    title: 'Reach More Customers',
    text: 'Showcase your agricultural products to consumers through an online marketplace.',
  },
  {
    title: 'Sell Directly',
    text: 'Connect directly with consumers without unnecessary intermediaries.',
  },
  {
    title: 'Manage With Ease',
    text: 'Manage products, prices, quantities, and orders from one convenient platform.',
  },
];

const consumerBenefits = [
  {
    title: 'Discover Fresh Produce',
    text: 'Find fresh agricultural products offered by local farmers.',
  },
  {
    title: 'Transparent Information',
    text: 'View product details, prices, availability, and other information before placing an order.',
  },
  {
    title: 'Support Local Farmers',
    text: "Buy directly from local farmers and support Nepal's agricultural community.",
  },
];

const steps = [
  {
    number: '01',
    title: 'Farmers Register',
    text: 'Farmers create an account and set up their profile.',
  },
  {
    number: '02',
    title: 'List Products',
    text: 'Farmers add products with prices, quantities, and details.',
  },
  {
    number: '03',
    title: 'Consumers Order',
    text: 'Consumers browse products and place orders directly.',
  },
  {
    number: '04',
    title: 'Orders Fulfilled',
    text: 'Farmers manage orders through the delivery process.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/about') {
      requestAnimationFrame(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [location.pathname]);

  return (
    <div className="-mt-20 min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat pt-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20, 55, 35, 0.62), rgba(20, 55, 35, 0.62)), url('/hero-farm.jpg')",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center text-white">

            <p className="animate-fade-in mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-green-100 sm:text-base">
              Welcome to FarmLink
            </p>

            <h1 className="animate-fade-in-delay-1 text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
              Fresh from Nepal&apos;s Farms,
              <span className="mt-1 block text-green-200">
                Directly to You
              </span>
            </h1>

            <p className="animate-fade-in-delay-2 mx-auto mb-10 mt-6 max-w-3xl text-lg leading-relaxed text-gray-100 sm:text-xl">
              Connect directly with local farmers. Get fresh, quality produce
              at fair prices while supporting Nepal&apos;s agricultural community.
            </p>

            <div className="animate-fade-in-delay-3 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="interactive-btn w-full min-w-[180px] rounded-lg bg-green-600 px-7 py-3.5 font-semibold text-white shadow-lg transition duration-200 hover:bg-green-700 hover:shadow-xl sm:w-auto"
              >
                Browse Products
              </button>

              <button
                type="button"
                onClick={() => navigate('/register')}
                className="interactive-btn w-full min-w-[180px] rounded-lg bg-white px-7 py-3.5 font-semibold text-green-700 shadow-lg transition duration-200 hover:bg-gray-100 hover:shadow-xl sm:w-auto"
              >
                Join FarmLink
              </button>
            </div>

          </div>
        </div>

        <a
          href="#about"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/80 transition hover:text-white"
          aria-label="Scroll to about section"
        >
          <span className="flex flex-col items-center gap-1 text-xs font-medium uppercase tracking-widest">
            Explore
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </a>
      </section>


      {/* Quote */}
      {/* <section className="bg-green-50 py-16 lg:py-20">
        <FadeIn className="mx-auto max-w-4xl px-6 text-center">

          <div className="mb-4 text-5xl leading-none text-green-600">
            &ldquo;
          </div>

          <p className="mx-auto max-w-3xl text-balance text-2xl font-semibold leading-relaxed text-gray-800 sm:text-3xl">
            Connecting farmers directly with consumers for a fairer and fresher agricultural marketplace.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-center text-gray-600">
            FarmLink — From Farm to Table, Without the Middleman.
          </p>

        </FadeIn>
      </section> */}

      <section id="about" className="min-h-[500px] flex items-center bg-white py-20">
  <div className="w-full max-w-6xl mx-auto px-6">

    <div className="max-w-4xl mx-auto text-center">

      <p className="text-sm font-semibold uppercase tracking-widest text-green-900 mb-3">
        About FarmLink
      </p>

      <h2 className="text-3xl sm:text-3xl lg:text-5xl font-bold leading-tight text-gray-800 mb-5">
        Connecting Nepal's Farmers Directly With Consumers
      </h2>

      <p className="mx-auto max-w-3xl text-lg sm:text-xl leading-relaxed text-gray-600">
        FarmLink is a digital marketplace that connects local farmers directly
        with consumers, making fresh agricultural products easier to discover
        while helping farmers reach customers and receive fair value for their
        products.
      </p>

    </div>

  </div>
</section>


      {/* About */}
      <section id="about" className="scroll-mt-24 bg-gray-50 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">

          {/* <FadeIn className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
              About FarmLink
            </p>

            <h2 className="text-center text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              Connecting Nepal&apos;s Farmers
              <span className="mt-1 block text-center text-green-600">
                Directly With Consumers
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-7 text-gray-600 sm:text-lg">
              FarmLink is a digital marketplace that connects local farmers
              directly with consumers, making fresh agricultural products
              easier to discover while helping farmers reach customers and
              receive fair value for their products.
            </p>
          </FadeIn>  */}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">

            <FadeIn delay={100}>
              <div className="interactive-card h-full rounded-2xl border border-gray-100 bg-white p-8 shadow-sm lg:p-10">
                <div className="mb-8 flex items-center justify-center gap-4 md:justify-start">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-100">
                    <span className="text-2xl" role="img" aria-hidden="true">🌾</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">For Farmers</h3>
                </div>

                <div className="space-y-7">
                  {farmerBenefits.map((benefit) => (
                    <div key={benefit.title} className="flex items-start gap-4 text-left">
                      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                        <span className="font-bold text-green-600">✓</span>
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold text-gray-900">{benefit.title}</h4>
                        <p className="leading-6 text-gray-600">{benefit.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>


            <FadeIn delay={200}>
              <div className="interactive-card h-full rounded-2xl border border-gray-100 bg-white p-8 shadow-sm lg:p-10">
                <div className="mb-8 flex items-center justify-center gap-4 md:justify-start">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-100">
                    <span className="text-2xl" role="img" aria-hidden="true">🛒</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">For Consumers</h3>
                </div>

                <div className="space-y-7">
                  {consumerBenefits.map((benefit) => (
                    <div key={benefit.title} className="flex items-start gap-4 text-left">
                      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                        <span className="font-bold text-green-600">✓</span>
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold text-gray-900">{benefit.title}</h4>
                        <p className="leading-6 text-gray-600">{benefit.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

          </div>

{/* 
          <FadeIn className="mx-auto mt-14 max-w-3xl text-center">
            <p className="text-lg font-medium leading-8 text-gray-700 sm:text-xl">
              From farm to table, FarmLink makes the connection
              <span className="font-semibold text-green-600">
                {' '}simpler, fresher, and fairer.
              </span>
            </p>
          </FadeIn> */}

        </div>
      </section>


      {/* How It Works */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <FadeIn className="mx-auto mb-16 max-w-4xl text-center">
            {/* <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-700 sm:text-1xl">
              Simple Process

            </p> */}
            
            <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-3xl">
              How FarmLink Works
            </h2>
            
            

            <p className="mx-auto mt-4 max-w-4xl text-center text-lg text-gray-600">
              From registration to delivery, FarmLink keeps the process simple.
            </p>
          </FadeIn>


          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {steps.map((step, index) => (
              <FadeIn key={step.number} delay={index * 100}>
                <div className="interactive-step group rounded-2xl px-5 py-6 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white shadow-md transition duration-300 group-hover:scale-110 group-hover:bg-green-700 group-hover:shadow-lg">
                    {step.number}
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="mx-auto max-w-xs leading-6 text-gray-600">{step.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="bg-green-700 py-20 lg:py-24">
        <FadeIn className="mx-auto max-w-7xl px-6 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Connect with FarmLink?
          </h2>

          <p className="mx-auto mt-5 max-w-7xl text-lg leading-relaxed text-green-100 sm:text-xl">
            Join the digital marketplace connecting Nepal&apos;s farmers
            directly with consumers.
          </p>

          {/* <button
            type="button"
            onClick={() => navigate('/register')}
            className="interactive-btn mt-9 rounded-lg bg-white px-8 py-4 font-semibold text-green-700 shadow-lg transition duration-200 hover:bg-gray-100 hover:shadow-xl"
          >
            Create Your Account
          </button> */}
        </FadeIn>
      </section>

    </div>
  );
};

export default LandingPage;
