import {useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ModalForm from './Modal';
import { generatePoints } from '@/lib/polynomial'

const PolynomialGraph = () => {

  const [isVisible, setIsVisible] = useState(true);
  const [addedPoints, setAddedPoints] = useState<{x: number, y: number, visible?: boolean}[][]>([])
  const [newWeight, setNewWeight] = useState("")

  const CustomizedDot = ({ cx, cy, stroke, payload, value }: {cx: number, cy: number, stroke: number, payload: {visible: boolean}, value: number}) => {
  
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
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Enter new weight (-6 to 6)"
                className="w-40"
              />
            <Button 
              variant="outline"
              size="icon"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            {/* <Button 
              variant="outline"
              size="icon"
              onClick={() => handleInput()}
            >
              <p>Add</p>
            </Button> */}
            <ModalForm newWeight={newWeight === "" ? NaN : Number(newWeight)} addPoints={pts => setAddedPoints([pts, ...addedPoints])} resetText={() => setNewWeight("")}></ModalForm>
          </div>
        </CardHeader>

        <CardContent style={{maxHeight: "100vh", padding: 0, aspectRatio: 1}}>
          <ResponsiveContainer aspect={1}>
            <LineChart data={generatePoints()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                type="number"
                domain={[-6, 6]}
                tickCount={13}
                label={{ value: 'Weight 1', position: 'bottom' }}
              />
              <YAxis
                type="number"
                domain={[0, 12]}
                tickCount={13}
                label={{ value: 'Loss', angle: -90, position: 'left' }}
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