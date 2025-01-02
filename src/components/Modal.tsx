import React, { useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { calcSlope, calcY } from '@/lib/polynomial';

const WEIGHT_2 = 4

enum IsCorrectState {
  NO_INPUT = 0,
  CORRECT,
  INCORRECT
}

const ModalForm = ({newWeight, addPoints, resetText, revealGraph}: {newWeight: number, addPoints: (pts: {x: number, y:number, visible?: boolean}[]) => void, resetText: () => void, revealGraph: (v: boolean) => void}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isCorrect, setIsCorrect] = useState<IsCorrectState>(IsCorrectState.NO_INPUT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue === "REVEALME") {
      revealGraph(true)
      setIsOpen(false)
      setIsCorrect(IsCorrectState.NO_INPUT)
      resetText()
      setInputValue('')
      return
    }
    if (isCorrect == IsCorrectState.CORRECT) return;

    const y_val = calcY(newWeight)

    const input = Number(inputValue)

    if (isNaN(input) || Math.abs(input - y_val) >= 0.1) {
      setInputValue('');
      setIsCorrect(IsCorrectState.INCORRECT)
      return
    }
    setIsCorrect(IsCorrectState.CORRECT)

    const slope = calcSlope(newWeight)

    const L = 0.5
    const distance = L / (2 * Math.sqrt(1 + slope*slope))

    const x1 = Math.max(-6, newWeight - distance)
    const x2 = Math.min(6, newWeight + distance)
    const y1 = Math.max(y_val + slope * (x1 - newWeight), 0)
    const y2 = Math.max(y_val + slope * (x2 - newWeight), 0)

    addPoints([{x: x1, y: y1}, {x: newWeight, y: y_val, visible: true}, {x: x2, y: y2}])

    setTimeout(() => {setIsOpen(false); setIsCorrect(IsCorrectState.NO_INPUT); resetText(); setInputValue('')}, 1000)
  };

  const [input1, input2, expected] = useMemo(
    () => {
      // random number -5 to 5
      const input1 = Math.round((Math.random()*10) - 5)
      const input2 = Math.round((Math.random()*10) - 5)

      const loss = calcY(newWeight)
      const expected = newWeight*input1 + WEIGHT_2*input2 + (Math.random() > 0.5 ? loss : -loss)
      return [input1, input2, expected]
    },
    [isOpen]
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Update Weight</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Calculate the Loss</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4">
            {(!isNaN(newWeight) && newWeight >= -6 && newWeight <= 6) ? 
                <>
                <p className='mb-2'>
                  You entered a weight of: {newWeight}. <br />
                  Your weights are now {newWeight} and {WEIGHT_2}, <br /> 
                  Your inputs are: {input1} and {input2}, <br />
                  With an expected value of {expected.toFixed(1)}.<br />
                  Use your whiteboard to draw the neural network and calculate the output and loss. 
                </p>
                {/* <svg width={300} height={150} fill="white" strokeWidth={3}>
                  <path d="M 20 40 L 40 40" stroke="black"/>
                  <path d="M 20 120 L 40 120" stroke="black"/>
                  <path d="M 80 40 L 140 80" stroke="black"/>
                  <path d="M 80 120 L 140 80" stroke="black"/>
                  <path d="M 180 80 L 200 80" stroke="black"/>

                  <g transform="translate(60 40)"><circle r="20" stroke="red" /></g>
                  <g transform="translate(60 120)"><circle r="20" stroke="red" /></g>
                  <g transform="translate(160 80)"><circle r="20" stroke="red" /></g>

                  <text x={input1 < 0 ? 4 : 9} y="45" fill="black">{input1}</text>
                  <text x={input2 < 0 ? 4 : 9} y="125" fill="black">{input2}</text>
                  <text x="203" y="84" fill="black">output</text>
                </svg> */}
                <p className='mb-2'>Enter the loss here:</p>
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter calculated loss here"
                  className="w-full"
                />  
                </>
              : 
                <p className="mb-4">Sorry, that weight is invalid.</p>
            }

            {isCorrect == IsCorrectState.NO_INPUT ? <></> : (
              isCorrect == IsCorrectState.CORRECT ? 
                <p style={{color: "green"}}>Correct! Adding to the graph a weight of {newWeight} results in loss {calcY(newWeight).toFixed(1)}...</p> 
                : <p style={{color: "red"}}>Sorry, that's not right.</p>
            )}
            
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            {(!isNaN(newWeight) && newWeight >= -6 && newWeight <= 6) && <Button type="submit">Submit</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalForm;