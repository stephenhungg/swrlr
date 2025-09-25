# NebulaSketch
⸻

🔍 Overview

NebulaSketch is a mesmerizing canvas-based particle engine that renders 20,000 procedurally-driven particles using noise fields, color blending, and custom buffer manipulation. It’s lightweight, blazing fast, and visually hypnotic—perfect for generative visuals, audio-reactive art, and immersive web experiences.

⸻

⚙️ Functionality
	•	🌬️ Simplex Noise Field – Particles flow in a fluid-like motion via 3D noise
	•	🖼️ Custom Alpha + Fade Logic – Each pixel fades in/out based on TTL
	•	🎨 Color Blending – RGB values are randomized for natural spectrum variance
	•	🧠 Per-particle attributes:
	•	x, y – Position
	•	vx, vy – Velocity
	•	a, l – Alpha/Fade
	•	ttl – Lifespan
	•	vc – Velocity coefficient
	•	r, g, b – Color channels

⸻

🧩 Utility

Use this for:
	•	Interactive backgrounds
	•	VJ visual layers
	•	Creative coding installations
	•	Generative NFTs or visual art
	•	Performance visualizations with Stats.js integration

⸻

📦 Included Files
	•	main.js – Core app logic
	•	utils.js (assumed) – For helper functions like rand, lerp, fadeInOut
	•	createRenderingContext() – Buffer + Context bootstrapper
	•	Uses SimplexNoise, Stats.js, and native canvas

⸻

📐 Specifications
	•	Particle Count: 20,000
	•	Noise Steps: 6
	•	Motion Physics: Custom vx/vy velocity system
	•	Visual Pipeline:
	•	Canvas buffer render
	•	Frame accumulation with alpha trail
	•	Blurring, brightening, saturating
	•	Composite rendering (additive blend)

⸻

💻 Tech Requirements
	•	Runs in any modern browser
	•	Works on both desktop and mobile (performance varies)
	•	Requires SimplexNoise, Stats.js, PropsArray utility

⸻

🧠 Skill Level

Intermediate–Advanced
Great for creative coders looking to dive into buffer-based rendering, procedural particle simulation, and pixel-level graphics programming.

⸻

🎥 Media Preview

(Insert looping video/GIF demo of simulation here)

⸻

🧑‍💻 Dev Notes
	•	Blur + brightness pipeline is fully editable
	•	PropsArray supports custom shape particle data—extend freely
	•	Add audio reactivity by mapping velocity or color to sound
	•	Built for max visual fidelity with minimum dependencies

⸻

🎯 Perfect For

Creative devs, generative artists, VJs, and anyone needing a highly customizable, performance-optimized 2D particle sim for web-based visuals.

⸻

Want a JSON export, tutorial version, or monetizable product pack version of this? Just say the word 💼🚀