const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "0";        // IMPORTANT
canvas.style.pointerEvents = "none";

document.body.appendChild(canvas);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* PARTICLES */
const particles = [];
const PARTICLE_COUNT = 17;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    dx: Math.random() * 0.5 + 0.2,
    dy: Math.random() * 0.5 + 0.2
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x > canvas.width) p.x = 0;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 140, 0, 0.8)";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();

const grid = document.querySelector('.project-grid');
const btnLeft = document.querySelector('.scroll-btn.left');
const btnRight = document.querySelector('.scroll-btn.right');

const isMobile = window.innerWidth <= 768;
const scrollAmount = isMobile ? window.innerWidth * 0.75 : 1000;

btnLeft.addEventListener('click', () => {
  grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

btnRight.addEventListener('click', () => {
  grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});

history.scrollRestoration = 'manual';

// LOGO WAVE ANIMATION - SPLIT INTO LETTERS
const logoText = "Portfolio";
const logoEl = document.getElementById("logoText");

logoText.split("").forEach((char, i) => {
  const span = document.createElement("span");
  span.textContent = char;
  span.classList.add("logo-letter");
  span.style.animationDelay = `${i * 0.08}s`;        // page load wave delay
  span.dataset.index = i;
  logoEl.appendChild(span);
});

// HOVER — wave bounce each letter
logoEl.addEventListener("mouseenter", () => {
  const letters = logoEl.querySelectorAll(".logo-letter");
  letters.forEach((letter, i) => {
    setTimeout(() => {
      letter.classList.remove("hover-wave");
      void letter.offsetWidth; // force reflow to restart animation
      letter.classList.add("hover-wave");
    }, i * 60);
  });
});

//  SCROLL ANIMATIONS
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target); // animate only once
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up, .slide-left, .slide-right')
  .forEach(el => observer.observe(el));

//   DARK / LIGHT MODE
const themeToggle = document.getElementById('themeToggle');
const darkBtn = document.getElementById('darkBtn');

function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);

  // sync both buttons
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  darkBtn.innerHTML = isDark
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}


// load saved theme on page load
applyTheme(localStorage.getItem('theme') === 'dark');

// desktop toggle
themeToggle.addEventListener('click', () => {
  applyTheme(!document.body.classList.contains('dark'));
});

// mobile dark btn
darkBtn.addEventListener('click', () => {
  applyTheme(!document.body.classList.contains('dark'));
});

function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);

  themeToggle.textContent = isDark ? '☀️' : '🌙';
  darkBtn.innerHTML = isDark
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';

  // ONE image, swap src only
  const profileImg = document.getElementById('profileImg');
  if (profileImg) {
    profileImg.src = isDark ? 'images/profile1.png' : 'images/profile2.png';
  }

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

//  SETTINGS MENU
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');

settingsBtn.addEventListener('click', () => {
  settingsMenu.classList.toggle('open');
  settingsBtn.style.transform = settingsMenu.classList.contains('open')
    ? 'rotate(90deg)'
    : 'rotate(0deg)';
});

// close menu when a link is clicked
settingsMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    settingsMenu.classList.remove('open');
    settingsBtn.style.transform = 'rotate(0deg)';
  });
});

// close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!settingsBtn.contains(e.target) && !settingsMenu.contains(e.target)) {
    settingsMenu.classList.remove('open');
    settingsBtn.style.transform = 'rotate(0deg)';
  }
});

//  SPLIT TEXT - LETTERS FLY IN
function splitIntoLetters(el) {
  const text = el.innerText.trim();
  el.innerHTML = '';

  text.split('').forEach(char => {
    if (char === ' ') {
      const space = document.createElement('span');
      space.classList.add('split-space');
      el.appendChild(space);
      return;
    }

    const span = document.createElement('span');
    span.classList.add('split-letter');
    span.textContent = char;

    // random direction for each letter
    const tx = (Math.random() - 0.5) * 300;  // -150px to +150px horizontal
    const ty = (Math.random() - 0.5) * 300;  // -150px to +150px vertical
    const tr = (Math.random() - 0.5) * 60;   // -30deg to +30deg rotation

    span.style.setProperty('--tx', `${tx}px`);
    span.style.setProperty('--ty', `${ty}px`);
    span.style.setProperty('--tr', `${tr}deg`);

    el.appendChild(span);
  });
}

function triggerSplitAnimation() {
  const closing = document.querySelector('.closing-section');
  if (!closing || closing.dataset.animated === 'true') return;

  const rect = closing.getBoundingClientRect();
  const inView = rect.top < window.innerHeight - 80;

  if (!inView) return;

  closing.dataset.animated = 'true';

  const elements = [
    { el: closing.querySelector('.thankyou-text'),   delay: 0    },
    { el: closing.querySelector('.closing-message'), delay: 300  },
    { el: closing.querySelector('.closing-tag'),     delay: 600  },
  ];

  elements.forEach(({ el, delay }) => {
    if (!el) return;
    splitIntoLetters(el);

    const letters = el.querySelectorAll('.split-letter');
    letters.forEach((letter, i) => {
      setTimeout(() => {
        letter.classList.add('landed');
      }, delay + i * 40); // each letter lands 40ms after the previous
    });
  });
}

// ON PAGE LOAD
window.addEventListener('load', () => {
  setTimeout(triggerSplitAnimation, 300);
});

// ON SCROLL
window.addEventListener('scroll', triggerSplitAnimation);

// HOME BUTTON - smooth scroll to hero
document.querySelector('.home-btn').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// HOME BUTTON - show after scrolling down
const homeBtn = document.querySelector('.home-btn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    homeBtn.classList.add('show');
  } else {
    homeBtn.classList.remove('show');
  }
});

// smooth scroll to top
homeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function splitIntoLetters(el) {
  const text = el.innerText.trim();
  el.innerHTML = '';

  // wrap each WORD in a no-break span
  text.split(' ').forEach((word, wi) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';

    word.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.classList.add('split-letter');
      span.textContent = char;

      const tx = (Math.random() - 0.5) * 300;
      const ty = (Math.random() - 0.5) * 300;
      const tr = (Math.random() - 0.5) * 60;

      span.style.setProperty('--tx', `${tx}px`);
      span.style.setProperty('--ty', `${ty}px`);
      span.style.setProperty('--tr', `${tr}deg`);

      wordSpan.appendChild(span);
    });

    el.appendChild(wordSpan);

    // add space between words
    if (wi < text.split(' ').length - 1) {
      const space = document.createElement('span');
      space.classList.add('split-space');
      el.appendChild(space);
    }
  });
}

document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const successMsg = document.getElementById('successMsg');
  successMsg.style.display = 'block';

  this.reset();

  setTimeout(() => {
    successMsg.style.display = 'none';
  }, 4000);
});

// STICKY NAVBAR - shrink on scroll
// const navbar = document.querySelector('.navbar');

// window.addEventListener('scroll', () => {
//   if (window.scrollY > 50) {
//     navbar.style.padding = '12px 10%';
//     navbar.style.boxShadow = '0 4px 20px rgba(255, 140, 0, 0.2)';
//   } else {
//     navbar.style.padding = '20px 10%';
//     navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
//   }
// });
