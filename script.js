  const snapContainer = document.getElementById('snapContainer');
  const sections = document.querySelectorAll('.snap-section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
 
  snapContainer.addEventListener('scroll', () => {
    const scrollTop = snapContainer.scrollTop;
    const height = snapContainer.clientHeight;
    let current = '';
    sections.forEach(s => {
      if (scrollTop >= s.offsetTop - height / 2) current = s.id;
    });
    navLinks.forEach(a => {
      const isActive = a.getAttribute('href') === '#' + current;
      a.style.color = isActive ? 'var(--text)' : '';
      a.style.background = isActive ? 'var(--surface2)' : '';
    });
  });
 
  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          snapContainer.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        }
      }
    });
  });
 
  // "View Projects" button in About section scrolls to Projects
  const viewProjectsBtn = document.getElementById('viewProjectsBtn');
  if (viewProjectsBtn) {
    viewProjectsBtn.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector('#projects');
      if (target) snapContainer.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    });
  }
 
  // Scroll animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        el.target.style.opacity = '1';
        el.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, root: snapContainer });
 
  document.querySelectorAll('.project-card, .timeline-item, .edu-card, .skill-pill-btn, .about-feature-row, .about-info-row').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Contact form submission with Formspree (no page reload)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      e.stopPropagation();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
      formStatus.textContent = '';

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://formspree.io/f/mkopdpad', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        const result = await response.json().catch(() => null);

        if (response.ok) {
          showToast("Message sent successfully!", "success");
          formStatus.style.color = '#7CFFB2';
          contactForm.reset();
        } else {
          showToast("Message not sent. Try again!", "error");
          formStatus.style.color = '#ff6b6b';
          console.log(result);
        }
      } catch (error) {
        showToast("Network error. Try again!", "error");
        formStatus.style.color = '#ff6b6b';
        console.error(error);
      } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      }
    });
  }

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = "toast show " + type;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}