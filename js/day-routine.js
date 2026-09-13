/**
 * Shemrock Heart - A Day at Shemrock Hearts (Interactive Routine Stepper)
 * Corresponds directly to the architecture PDF:
 * Arrival -> Classroom -> Activity -> Play -> Interaction -> Learning -> Home
 */

(function () {
  'use strict';

  const routineData = [
    {
      id: 0,
      stepNum: 1,
      title: 'Warm Morning Arrival',
      label: 'Arrival',
      time: '8:45 AM – 9:15 AM',
      icon: '🌅',
      image: 'assets/images/routine_arrival.jpg',
      lead: 'A cheerful start with warm smiles, loving greetings, and gentle transition into school.',
      description:
        'Every child is welcomed at our colorful entrance by their caring teachers and school principal. We begin with gentle temperature & wellness check, shoes in personal cubbies, and emotional reassurance so little ones feel completely safe and loved from their very first step.',
      learningPoints: [
        'Emotional security & confident separation from parents',
        'Habits of organization: personal cubby and bag placement',
        'Polite social greetings: “Good Morning!”, smiles & high-fives'
      ]
    },
    {
      id: 1,
      stepNum: 2,
      title: 'Classroom Circle Time',
      label: 'Classroom',
      time: '9:15 AM – 10:00 AM',
      icon: '☀️',
      image: 'assets/images/hero_kids.jpg',
      lead: 'Energizing circle time, action songs, morning rhymes, and weekly theme discovery.',
      description:
        'Children gather on cozy, colorful alphabet rugs for Morning Circle. Through interactive songs, calendar exploration, weather observation, and show-and-tell, children develop attentive listening, rhythm, and self-confidence speaking in front of friends.',
      learningPoints: [
        'Language immersion & phonemic awareness through rhymes',
        'Understanding daily calendar, days of the week & weather',
        'Listening attentively and taking turns during circle discussions'
      ]
    },
    {
      id: 2,
      stepNum: 3,
      title: 'Hands-on Activity & Sensory Play',
      label: 'Activity',
      time: '10:00 AM – 10:45 AM',
      icon: '🎨',
      image: 'assets/images/routine_activity.jpg',
      lead: 'Tactile sensory trays, finger painting, clay sculpting, and curiosity-led exploration.',
      description:
        'Children learn best when using all their senses! In our activity hub, little hands squish organic clay, experiment with vibrant finger paints, solve colorful wooden block puzzles, and explore water & kinetic sand tables designed for early cognitive growth.',
      learningPoints: [
        'Fine motor dexterity, finger grip strength & hand-eye coordination',
        'Sensory integration: textures, colors, shapes & spatial reasoning',
        'Uninhibited creative expression and imaginative experimentation'
      ]
    },
    {
      id: 3,
      stepNum: 4,
      title: 'Joyful Outdoor Play & Motor Fun',
      label: 'Play',
      time: '10:45 AM – 11:30 AM',
      icon: '🏃',
      image: 'assets/images/routine_play.jpg',
      lead: 'Safe outdoor playground with soft turf, slides, tricycles, and active teamwork games.',
      description:
        'Out in the fresh air under shaded awnings, our safe play turf comes alive. Toddlers enjoy smooth mini slides, pedal colorful tricycles on rubberized tracks, navigate soft obstacle courses, and engage in cooperative parachute games under watchful teacher supervision.',
      learningPoints: [
        'Gross motor agility, balancing, running and bilateral coordination',
        'Understanding safety, sharing play equipment, and waiting turns',
        'Fresh air, active physical exercise, and cardiovascular vitality'
      ]
    },
    {
      id: 4,
      stepNum: 5,
      title: 'Healthy Snack & Social Interaction',
      label: 'Interaction',
      time: '11:30 AM – 12:15 PM',
      icon: '🍎',
      image: 'assets/images/routine_snack.jpg',
      lead: 'Table etiquettes, mindful eating, fruit snacking, and joyful conversation with friends.',
      description:
        'Handwashing with foamy bubbles begins snack time! Sitting at pastel kid-friendly dining tables, children enjoy wholesome fruit slices and homemade snacks. Teachers guide self-feeding, using napkins, and polite phrases like “Please pass”, “Thank you”, and “May I”.',
      learningPoints: [
        'Hygiene self-care: proper handwashing and clean eating habits',
        'Developing positive, adventurous attitudes toward healthy fruits',
        'Grace and social mealtime etiquette with classmates'
      ]
    },
    {
      id: 5,
      stepNum: 6,
      title: 'ShemEduMAX™ Learning & Phonics',
      label: 'Learning',
      time: '12:15 PM – 1:00 PM',
      icon: '📚',
      image: 'assets/images/routine_learning.jpg',
      lead: 'Award-winning ShemEduMAX™ scientific curriculum, storytelling, and early numeracy concepts.',
      description:
        'Guided by the proven ShemEduMAX™ blended curriculum, children dive into multi-sensory phonics, letter sounds, Montessori counting beads, and immersive big-book storytelling that kindles a lifelong passion for reading and curious problem-solving.',
      learningPoints: [
        'Synthetic phonics: sound-symbol relationships and vocabulary expansion',
        'Early mathematical concepts: counting, grouping, patterns & sizes',
        'Critical thinking, comprehension, and cause-and-effect inquiry'
      ]
    },
    {
      id: 6,
      stepNum: 7,
      title: 'Reflection & Cheerful Departure',
      label: 'Home',
      time: '1:00 PM – 1:30 PM',
      icon: '🎒',
      image: 'assets/images/routine_arrival.jpg',
      lead: 'Reflecting on the day’s discoveries, packing bags, parent diary updates, and warm goodbyes.',
      description:
        'The day winds down with a calming reflection song. Children pack their bags, receive their daily star stamps and parent observation diary, and head to the pickup foyer with beaming smiles, proud of everything they created and learned!',
      learningPoints: [
        'Reflective thinking: recalling favorite memories and lessons of the day',
        'Independence in packing personal belongings and tidying up',
        'Reconnecting happily with parents with pride in their accomplishments'
      ]
    }
  ];

  let currentStepIndex = 0;
  let autoplayTimer = null;
  let isAutoplaying = true;

  function renderStepper() {
    const tabsContainer = document.getElementById('routine-nav-tabs');
    const imageElement = document.getElementById('routine-img');
    const timeBadge = document.getElementById('routine-time-badge');
    const stepIndicator = document.getElementById('routine-step-num');
    const titleElement = document.getElementById('routine-title');
    const descElement = document.getElementById('routine-desc');
    const benefitsList = document.getElementById('routine-benefits-list');

    if (!tabsContainer || !imageElement) return;

    // Render Tabs if not populated
    if (tabsContainer.children.length === 0) {
      routineData.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = `routine-tab-btn ${index === 0 ? 'active' : ''}`;
        btn.setAttribute('aria-label', `View ${item.label} stage`);
        btn.innerHTML = `
          <span class="tab-step-num">${item.stepNum}</span>
          <span>${item.icon} ${item.label}</span>
        `;
        btn.addEventListener('click', () => {
          goToStep(index);
          pauseAutoplay();
        });
        tabsContainer.appendChild(btn);
      });
    }

    updateStepView();
  }

  function updateStepView() {
    const item = routineData[currentStepIndex];
    const tabsContainer = document.getElementById('routine-nav-tabs');

    // Update active tab class
    const tabs = document.querySelectorAll('.routine-tab-btn');
    tabs.forEach((tab, index) => {
      if (index === currentStepIndex) {
        tab.classList.add('active');
        // Scroll horizontally inside the tab bar container only, without scrolling the main browser window
        if (tabsContainer && tabsContainer.scrollWidth > tabsContainer.clientWidth) {
          const containerRect = tabsContainer.getBoundingClientRect();
          const tabRect = tab.getBoundingClientRect();
          const relativeLeft = tabRect.left - containerRect.left + tabsContainer.scrollLeft;
          const targetScrollLeft = relativeLeft - (tabsContainer.clientWidth / 2) + (tab.offsetWidth / 2);
          tabsContainer.scrollTo({
            left: Math.max(0, targetScrollLeft),
            behavior: 'smooth'
          });
        }
      } else {
        tab.classList.remove('active');
      }
    });

    // Animate image fade
    const imageElement = document.getElementById('routine-img');
    const timeBadge = document.getElementById('routine-time-badge');
    const stepIndicator = document.getElementById('routine-step-num');
    const titleElement = document.getElementById('routine-title');
    const descElement = document.getElementById('routine-desc');
    const benefitsList = document.getElementById('routine-benefits-list');

    if (imageElement) {
      imageElement.style.opacity = '0.4';
      imageElement.style.transform = 'scale(0.98)';
      setTimeout(() => {
        imageElement.src = item.image;
        imageElement.alt = `${item.title} at Shemrock Heart Guwahati`;
        imageElement.style.opacity = '1';
        imageElement.style.transform = 'scale(1)';
      }, 150);
    }

    if (timeBadge) timeBadge.innerHTML = `⏱️ ${item.time}`;
    if (stepIndicator) stepIndicator.textContent = `Stage 0${item.stepNum} of 07 • Real Day Timeline`;
    if (titleElement) titleElement.textContent = item.title;
    if (descElement) descElement.textContent = item.description;

    if (benefitsList) {
      benefitsList.innerHTML = item.learningPoints
        .map(pt => `<li><span style="color:var(--color-accent-mint);">✔</span> ${pt}</li>`)
        .join('');
    }
  }

  function goToStep(index) {
    if (index >= 0 && index < routineData.length) {
      currentStepIndex = index;
      updateStepView();
      if (window.ShemrockAudio) window.ShemrockAudio.playPop();
    }
  }

  function nextStep() {
    currentStepIndex = (currentStepIndex + 1) % routineData.length;
    updateStepView();
    if (window.ShemrockAudio) window.ShemrockAudio.playPop();
  }

  function prevStep() {
    currentStepIndex = (currentStepIndex - 1 + routineData.length) % routineData.length;
    updateStepView();
    if (window.ShemrockAudio) window.ShemrockAudio.playPop();
  }

  function startAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      if (isAutoplaying) {
        currentStepIndex = (currentStepIndex + 1) % routineData.length;
        updateStepView();
      }
    }, 5500);
  }

  function pauseAutoplay() {
    isAutoplaying = false;
    const playPauseBtn = document.getElementById('routine-play-pause-btn');
    if (playPauseBtn) playPauseBtn.innerHTML = '▶ Resume Auto';
  }

  function toggleAutoplay() {
    isAutoplaying = !isAutoplaying;
    const playPauseBtn = document.getElementById('routine-play-pause-btn');
    if (playPauseBtn) {
      playPauseBtn.innerHTML = isAutoplaying ? '⏸ Pause Auto' : '▶ Resume Auto';
    }
    if (window.ShemrockAudio) window.ShemrockAudio.playPop();
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderStepper();
    startAutoplay();

    const nextBtn = document.getElementById('routine-next-btn');
    const prevBtn = document.getElementById('routine-prev-btn');
    const playPauseBtn = document.getElementById('routine-play-pause-btn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextStep();
        pauseAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevStep();
        pauseAutoplay();
      });
    }

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', toggleAutoplay);
    }
  });

  window.ShemrockRoutine = {
    goToStep,
    nextStep,
    prevStep
  };
})();
