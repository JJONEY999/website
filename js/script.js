document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".section_2_track");
    const prevBtn = document.querySelector(".slider-btn.prev");
    const nextBtn = document.querySelector(".slider-btn.next");

    const slideWidth = 356;
    const gap = 40;
    const moveX = slideWidth + gap;

    let slides = Array.from(track.children);
    let index = 0;
    let isMoving = false;

    /* =========================
      1. 앞뒤 슬라이드 복제
    ========================== */
    const firstClones = slides.slice(0, 3).map(slide => slide.cloneNode(true));
    const lastClones = slides.slice(-3).map(slide => slide.cloneNode(true));

    firstClones.forEach(slide => track.appendChild(slide));
    lastClones.reverse().forEach(slide => track.prepend(slide));

    slides = Array.from(track.children);
    index = 3;

    track.style.transform = `translateX(${-moveX * index}px)`;

/* =========================
  2. 상태 업데이트 (자연스러운 이동을 위해 수정)
========================== */
function updateSlides(currentIndex) {
    slides.forEach(slide => slide.classList.remove("active", "up"));

    // 화면에 보이는 4개 중 2, 3번째 인덱스 계산
    const second = currentIndex + 1;
    const third = currentIndex + 2;

    if (slides[second]) slides[second].classList.add("up");
    if (slides[third]) slides[third].classList.add("up");
}

// 초기 실행
updateSlides(index);

/* =========================
  3. 이동 (클릭 즉시 업데이트 호출)
========================== */
function move(dir) {
    if (isMoving) return;
    isMoving = true;

    index += dir;
    
    // 1. 이동 시작과 동시에 클래스 업데이트 (자연스러운 애니메이션 핵심)
    updateSlides(index);

    // 2. 트랙 이동
    track.style.transition = "transform 0.3s ease";
    track.style.transform = `translateX(${-moveX * index}px)`;

    setTimeout(resetPosition, 600);
}

function resetPosition() {
    track.style.transition = "none";

    if (index >= slides.length - 3) {
        index = 3;
    } else if (index <= 0) {
        index = slides.length - 6;
    }

    track.style.transform = `translateX(${-moveX * index}px)`;
    
    // 무한 루프 리셋 후에도 상태 유지
    updateSlides(index); 
    isMoving = false;
}

    /* =========================
      4. 버튼
    ========================== */
    nextBtn.addEventListener("click", () => move(1));
    prevBtn.addEventListener("click", () => move(-1));

    /* =========================
      5. 자동 슬라이드
    ========================== */
    let auto = setInterval(() => move(1), 1500);

    track.addEventListener("mouseenter", () => clearInterval(auto));
    track.addEventListener("mouseleave", () => {
        auto = setInterval(() => move(1), 1500);
    });
});


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
    track.style.transition = "transform 0.8s ease";
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




document.addEventListener('DOMContentLoaded', () => {
    function createRollingBanner(selector, duration) {
        const box = document.querySelector(selector);
        if (!box) return;
        
        const track = box.querySelector('.banner-track');
        const slides = box.querySelectorAll('.slide');
        let index = 0;

        if (slides.length > 1) {
            setInterval(() => {
                index = (index + 1) % slides.length;
                track.style.transform = `translateX(-${index * 100}%)`;
            }, duration);
        }
    }

    // 각 배너를 독립적으로 실행
    createRollingBanner('.banner-1', 4500); // 메인 4.5초
    createRollingBanner('.banner-2', 3000); // 상단 3초
    createRollingBanner('.banner-3', 5500); // 하단 5.5초
});


document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.archive-track');
    const prev = document.querySelector('.prev-btn');
    const next = document.querySelector('.next-btn');
    const items = document.querySelectorAll('.archive-card');
    
    let currentIdx = 0;
    const gap = 30;
    const itemWidth = items[0].offsetWidth + gap;
    const maxIdx = items.length - 3; // 화면에 3개 보여주기 때문

    next.addEventListener('click', () => {
        if (currentIdx < maxIdx) {
            currentIdx++;
            track.style.transform = `translateX(-${currentIdx * itemWidth}px)`;
        }
    });

    prev.addEventListener('click', () => {
        if (currentIdx > 0) {
            currentIdx--;
            track.style.transform = `translateX(-${currentIdx * itemWidth}px)`;
        }
    });
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
