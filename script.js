class ComparisonSlider {
    constructor(selector) {
        this.wrapper = document.querySelector(selector);
        this.overlay = this.wrapper.querySelector('.comparison-slider__overlay');
        this.divider = this.wrapper.querySelector('.comparison-slider__divider');
        this.isActive = false;
        this.isMobile = this.detectMobile();

        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        if (this.isMobile) {
            // Mobile: drag to interact
            this.wrapper.addEventListener('touchstart', () => this.handleStart());
            document.addEventListener('touchend', () => this.handleEnd());
            this.wrapper.addEventListener('touchmove', (e) => this.handleMove(e));
        } else {
            // Desktop: hover to interact
            this.wrapper.addEventListener('mouseenter', () => this.isActive = true);
            this.wrapper.addEventListener('mouseleave', () => this.isActive = false);
            this.wrapper.addEventListener('mousemove', (e) => this.handleMove(e));
        }
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
        // Convertir porcentaje a valores para clip-path horizontal
        const rightValue = 100 - percentage;

        // Actualizar el clip-path del overlay - horizontal simple
        this.overlay.style.clipPath = `inset(0 ${rightValue}% 0 0)`;

        // Actualizar posición del divisor
        this.divider.style.left = percentage + '%';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ComparisonSlider('.comparison-slider__wrapper');
});
