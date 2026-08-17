import * as THREE from "three";

export const loadingManager = new THREE.LoadingManager();

const bar = document.getElementById("loading-bar");
const percentText = document.getElementById("loading-percent");
const screen = document.getElementById("loading-screen");

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const percent = Math.round((itemsLoaded / itemsTotal) * 100);
    bar.style.width = percent + "%";
    percentText.textContent = percent + "%";
};

loadingManager.onLoad = () => {
    screen.classList.add("hidden");
    setTimeout(() => screen.remove(), 500);
};

loadingManager.onError = (url) => {
    console.error("Hiba a betöltés közben:", url);
};