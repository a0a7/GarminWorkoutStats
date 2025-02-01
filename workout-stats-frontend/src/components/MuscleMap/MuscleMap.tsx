import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as MuscleMapSVG } from "../../resources/muscle-map.svg";

type MuscleMapProps = {
  muscleActivation: { [key: string]: number };
  volumeType: string;
  weightUnit: string;
  totalVolume: number;
  onMuscleClick: (muscle: string) => void;
};

const allMuscles = [
  "ABDUCTORS",
  "ABS",
  "ADDUCTORS",
  "BICEPS",
  "CALVES",
  "CHEST",
  "FOREARM",
  "GLUTES",
  "HAMSTRINGS",
  "HIPS",
  "LATS",
  "LOWER_BACK",
  "NECK",
  "OBLIQUES",
  "QUADS",
  "SHOULDERS",
  "TRAPS",
  "TRICEPS",
];

const getColor = (value: number, max: number) => {
  const ratio = (value / max) * 100;
  if (ratio <= 5) {
    return 'rgba(171, 171, 171, 0.8)';
  } else if (ratio <= 25) {
    const t = (ratio - 5) / 20;
    const r = Math.round(171 + t * (255 - 171)) * 1.1;
    const g = Math.round(171 + t * (245 - 171) * 0.5);
    const b = Math.round(171 - t * 171 * 1.4);
    return `rgba(${r}, ${g}, ${b}, 0.8)`;
  } else if (ratio <= 75) {
    let g = 155 - Math.round(((ratio - 50) / 25) * (255 - 165));
    return `rgba(255, ${g}, 0, 0.8)`;
  } else {
    let r = 255 - Math.round(((ratio - 75) / 25) * (255 - 139));
    let g = 165 - Math.round(((ratio - 75) / 25) * 165);
    return `rgba(${r}, ${g}, 0, 0.8)`;
  }
};

const MuscleMap: React.FC<MuscleMapProps> = ({ muscleActivation, volumeType, totalVolume, weightUnit, onMuscleClick }) => {
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const maxActivation = Math.max(...Object.values(muscleActivation));
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseEnter = (muscle: string, event: MouseEvent) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (svgRect) {
      setHoveredMuscle(muscle);
      setTooltipPosition({ x: event.clientX - svgRect.left, y: event.clientY - svgRect.top });
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (hoveredMuscle && svgRect) {
      setTooltipPosition({ x: event.clientX - svgRect.left, y: event.clientY - svgRect.top });
    }
  };

  const handleMouseLeave = () => {
    setHoveredMuscle(null);
    setTooltipPosition(null);
  };

  const handleClick = (muscle: string) => {
    onMuscleClick(muscle);
  };

  useEffect(() => {
    const svgElement = svgRef.current;
    if (svgElement) {
      allMuscles.forEach((muscle) => {
        const muscleElements = svgElement.querySelectorAll(`.${muscle.toLowerCase()}`);
        muscleElements.forEach((muscleElement) => {
          muscleElement.addEventListener("mouseenter", (event) => handleMouseEnter(muscle, event as MouseEvent));
          muscleElement.addEventListener("mousemove", (event) => handleMouseMove(event as MouseEvent));
          muscleElement.addEventListener("mouseleave", handleMouseLeave);
          muscleElement.addEventListener("click", () => handleClick(muscle));
        });
      });
    }
    return () => {
      if (svgElement) {
        allMuscles.forEach((muscle) => {
          const muscleElements = svgElement.querySelectorAll(`.${muscle.toLowerCase()}`);
          muscleElements.forEach((muscleElement) => {
            muscleElement.removeEventListener("mouseenter", (event) => handleMouseEnter(muscle, event as MouseEvent));
            muscleElement.removeEventListener("mousemove", (event) => handleMouseMove(event as MouseEvent));
            muscleElement.removeEventListener("mouseleave", handleMouseLeave);
            muscleElement.removeEventListener("click", () => handleClick(muscle));
          });
        });
      }
    };
  }, [hoveredMuscle]);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "10px" }}>
        {[100, 75, 50, 25, 10].map(level => {
          const value = (maxActivation * level) / 100;
          const color = getColor(value, maxActivation);
          return (
            <div key={level} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: color,
                marginRight: "5px",
                marginBottom: "2px"
              }}></div>
            <span style={{ fontSize: "14px" }}>{volumeType === "weight" ? value?.toFixed(1) : value?.toFixed(0)} {volumeType === "weight" ? weightUnit : "sets"}</span>            </div>
          );
        })}
      </div>
      <MuscleMapSVG
        ref={svgRef}
        style={{ width: "100%", height: "100%" }}
        className="muscle-map"
      />
      <style>
        {allMuscles.map((muscle) => {
          const activation = muscleActivation[muscle] || 0;
          const color = getColor(activation, maxActivation);
          return `
            .${muscle.toLowerCase()} {
              fill: ${color};
              cursor: pointer;
            }
          `;
        }).join("\n")}
      </style>
      {hoveredMuscle && tooltipPosition && (
        <div
          style={{
            position: "absolute",
            top: tooltipPosition.y,
            left: tooltipPosition.x,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "8px",
            borderRadius: "5px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            transform: "translate(10%, -110%)",
            fontSize: "14px",
            fontWeight: "500",
            color: "#333",
            whiteSpace: "nowrap",
          }}
        >
          <h4 style={{ margin: "0 0 5px 0", fontSize: "14px", fontWeight: "bold" }}>
            {hoveredMuscle}
          </h4>
          <p style={{ margin: "0", fontSize: "12px" }}>
            {volumeType == "weight" ? "Weight: " : "# Sets: "}
            {muscleActivation[hoveredMuscle]?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ") /* Add &ThinSpace; every 3 digits for legibility  */ } 
            {volumeType == "weight" ? " " + weightUnit : ""  /* Add units if necessary */ }
            </p>
          <p style={{ margin: "0", fontSize: "12px" }}>
            Relative Activation:{" "}
            {muscleActivation[hoveredMuscle] > 0 ? ((muscleActivation[hoveredMuscle] / maxActivation) * 100).toFixed(2) : 0}%
          </p>
          <p style={{ margin: "0", fontSize: "12px" }}>
            Absolute Activation:{" "}
            {muscleActivation[hoveredMuscle] > 0 ? ((muscleActivation[hoveredMuscle] / totalVolume) * 100).toFixed(2) : 0} %
          </p>
        </div>
      )}
    </div>
  );
};

export default MuscleMap;