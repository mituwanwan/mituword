import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Cosmic (Void) 主题 - 华丽宇宙
        cosmic: {
          dark: "#0a0e27",
          deeper: "#050811",
          blue: "#1a1f4e",
          purple: "#8b5cf6",
          pink: "#ec4899",
          cyan: "#06b6d4",
          sun: "#f59e0b",
          sunRed: "#ef4444",
          earth: "#3b82f6",
          star: "#ffffff",
          dust: "#c0c0c0",
          foreground: "#e0e0ff",
        },
        // Solar (Realm) 主题 - 阳光花园 / 我的世界像素
        solar: {
          light: "#fef7ed",
          brighter: "#fffaf0",
          sky: "#87ceeb",
          ocean: "#1e90ff",
          grass: "#228b22",
          sun: "#f59e0b",
          sunset: "#ff6b35",
          gold: "#ffd700",
          cloud: "#ffffff",
          mist: "#708090",
          foreground: "#1f2937",
        },
        // 别名兼容旧命名
        void: {
          dark: "#0a0e27",
          deeper: "#050811",
          blue: "#1a1f4e",
          purple: "#8b5cf6",
          pink: "#ec4899",
          cyan: "#06b6d4",
          sun: "#f59e0b",
          sunRed: "#ef4444",
          earth: "#3b82f6",
          star: "#ffffff",
          dust: "#c0c0c0",
          foreground: "#e0e0ff",
        },
        realm: {
          light: "#fef7ed",
          brighter: "#fffaf0",
          sky: "#87ceeb",
          ocean: "#1e90ff",
          grass: "#228b22",
          sun: "#f59e0b",
          sunset: "#ff6b35",
          gold: "#ffd700",
          cloud: "#ffffff",
          mist: "#708090",
          foreground: "#1f2937",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        // 宇宙主题动画
        twinkle: "twinkle 3s ease-in-out infinite",
        "twinkle-large": "twinkleLarge 4s ease-in-out infinite",
        "twinkle-double": "twinkleDouble 2s ease-in-out infinite",
        "shooting-star": "shootingStar 3s ease-in-out infinite",
        "black-hole-pulse": "blackHolePulse 4s ease-in-out infinite",
        "disk-spin": "diskSpin 15s linear infinite",
        "nebula-float": "nebulaFloat 60s ease-in-out infinite",
        "rocket-launch": "rocketLaunch 25s ease-in-out infinite",
        "ufo-float": "ufoFloat 18s ease-in-out infinite",
        "ufo-wobble": "ufoWobble 20s ease-in-out infinite",
        // 太阳主题动画
        "sun-pulse": "sunPulse 4s ease-in-out infinite",
        "sun-ray": "sunRay 4s ease-in-out infinite",
        "sun-ring-pulse": "sunRingPulse 4s ease-in-out infinite",
        "cloud-float": "cloudFloat 20s ease-in-out infinite",
        "leaf-fall": "leafFall 8s ease-in-out infinite",
        "petal-fall": "petalFall 10s ease-in-out infinite",
        "butterfly-fly": "butterflyFly 16s ease-in-out infinite",
        "paper-plane-fly": "paperPlaneFly 20s linear infinite",
        "rainbow-fade": "rainbowFade 8s ease-in-out infinite",
        // 通用动画
        orbit: "orbit 20s linear infinite",
        "orbit-slow": "orbit 30s linear infinite",
        "orbit-fast": "orbit 10s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.3)" },
        },
        twinkleLarge: {
          "0%, 100%": { opacity: "0.15", transform: "scale(0.7)" },
          "50%": { opacity: "1", transform: "scale(1.4)" },
        },
        twinkleDouble: {
          "0%, 100%": { opacity: "0.1", transform: "scale(0.6)" },
          "25%": { opacity: "1", transform: "scale(1.5)" },
          "50%": { opacity: "0.3", transform: "scale(0.9)" },
          "75%": { opacity: "1", transform: "scale(1.2)" },
        },
        shootingStar: {
          "0%": { transform: "translate(0, 0)", opacity: "0" },
          "3%": { opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "translate(450px, 350px)", opacity: "0" },
        },
        blackHolePulse: {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)", opacity: "0.6" },
          "50%": { transform: "translate(-50%, -50%) scale(1.15)", opacity: "1" },
        },
        diskSpin: {
          "0%": { transform: "translate(-50%, -50%) rotateX(75deg) rotate(0deg)" },
          "100%": { transform: "translate(-50%, -50%) rotateX(75deg) rotate(360deg)" },
        },
        nebulaFloat: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(40px, -30px) scale(1.15)" },
        },
        rocketLaunch: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "0" },
          "5%": { opacity: "1" },
          "25%": { transform: "translateY(-30vh) rotate(-2deg)" },
          "40%": { transform: "translateY(-60vh) rotate(1deg)" },
          "55%": { transform: "translateY(-80vh) rotate(-1deg)" },
          "70%": { opacity: "1", transform: "translateY(-100vh) rotate(2deg)" },
          "75%": { opacity: "0", transform: "translateY(-110vh) rotate(-3deg)" },
          "76%": { transform: "translateY(20vh) rotate(5deg)", opacity: "0" },
          "100%": { transform: "translateY(0) rotate(0deg)", opacity: "0" },
        },
        ufoFloat: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(-30px, -20px) rotate(5deg)" },
          "50%": { transform: "translate(10px, -40px) rotate(-5deg)" },
          "75%": { transform: "translate(40px, -10px) rotate(3deg)" },
        },
        ufoWobble: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "20%": { transform: "translate(50px, 30px) scale(1.1) rotate(10deg)" },
          "40%": { transform: "translate(-20px, 50px) scale(0.9) rotate(-10deg)" },
          "60%": { transform: "translate(-60px, 0px) scale(1.05) rotate(8deg)" },
          "80%": { transform: "translate(10px, -30px) scale(0.95) rotate(-5deg)" },
        },
        sunPulse: {
          "0%, 100%": { opacity: "0.8", transform: "scale(0.95)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        sunRay: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.95)" },
          "50%": { opacity: "0.7", transform: "scale(1.1)" },
        },
        sunRingPulse: {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)", opacity: "0.5" },
          "50%": { transform: "translate(-50%, -50%) scale(1.2)", opacity: "1" },
        },
        cloudFloat: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(40px)" },
        },
        leafFall: {
          "0%": { transform: "translateY(-30px) rotate(45deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(405deg)", opacity: "0" },
        },
        petalFall: {
          "0%": { transform: "translateY(-20px) rotate(0deg) scaleX(1)", opacity: "0" },
          "10%": { opacity: "0.9" },
          "50%": { transform: "translateY(50vh) rotate(180deg) scaleX(0.8)" },
          "90%": { opacity: "0.9" },
          "100%": { transform: "translateY(100vh) rotate(360deg) scaleX(1)", opacity: "0" },
        },
        butterflyFly: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: "0" },
          "5%": { opacity: "1" },
          "10%": { transform: "translate(50px, -30px) rotate(5deg) scale(1.1)" },
          "25%": { transform: "translate(120px, -60px) rotate(-3deg) scale(0.9)" },
          "40%": { transform: "translate(200px, -20px) rotate(8deg) scale(1)" },
          "55%": { transform: "translate(280px, -50px) rotate(-5deg) scale(1.1)" },
          "70%": { transform: "translate(350px, -10px) rotate(4deg) scale(0.9)" },
          "85%": { transform: "translate(420px, -40px) rotate(-2deg) scale(1)", opacity: "1" },
          "95%": { opacity: "0" },
        },
        paperPlaneFly: {
          "0%": { transform: "translate(-100px, 0) rotate(-5deg)", opacity: "0" },
          "10%": { opacity: "0.8" },
          "50%": { transform: "translate(50vw, -30px) rotate(3deg)" },
          "90%": { opacity: "0.8" },
          "100%": { transform: "translate(110vw, -60px) rotate(-2deg)", opacity: "0" },
        },
        rainbowFade: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.6" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(245, 158, 11, 0.6)" },
        },
      },
      boxShadow: {
        // 宇宙主题阴影
        glow: "0 0 30px rgba(139, 92, 246, 0.3)",
        "glow-lg": "0 0 50px rgba(139, 92, 246, 0.4)",
        sun: "0 0 40px rgba(245, 158, 11, 0.5)",
        earth: "0 0 30px rgba(59, 130, 246, 0.4)",
        // 太阳主题阴影
        sunny: "0 0 30px rgba(245, 158, 11, 0.3)",
        sky: "0 0 30px rgba(135, 206, 235, 0.4)",
        ocean: "0 0 30px rgba(30, 144, 255, 0.3)",
      },
      backgroundImage: {
        // 宇宙主题渐变
        "cosmic-gradient": "linear-gradient(135deg, #0a0e27 0%, #1a1f4e 50%, #050811 100%)",
        "cosmic-sun-gradient": "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
        "nebula-gradient": "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        "earth-gradient": "radial-gradient(circle at 30% 30%, #3b82f6, #1e40af, #0a0e27)",
        // 太阳主题渐变
        "solar-gradient": "linear-gradient(180deg, #87ceeb 0%, #fef7ed 50%, #fffaf0 100%)",
        "sunrise-gradient": "linear-gradient(135deg, #ff6b35 0%, #f59e0b 50%, #ffd700 100%)",
        "ocean-gradient": "linear-gradient(180deg, #87ceeb 0%, #1e90ff 50%, #1a5f9c 100%)",
        "meadow-gradient": "linear-gradient(180deg, #87ceeb 0%, #228b22 100%)",
        // 别名兼容
        "void-gradient": "linear-gradient(135deg, #0a0e27 0%, #1a1f4e 50%, #050811 100%)",
        "sun-gradient": "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
        "realm-gradient": "linear-gradient(180deg, #87ceeb 0%, #fef7ed 50%, #fffaf0 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
