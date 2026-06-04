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
        // 暗色主题 - 宇宙黑洞
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
        // 亮色主题 - 太阳地球
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
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        // 宇宙主题动画
        "twinkle": "twinkle 3s ease-in-out infinite",
        "orbit": "orbit 20s linear infinite",
        "orbit-slow": "orbit 30s linear infinite",
        "orbit-fast": "orbit 10s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "shooting-star": "shootingStar 3s ease-in-out infinite",
        // 太阳地球主题动画
        "sun-ray": "sunRay 4s ease-in-out infinite",
        "cloud-float": "cloudFloat 8s ease-in-out infinite",
        "wave": "wave 3s ease-in-out infinite",
        "leaf-fall": "leafFall 5s ease-in-out infinite",
      },
      keyframes: {
        // 宇宙主题
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
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
        shootingStar: {
          "0%": { transform: "translateX(100vw) translateY(-10vh)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "translateX(-20vw) translateY(110vh)", opacity: "0" },
        },
        // 太阳地球主题
        sunRay: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.95)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        cloudFloat: {
          "0%, 100%": { transform: "translateX(0px)" },
          "50%": { transform: "translateX(20px)" },
        },
        wave: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        leafFall: {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100px) rotate(360deg)", opacity: "0" },
        },
      },
      boxShadow: {
        // 宇宙主题阴影
        "glow": "0 0 30px rgba(139, 92, 246, 0.3)",
        "glow-lg": "0 0 50px rgba(139, 92, 246, 0.4)",
        "sun": "0 0 40px rgba(245, 158, 11, 0.5)",
        "earth": "0 0 30px rgba(59, 130, 246, 0.4)",
        // 太阳地球主题阴影
        "sunny": "0 0 30px rgba(245, 158, 11, 0.3)",
        "sky": "0 0 30px rgba(135, 206, 235, 0.4)",
        "ocean": "0 0 30px rgba(30, 144, 255, 0.3)",
      },
      backgroundImage: {
        // 宇宙主题背景
        "cosmic-gradient": "linear-gradient(135deg, #0a0e27 0%, #1a1f4e 50%, #050811 100%)",
        "sun-gradient": "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
        "nebula-gradient": "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        "earth-gradient": "radial-gradient(circle at 30% 30%, #3b82f6, #1e40af, #0a0e27)",
        // 太阳地球主题背景
        "solar-gradient": "linear-gradient(180deg, #87ceeb 0%, #fef7ed 50%, #fffaf0 100%)",
        "sunrise-gradient": "linear-gradient(135deg, #ff6b35 0%, #f59e0b 50%, #ffd700 100%)",
        "ocean-gradient": "linear-gradient(180deg, #87ceeb 0%, #1e90ff 50%, #1a5f9c 100%)",
        "meadow-gradient": "linear-gradient(180deg, #87ceeb 0%, #228b22 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
