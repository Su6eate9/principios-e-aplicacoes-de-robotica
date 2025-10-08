import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Info } from "lucide-react";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 450;
const M2P = 3779.52;
const ROBOT_LENGTH = 1;
const ROBOT_SPEED = 0.01;

export const RobotSimulator = () => {
  const canvasRef = useRef(null);
  const robotImageRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const robotStateRef = useRef({
    x: 200,
    y: 200,
    theta: 0,
    gamma: 0,
    v: ROBOT_SPEED * M2P,
    trail: [],
  });

  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    const img = new Image();
    img.src = "robo.png";
    img.onload = () => {
      robotImageRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Erro ao carregar imagem do robô");
      setImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const state = robotStateRef.current;
      if (e.key === "ArrowUp") {
        state.gamma += 0.005;
      } else if (e.key === "ArrowDown") {
        state.gamma -= 0.005;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;

    const drawRobot = (x, y, theta) => {
      const size = 40;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-theta);

      if (robotImageRef.current && imageLoaded) {
        ctx.drawImage(robotImageRef.current, -size / 2, -size / 2, size, size);
      } else {
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(-size / 2, -size / 2, size, size);

        ctx.fillStyle = "#ef4444";
        ctx.fillRect(size / 2 - 5, -3, 8, 6);
      }

      ctx.restore();
    };

    const drawRobotFrame = (x, y, theta) => {
      const length = 80;

      // X axis (red)
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + length * Math.cos(-theta), y + length * Math.sin(-theta));
      ctx.stroke();

      // Y axis (green)
      ctx.strokeStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + length * Math.cos(-theta + Math.PI / 2),
        y + length * Math.sin(-theta + Math.PI / 2)
      );
      ctx.stroke();
    };

    const drawTrail = (trail) => {
      if (trail.length < 2) return;

      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
      }
      ctx.stroke();
    };

    const drawInfo = (state) => {
      if (!showInfo) return;

      ctx.fillStyle = "#000000";
      ctx.fillRect(10, CANVAS_HEIGHT - 60, 500, 50);

      ctx.fillStyle = "#ffffff";
      ctx.font = "16px monospace";
      const info = `x: ${Math.round(state.x)} | y: ${Math.round(
        state.y
      )} | θ: ${Math.round((state.theta * 180) / Math.PI)}° | γ: ${(
        (state.gamma * 180) /
        Math.PI
      ).toFixed(2)}°`;
      ctx.fillText(info, 20, CANVAS_HEIGHT - 30);
    };

    const updateRobot = (dt) => {
      const state = robotStateRef.current;

      // Kinematic model
      state.x += state.v * Math.cos(state.theta) * dt;
      state.y -= state.v * Math.sin(state.theta) * dt;
      state.theta += ((state.v * Math.tan(state.gamma)) / ROBOT_LENGTH) * dt;

      // Reset theta to avoid overflow
      if (state.theta > 2 * Math.PI || state.theta < -2 * Math.PI) {
        state.theta = 0;
      }

      // Keep robot within bounds
      state.x = Math.max(50, Math.min(CANVAS_WIDTH - 50, state.x));
      state.y = Math.max(50, Math.min(CANVAS_HEIGHT - 50, state.y));

      // Update trail
      state.trail.push({ x: state.x, y: state.y });
      if (state.trail.length > 500) {
        state.trail.shift();
      }
    };

    const animate = () => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Clear canvas
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Grid
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_WIDTH; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let i = 0; i < CANVAS_HEIGHT; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_WIDTH, i);
        ctx.stroke();
      }

      const state = robotStateRef.current;

      if (isRunning) {
        updateRobot(dt);
      }

      drawTrail(state.trail);
      drawRobotFrame(state.x, state.y, state.theta);
      drawRobot(state.x, state.y, state.theta);
      drawInfo(state);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isRunning, showInfo]);

  const handleReset = () => {
    robotStateRef.current = {
      x: 200,
      y: 200,
      theta: 0,
      gamma: 0,
      v: ROBOT_SPEED * M2P,
      trail: [],
    };
    setIsRunning(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 overflow-hidden">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-4 w-full max-w-7xl">
        <h1 className="text-2xl font-bold text-white mb-3 text-center">
          Simulador de Robô Móvel
        </h1>

        <div className="bg-slate-900 rounded-lg p-3 mb-3">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="rounded border-2 border-slate-700 w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex gap-3 items-center justify-center">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
            >
              {isRunning ? (
                <>
                  <Pause size={18} />
                  Pausar
                </>
              ) : (
                <>
                  <Play size={18} />
                  Iniciar
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
            >
              <RotateCcw size={18} />
              Resetar
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`flex items-center gap-2 ${
                showInfo
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-slate-600 hover:bg-slate-700"
              } text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm`}
            >
              <Info size={18} />
              Info
            </button>
          </div>

          <div className="bg-slate-700 rounded-lg p-3 text-white">
            <h3 className="font-bold mb-2 text-sm">Controles:</h3>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <kbd className="bg-slate-900 px-2 py-1 rounded">↑</kbd>
                <span>Aumentar ângulo</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="bg-slate-900 px-2 py-1 rounded">↓</kbd>
                <span>Diminuir ângulo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
