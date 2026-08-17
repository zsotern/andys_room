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

export function toggleInfo() {
    const left = document.getElementById('hud-left');
    const right = document.getElementById('hud-right');
    const visible = left.style.display !== 'none';
    left.style.display = visible ? 'none' : 'block';
    right.style.display = visible ? 'none' : 'block';
}

export function resetCamera() {
    camera.position.copy(defaultCamState);
    controls.target.set(0, 1.2, 0);
    controls.update();
}

export function toast(msg) {
    const message = document.getElementById('toast');
    message.textContent = msg;
    message.style.display = 'block';
    clearTimeout(message._t);
    message._t = setTimeout(()=>{ message.style.display = 'none'; }, 1200);
}