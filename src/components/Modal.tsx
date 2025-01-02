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

const ModalForm = ({newWeight, addPoints, resetText}: {newWeight: number, addPoints: (pts: {x: number, y:number, visible?: boolean}[]) => void, resetText:  () => void}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isCorrect, setIsCorrect] = useState<IsCorrectState>(IsCorrectState.NO_INPUT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                <p className="mb-4">You entered a weight of: {newWeight}. <br />
                                    Your weights are now {newWeight} and {WEIGHT_2}, <br /> 
                                    Your inputs are: {input1} and {input2}, <br />
                                    With an expected value of {expected.toFixed(1)}. <br />
                                    Enter the loss for these weights:</p>
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