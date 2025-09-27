import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const PneumoniaDetectionGauge = ({ confidence, label }) => {
  const color = label === "PNEUMONIA" ? "#DC2626" : "#16A34A"; 
  // let adjustedConfidence=0;

  // if (label==="PNEUMONIA" && typeof confidence === "number")
  //   adjustedConfidence = confidence;
  // else if (label==="NORMAL" && typeof confidence === "number") 
  //    adjustedConfidence=Math.round((1 - confidence / 100) * 100);

  const adjustedConfidence = label === "NORMAL" ? Math.round((1 - confidence / 100) * 100) : confidence;

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

export default PneumoniaDetectionGauge;
