import { init } from './scene.js';
import { animate } from './animation.js';

function isMobile() {
    return window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
}

if (isMobile()) {
    document.getElementById("mobile-warning").classList.remove("hidden");
    document.getElementById("loading-screen")?.remove();
} else {
    init();
    animate();
}