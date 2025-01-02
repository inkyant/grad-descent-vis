import React, { useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PolynomialGraph = () => {
  const coefficients = [0.00091096, 0.0000022854, -0.0402169, 0, 0.47182, 0.22782, 0.5];
  const derivCoefficients = [0.00091096*6, 0.0000022854*5, -0.0402169*4, 0, 0.47182*2, 0.22782];

  const [isVisible, setIsVisible] = useState(true);
  const [addedPoints, setAddedPoints] = useState([])
  const pointTextRef = useRef("")

  const calcY = (x, coefs) => {
    return coefs.reduce((sum, coeff, power) => {
      return sum + coeff * Math.pow(x, coefs.length - 1 - power);
    }, 0);
  }

  // Generate points for the polynomial
  const generatePoints = () => {
    const points = [];
    for (let x = -6; x <= 6; x += 0.1) {
      const y = calcY(x, coefficients)
      points.push({ x, y });
    }
    return points;
  };

  const handleInput = () => {
    const x = parseFloat(pointTextRef.current)
    if (!isNaN(x) && x >= -6 && x <= 6) {

      const y_val = calcY(x, coefficients)
      const slope = calcY(x, derivCoefficients)

      const L = 0.5
      const distance = L / (2 * Math.sqrt(1 + slope*slope))

      const x1 = Math.max(-6, x - distance);
      const x2 = Math.min(6, x + distance);
      const y1 = y_val + slope * (x1 - x);
      const y2 = y_val + slope * (x2 - x);

      setAddedPoints([[{x: x1, y: y1}, {x: x, y: y_val, visible: true}, {x: x2, y: y2}], ...addedPoints])
    }
  }

  const CustomizedDot = (props) => {
    const { cx, cy, stroke, payload, value } = props;
  
    if (payload.visible) {
      return (
        <svg x={cx - 4} y={cy - 4} width={8} height={8} fill="white">
          <g transform="translate(4 4)"><circle r="4" fill="red" /></g>
        </svg>
      );
    }
    return null;
  };

  return (
    <Card style={{display: "flex", height: "100vh"}}>
        <CardHeader style={{width: "20%"}}>
          <CardTitle>Gradient Descent Graph: Loss vs. Weight 1</CardTitle>
          <div>
            <Input
                type="text"
                onChange={(e) => {pointTextRef.current = e.target.value}}
                placeholder="Enter x (-6 to 6)"
                className="w-40"
              />
            <Button 
              variant="outline"
              size="icon"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline"
              size="icon"
              onClick={() => handleInput()}
            >
              <p>Add</p>
            </Button>
          </div>  
        </CardHeader>

        <CardContent style={{maxHeight: "100vh"}}>
          <ResponsiveContainer aspect={1}>
            <LineChart data={generatePoints()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                type="number"
                domain={[-6, 6]}
                tickCount={13}
                label={{ value: 'x', position: 'bottom' }}
              />
              <YAxis
                type="number"
                domain={[0, 12]}
                tickCount={13}
                label={{ value: 'y', angle: -90, position: 'left' }}
              />
              {/* <Tooltip
                formatter={(value) => value.toFixed(2)}
                labelFormatter={(value) => `x: ${value.toFixed(1)}`}
              /> */}
              <Line
                type="monotone"
                dataKey="y"
                stroke="#2563eb"
                dot={false}
                strokeWidth={2}
                hide={!isVisible}
                isAnimationActive={false}
              />

              {addedPoints.map((point, idx) => 
                  <Line
                    data={point}
                    type="monotone"
                    dataKey="y"
                    xAxisId={0}
                    yAxisId={0}
                    name="point"
                    stroke="#dc2626"
                    dot={<CustomizedDot />}
                    isAnimationActive={false}
                    key={idx}
                  />
              )}

            </LineChart>
          </ResponsiveContainer>
        </CardContent>
    </Card>
  );
};

export default PolynomialGraph;