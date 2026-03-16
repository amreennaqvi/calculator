/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Divide, Minus, Plus, X, Equal, Percent, RotateCcw } from 'lucide-react';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  const handleNumber = (num: string) => {
    if (isFinished) {
      setDisplay(num);
      setIsFinished(false);
      return;
    }
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperator = (op: string) => {
    setIsFinished(false);
    if (equation && !isFinished) {
      calculate();
      setEquation(prev => prev + ' ' + display + ' ' + op);
    } else {
      setEquation(display + ' ' + op);
    }
    setDisplay('0');
  };

  const calculate = () => {
    const parts = equation.split(' ');
    if (parts.length < 2) return;

    const prev = parseFloat(parts[0]);
    const current = parseFloat(display);
    const op = parts[1];

    let result = 0;
    switch (op) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '×': result = prev * current; break;
      case '÷': result = current !== 0 ? prev / current : 0; break;
    }

    const resultStr = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, "");
    setDisplay(resultStr);
    setEquation('');
    setIsFinished(true);
  };

  const handleEqual = () => {
    if (!equation) return;
    calculate();
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setIsFinished(false);
  };

  const toggleSign = () => {
    setDisplay(prev => (parseFloat(prev) * -1).toString());
  };

  const handlePercent = () => {
    setDisplay(prev => (parseFloat(prev) / 100).toString());
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(prev => prev + '.');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
    if (e.key === '+') handleOperator('+');
    if (e.key === '-') handleOperator('-');
    if (e.key === '*') handleOperator('×');
    if (e.key === '/') handleOperator('÷');
    if (e.key === 'Enter' || e.key === '=') handleEqual();
    if (e.key === 'Escape') clear();
    if (e.key === '.') handleDecimal();
    if (e.key === 'Backspace') setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, equation, isFinished]);

  const Button = ({ children, onClick, className = "", variant = "default" }: { children: React.ReactNode, onClick: () => void, className?: string, variant?: 'default' | 'operator' | 'action' }) => {
    const variants = {
      default: "bg-white hover:bg-zinc-50 text-zinc-800 shadow-sm",
      operator: "bg-zinc-900 hover:bg-zinc-800 text-white shadow-md",
      action: "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 shadow-sm"
    };

    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`h-16 w-full rounded-2xl flex items-center justify-center text-xl font-medium transition-colors ${variants[variant]} ${className}`}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[360px] bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 p-6 border border-zinc-100"
      >
        {/* Display Section */}
        <div className="mb-8 px-2">
          <div className="h-6 text-right text-zinc-400 text-sm font-medium overflow-hidden whitespace-nowrap mb-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={equation}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {equation}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="text-right overflow-hidden">
            <motion.div
              key={display}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-light tracking-tight text-zinc-900 truncate"
            >
              {display}
            </motion.div>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          <Button variant="action" onClick={clear}><RotateCcw size={20} /></Button>
          <Button variant="action" onClick={toggleSign}><span className="text-lg">±</span></Button>
          <Button variant="action" onClick={handlePercent}><Percent size={20} /></Button>
          <Button variant="operator" onClick={() => handleOperator('÷')}><Divide size={24} /></Button>

          <Button onClick={() => handleNumber('7')}>7</Button>
          <Button onClick={() => handleNumber('8')}>8</Button>
          <Button onClick={() => handleNumber('9')}>9</Button>
          <Button variant="operator" onClick={() => handleOperator('×')}><X size={20} /></Button>

          <Button onClick={() => handleNumber('4')}>4</Button>
          <Button onClick={() => handleNumber('5')}>5</Button>
          <Button onClick={() => handleNumber('6')}>6</Button>
          <Button variant="operator" onClick={() => handleOperator('-')}><Minus size={24} /></Button>

          <Button onClick={() => handleNumber('1')}>1</Button>
          <Button onClick={() => handleNumber('2')}>2</Button>
          <Button onClick={() => handleNumber('3')}>3</Button>
          <Button variant="operator" onClick={() => handleOperator('+')}><Plus size={24} /></Button>

          <Button onClick={() => handleNumber('0')} className="col-span-2">0</Button>
          <Button onClick={handleDecimal}>.</Button>
          <Button variant="operator" onClick={handleEqual} className="bg-emerald-600 hover:bg-emerald-700"><Equal size={24} /></Button>
        </div>
      </motion.div>
    </div>
  );
}
