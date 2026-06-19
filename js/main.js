// ============================================================
//   BARID — AC Iraq  |  Main JS
//   Handles: navbar scroll, mobile menu, gallery/posts from localStorage
// ============================================================

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 30);
});

// ---- MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
});
// Close on link click
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => mobileMenu?.classList.remove('open'));
});

// ---- CONTACT FORM ----
function submitForm(e) {
  e.preventDefault();
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
  // Future: submit to Supabase here
}

// ---- LOAD DYNAMIC CONTENT FROM LOCAL STORAGE ----
// (Populated by admin panel; will be replaced by Supabase API calls later)

function loadDynamicContent() {
  // Gallery images
  const images = JSON.parse(localStorage.getItem('barid_gallery') || '[]');
  const galleryDynamic = document.getElementById('galleryDynamic');
  if (galleryDynamic && images.length > 0) {
    images.forEach(img => {
      const el = document.createElement('div');
      el.className = 'gallery-item';
      el.innerHTML = `
        <img src="${escHtml(img.url)}" alt="${escHtml(img.caption)}" loading="lazy" />
        <div class="gallery-caption">${escHtml(img.caption)}</div>
      `;
      galleryDynamic.appendChild(el);
    });
  }

  // Posts
  const posts = JSON.parse(localStorage.getItem('barid_posts') || '[]');
  const postsDynamic = document.getElementById('postsDynamic');
  if (postsDynamic && posts.length > 0) {
    posts.slice().reverse().forEach(post => {
      const el = document.createElement('article');
      el.className = 'post-card';
      el.innerHTML = `
        <div class="post-meta">${escHtml(post.category || 'مقال')} · ${escHtml(post.date)}</div>
        <h3>${escHtml(post.title)}</h3>
        <p>${escHtml(post.content)}</p>
        ${post.image ? `<img src="${escHtml(post.image)}" alt="${escHtml(post.title)}" style="width:100%;border-radius:8px;margin-top:10px;" loading="lazy"/>` : ''}
      `;
      postsDynamic.appendChild(el);
    });
  }

  // Hero image override
  const heroUrl = localStorage.getItem('barid_hero_image');
  if (heroUrl) {
    const heroImg = document.getElementById('heroImage');
    if (heroImg) heroImg.src = heroUrl;
  }
}

function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// Run on page load
document.addEventListener('DOMContentLoaded', loadDynamicContent);

// ---- SCROLL REVEAL (lightweight, no library) ----
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.card, .service-card, .gallery-item, .post-card, .testimonial, .step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});
