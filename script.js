const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const angle = document.getElementById("angle");
const angleValue = document.getElementById("angleValue");
const preview = document.querySelector(".preview");
const cssCode = document.getElementById("cssCode");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const modeRadios = document.querySelectorAll("input[name='mode']");

let animationInterval = null;
let animatedAngle = parseInt(angle.value);
let rainbowStep = 0;

function updateGradient(customAngle = null, customColors = null) {
  const gradAngle = customAngle !== null ? customAngle : angle.value;
  const c1 = customColors ? customColors[0] : color1.value;
  const c2 = customColors ? customColors[1] : color2.value;

  const gradient = `linear-gradient(${gradAngle}deg, ${c1}, ${c2})`;
  preview.style.background = gradient;
  cssCode.textContent = `background: ${gradient};`;
  angleValue.textContent = gradAngle + "°";
}

function startAngleAnimation() {
  animationInterval = setInterval(() => {
    animatedAngle = (animatedAngle + 1) % 361;
    updateGradient(animatedAngle);
  }, 30);
}

function startRainbowAnimation() {
  animationInterval = setInterval(() => {
    rainbowStep += 2;
    const c1 = `hsl(${rainbowStep % 360}, 80%, 60%)`;
    const c2 = `hsl(${(rainbowStep + 120) % 360}, 80%, 60%)`;
    updateGradient(animatedAngle, [c1, c2]);
  }, 50);
}

function stopAnimation() {
  clearInterval(animationInterval);
  animationInterval = null;
}

// Update on input change (manual mode only)
[color1, color2, angle].forEach(input => {
  input.addEventListener("input", () => {
    if (document.querySelector("input[name='mode']:checked").value === "manual") {
      updateGradient();
    }
  });
});

// Copy CSS
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(cssCode.textContent);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy CSS"), 1500);
});

// Download PNG
downloadBtn.addEventListener("click", () => {
  html2canvas(preview).then(canvas => {
    const link = document.createElement("a");
    link.download = "gradient.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

// Mode switching
modeRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    stopAnimation();
    const mode = document.querySelector("input[name='mode']:checked").value;
    if (mode === "animate") {
      startAngleAnimation();
    } else if (mode === "rainbow") {
      startRainbowAnimation();
    } else {
      updateGradient();
    }
  });
});

// Initial load
updateGradient();