import { MouseEvent, TouchEvent, useEffect, useMemo, useRef, useState } from 'react';

const CONTACT = {
  email: 'hello@faithfulquayson.com',
  linkedIn: 'https://www.linkedin.com/in/faithful-kobina-quayson-128266110/',
  instagram: '#',
  ubic: '#',
};

const imageSlots = {
  hero: '/images/faithful-hero.jpg',
  speaking: '/images/faithful-speaking.jpg',
  work: '/images/faithful-work.jpg',
  ubic: '/images/ubic-behind-scenes.jpg',
};

const navItems = [
  ['Journey', '#story'],
  ['Work', '#work'],
  ['Speaking', '#speaking'],
  ['Contact', '#contact'],
];

const journeyStops = [
  {
    label: 'Stop 01 - KNUST, Kumasi',
    title: 'The Hustle',
    body: 'Selling sneakers and custom laptop skins to fellow students. No big budget, no perfect plan, just learning how people choose, what they value, and how trust turns a casual conversation into a sale.',
    tag: 'Sales / Sourcing / Reading people',
  },
  {
    label: 'Stop 02 - On the road',
    title: 'The Route',
    body: 'Running an intercity student transport business taught me timing, service, pricing, and reputation. If the bus is late, the story collapses. That was my first real lesson in operations.',
    tag: 'Logistics / Trust / Service',
  },
  {
    label: 'Stop 03 - First tools',
    title: 'The Frame',
    body: 'Graphic design started because I wanted my own hustle to look sharper. Then photography and video followed, and I realized the image was not decoration. It was how the work earned attention.',
    tag: 'Brand / Visual language',
  },
  {
    label: 'Stop 04 - Behind the lens',
    title: 'The Lens',
    body: 'Photography and videography gave me a way to tell other people\'s stories properly. That work grew into Ubic Media Agency: helping brands communicate with more clarity, feeling, and impact.',
    tag: 'Photography / Film / Ubic Media',
  },
  {
    label: 'Stop 05 - Full circle',
    title: 'The Build',
    body: 'Web design tied the threads together. Design, story, and code became one place where a brand could live, explain itself, and move people toward action.',
    tag: 'Web design / Development',
  },
  {
    label: 'Stop 06 - Marketing responsibility',
    title: 'The Story',
    body: 'Storytelling is what helped me step into the marketing responsibilities at Ubic Media Agency. The same lessons from the hustle now shape campaign thinking, client messaging, and content direction.',
    tag: 'Marketing / Responsibility / Story',
    active: true,
  },
];

const workCards = [
  {
    index: '01',
    title: 'Graphic Design',
    body: 'Brand identities, posters, campaign visuals, and visual systems that make ideas look as sharp as they feel.',
    label: 'The frame',
  },
  {
    index: '02',
    title: 'Photography',
    body: 'Portraits, events, brand shoots, and documentary-style work that captures the real thing without sanding off the character.',
    label: 'The lens',
  },
  {
    index: '03',
    title: 'Videography',
    body: 'Short-form, brand film, and campaign content through Ubic Media Agency, built around story before production polish.',
    label: 'The motion',
  },
  {
    index: '04',
    title: 'Web Design',
    body: 'Fast, considered websites for founders and brands where the journey, message, and next step live in one place.',
    label: 'The build',
  },
];

function useCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || reduceMotion) {
      return;
    }

    document.body.classList.add('custom-cursor-active');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = 0;

    const move = (event: globalThis.MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }

      rafId = window.requestAnimationFrame(animate);
    };

    const enter = (event: Event) => {
      const element = event.currentTarget as HTMLElement;
      ringRef.current?.classList.add('is-active');

      if (labelRef.current) {
        labelRef.current.textContent = element.dataset.cursor || '';
      }
    };

    const leave = () => {
      ringRef.current?.classList.remove('is-active');

      if (labelRef.current) {
        labelRef.current.textContent = '';
      }
    };

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-cursor]'));
    targets.forEach((target) => {
      target.addEventListener('mouseenter', enter);
      target.addEventListener('mouseleave', leave);
    });

    window.addEventListener('mousemove', move);
    animate();

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', move);
      window.cancelAnimationFrame(rafId);
      targets.forEach((target) => {
        target.removeEventListener('mouseenter', enter);
        target.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return { dotRef, ringRef, labelRef };
}

function PhotoSlot({
  src,
  expected,
  label,
  className = '',
}: {
  src: string;
  expected: string;
  label: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={`photo-slot ${className} ${failed ? 'is-missing' : ''}`}>
      {!failed && <img src={src} alt={label} onError={() => setFailed(true)} />}
      {failed && (
        <div className="photo-fallback">
          <span className="mono">Photo slot</span>
          <strong>{label}</strong>
          <small>Add {expected}</small>
        </div>
      )}
    </figure>
  );
}

function RippleLink({
  href,
  children,
  className = '',
  cursor = 'Go',
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  cursor?: string;
  external?: boolean;
}) {
  const handleTouch = (event: TouchEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const touch = event.touches[0];
    const ripple = document.createElement('span');

    ripple.className = 'ripple';
    ripple.style.left = `${touch.clientX - rect.left}px`;
    ripple.style.top = `${touch.clientY - rect.top}px`;
    target.appendChild(ripple);

    window.setTimeout(() => ripple.remove(), 650);
  };

  return (
    <a
      href={href}
      className={`magnetic ${className}`}
      data-cursor={cursor}
      onMouseMove={handleMagnet}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = '';
      }}
      onTouchStart={handleTouch}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

function handleMagnet(event: MouseEvent<HTMLElement>) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;

  element.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
}

function App() {
  const cursor = useCursor();
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      return;
    }

    const move = (event: globalThis.MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 6;
      const y = (event.clientY / window.innerHeight - 0.5) * 5;

      document.documentElement.style.setProperty('--text-shift-x', `${x.toFixed(2)}px`);
      document.documentElement.style.setProperty('--text-shift-y', `${y.toFixed(2)}px`);
    };

    window.addEventListener('mousemove', move);

    return () => {
      window.removeEventListener('mousemove', move);
      document.documentElement.style.removeProperty('--text-shift-x');
      document.documentElement.style.removeProperty('--text-shift-y');
    };
  }, []);

  const handleHeroMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  const handleCardMove = (event: MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `perspective(800px) rotateX(${py * -5}deg) rotateY(${px * 5}deg) translateY(-2px)`;
  };

  return (
    <>
      <header className="site-header">
        <nav className="nav wrap" aria-label="Primary navigation">
          <a href="#top" className="logo" aria-label="Faithful Kobina Quayson home">
            FAITHFUL<span>.</span>QUAYSON
          </a>
          <div className="nav-links">
            {navItems.map(([label, href]) => (
              <a key={label} href={href}>
                {label}
              </a>
            ))}
          </div>
          <RippleLink href="#contact" className="nav-cta" cursor="Talk">
            Let's talk
          </RippleLink>
        </nav>
      </header>

      <main id="top">
        <section className="hero" onMouseMove={handleHeroMove}>
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span />
                Accra, Ghana - Creative entrepreneur
              </p>
              <h1 className="display">
                I sold sneakers before I sold <span>ideas.</span>
              </h1>
              <p className="hero-lede">
                I am Faithful Kobina Quayson, a Ghanaian creative entrepreneur and web
                developer. My path started on a KNUST campus, selling sneakers and custom
                laptop skins, and grew into transport, design, photography, film, web, and
                the marketing responsibilities I now help carry at Ubic Media Agency.
              </p>
              <div className="hero-actions">
                <RippleLink href="#story" className="button primary" cursor="Route">
                  Follow the route
                </RippleLink>
                <RippleLink href="#speaking" className="button secondary" cursor="Invite">
                  Invite me to speak
                </RippleLink>
              </div>
            </div>
            <PhotoSlot
              src={imageSlots.hero}
              expected="public/images/faithful-hero.jpg"
              label="Cinematic portrait of Faithful"
              className="hero-cinema"
            />
          </div>
        </section>

        <section className="journey section-band" id="story">
          <div className="wrap">
            <SectionHead kicker="The route" title="Every stop taught me something the next craft would need." />
            <div className="route">
              {journeyStops.map((stop) => (
                <article className={`stop ${stop.active ? 'is-stage' : ''}`} key={stop.title}>
                  <p className="stop-num mono">{stop.label}</p>
                  <h3 className="display">{stop.title}</h3>
                  <p>{stop.body}</p>
                  <span>{stop.tag}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="marketing section-band" id="marketing">
          <div className="wrap marketing-grid">
            <div>
              <SectionHead
                kicker="Ubic Media Agency"
                title="The marketing work came from the story work."
              />
              <p className="section-copy">
                At Ubic Media Agency, storytelling became the bridge between creative work
                and marketing responsibility. The same instincts I used to sell, organize,
                design, shoot, and build now help shape how brands speak: what the message
                is, what the audience should feel, and how content can carry that meaning
                without becoming noise.
              </p>
            </div>
            <div className="marketing-card story-card">
              <p className="mono">What storytelling handles</p>
              <div className="marketing-points">
                <span>Finding the human angle</span>
                <span>Shaping campaign direction</span>
                <span>Making client messages clearer</span>
                <span>Turning visuals into meaning</span>
              </div>
            </div>
          </div>
        </section>

        <section className="work section-band" id="work">
          <div className="wrap">
            <SectionHead kicker="The work" title="Four ways the story becomes useful." />
            <div className="work-layout">
              <div className="work-grid">
                {workCards.map((card) => (
                  <article
                    className="work-card"
                    key={card.title}
                    data-cursor="View"
                    onMouseMove={handleCardMove}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.transform = '';
                    }}
                  >
                    <p className="mono">Craft / {card.index}</p>
                    <div>
                      <span>{card.label}</span>
                      <h3 className="display">{card.title}</h3>
                      <p>{card.body}</p>
                    </div>
                  </article>
                ))}
              </div>
              <aside className="proof-strip">
                <PhotoSlot
                  src={imageSlots.hero}
                  expected="public/images/faithful-hero.jpg"
                  label="Faithful portrait"
                />
                <PhotoSlot
                  src={imageSlots.ubic}
                  expected="public/images/ubic-behind-scenes.jpg"
                  label="Behind the scenes at Ubic Media Agency"
                />
              </aside>
            </div>
          </div>
        </section>

        <section className="speaking section-band" id="speaking">
          <div className="wrap">
            <SectionHead
              kicker="Speaking"
              title="I speak about reinvention, storytelling, and building a craft from a hustle."
            />
            <div className="speaking-pass">
              <div className="pass-copy">
                <p className="mono">Boarding: Faithful K. Quayson</p>
                <h3 className="display">Invite me to speak</h3>
                <p>
                  My talks connect the practical and the personal: selling on campus,
                  running transport, learning creative tools, and using storytelling to
                  carry bigger marketing responsibility at Ubic Media Agency.
                </p>
                <div className="topics" aria-label="Speaking topics">
                  <span>Marketing storytelling</span>
                  <span>Creative entrepreneurship</span>
                  <span>Reinvention</span>
                  <span>AI and creative work</span>
                </div>
                <RippleLink href={`mailto:${CONTACT.email}`} className="button primary light" cursor="Send">
                  Send speaking invite
                </RippleLink>
              </div>
              <PhotoSlot
                src={imageSlots.speaking}
                expected="public/images/faithful-speaking.jpg"
                label="Faithful speaking"
                className="speaking-photo"
              />
            </div>
          </div>
        </section>

        <section className="note section-band">
          <div className="wrap note-inner">
            <span className="quote-mark">"</span>
            <p>
              I did not plan any of this. I sold sneakers because I needed money, ran a
              transport line because I saw a gap, and picked up design because I wanted my
              own hustle to look better. Somewhere along the way, the craft became the
              point, and the story became the way I understood the work.
            </p>
            <strong className="script">Faithful Kobina Quayson</strong>
            <span className="mono">Creative entrepreneur / Web developer / Founder, Ubic Media Agency</span>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="wrap contact-grid">
            <div>
              <p className="mono contact-kicker">Let's work together</p>
              <h2 className="display">Have a project, a stage, or an idea in mind?</h2>
            </div>
            <div className="contact-actions">
              <RippleLink href={`mailto:${CONTACT.email}`} className="button primary" cursor="Send">
                Email me
              </RippleLink>
              <RippleLink href="#speaking" className="button secondary" cursor="Invite">
                Invite me to speak
              </RippleLink>
              <RippleLink href={CONTACT.linkedIn} className="button secondary" cursor="Open" external>
                LinkedIn
              </RippleLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-row">
          <p>© {year} Faithful Kobina Quayson. Built one craft at a time.</p>
          <div>
            <a href={CONTACT.linkedIn} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={CONTACT.instagram}>Instagram</a>
            <a href={CONTACT.ubic}>Ubic Media Agency</a>
            <a href={`mailto:${CONTACT.email}`}>Email</a>
          </div>
        </div>
      </footer>

      <div className="cursor-dot" ref={cursor.dotRef} />
      <div className="cursor-ring" ref={cursor.ringRef}>
        <span ref={cursor.labelRef} />
      </div>
    </>
  );
}

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="section-head">
      <span className="mono">{kicker}</span>
      <h2 className="display">{title}</h2>
    </div>
  );
}

export default App;
