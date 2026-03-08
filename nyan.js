window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("nyan-stars");

    if (!container) {
        return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        return;
    }

    container.replaceChildren(canvas);

    const stars = [];
    const pointer = {
        x: -9999,
        y: -9999,
        active: false
    };

    const STAR_COUNT = 55;
    const BASE_COLORS = ["#d4b53f", "#c9a62e", "#e0c55a"];
    const REPULSE_RADIUS = 140;
    const REPULSE_FORCE = 0.18;
    let width = 0;
    let height = 0;
    let animationFrameId = 0;

    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
    }

    function createStar() {
        return {
            x: randomBetween(0, width),
            y: randomBetween(0, height),
            vx: randomBetween(-0.35, 0.35),
            vy: randomBetween(-0.2, 0.2),
            size: randomBetween(5, 10),
            opacity: randomBetween(0.45, 0.95),
            color: BASE_COLORS[Math.floor(Math.random() * BASE_COLORS.length)]
        };
    }

    function populateStars() {
        stars.length = 0;

        for (let i = 0; i < STAR_COUNT; i += 1) {
            stars.push(createStar());
        }
    }

    function drawStar(x, y, outerRadius, innerRadius, color, opacity) {
        context.save();
        context.beginPath();

        for (let i = 0; i < 10; i += 1) {
            const angle = (Math.PI / 5) * i - Math.PI / 2;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;

            if (i === 0) {
                context.moveTo(px, py);
            } else {
                context.lineTo(px, py);
            }
        }

        context.closePath();
        context.fillStyle = color;
        context.globalAlpha = opacity;
        context.fill();
        context.restore();
    }

    function updateStar(star) {
        const dx = star.x - pointer.x;
        const dy = star.y - pointer.y;
        const distance = Math.hypot(dx, dy);

        if (pointer.active && distance < REPULSE_RADIUS && distance > 0) {
            const force = (1 - distance / REPULSE_RADIUS) * REPULSE_FORCE;
            star.vx += (dx / distance) * force;
            star.vy += (dy / distance) * force;
        }

        star.vx *= 0.985;
        star.vy *= 0.985;
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < -12) star.x = width + 12;
        if (star.x > width + 12) star.x = -12;
        if (star.y < -12) star.y = height + 12;
        if (star.y > height + 12) star.y = -12;

        drawStar(star.x, star.y, star.size, star.size * 0.45, star.color, star.opacity);
    }

    function animate() {
        context.clearRect(0, 0, width, height);

        for (const star of stars) {
            updateStar(star);
        }

        animationFrameId = window.requestAnimationFrame(animate);
    }

    function handlePointerMove(event) {
        const rect = canvas.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = true;
    }

    function resetPointer() {
        pointer.x = -9999;
        pointer.y = -9999;
        pointer.active = false;
    }

    resizeCanvas();
    populateStars();
    animate(0);

    window.addEventListener("resize", () => {
        resizeCanvas();
        populateStars();
    });

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseleave", resetPointer);
    window.addEventListener("blur", resetPointer);

    window.addEventListener("beforeunload", () => {
        window.cancelAnimationFrame(animationFrameId);
    });
});
