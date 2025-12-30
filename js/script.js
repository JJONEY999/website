/*-------------------------------section_2------------------------------*/ 
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".section_2_track");
    const prevBtn = document.querySelector(".slider-btn.prev");
    const nextBtn = document.querySelector(".slider-btn.next");

    const slideWidth = 356;
    const gap = 40;
    const moveX = slideWidth + gap;

    let slides = Array.from(track.children);
    const originalCount = slides.length; // 원본 개수 (8개)

    /* 1. 앞뒤 슬라이드 복제 (충분히 복제하여 빈 공간 방지) */
    const firstClones = slides.slice(0, 4).map(slide => slide.cloneNode(true));
    const lastClones = slides.slice(-4).map(slide => slide.cloneNode(true));

    // 순서대로 추가해야 함 (reverse 제거)
    firstClones.forEach(slide => track.appendChild(slide));
    lastClones.reverse().forEach(slide => track.prepend(slide)); // prepend 시 역순 정렬 주의

    // 다시 prepend 할 때는 원래 순서를 유지하려면 아래 방식 권장
    // track.prepend(...lastClones); // 최신 브라우저 방식

    // 안전한 복제 및 배치
    track.innerHTML = '';
    const allSlides = [...slides.slice(-4), ...slides, ...slides.slice(0, 4)];
    allSlides.forEach(slide => {
        const newSlide = slide.cloneNode(true);
        track.appendChild(newSlide);
    });

    const finalSlides = Array.from(track.children);
    let index = 4; // 복제된 4개 다음부터 시작
    let isMoving = false;

    track.style.transform = `translateX(${-moveX * index}px)`;

    function updateSlides(currentIndex) {
        finalSlides.forEach(slide => slide.classList.remove("up"));
        // 현재 보이는 화면의 중앙 2, 3번째 강조
        if (finalSlides[currentIndex + 1]) finalSlides[currentIndex + 1].classList.add("up");
        if (finalSlides[currentIndex + 2]) finalSlides[currentIndex + 2].classList.add("up");
    }

    updateSlides(index);

    function move(dir) {
        if (isMoving) return;
        isMoving = true;

        index += dir;
        track.style.transition = "transform 0.4s ease-out"; // 부드러운 전환
        track.style.transform = `translateX(${-moveX * index}px)`;
        
        updateSlides(index);

        // 애니메이션 종료 후 위치 체크
        track.addEventListener('transitionend', resetPosition, { once: true });
    }

    function resetPosition() {
        track.style.transition = "none";

        // 끝에 도달했을 때 원본 위치로 순간 이동
        if (index >= originalCount + 4) {
            index = 4;
        } else if (index <= 3) {
            index = originalCount + 3;
        }

        track.style.transform = `translateX(${-moveX * index}px)`;
        updateSlides(index);
        isMoving = false;
    }

    nextBtn.addEventListener("click", () => move(1));
    prevBtn.addEventListener("click", () => move(-1));

    let auto = setInterval(() => move(1), 2000); // 간격을 조금 늘려야 사용자 경험에 좋음

    track.addEventListener("mouseenter", () => clearInterval(auto));
    track.addEventListener("mouseleave", () => {
        auto = setInterval(() => move(1), 2000);
    });
});
/*-------------------------------------------------------------------------------*/ 

document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".main-slider-wrap");

  let slides = Array.from(track.children);
  const slideWidth = wrap.offsetWidth;

  let index = 1;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let autoSlide;

  /* ===== 무한 루프 세팅 ===== */
  const first = slides[0].cloneNode(true);
  const last = slides[slides.length - 1].cloneNode(true);

  track.appendChild(first);
  track.prepend(last);

  slides = Array.from(track.children);
  track.style.transform = `translateX(${-slideWidth * index}px)`;

  function update() {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");
  }
  update();

  function move(dir) {
    index += dir;
    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(${-slideWidth * index}px)`;

    track.addEventListener("transitionend", reset, { once: true });
    update();
  }

  function reset() {
    track.style.transition = "none";

    if (index === slides.length - 1) index = 1;
    if (index === 0) index = slides.length - 2;

    track.style.transform = `translateX(${-slideWidth * index}px)`;
    update();
  }

  /* ===== 드래그 ===== */
  wrap.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.pageX;
    currentX = -slideWidth * index;
    track.style.transition = "none";
  });

  window.addEventListener("mousemove", e => {
    if (!isDragging) return;
    const diff = e.pageX - startX;
    track.style.transform = `translateX(${currentX + diff}px)`;
  });

  window.addEventListener("mouseup", e => {
    if (!isDragging) return;
    isDragging = false;

    const diff = e.pageX - startX;
    if (diff > 100) move(-1);
    else if (diff < -100) move(1);
    else move(0);
  });

  /* ===== 자동 슬라이드 ===== */
  function startAuto() {
    autoSlide = setInterval(() => move(1), 4000);
  }

  function stopAuto() {
    clearInterval(autoSlide);
  }

  /* ===== 스크롤 진입 시 시작 ===== */
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) startAuto();
    else stopAuto();
  }, { threshold: 0.6 });

  observer.observe(wrap);

  wrap.addEventListener("mouseenter", stopAuto);
  wrap.addEventListener("mouseleave", startAuto);
});

document.addEventListener('DOMContentLoaded', () => {
  const rightTrack = document.querySelector('#main-right .vertical');
  if (!rightTrack) return;

  const slideDelay = 3000;
  const transition = 'transform 0.8s ease-in-out';

  // ✅ 한 장 이동 단위(이미지 509 + 간격 84 = 593)
  const step = 593;

  const imgs = Array.from(rightTrack.querySelectorAll('img'));

  // ✅ 첫번째 복제(무한루프용)
  const firstClone = imgs[0].cloneNode(true);
  rightTrack.appendChild(firstClone);

  let idx = 0;
  let lock = false;

  function move() {
    if (lock) return;
    lock = true;

    idx++;
    rightTrack.style.transition = transition;
    rightTrack.style.transform = `translateY(-${idx * step}px)`;

    // ✅ 마지막(복제)까지 가면 transition 끝난 뒤 0으로 순간이동
    if (idx === imgs.length) {
      rightTrack.addEventListener('transitionend', function reset() {
        rightTrack.removeEventListener('transitionend', reset);
        rightTrack.style.transition = 'none';
        rightTrack.style.transform = 'translateY(0)';
        idx = 0;
        lock = false;
      }, { once: true });
    } else {
      rightTrack.addEventListener('transitionend', () => {
        lock = false;
      }, { once: true });
    }
  }

  setInterval(move, slideDelay);
});


document.addEventListener('DOMContentLoaded', () => {
  const rightTrack = document.querySelector('#main-left .horizontal');
  if (!rightTrack) return;

  const slideDelay = 2000;
  const transition = 'transform 1.2s ease-in-out';

  // ✅ 한 장 이동 단위(이미지 509 + 간격 84 = 593)
  const step = 978;

  const imgs = Array.from(rightTrack.querySelectorAll('img'));

  // ✅ 첫번째 복제(무한루프용)
  const firstClone = imgs[0].cloneNode(true);
  rightTrack.appendChild(firstClone);

  let idx = 0;
  let lock = false;

  function move() {
    if (lock) return;
    lock = true;

    idx++;
    rightTrack.style.transition = transition;
    rightTrack.style.transform = `translateX(-${idx * step}px)`;

    // ✅ 마지막(복제)까지 가면 transition 끝난 뒤 0으로 순간이동
    if (idx === imgs.length) {
      rightTrack.addEventListener('transitionend', function reset() {
        rightTrack.removeEventListener('transitionend', reset);
        rightTrack.style.transition = 'none';
        rightTrack.style.transform = 'translateX(0)';
        idx = 0;
        lock = false;
      }, { once: true });
    } else {
      rightTrack.addEventListener('transitionend', () => {
        lock = false;
      }, { once: true });
    }
  }

  setInterval(move, slideDelay);
});

/*----------------------Section_4-----------------------------*/ 

document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.archive-track');
    const cards = document.querySelectorAll('.archive-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = cards.length; // 복제본 때문에 실제 시작 인덱스 설정
    const cardCount = cards.length;
    const gap = 30; // 카드 사이 간격
    let isTransitioning = false; // 연속 클릭 방지용 플래그
    let autoPlayInterval; // 자동 재생 인터벌 변수

    // 1. 무한 루프를 위해 앞뒤로 카드 복제
    cards.forEach((card) => {
        const firstClone = card.cloneNode(true);
        const lastClone = card.cloneNode(true);
        track.appendChild(firstClone); // 뒤에 추가
        track.insertBefore(lastClone, cards[0]); // 앞에 추가
    });

    // 초기 위치 설정
    updatePosition(false);

    function updatePosition(animation = true) {
        if (!animation) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        }
        
        // 이동 공식: (카드너비 + 간격) * 인덱스
        const moveX = `calc(-${currentIndex} * ((100% - 60px) / 3 + ${gap}px))`;
        track.style.transform = `translateX(${moveX})`;
    }

    // 다음 슬라이드로 이동하는 함수
    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updatePosition();

        if (currentIndex === cardCount * 2) {
            setTimeout(() => {
                currentIndex = cardCount;
                updatePosition(false);
                isTransitioning = false;
            }, 600);
        } else {
            setTimeout(() => { isTransitioning = false; }, 600);
        }
    }

    // 이전 슬라이드로 이동하는 함수
    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        updatePosition();

        if (currentIndex === 0) {
            setTimeout(() => {
                currentIndex = cardCount;
                updatePosition(false);
                isTransitioning = false;
            }, 600);
        } else {
            setTimeout(() => { isTransitioning = false; }, 600);
        }
    }

    // 2. 자동 재생 함수 (3초마다 실행)
    function startAutoPlay() {
        stopAutoPlay(); // 중복 방지
        autoPlayInterval = setInterval(nextSlide, 2000); 
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // 3. 이벤트 연결
    nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoPlay(); // 클릭 시 시간 초기화 후 재시작
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoPlay(); // 클릭 시 시간 초기화 후 재시작
    });

    // 마우스를 올리면 멈추고, 떼면 다시 재생 (선택 사항)
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    // 실행
    startAutoPlay();
});
