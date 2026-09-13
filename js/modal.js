/**
 * Shemrock Heart - Modal Handler & Celebration Confetti Engine
 */

(function () {
  'use strict';

  // Lightweight HTML5 Canvas Confetti Engine
  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FFA800', '#FF5A79', '#10B981', '#38BDF8', '#8B5CF6', '#124388'];
    const confettiCount = 120;
    const confettiPieces = [];

    for (let i = 0; i < confettiCount; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 8 + 4,
        d: Math.random() * confettiCount,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: Math.random() * 0.07 + 0.05,
        tiltAngle: 0
      });
    }

    let animationFrame;
    let duration = 180; // ~3 seconds at 60fps

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiPieces.forEach(p => {
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();

        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) * 1.5;
        p.tilt = Math.sin(p.tiltAngle - (p.r / 3)) * 15;
      });

      duration--;
      if (duration > 0) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    draw();
  }

  // Modal open and close handlers
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.ShemrockAudio) window.ShemrockAudio.playPop();
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (window.ShemrockAudio) window.ShemrockAudio.playPop();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Attach trigger buttons
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-open-modal');
        openModal(targetId);
      });
    });

    // Close buttons
    document.querySelectorAll('.modal-close-btn, [data-close-modal]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const modal = btn.closest('.modal-backdrop');
        if (modal) closeModal(modal.id);
      });
    });

    // Backdrop click close
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          closeModal(modal.id);
        }
      });
    });

    // ESC key close
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
          closeModal(modal.id);
        });
      }
    });

    // Handle Visit Booking Form Submission
    const visitForm = document.getElementById('visit-booking-form');
    if (visitForm) {
      // Set minimum date to today
      const dateInput = visitForm.querySelector('input[type="date"]');
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
      }

      visitForm.addEventListener('submit', e => {
        e.preventDefault();

        const parentName = document.getElementById('visit-parent-name')?.value || 'Parent';
        const childName = document.getElementById('visit-child-name')?.value || 'Child';
        const childAge = document.getElementById('visit-child-age')?.value || 'Preschool';
        const phone = document.getElementById('visit-phone')?.value || '';
        const visitDate = document.getElementById('visit-date')?.value || '';
        const visitSlot = document.getElementById('visit-slot')?.value || 'Morning (10:00 AM)';

        // Switch to success state
        const formBody = document.getElementById('visit-form-fields');
        const successState = document.getElementById('visit-form-success');
        const successMsg = document.getElementById('visit-success-summary');

        if (formBody && successState) {
          formBody.style.display = 'none';
          successState.style.display = 'block';

          if (successMsg) {
            successMsg.innerHTML = `
              <strong>Thank you, ${parentName}!</strong><br>
              We are delighted to welcome little <strong>${childName}</strong> to Shemrock Heart Guwahati on <strong>${visitDate}</strong> during the <strong>${visitSlot}</strong> slot.<br>
              Our admissions team will contact you at <strong>${phone}</strong>.
            `;
          }

          // Trigger confetti & joyful sound
          triggerConfetti();
          if (window.ShemrockAudio) window.ShemrockAudio.playFanfare();

          // Prepare WhatsApp link button
          const whatsappBtn = document.getElementById('visit-whatsapp-confirm-btn');
          if (whatsappBtn) {
            const message = encodeURIComponent(
              `Hello Shemrock Heart Guwahati! I would like to confirm my school visit for my child ${childName} (Age: ${childAge}) on ${visitDate} (${visitSlot}). Parent: ${parentName} (${phone})`
            );
            whatsappBtn.href = `https://api.whatsapp.com/send?phone=919560809732&text=${message}`;
          }
        }
      });
    }

    // Video modal preview handlers
    document.querySelectorAll('[data-video-review]').forEach(card => {
      card.addEventListener('click', () => {
        const parentName = card.getAttribute('data-parent-name') || 'Shemrock Parent';
        const reviewText = card.getAttribute('data-review') || '';
        const childGrade = card.getAttribute('data-child') || '';

        const modalTitle = document.getElementById('video-modal-title');
        const modalQuote = document.getElementById('video-modal-quote');
        const modalMeta = document.getElementById('video-modal-meta');

        if (modalTitle) modalTitle.textContent = `${parentName}'s Experience`;
        if (modalQuote) modalQuote.textContent = `“${reviewText}”`;
        if (modalMeta) modalMeta.textContent = `${parentName} • Parent of ${childGrade} • Shemrock Heart Guwahati`;

        openModal('modal-video-review');
      });
    });
  });

  window.ShemrockModal = {
    openModal,
    closeModal,
    triggerConfetti
  };
})();
