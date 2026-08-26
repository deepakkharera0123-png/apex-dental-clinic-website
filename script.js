document.addEventListener('DOMContentLoaded', () => {

  // ==================== 1. HAMBURGER DRAWER TOGGLE ====================
  const menuBtn = document.getElementById('menu-toggle');
  const navDrawer = document.getElementById('main-nav');

  if (menuBtn && navDrawer) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menuBtn.classList.toggle('active');
      navDrawer.classList.toggle('active');
    });

    // Close when clicking any link
    navDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navDrawer.classList.remove('active');
      });
    });
  }

  // ==================== 2. BEFORE / AFTER DRAG SLIDER ====================
  const sliderViewport = document.getElementById('slider-viewport');
  const beforeClip = document.getElementById('before-clip');
  const dragHandle = document.getElementById('drag-handle');
  const imgBefore = document.querySelector('.img-before');

  if (sliderViewport && beforeClip && dragHandle && imgBefore) {
    let isDragging = false;

    const syncImageWidth = () => {
      const rect = sliderViewport.getBoundingClientRect();
      imgBefore.style.width = `${rect.width}px`;
    };

    window.addEventListener('resize', syncImageWidth);
    syncImageWidth();

    const setSliderPos = (clientX) => {
      const rect = sliderViewport.getBoundingClientRect();
      let offsetX = clientX - rect.left;

      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      beforeClip.style.width = `${percentage}%`;
      dragHandle.style.left = `${percentage}%`;
      imgBefore.style.width = `${rect.width}px`;
    };

    // Mouse Events
    sliderViewport.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPos(e.clientX);
    });

    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPos(e.clientX);
    });

    // Touch Events for Mobile
    sliderViewport.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPos(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPos(e.touches[0].clientX);
    }, { passive: true });
  }

  // ==================== 3. TREATMENT COST ESTIMATOR ====================
  const procCheckboxes = document.querySelectorAll('.proc-check');
  const summaryList = document.getElementById('summary-list');
  const grandTotal = document.getElementById('grand-total');
  const totalSittings = document.getElementById('total-sittings');

  function calculateLedger() {
    if (!summaryList) return;

    let subtotal = 0;
    let maxSittings = 0;
    let selectedCount = 0;
    let listHTML = '';

    procCheckboxes.forEach(box => {
      if (box.checked) {
        selectedCount++;
        const price = parseInt(box.getAttribute('data-price'), 10);
        const sittings = parseInt(box.getAttribute('data-sittings'), 10);
        const name = box.getAttribute('data-name');

        subtotal += price;
        if (sittings > maxSittings) maxSittings = sittings;

        listHTML += `
          <div class="summary-row">
            <span>${name}</span>
            <strong>₹${price.toLocaleString('en-IN')}</strong>
          </div>
        `;
      }
    });

    if (selectedCount === 0) {
      summaryList.innerHTML = `<p class="empty-list-msg">Select procedures to view line items.</p>`;
      grandTotal.textContent = '₹0';
      totalSittings.textContent = '—';
    } else {
      summaryList.innerHTML = listHTML;
      grandTotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
      totalSittings.textContent = maxSittings === 1 ? '1 In-Clinic Visit' : `${maxSittings} Clinical Sittings`;
    }
  }

  procCheckboxes.forEach(box => box.addEventListener('change', calculateLedger));

  // ==================== 4. CONSULTATION TOKEN SLIP DESK ====================
  const intakeForm = document.getElementById('intake-form');
  const slipModal = document.getElementById('slip-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const tokenDisplay = document.getElementById('token-display');
  const tokenLedgerData = document.getElementById('token-ledger-data');

  if (intakeForm && slipModal) {
    intakeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('pt-name')?.value.trim() || 'Patient';
      const phone = document.getElementById('pt-phone')?.value.trim() || '—';
      const treatment = document.getElementById('pt-treatment')?.value || 'Evaluation';
      const specialist = document.getElementById('pt-specialist')?.value || 'Senior Clinician';
      const date = document.getElementById('pt-date')?.value || 'Flexible';
      const slot = document.getElementById('pt-slot')?.value || 'Morning';

      const randomToken = 'APX-' + Math.floor(100 + Math.random() * 900);
      if (tokenDisplay) tokenDisplay.textContent = `TOKEN #${randomToken}`;

      if (tokenLedgerData) {
        tokenLedgerData.innerHTML = `
          <div class="token-row"><span>Patient Name:</span> <strong>${name}</strong></div>
          <div class="token-row"><span>Mobile Contact:</span> <strong>${phone}</strong></div>
          <div class="token-row"><span>Procedure:</span> <strong>${treatment}</strong></div>
          <div class="token-row"><span>Attending Doctor:</span> <strong>${specialist}</strong></div>
          <div class="token-row"><span>Slot:</span> <strong>${date} (${slot})</strong></div>
        `;
      }

      slipModal.classList.add('active');
      intakeForm.reset();
    });
  }

  if (closeModalBtn && slipModal) {
    closeModalBtn.addEventListener('click', () => slipModal.classList.remove('active'));
    slipModal.addEventListener('click', (e) => {
      if (e.target === slipModal) slipModal.classList.remove('active');
    });
  }

});