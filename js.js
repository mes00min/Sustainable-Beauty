document.addEventListener("DOMContentLoaded", () => {


    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const stickers = document.querySelectorAll('.sticker');
    const startButton = document.getElementById('startButton');
    const imagePaths = [
        "img/paper01.png", "img/paper02.png", "img/paper03.png",
        "img/fly01.png", "img/fly02.png"
    ];

    const staticImage04 = document.querySelector("#D .static-image04");
    const sectionD = document.querySelector("#D");
    const staticImage05 = document.querySelector(".static-image05");
    const container = document.querySelector('.graph-container');
    const image = document.querySelector('.graph-image');
    const magnifier = document.querySelector('.magnifier');
    const sectionE = document.querySelector("#E");
    const sectionH = document.querySelector("#H"); 
    const dropdowns = document.querySelectorAll(".dropdown");
    const fallingContainer = document.getElementById("H");
    const staticImage09 = document.querySelector(".static-image09");
    const scoreElement = document.getElementById("score");
    const interactivePoints = document.querySelectorAll(".interactive-point");
    const descriptionBox = document.querySelector(".description-box");
    const descriptionTitle = document.querySelector(".description-title");
    const descriptionContent = document.querySelector(".description-content");


    let hideTimeout; // leave 이벤트 타이머
    

    let movedStickers = 0;
    const totalStickers = stickers.length;
    let isScrollLocked = true;


    // 햄버거 버튼 클릭 이벤트
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });


    // 초기 상태 설정
    document.body.style.overflow = "hidden";
    startButton.style.opacity = 0.5;
    startButton.style.pointerEvents = "none";


    // 스티커 이동 감지 및 부드러운 드래그
    stickers.forEach((sticker) => {
        let offsetX = 0, offsetY = 0;
        let isDragging = false;

        sticker.addEventListener("mousedown", (event) => {
            event.preventDefault();
            offsetX = event.clientX - sticker.offsetLeft;
            offsetY = event.clientY - sticker.offsetTop;
            isDragging = true;

            const onMouseMove = (event) => {
                if (!isDragging) return;

                gsap.to(sticker, {
                    left: `${event.clientX - offsetX}px`,
                    top: `${event.clientY - offsetY}px`,
                    duration: 0.1,
                    ease: "power1.out",
                });
            };

            const onMouseUp = () => {
                isDragging = false;
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);

                if (!sticker.dataset.moved) {
                    sticker.dataset.moved = true;
                    movedStickers++;
                }

                if (movedStickers === totalStickers) {
                    gsap.to(startButton, {
                        opacity: 1,
                        duration: 0.3,
                        onComplete: () => {
                            startButton.style.pointerEvents = "auto";
                        },
                    });
                }
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
    });


    // 스타트 버튼 클릭 시 스크롤 잠금 해제
    startButton.addEventListener('click', () => {
        if (movedStickers === totalStickers) {
            document.body.style.overflow = "auto";
            isScrollLocked = false;
            const targetSection = document.querySelector('#B');
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            alert('먼저 모든 쓰레기를 옮겨주세요!');
        }
    });


    // 스크롤 잠금
    document.addEventListener('scroll', () => {
        if (isScrollLocked) {
            window.scrollTo(0, 0);
        }
    });


    // 섹션 D 이미지 서서히 나타내기
    if (sectionD) {
        const image = sectionD.querySelector(".graph-image");
        if (image) {
            image.style.opacity = 0;
            image.style.transition = "opacity 2s ease-in-out";

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            image.style.opacity = 1; // 이미지 표시
                        }, 1000); // 시간 조절
                    }
                });
            });

            observer.observe(container);
        }
    }


    // 돋보기 효과
    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 돋보기 활성화 및 위치 설정
        magnifier.style.display = "block";
        magnifier.style.left = `${x - magnifier.offsetWidth / 2}px`;
        magnifier.style.top = `${y - magnifier.offsetHeight / 2}px`;

        // 돋보기 배경 이미지 설정
        magnifier.style.backgroundImage = `url(${image.src})`;
        magnifier.style.backgroundPosition = `${-x * 2 + magnifier.offsetWidth / 2}px ${-y * 2 + magnifier.offsetHeight / 2}px`;
    });

    container.addEventListener('mouseleave', () => {
        magnifier.style.display = "none"; // 돋보기 숨기기
    });


    // 트럭 이미지 애니메이션 (#D)
    if (staticImage04 && sectionD) {
        staticImage04.style.transform = "translateX(-150%) translateY(-50%) scaleY(0.95)";
        window.addEventListener("scroll", () => {
            const rect = sectionD.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                staticImage04.style.transition = "transform 1.5s ease-in-out";
                staticImage04.style.transform = "translateX(0) translateY(-50%) scaleY(0.95)";
            }
        });
    }


    // 자동차 이미지 애니메이션 (#E)
    if (staticImage05 && sectionE) {
        staticImage05.style.transform = "translateX(150%) translateY(-50%)";
        staticImage05.style.transition = "transform 1.5s ease-in-out";

        window.addEventListener("scroll", () => {
            const rect = sectionE.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                staticImage05.style.transform = "translateX(0) translateY(-50%)";
            }
        });
    }


    // 드롭다운 기능 (#F)
    dropdowns.forEach((dropdown) => {
        const header = dropdown.querySelector(".dropdown-header");
        const content = dropdown.querySelector(".dropdown-content");

        header.addEventListener("click", () => {
            const isOpen = dropdown.classList.contains("open");

            dropdowns.forEach((d) => {
                d.classList.remove("open");
                d.querySelector(".dropdown-content").style.maxHeight = null;
            });

            if (!isOpen) {
                dropdown.classList.add("open");
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });



    // interactive-point hover 이벤트
    interactivePoints.forEach((point) => {
        point.addEventListener("mouseenter", () => {
            const title = point.dataset.title || "Untitled";
            const description = point.dataset.description || "No description available";

            descriptionTitle.textContent = title;
            descriptionContent.textContent = description.replace(/&#10;/g, '\n');

            descriptionBox.querySelector(".description-title").textContent = title;
            descriptionBox.querySelector(".description-content").textContent = description;

            descriptionBox.classList.remove("hidden");
            descriptionBox.classList.add("visible");
        });

        point.addEventListener("mouseleave", () => {
            descriptionBox.classList.remove("visible");
            descriptionBox.classList.add("hidden");
        });
    });


        // .static-image09 좌우 마우스 이동
        if (staticImage09) {
            document.addEventListener("mousemove", (event) => {
                const section = document.getElementById("H");
                const sectionWidth = section.offsetWidth;
                const mouseX = event.clientX;
    
                const percentX = (mouseX / sectionWidth) * 100;
    
                staticImage09.style.left = `${percentX}%`;
            });
        }



        
        let score = 0; // 스코어 초기화

        // 스코어 업데이트 함수
        function updateScore() {
            score++;
            scoreElement.textContent = score; // `span` 업데이트
        }

        // Falling Image 생성 함수
        function createFallingImageForSection(containerId) {
            const imageUrl = imagePaths[Math.floor(Math.random() * imagePaths.length)];
            const img = document.createElement("img");
            img.src = imageUrl;
            img.classList.add("falling-image");

            // 초기 위치 설정
            img.style.left = `${Math.random() * 100}vw`;
            img.style.top = `-50px`;
            img.style.zIndex = "2"; // z-index 설정 (원하는 값으로 변경)

            const container = document.getElementById(containerId);
            if (!container) return;

            container.appendChild(img);

            const duration = 5 + Math.random() * 2; // 떨어지는 시간 조정
            const factor = Math.random() + 0.8; // 크기 비율
            img.style.width = `${80 * factor}px`; // 크기 조정

            const endY = container.offsetHeight;

            // 섹션 H에서는 충돌 감지 포함
            gsap.to(img, {
                y: endY,
                duration: duration,
                ease: "linear",
                onUpdate: () => {
                    if (containerId === "H") checkCollision(img); // 충돌 감지
                },
                onComplete: () => {
                    img.remove(); // 떨어진 이미지 제거
                },
            });
        }

        // 충돌 감지 함수
        function checkCollision(fallingImage) {
            const staticRect = staticImage09.getBoundingClientRect();
            const fallingRect = fallingImage.getBoundingClientRect();

            if (
                fallingRect.left < staticRect.right &&
                fallingRect.right > staticRect.left &&
                fallingRect.top < staticRect.bottom &&
                fallingRect.bottom > staticRect.top
            ) {
                updateScore(); // 스코어 업데이트
                fallingImage.remove(); // 충돌한 이미지 제거
            }
        }

 
        setInterval(() => createFallingImageForSection("B"), 1000); 
        setInterval(() => createFallingImageForSection("C"), 2000); 
        setInterval(() => createFallingImageForSection("H"), 800); 
            
            
});
