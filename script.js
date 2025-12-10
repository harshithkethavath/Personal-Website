class TypeWriter {
    constructor(txtElement, words, emojis, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.emojis = emojis;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.emojiElement = document.querySelector('.hero-emoji');
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (!this.isDeleting && this.txt === '') {
            if (this.emojiElement && this.emojis[current]) {
                this.emojiElement.textContent = this.emojis[current];
            }
        }

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        if (this.emojiElement && fullTxt.length > 0) {
            const opacity = this.txt.length / fullTxt.length;
            this.emojiElement.style.opacity = opacity;
        }

        let typeSpeed = 200;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

document.addEventListener('DOMContentLoaded', init);

function init() {
    const txtElement = document.querySelector('.txt-type');
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');

    const emojis = ["☁️", "🤖", "🧠"];

    new TypeWriter(txtElement, words, emojis, wait);

    const track = document.querySelector('.carousel-track');
    const cards = track.querySelectorAll('.project-card');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentIndex = 0;
    let itemsPerView = 3;

    function updateItemsPerView() {
        if (window.innerWidth <= 768) {
            itemsPerView = 1;
        } else if (window.innerWidth <= 1024) {
            itemsPerView = 2;
        } else {
            itemsPerView = 3;
        }
        setupCarousel();
    }

    function setupCarousel() {
        const totalPages = Math.ceil(cards.length / itemsPerView);

        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateTrack();
            });
            dotsContainer.appendChild(dot);
        }

        if (currentIndex >= totalPages) {
            currentIndex = totalPages - 1;
        }
        updateTrack();
    }

    function updateTrack() {
        track.style.transform = `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 32}px))`;

        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    prevBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(cards.length / itemsPerView);
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = totalPages - 1;
        }
        updateTrack();
    });

    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(cards.length / itemsPerView);
        currentIndex++;
        if (currentIndex >= totalPages) {
            currentIndex = 0;
        }
        updateTrack();
    });

    window.addEventListener('resize', () => {
        updateItemsPerView();
    });


    updateItemsPerView();
}
