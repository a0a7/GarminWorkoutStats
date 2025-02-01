import React from "react";

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

const MuscleMap: React.FC<MuscleMapProps> = ({ muscleActivation }) => {
  return (
    <div>
      <h3>Muscle Activation Map</h3>
      {allMuscles.map((muscle) => (
        <div key={muscle}>
          {muscle}: {muscleActivation[muscle] || 0}
        </div>
      ))}
    </div>
  );
};

export default MuscleMap;