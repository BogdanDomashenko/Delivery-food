new Swiper('.swiper', {
    autoplay: {
        delay: 5000,
    },
    slidesPerView: 1,
    loop: true,
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 30,
      slideShadows: false,
    },
    grabCursor: true,
});