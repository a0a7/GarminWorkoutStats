import React from "react";
import { ReactComponent as MuscleMapSVG } from "../../resources/muscle-map.svg";

type MuscleMapProps = {
  muscleActivation: { [key: string]: number };
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
  if (ratio <= 5) {           // Gray < 5%
    return 'rgba(171, 171, 171, 0.8)';
  } else if (ratio <= 25) {   // Gray (5%) -> Yellow (25%)
    const t = (ratio - 5) / 20;
    const r = Math.round(171 + t * (255 - 171)) * 1.1;
    const g = Math.round(171 + t * (245 - 171) * 0.5); // multiply by 0.65 for aesthetics
    const b = Math.round(171 - t * 171 * 1.4);
    return `rgba(${r}, ${g}, ${b}, 0.8)`;
  } else if (ratio <= 75) {   // Yellow (25%) -> Orange (75%)
      let g = 155 - Math.round(((ratio - 50) / 25) * (255 - 165));
      return `rgba(255, ${g}, 0, 0.8)`;
  } else {                    // Orange (75%) -> Red (100%)
      let r = 255 - Math.round(((ratio - 75) / 25) * (255 - 139));
      let g = 165 - Math.round(((ratio - 75) / 25) * 165);
      return `rgba(${r}, ${g}, 0, 0.8)`;
  }
}

const MuscleMap: React.FC<MuscleMapProps> = ({ muscleActivation }) => {
  const maxActivation = Math.max(...Object.values(muscleActivation));

  return (
    <div>
      <MuscleMapSVG
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
            }
          `;
        }).join("\n")}
      </style>
      {allMuscles.map((muscle) => (
        <div key={muscle}>
          {muscle}: {muscleActivation[muscle] || 0}
        </div>
      ))}
    </div>
  );
};

export default MuscleMap;