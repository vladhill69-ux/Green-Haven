// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Shared Cart Logic
  const cartBtn = document.getElementById('cart-btn');
  let cartCount = JSON.parse(localStorage.getItem('cartCount')) || 0;

  function updateCart() {
    if (cartBtn) {
      cartBtn.textContent = `🛒 ${cartCount}`;
      cartBtn.setAttribute('aria-label', `View cart (${cartCount} items)`);
    }
    localStorage.setItem('cartCount', JSON.stringify(cartCount));
  }

  // Event Delegation for Add Buttons (Works on Both Pages)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-btn')) {
      cartCount++;
      updateCart();
      e.target.textContent = 'Added! ✨';
      setTimeout(() => { e.target.textContent = 'Add to Cart'; }, 1500);
    }
  });

  updateCart(); // Init

  // Page-Specific: Home Quiz (From index.html)
  const isHome = document.querySelector('.hero') && !document.querySelector('.shop-hero');
  if (isHome) {
    initQuiz();
  }

  // Page-Specific: Shop Filters & Grid
  const isShop = document.querySelector('.shop-hero');
  if (isShop) {
    initShop();
  }

  // Lazy Reveals (Global)
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

// Quiz Init (Home Only)
function initQuiz() {
  const modal = document.getElementById('quiz-modal');
  const trigger = document.getElementById('quiz-trigger');
  const close = document.getElementById('quiz-close');
  const form = document.getElementById('quiz-form');
  const steps = document.querySelectorAll('.quiz-step');
  let currentStep = 1;

  if (!modal) return;

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

  form.addEventListener('click', (e) => {
    if (e.target.classList.contains('next-btn')) {
      if (currentStep < 2) {
        if (document.querySelector('input[name="light"]:checked')) {
          currentStep++;
          updateSteps();
        } else {
          alert('Pick a light level!');
        }
      } else if (currentStep === 2) {
        if (document.querySelector('input[name="water"]:checked')) {
          currentStep = 3;
          updateSteps();
          // Mock results – could redirect to shop.html?light=low&water=low
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
}

// Shop Init
function initShop() {
  const inventory = window.plantInventory || [];
  const grid = document.getElementById('plant-grid');
  const lightFilter = document.getElementById('light-filter');
  const waterFilter = document.getElementById('water-filter');
  const priceFilter = document.getElementById('price-filter');
  const clearBtn = document.getElementById('clear-filters');
  const status = document.getElementById('filter-status');

  // Parse URL Params for Initial State
  const urlParams = new URLSearchParams(window.location.search);
  lightFilter.value = urlParams.get('light') || '';
  waterFilter.value = urlParams.get('water') || '';
  priceFilter.value = urlParams.get('price') || '';

  function renderGrid(filteredPlants) {
    grid.innerHTML = ''; // Diff: Clear & Rebuild (Efficient for small sets)
    filteredPlants.forEach(plant => {
      const card = document.createElement('article');
      card.className = 'plant-card';
      card.setAttribute('role', 'gridcell');
      card.innerHTML = `
        <img src="${plant.image}" alt="${plant.name} in pot" loading="lazy" width="300" height="200">
        <h3>${plant.name}</h3>
        <p class="price">$${plant.price}</p>
        <p class="care-tags">${plant.tags}</p>
        <button class="add-btn" data-product="${plant.id}">Add to Cart</button>
      `;
      // PDP Stub: Click for details
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('add-btn')) {
          alert(`PDP for ${plant.name}: Care guide, AR preview coming soon!`);
        }
      });
      grid.appendChild(card);
    });

    // Announce Update
    status.textContent = filteredPlants.length ? `${filteredPlants.length} plants match your filters.` : 'No plants match. Try adjusting filters!';
    
    // Trigger Lazy Observer (Already Global)
  }

  function applyFilters() {
    let filtered = [...inventory];
    const light = lightFilter.value;
    const water = waterFilter.value;
    const maxPrice = priceFilter.value ? parseInt(priceFilter.value) : Infinity;

    if (light) filtered = filtered.filter(p => p.light === light);
    if (water) filtered = filtered.filter(p => p.water === water);
    filtered = filtered.filter(p => p.price <= maxPrice);

    // Update URL (No Reload)
    const params = new URLSearchParams();
    if (light) params.set('light', light);
    if (water) params.set('water', water);
    if (priceFilter.value) params.set('price', priceFilter.value);
    const newUrl = params.toString() ? `shop.html?${params}` : 'shop.html';
    window.history.replaceState({}, '', newUrl);

    renderGrid(filtered);
  }

  // Listeners
  [lightFilter, waterFilter, priceFilter].forEach(filter => {
    filter.addEventListener('change', applyFilters);
  });

  clearBtn.addEventListener('click', () => {
    lightFilter.value = waterFilter.value = priceFilter.value = '';
    window.history.replaceState({}, '', 'shop.html');
    applyFilters();
  });

  // Initial Render
  applyFilters();
}
