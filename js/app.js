/**
 * Shemrock Heart - Main Application Controller
 * Handles Navigation, Web Audio Micro-Interactions, Mascot, Gallery, and FAQs
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Web Audio Micro-Interactions (Zero external assets needed)
  // -------------------------------------------------------------------------
  let audioCtx = null;
  let isSoundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPop() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      // Pleasant marimba cheerful note
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08); // A5

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // Audio fallback silent
    }
  }

  function playFanfare() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.09 + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * 0.09);
        osc.stop(audioCtx.currentTime + idx * 0.09 + 0.25);
      });
    } catch (e) {}
  }

  window.ShemrockAudio = {
    playPop,
    playFanfare
  };

  // -------------------------------------------------------------------------
  // 2. DOM Ready Controller
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // A. Sound Toggle in Header
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        soundToggleBtn.innerHTML = isSoundEnabled ? '🔔' : '🔕';
        soundToggleBtn.setAttribute('title', isSoundEnabled ? 'Mute playful sound' : 'Enable playful sound');
        if (isSoundEnabled) playPop();
      });
    }

    // Attach click pops to key buttons & navigation links
    document.querySelectorAll('.btn, .nav-link, .routine-tab-btn, .gallery-filter-btn').forEach(el => {
      el.addEventListener('click', () => {
        playPop();
      });
    });

    // B. Sticky Header & Scroll Spy
    const header = document.querySelector('.site-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;

      if (header) {
        if (scrollPos > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Scroll Spy for navigation highlighting
      let currentSectionId = '';
      sections.forEach(section => {
        const top = section.offsetTop - 120;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    });

    // C. Mobile Drawer Navigation
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('open');
        if (isOpen) {
          mobileDrawer.classList.remove('open');
          mobileToggle.classList.remove('open');
          document.body.style.overflow = '';
        } else {
          mobileDrawer.classList.add('open');
          mobileToggle.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
        playPop();
      });

      // Close mobile drawer on link click
      mobileDrawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
          mobileToggle.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // D. Gallery Filter Tabs
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });

    // E. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question-btn');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Close other FAQs
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });

          // Toggle current
          if (isActive) {
            item.classList.remove('active');
          } else {
            item.classList.add('active');
          }
          playPop();
        });
      }
    });

    // F. Interactive Mascot ("Rocky the Shemrock Buddy")
    const mascotBtn = document.getElementById('mascot-btn');
    const mascotBubble = document.getElementById('mascot-speech-bubble');

    const mascotTips = [
      "👋 Hello! Welcome to Shemrock Heart Guwahati!",
      "❤️ 19 years of creating happy little learners in Assam!",
      "🧸 Tap 'Book a School Visit' to tour our play areas!",
      "🍎 Daily nutritious snacks & gentle care routine!",
      "🎨 Did you know? We have messy play and pottery fun!",
      "💬 Need quick help? Tap WhatsApp anytime!"
    ];

    let currentTipIndex = 0;

    if (mascotBtn && mascotBubble) {
      mascotBtn.addEventListener('click', () => {
        currentTipIndex = (currentTipIndex + 1) % mascotTips.length;
        mascotBubble.style.opacity = '0';
        mascotBubble.style.transform = 'scale(0.9)';

        setTimeout(() => {
          mascotBubble.textContent = mascotTips[currentTipIndex];
          mascotBubble.style.opacity = '1';
          mascotBubble.style.transform = 'scale(1)';
        }, 150);

        playPop();
      });

      mascotBubble.addEventListener('click', () => {
        window.ShemrockModal.openModal('modal-visit-booking');
      });
    }
  });
})();
