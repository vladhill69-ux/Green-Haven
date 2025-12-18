// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Quiz Modal
  const modal = document.getElementById('quiz-modal');
  const trigger = document.getElementById('quiz-trigger');
  const close = document.getElementById('quiz-close');
  const form = document.getElementById('quiz-form');
  const steps = document.querySelectorAll('.quiz-step');
  let currentStep = 1;

  trigger.addEventListener('click', () => {
    modal.showModal();
    modal.setAttribute('aria-hidden', 'false');
  });

  close.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.close();
    modal.setAttribute('aria-hidden', 'true');
    resetQuiz();
  }

  function resetQuiz() {
    currentStep = 1;
    steps.forEach(step => step.classList.remove('active'));
    steps[0].classList.add('active');
    form.reset();
  }

  // Step Navigation
  form.addEventListener('click', (e) => {
    if (e.target.classList.contains('next-btn')) {
      if (currentStep < 2) {
        if (document.querySelector('input[name="light"]:checked')) {
          currentStep++;
          updateSteps();
        } else {
          alert('Pick a light level!'); // Simple validation
        }
      } else if (currentStep === 2) {
        if (document.querySelector('input[name="water"]:checked')) {
          currentStep = 3;
          updateSteps();
        } else {
          alert('Choose your watering style!');
        }
      }
    } else if (e.target.classList.contains('prev-btn')) {
      currentStep--;
      updateSteps();
    }
  });

  function updateSteps() {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index + 1 === currentStep);
    });
  }

  // Cart Functionality
  const cartBtn = document.getElementById('cart-btn');
  const addBtns = document.querySelectorAll('.add-btn');
  let cartCount = JSON.parse(localStorage.getItem('cartCount')) || 0;

  function updateCart() {
    cartBtn.textContent = `🛒 ${cartCount}`;
    localStorage.setItem('cartCount', JSON.stringify(cartCount));
  }

  addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cartCount++;
      updateCart();
      btn.textContent = 'Added! ✨';
      setTimeout(() => { btn.textContent = 'Add to Cart'; }, 1500);
    });
  });

  updateCart(); // Init

  // Lazy Reveals (Intersection Observer)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    });

    document.querySelectorAll('.plant-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }
});
