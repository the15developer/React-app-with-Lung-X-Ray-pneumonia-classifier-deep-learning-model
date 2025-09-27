import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CovidDetectionGauge = ({ confidence, label }) => {
  const color = label === "COVID-19" ? "#DC2626" : "#16A34A"; // red or green


  const adjustedConfidence = label === "COVID-19" ? Math.round((1 - confidence / 100) * 100) : confidence;

  return (
    <div style={{ width: 200, margin: "0 auto" }}>
      <CircularProgressbarWithChildren
        value={adjustedConfidence}
        styles={buildStyles({
          pathColor: color,
          trailColor: "#eee",
          strokeLinecap: "round",
        })}
      >
        <div style={{ fontSize: 24, fontWeight: "bold", color: color }}>
          {adjustedConfidence}%
        </div>
        <div style={{ fontSize: 16, marginTop: 5 }}>{label}</div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default CovidDetectionGauge;
