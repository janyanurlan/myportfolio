/* ============================================================
   PORTFOLIO — script.js
   ============================================================ */

// ---- Custom cursor dot follow ----
(function initCursor() {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position:fixed;width:8px;height:8px;
    background:#c084fc;border-radius:50%;
    pointer-events:none;z-index:10000;
    transform:translate(-50%,-50%);
    box-shadow:0 0 12px #c084fc;
    transition:width .2s,height .2s,opacity .2s;
  `;
  document.body.appendChild(dot);
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animate() {
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  document.querySelectorAll('a,button,.hobby-card,.work-card,.fact-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = '16px';
      dot.style.height = '16px';
      dot.style.opacity = '0.6';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.opacity = '1';
    });
  });
})();

// ---- Particle canvas ----
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const particles = [];
  let mx = -999, my = -999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  class Particle {
    constructor(x, y) {
      this.x = x; this.y = y;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2 - 1;
      this.life = 1;
      this.decay = Math.random() * 0.025 + 0.015;
      this.size = Math.random() * 3 + 1;
      const hue = Math.random() > 0.5 ? 270 : 220;
      this.color = `hsla(${hue},80%,70%,`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.02;
      this.life -= this.decay;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.life + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color + '0.5)';
      ctx.fill();
    }
  }

  let frameCount = 0;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    frameCount++;
    if (frameCount % 2 === 0 && mx > 0) {
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(
          mx + (Math.random() - 0.5) * 8,
          my + (Math.random() - 0.5) * 8
        ));
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0) particles.splice(i, 1);
    }
    if (particles.length > 300) particles.splice(0, 10);
    requestAnimationFrame(loop);
  }
  loop();
})();

// ---- Typewriter ----
(function initTypewriter() {
  const el = document.getElementById('typedRole');
  if (!el) return;
  const roles = [
    'Frontend Developer',
    'UI/UX Enthusiast',
    'JavaScript Explorer',
    'Open-Source Learner',
  ];
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const current = roles[ri];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; return setTimeout(tick, 2000); }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 50 : 90);
  }
  setTimeout(tick, 800);
})();

// ---- Nav scroll behaviour ----
(function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();

// ---- Active nav link on scroll ----
(function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
})();

// ---- Reveal on scroll ----
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((el, idx) => {
          if (el === entry.target) {
            setTimeout(() => el.classList.add('visible'), idx * 100);
          }
        });
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => observer.observe(el));
})();

// ---- Skill bars animate ----
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar__fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => observer.observe(b));
})();

// ---- Count-up animation for GitHub stats ----
(function initCountUp() {
  const nums = document.querySelectorAll('.github-stat__num[data-count]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 1200;
      const start = performance.now();
      function update(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => observer.observe(n));
})();

// ---- Roadmap hover activation ----
(function initRoadmap() {
  const items = document.querySelectorAll('.roadmap__item');
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
})();

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ---- Story entries stagger ----
(function initStoryEntries() {
  const entries = document.querySelectorAll('.story__entry');
  const observer = new IntersectionObserver(entries_ => {
    entries_.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(entries).indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, idx * 150);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  entries.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
})();

// ---- Hobby card tilt effect ----
(function initTilt() {
  const cards = document.querySelectorAll('.hobby-card, .work-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

console.log('%c Portfolio loaded 💜', 'color:#c084fc;font-size:14px;font-weight:bold;');
