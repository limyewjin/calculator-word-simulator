import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const SevenSegmentDigit = ({ digit, hasDecimal, upsideDown = false }) => {
  const segments = {
    '0': [1,1,1,1,1,1,0],
    '1': [0,1,1,0,0,0,0],
    '2': [1,1,0,1,1,0,1],
    '3': [1,1,1,1,0,0,1],
    '4': [0,1,1,0,0,1,1],
    '5': [1,0,1,1,0,1,1],
    '6': [1,0,1,1,1,1,1],
    '7': [1,1,1,0,0,0,0],
    '8': [1,1,1,1,1,1,1],
    '9': [1,1,1,0,0,1,1],
    ' ': [0,0,0,0,0,0,0]  // Blank digit
  };

  const segmentPaths = [
    'M4,4 H36',           // top
    'M38,6 V24',          // top-right
    'M38,26 V44',         // bottom-right
    'M4,46 H36',          // bottom
    'M2,26 V44',          // bottom-left
    'M2,6 V24',           // top-left
    'M4,25 H36'           // middle
  ];

  const activeSeg = segments[digit] || segments[' '];

  return (
    <svg width="48" height="64" viewBox="0 0 50 50" style={{ transform: upsideDown ? 'rotate(180deg)' : 'none' }}>
      <rect x="0" y="0" width="50" height="50" fill="black" />
      {segmentPaths.map((d, i) => (
        <path key={i} d={d} stroke={activeSeg[i] ? 'white' : '#222'} strokeWidth="4" strokeLinecap="round" fill="none" />
      ))}
      {hasDecimal && <circle cx="42" cy="48" r="4" fill="white" />}  {/* Adjusted position, size, and centering */}
    </svg>
  );
};

const CalculatorDisplay = ({ value, upsideDown = false }) => {
  let processedValue = value;
  if (upsideDown) {
    processedValue = value.split('').reverse().join('').replace(/\.(.*)/, '$1.');  // Corrected handling of decimal point position in reverse
  }

  const [intPart, fracPart] = processedValue.split('.');
  const paddedIntPart = intPart.padStart(11, ' ');
  const displayDigits = (fracPart ? paddedIntPart.slice(-11) : paddedIntPart) + (fracPart || '');

  return (
    <div className="flex justify-end items-center bg-black p-4 rounded overflow-x-auto">
      {displayDigits.split('').map((digit, index) => (
        <SevenSegmentDigit 
          key={index} 
          digit={digit} 
          hasDecimal={index === paddedIntPart.length - 1 && fracPart}
          upsideDown={upsideDown} 
        />
      ))}
    </div>
  );
};

const CalculatorWordSimulator = () => {
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    if (value.split('.').length > 2) return; // Prevent multiple decimal points
    setInput(value.slice(0, 12)); // Allow up to 11 digits plus potentially 1 decimal point
  };

  const clearInput = () => {
    setInput('');
  };

  const examples = [
    { word: 'HELLO', number: '07734' },
    { word: 'SHELL', number: '77345' },
    { word: 'BOOBIES', number: '5318008' },
    { word: 'HILLBILLIES', number: '53177187714' },
    { word: 'BOZO', number: '0.208' },
  ];

  const setExample = (number) => {
    setInput(number);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">Calculator Word Simulator</h2>
      <div className="space-y-2">
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter numbers (max 11 digits)"
          className="w-full text-right pr-2 text-2xl"
        />
        <Button onClick={clearInput} className="w-full">Clear</Button>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold">Normal view:</p>
        <CalculatorDisplay value={input} />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold">Upside-down view:</p>
        <CalculatorDisplay value={input} upsideDown={true} />
      </div>
      <div className="mt-6 space-y-2">
        <p className="font-semibold">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <Button 
              key={index} 
              onClick={() => setExample(example.number)}
              className="text-sm"
            >
              {example.word} ({example.number})
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-2 text-sm">
        <p className="font-semibold">Additional Resources:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <a href="https://paperlined.org/apps/wikipedia/offsite_content/Calculator_spelling.txt" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-blue-600 hover:underline">
              Complete list of calculator-spellings words
            </a>
          </li>
          <li>
            <a href="https://news.ycombinator.com/item?id=40763931" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-blue-600 hover:underline">
              Hacker News discussion: "Words you can spell with a calculator"
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CalculatorWordSimulator;

