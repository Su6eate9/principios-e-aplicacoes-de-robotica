import React, { useState, useEffect } from "react";
import { Play, RotateCw, RotateCcw, ArrowRight, RefreshCw } from "lucide-react";

export const RobotNavigation = () => {
  const [currentPosition, setCurrentPosition] = useState({
    x: 0,
    y: 0,
    theta: 0,
  });
  const [path, setPath] = useState([{ x: 0, y: 0, theta: 0 }]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transformationHistory, setTransformationHistory] = useState([]);

  const commandSequence = [
    { dx: 0, dy: 0, dtheta: 0 },
    { dx: 0, dy: 0, dtheta: 0 },
    { dx: 2, dy: 1, dtheta: 0 },
    { dx: 0, dy: 0, dtheta: -45 },
    { dx: 3, dy: 1, dtheta: 0 },
    { dx: -4, dy: 2, dtheta: 0 },
    { dx: 0, dy: 0, dtheta: -180 },
    { dx: -2, dy: 2, dtheta: 0 },
  ];

  const calculateTransformationMatrix = (dx, dy, dtheta, fromPosition) => {
    const thetaRad = (dtheta * Math.PI) / 180;
    const cos_theta = Math.cos(thetaRad);
    const sin_theta = Math.sin(thetaRad);

    if (dtheta !== 0) {
      return [
        [cos_theta, -sin_theta, fromPosition.x + dx],
        [sin_theta, cos_theta, fromPosition.y + dy],
        [0, 0, 1],
      ];
    } else {
      return [
        [1, 0, dx],
        [0, 1, dy],
        [0, 0, 1],
      ];
    }
  };

  const getMovementDescription = (dx, dy, dtheta) => {
    if (dx === 0 && dy === 0 && dtheta === 0) {
      return "Matriz identidade";
    } else if (dtheta !== 0 && (dx !== 0 || dy !== 0)) {
      return `Rotação ${dtheta}° + Translação (${dx}, ${dy})`;
    } else if (dtheta !== 0) {
      return `Rotação ${dtheta}°`;
    } else {
      return `Translação (${dx}, ${dy})`;
    }
  };

  const executeNextMovement = () => {
    if (currentStep < commandSequence.length - 1) {
      setIsAnimating(true);

      const nextCommand = commandSequence[currentStep + 1];
      const currentPos = currentPosition;
      const newPosition = {
        x: currentPos.x + nextCommand.dx,
        y: currentPos.y + nextCommand.dy,
        theta: currentPos.theta + nextCommand.dtheta,
      };

      const transformationMatrix = calculateTransformationMatrix(
        nextCommand.dx,
        nextCommand.dy,
        nextCommand.dtheta,
        currentPos
      );

      const transformationRecord = {
        step: currentStep + 1,
        fromPosition: { ...currentPos },
        toPosition: { ...newPosition },
        movement: { ...nextCommand },
        matrix: transformationMatrix,
        description: `T${currentStep + 1} - ${getMovementDescription(
          nextCommand.dx,
          nextCommand.dy,
          nextCommand.dtheta
        )}`,

        cosValue: Math.cos(((nextCommand.dtheta || 0) * Math.PI) / 180),
        sinValue: Math.sin(((nextCommand.dtheta || 0) * Math.PI) / 180),
      };

      setTimeout(() => {
        setCurrentPosition(newPosition);
        setCurrentStep(currentStep + 1);
        setPath((prev) => [...prev, newPosition]);
        setTransformationHistory((prev) => [...prev, transformationRecord]);
        setIsAnimating(false);
      }, 500);
    }
  };

  const reset = () => {
    setCurrentPosition({ x: 0, y: 0, theta: 0 });
    setPath([{ x: 0, y: 0, theta: 0 }]);
    setCurrentStep(0);
    setTransformationHistory([]);
    setIsAnimating(false);
  };

  const rotateRobot = (direction) => {
    const rotationAmount = direction === "cw" ? 45 : -45;
    const newTheta = (currentPosition.theta + rotationAmount) % 360;

    const manualRotationMatrix = calculateTransformationMatrix(
      0,
      0,
      rotationAmount,
      currentPosition
    );

    const manualTransformation = {
      step: `Manual-${Date.now()}`,
      fromPosition: { ...currentPosition },
      toPosition: { ...currentPosition, theta: newTheta },
      movement: { dx: 0, dy: 0, dtheta: rotationAmount },
      matrix: manualRotationMatrix,
      description: `Rotação Manual ${rotationAmount}°`,
      cosValue: Math.cos((rotationAmount * Math.PI) / 180),
      sinValue: Math.sin((rotationAmount * Math.PI) / 180),
    };

    setCurrentPosition((prev) => ({ ...prev, theta: newTheta }));
    setTransformationHistory((prev) => [...prev, manualTransformation]);
  };

  const formatMatrix = (matrix) => {
    return matrix
      .map((row) =>
        row
          .map((val) => (typeof val === "number" ? val.toFixed(4) : val))
          .join("   ")
      )
      .join("\n");
  };

  const scaleX = (x) => 250 + x * 25;
  const scaleY = (y) => 200 - y * 25;
  const currentTransformation =
    transformationHistory[transformationHistory.length - 1];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Plano Cartesiano</h2>
            <div
              className="relative bg-gray-700 rounded overflow-hidden"
              style={{ width: "500px", height: "400px" }}
            >
              <svg width="500" height="400" className="absolute inset-0">
                {Array.from({ length: 21 }, (_, i) => (
                  <g key={i}>
                    <line
                      x1={25 * i}
                      y1={0}
                      x2={25 * i}
                      y2={400}
                      stroke="#4B5563"
                      strokeWidth="0.5"
                    />
                    <line
                      x1={0}
                      y1={25 * i}
                      x2={500}
                      y2={25 * i}
                      stroke="#4B5563"
                      strokeWidth="0.5"
                    />
                  </g>
                ))}
                <line
                  x1={250}
                  y1={0}
                  x2={250}
                  y2={400}
                  stroke="#9CA3AF"
                  strokeWidth="2"
                />
                <line
                  x1={0}
                  y1={200}
                  x2={500}
                  y2={200}
                  stroke="#9CA3AF"
                  strokeWidth="2"
                />

                {Array.from({ length: 21 }, (_, i) => {
                  const valueX = i - 10;
                  const valueY = 8 - i;

                  if (valueX !== 0 && i % 2 === 0) {
                    return (
                      <text
                        key={`x-${i}`}
                        x={25 * i}
                        y={215}
                        fill="#9CA3AF"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        {valueX}
                      </text>
                    );
                  }

                  if (valueY !== 0 && i % 2 === 0) {
                    return (
                      <text
                        key={`y-${i}`}
                        x={240}
                        y={25 * i + 5}
                        fill="#9CA3AF"
                        fontSize="10"
                        textAnchor="end"
                      >
                        {valueY}
                      </text>
                    );
                  }
                  return null;
                })}

                {path.map((point, index) => {
                  if (index === 0) return null;
                  const prevPoint = path[index - 1];
                  return (
                    <line
                      key={index}
                      x1={scaleX(prevPoint.x)}
                      y1={scaleY(prevPoint.y)}
                      x2={scaleX(point.x)}
                      y2={scaleY(point.y)}
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                  );
                })}

                {path.map((point, index) => (
                  <g key={index}>
                    <circle
                      cx={scaleX(point.x)}
                      cy={scaleY(point.y)}
                      r="5"
                      fill={index === currentStep ? "#EF4444" : "#10B981"}
                      stroke="#1F2937"
                      strokeWidth="2"
                    />
                    <text
                      x={scaleX(point.x) + 10}
                      y={scaleY(point.y) - 10}
                      fill="#E5E7EB"
                      fontSize="10"
                    >
                      T{index}
                    </text>
                  </g>
                ))}

                <g
                  transform={`translate(${scaleX(currentPosition.x)}, ${scaleY(
                    currentPosition.y
                  )}) rotate(${currentPosition.theta})`}
                >
                  <polygon
                    points="-10,-8 15,0 -10,8"
                    fill="#3B82F6"
                    stroke="#1E40AF"
                    strokeWidth="2"
                    className={isAnimating ? "animate-pulse" : ""}
                  />
                  <circle cx="8" cy="0" r="2" fill="#EF4444" />
                </g>
              </svg>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              <button
                onClick={executeNextMovement}
                disabled={
                  currentStep >= commandSequence.length - 1 || isAnimating
                }
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-3 py-2 rounded flex items-center gap-2 text-sm"
              >
                Executar
              </button>
              <button
                onClick={reset}
                className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded flex items-center gap-2 text-sm"
              >
                <RefreshCw size={16} />
                Reset
              </button>
              <button
                onClick={() => rotateRobot("cw")}
                className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded flex items-center gap-2 text-sm"
              >
                <RotateCw size={16} />
                Girar ↻
              </button>
              <button
                onClick={() => rotateRobot("ccw")}
                className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded flex items-center gap-2 text-sm"
              >
                <RotateCcw size={16} />
                Girar ↺
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Estado Atual</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-blue-400 text-xl font-bold">
                    {currentPosition.x}
                  </div>
                  <div className="text-xs text-gray-300">X</div>
                </div>
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-blue-400 text-xl font-bold">
                    {currentPosition.y}
                  </div>
                  <div className="text-xs text-gray-300">Y</div>
                </div>
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-blue-400 text-xl font-bold">
                    {currentPosition.theta}°
                  </div>
                  <div className="text-xs text-gray-300">θ</div>
                </div>
              </div>
            </div>
            {currentTransformation && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">
                  Última Transformação
                </h2>
                <div className="grid grid-cols-3 gap-2 text-center text-sm mb-3">
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-green-400 font-bold">
                      {currentTransformation.movement.dx > 0 ? "+" : ""}
                      {currentTransformation.movement.dx}
                    </div>
                    <div className="text-xs text-gray-300">ΔX</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-green-400 font-bold">
                      {currentTransformation.movement.dy > 0 ? "+" : ""}
                      {currentTransformation.movement.dy}
                    </div>
                    <div className="text-xs text-gray-300">ΔY</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-green-400 font-bold">
                      {currentTransformation.movement.dtheta > 0 ? "+" : ""}
                      {currentTransformation.movement.dtheta}°
                    </div>
                    <div className="text-xs text-gray-300">Δθ</div>
                  </div>
                </div>
                <div className="bg-gray-900 p-3 rounded">
                  <div className="text-sm text-gray-300 mb-2">
                    {currentTransformation.description}
                  </div>
                  {currentTransformation.movement.dtheta !== 0 && (
                    <div className="text-xs text-yellow-400 mb-2">
                      cos({currentTransformation.movement.dtheta}°) ={""}
                      {currentTransformation.cosValue.toFixed(4)}, sin(
                      {currentTransformation.movement.dtheta}°) ={""}
                      {currentTransformation.sinValue.toFixed(4)}
                    </div>
                  )}
                  <pre className="text-xs font-mono text-green-400">
                    {formatMatrix(currentTransformation.matrix)}
                  </pre>
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">
                Histórico de Posições
              </h2>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {path.map((point, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-xs ${
                      index === currentStep ? "bg-blue-600" : "bg-gray-700"
                    }`}
                  >
                    T{index}: ({point.x}, {point.y}, {point.theta}°)
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">
                Histórico de Transformações
              </h2>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {transformationHistory.map((transform, index) => (
                  <div key={index} className="bg-gray-700 p-2 rounded text-xs">
                    <div className="font-medium text-yellow-400">
                      {transform.description}
                    </div>
                    <div className="text-gray-300">
                      ({transform.fromPosition.x}, {transform.fromPosition.y}) →
                      ({transform.toPosition.x}, {transform.toPosition.y})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
