'use strict';

///////////////////////////////////////
//section1 && button
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

//nav
const navLinks = document.querySelector('.nav__links');

//tabs
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

//slider
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');
const sliders = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');

///////////////////////////////////////
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
//滚动 按钮
btnScrollTo.addEventListener('click', function () {
  //传统方式
  // const s1Croods = section1.getBoundingClientRect();
  // console.log(s1Croods);
  // window.scrollTo({
  //   top: s1Croods.top + window.scrollY,
  //   left: s1Croods.left + window.scrollX,
  //   behavior: 'smooth',
  // });

  //现代方法
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
//导航跳转link
navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    !e.target.classList.contains('nav__link') ||
    e.target.classList.contains('nav__link--btn')
  )
    return;
  //当前选择的link
  const curLink = e.target;
  //通过link的href属性选择相应的section
  document
    .querySelector(curLink.getAttribute('href'))
    .scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// 菜单 移入 动画
//处理导航link移入移出
const handleHover = function (e) {
  if (!e.target.classList.contains('nav__link')) return;

  const curLink = e.target;
  const siblings = curLink.closest('.nav').querySelectorAll('.nav__link');
  const logo = curLink.closest('.nav').querySelector('img');

  siblings.forEach(link => {
    if (link === curLink) return;
    link.style.opacity = this;
  });
  logo.style.opacity = this;
};

//导航移入移出
navLinks.addEventListener('mouseover', handleHover.bind(0.5));
navLinks.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// 选项卡 组件
tabsContainer.addEventListener('click', function (e) {
  const curTab = e.target.closest('.operations__tab');
  if (!curTab) return;

  //移除tab和tabContent的active状态
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active')
  );

  //给当前的tab和tabContent加上acvtive状态
  curTab.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${curTab.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Slider 轮播图幻灯片
let curSlide = 0;
const slideMax = sliders.length;

const createDOts = function () {
  sliders.forEach((_, index) => {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"`)
    .classList.add('dots__dot--active');
};

const goToSlide = function (curSlide) {
  sliders.forEach((slider, index) => {
    slider.style.transform = `translateX(${(index - curSlide) * 100}%)`;
  });
};

const nextSlide = function () {
  console.log(curSlide);
  if (curSlide === slideMax - 1) curSlide = 0;
  else curSlide++;

  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) curSlide = slideMax - 1;
  else curSlide--;

  goToSlide(curSlide);
  activateDot(curSlide);
};

//slider 初始状态
const initialSlider = function () {
  curSlide = 0;
  goToSlide(curSlide);

  createDOts();
  activateDot(curSlide);
};
initialSlider();

//按钮切换 slide
btnSliderRight.addEventListener('click', nextSlide);
btnSliderLeft.addEventListener('click', prevSlide);

dotsContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  curSlide = +e.target.dataset.slide;

  goToSlide(curSlide);
  activateDot(curSlide);
});

//键盘左右键切换 slide
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

///////////////////////////////////////
// Sticky 导航
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const stickyHeader = function (entries) {
  const entry = entries[0];

  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
  } else {
    nav.classList.add('sticky');
  }
};

const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyHeader, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections 显示 sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observe.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// 启动观察 observe sections
allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

//image lazing 图片懒加载
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  const img = entry.target;
  img.src = img.dataset.src;

  img.addEventListener('load', function () {
    img.classList.remove('lazy-img');
  });
  observe.unobserve(img);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

// 启动观察 observe imgs
imgTargets.forEach(img => {
  img.classList.add('lazy-img');
  imgObserver.observe(img);
});
