'use strict';

///////////////////////////////////////////////////////
//APP

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnToScrol = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const slides = document.querySelectorAll('.slide');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (btn) {
  return btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Page scrolling
btnToScrol.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(e.target.getBoundingClientRect());
  console.log('current Scroll X/Y:', window.pageXOffset, window.pageYOffset);
  console.log(
    'Height/width view port:',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  section1.scrollIntoView({ behavior: 'smooth' });
});

//Page navigation
//Event Delegation:

document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();
    console.log(event.target);

    //Mathching stratigy
    if (event.target.classList.contains('nav__link')) {
      const id = event.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

tabContainer.addEventListener('click', function (event) {
  const clicked = event.target.closest('.operations__tab');
  //Guard clause
  if (!clicked) return;

  //remove active classes
  tabs.forEach(function (t) {
    return t.classList.remove('operations__tab--active');
  });
  tabsContent.forEach(function (el) {
    el.classList.remove('operations__content--active');
  });

  //Acrive tab
  clicked.classList.add('operations__tab--active');

  //Active content area
  const activeArea = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  activeArea.classList.add(`operations__content--active`);
});

//Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//passing argument into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky navigation: Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;
const stickyHeaderFunc = function (entries, headerObserver) {
  const [entry] = entries;
  // console.log(`intersection done : ${entries[0].isIntersecting} `);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyHeaderFunc, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//reveal sections
function revealSections(sectionsSelector, threshold = 0.15) {
  const allSections = document.querySelectorAll(sectionsSelector);
  const handleIntersection = function (entries, observer) {
    const [entry] = entries;
    if (entry.isIntersecting) {
      entry.target.classList.add('section--hidden');
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    }
  };
  const observerOptions = { root: null, threshold: 0.15 };
  const sectionsObserver = new IntersectionObserver(
    handleIntersection,
    observerOptions
  );
  allSections.forEach(section => {
    sectionsObserver.observe(section);
    section.classList.add(sectionsSelector);
  });
}

revealSections('.section', 0.15);

//Lazy looding images
const targetImages = document.querySelectorAll('img[data-src]');
const obsImage = new IntersectionObserver(
  function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
        entry.target.addEventListener('load', function () {
          entry.target.classList.remove(entry.target.classList[1]);
          // or entry.target.classList.remove("lazy-img")
        });
        observer.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  }
);

targetImages.forEach(function (img) {
  obsImage.observe(img);
});

//Slider
let curSlide = 0;
let maxSlide = slides.length;

//Functions
const activateDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  });
};

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

//Next Slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
//prev Slide
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      `beforeend`,
      `<button class="dots__dot"  data-slide="${i}"></button>`
    );
  });
};

const initial = function () {
  createDots();
  goToSlide(0);
  activateDot(0);
};
initial();

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') prevSlide();
  if (event.key === 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('dots__dot')) {
    const { slide } = event.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
