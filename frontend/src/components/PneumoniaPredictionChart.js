import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import styled from "styled-components";

const PneumoniaPredictionChart = ({ userId }) => {
  const [predictions, setPredictions] = useState([]);

  // Function to fetch predictions from the backend
  const fetchPneumoniaPredictions = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_pneumonia_predictions?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }

      const data = await response.json();
      console.log(data);

      // Count the occurrences of "normal" and "pneumonia" predictions
      const counts = { normal: 0, pneumonia: 0 };

      

      data.forEach(prediction => {
        const lowerCasePrediction = prediction.prediction_result.toLowerCase(); // normalize casing
        if (lowerCasePrediction === "normal" || lowerCasePrediction === "NORMAL") {
          counts.normal++;
        } else if (lowerCasePrediction === "pneumonia" ) {
          counts.pneumonia++;
        }
      });

      console.log(counts);

      // Set the formatted data for the chart (we only need the counts for "normal" and "covid")
      setPredictions([
        { label: "Normal", count: counts.normal },
        { label: "Pneumonia", count: counts.pneumonia }
      ]);

      console.log(predictions);
    } catch (error) {
      console.error('Error fetching pneumonia predictions:', error);
    }
  };

  // Fetch predictions when the component is mounted or userId changes
  useEffect(() => {
    if (userId) {
      fetchPneumoniaPredictions(userId);
    }
  }, [userId]);

  return (
    <div>
      <Title>Bugünkü Zatürre Tahminleri</Title>
      <br></br>
      {/* Pass the aggregated prediction data to the chart */}
      <Chart predictions={predictions} />
    </div>
  );
};

export default PneumoniaPredictionChart;


const headerStyle = {
  textAlign: "center",
  // marginBottom: "1.5rem",
  color: "#1e3a8a",
  backgroundColor: "#e0f2fe",
  padding: "12px 24px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 50, 0.1)",
  fontSize: "30px",
  fontWeight: "600",
  letterSpacing: "0.5px",
};

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  /* margin-bottom: 10px; */
  color: #333;
  text-align: left; /* Align left */
`;