class ComparisonSlider {
    constructor(selector) {
        this.wrapper = document.querySelector(selector);
        if (!this.wrapper) return;
        
        this.overlay = this.wrapper.querySelector('.comparison-slider__overlay');
        this.divider = this.wrapper.querySelector('.comparison-slider__divider');
        this.isActive = false;
        this.isMobile = this.detectMobile();

        this.videoBeforeEl = this.wrapper.querySelector('.comparison-slider__img--before');
        this.videoAfterEl = this.wrapper.querySelector('.comparison-slider__img--after');

        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        this.startLightSync();

        if (this.isMobile) {
            this.wrapper.addEventListener('touchstart', () => this.handleStart());
            document.addEventListener('touchend', () => this.handleEnd());
            this.wrapper.addEventListener('touchmove', (e) => this.handleMove(e));
        } else {
            this.wrapper.addEventListener('mouseenter', () => this.handleStart());
            this.wrapper.addEventListener('mouseleave', () => this.handleEnd());
            this.wrapper.addEventListener('mousemove', (e) => this.handleMove(e));
        }
    }

    startLightSync() {
        setInterval(() => {
            if (!this.videoBeforeEl || !this.videoAfterEl) return;
            
            const diff = Math.abs(this.videoBeforeEl.currentTime - this.videoAfterEl.currentTime);
            if (diff > 0.1) {
                this.videoBeforeEl.currentTime = this.videoAfterEl.currentTime;
            }
        }, 500);
    }

    handleStart() {
        this.isActive = true;
    }

    handleEnd() {
        this.isActive = false;
    }

    handleMove(e) {
        if (!this.isActive) return;

        const rect = this.wrapper.getBoundingClientRect();
        let x;

        if (e.touches) {
            x = e.touches[0].clientX - rect.left;
        } else {
            x = e.clientX - rect.left;
        }

        x = Math.max(0, Math.min(x, rect.width));
        const percentage = (x / rect.width) * 100;

        this.updateSlider(percentage);
    }

    updateSlider(percentage) {
        const rightValue = 100 - percentage;
        this.overlay.style.clipPath = `inset(0 ${rightValue}% 0 0)`;
        this.divider.style.left = percentage + '%';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ComparisonSlider('.comparison-slider__wrapper');
});
