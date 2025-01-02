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

const ModalForm = ({newWeight, addPoints, resetText}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted value:', inputValue, "og value:", newWeight);

    const y_val = calcY(newWeight)
    const slope = calcSlope(newWeight)

    const L = 0.5
    const distance = L / (2 * Math.sqrt(1 + slope*slope))

    const x1 = Math.max(-6, newWeight - distance);
    const x2 = Math.min(6, newWeight + distance);
    const y1 = y_val + slope * (x1 - newWeight);
    const y2 = y_val + slope * (x2 - newWeight);

    addPoints([{x: x1, y: y1}, {x: newWeight, y: y_val, visible: true}, {x: x2, y: y2}])

    resetText()
    setInputValue('');
    setIsOpen(false);
  };

  const [input1, input2, expected] = useMemo(
    () => {
      // random number -5 to 5
      const input1 = (Math.random()*10).toFixed(0) - 5
      const input2 = (Math.random()*10).toFixed(0) - 5

      const loss = calcY(newWeight)
      const expected = newWeight*input1 + WEIGHT_2*input2 + (Math.random() > 0.5 ? loss : -loss)
      return [input1, input2, expected]
    },
    [isOpen]
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Test Weight</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Calculate the Loss</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4">
            {(!isNaN(newWeight) && newWeight > -6 && newWeight < 6) ? 
                <>
                <p className="mb-4">Your neural network has weights {newWeight} and {WEIGHT_2}, your inputs are {input1} and {input2} with an expect value of {expected.toFixed(1)}. Enter the loss for these weights:</p>
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

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            {(!isNaN(newWeight) && newWeight > -6 && newWeight < 6) && <Button type="submit">Submit</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalForm;