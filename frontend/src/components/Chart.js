import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const ChartCanvas = styled.canvas`
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
`;

const drawChart = (ctx, data) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const margin = 40;
  const width = ctx.canvas.width - margin * 2;
  const height = ctx.canvas.height - margin * 2;
  const barWidth = width / data.length - 20;  // Space out the bars

  // Draw axis
  ctx.strokeStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin, height + margin);
  ctx.lineTo(width + margin, height + margin);
  ctx.stroke();

  // Draw bars for the data
  data.forEach((item, index) => {
    const barHeight = item.count * 10;  // Adjust the scaling factor for the count
    ctx.fillStyle = item.label === "Normal" ? '#2ecc71' : '#e74c3c';  // Green for "normal", red for "covid"
    ctx.fillRect(margin + index * (barWidth + 20), height + margin - barHeight, barWidth, barHeight);
  });
};

const Chart = ({ predictions }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (predictions.length === 0) return;  // Don't draw if there's no data

    const ctx = canvasRef.current.getContext('2d');
    drawChart(ctx, predictions);
  }, [predictions]);

  return <ChartCanvas ref={canvasRef} />;
};

export default Chart;
