import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PolynomialGraph = () => {
  const [coefficients, setCoefficients] = useState([1, 0, 0]); // Default to y = x^2

  // Generate points for the polynomial
  const generatePoints = () => {
    const points = [];
    for (let x = -10; x <= 10; x += 0.5) {
      const y = coefficients.reduce((sum, coeff, power) => {
        return sum + coeff * Math.pow(x, coefficients.length - 1 - power);
      }, 0);
      points.push({ x, y });
    }
    console.log(points)
    return points;
  };

  return (
    <div className="w-full max-w-4xl">
        <div className="h-96">
          <div className='size-full'>
          <ResponsiveContainer width="100%" aspect={1}>
            <p>{generatePoints().map((v) => v.x +" "+v.y).join(" ")}</p>
            <LineChart data={generatePoints()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                type="number"
                domain={[-10, 10]}
                tickCount={11}
                label={{ value: 'x', position: 'bottom' }}
              />
              <YAxis
                type="number"
                domain={[-50, 50]}
                tickCount={11}
                label={{ value: 'y', angle: -90, position: 'left' }}
              />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                labelFormatter={(value) => `x: ${value}`}
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#2563eb"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2">Enter coefficients (highest degree first):</p>
          <div className="flex gap-2">
            {coefficients.map((coeff, index) => (
              <input
                key={index}
                type="number"
                value={coeff}
                onChange={(e) => {
                  const newCoeffs = [...coefficients];
                  newCoeffs[index] = parseFloat(e.target.value) || 0;
                  setCoefficients(newCoeffs);
                }}
                className="w-16 p-1 border rounded"
              />
            ))}
          </div>
        </div>
    </div>
  );
};

export default PolynomialGraph;