import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import '../App.css';

const SevenSegmentDigit = ({ digit, hasDecimal, upsideDown = false }) => {
  const segments = {
    '0': [1, 1, 1, 1, 1, 1, 0],
    '1': [0, 1, 1, 0, 0, 0, 0],
    '2': [1, 1, 0, 1, 1, 0, 1],
    '3': [1, 1, 1, 1, 0, 0, 1],
    '4': [0, 1, 1, 0, 0, 1, 1],
    '5': [1, 0, 1, 1, 0, 1, 1],
    '6': [1, 0, 1, 1, 1, 1, 1],
    '7': [1, 1, 1, 0, 0, 0, 0],
    '8': [1, 1, 1, 1, 1, 1, 1],
    '9': [1, 1, 1, 0, 0, 1, 1],
    ' ': [0, 0, 0, 0, 0, 0, 0], // Blank digit
  };

  const segmentPaths = [
    'M4,4 H36', // top
    'M38,6 V24', // top-right
    'M38,26 V44', // bottom-right
    'M4,46 H36', // bottom
    'M2,26 V44', // bottom-left
    'M2,6 V24', // top-left
    'M4,25 H36', // middle
  ];

  const activeSeg = segments[digit] || segments[' '];

  return (
    <svg width="48" height="64" viewBox="0 0 52 64" style={{ transform: upsideDown ? 'rotate(180deg)' : 'none' }}>
      <rect x="0" y="0" width="50" height="64" fill="black" />
      {segmentPaths.map((d, i) => (
        <path key={i} d={d} stroke={activeSeg[i] ? 'white' : '#222'} strokeWidth="4" strokeLinecap="round" fill="none" />
      ))}
      {hasDecimal && <circle cx="46" cy="48" r="4" fill="white" />}
    </svg>
  );
};

const CalculatorDisplay = ({ value, upsideDown = false }) => {
  let processedValue = value;
  if (upsideDown) {
    // Reverse the string
    processedValue = value.split('').reverse().join('');
  }

  const [intPart, fracPart] = processedValue.split('.');
  const paddedIntPart = intPart.padStart(11, ' ');
  const displayDigits = (fracPart ? paddedIntPart.slice(-11) : paddedIntPart) + (fracPart || '');

  return (
    <div className="display-container">
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
    <div className="container">
      <h2>Calculator Word Simulator</h2>
      <div className="input-container">
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter numbers (max 11 digits)"
        />
        <Button onClick={clearInput}>Clear</Button>
      </div>
      <div className="display-wrapper">
        <p className="text-sm font-semibold">Normal view:</p>
        <CalculatorDisplay value={input} />
      </div>
      <div className="display-wrapper">
        <p className="text-sm font-semibold">Upside-down view:</p>
        <CalculatorDisplay value={input} upsideDown={true} />
      </div>
      <div className="examples-container">
        <p className="font-semibold">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <Button key={index} onClick={() => setExample(example.number)}>
              {example.word} ({example.number})
            </Button>
          ))}
        </div>
      </div>
      <div className="resources-container">
        <p className="font-semibold">Additional Resources:</p>
        <ul>
          <li>
            <a href="https://paperlined.org/apps/wikipedia/offsite_content/Calculator_spelling.txt" target="_blank" rel="noopener noreferrer">
              Complete list of calculator-spellings words
            </a>
          </li>
          <li>
            <a href="https://news.ycombinator.com/item?id=40763931" target="_blank" rel="noopener noreferrer">
              Hacker News discussion: "Words you can spell with a calculator"
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CalculatorWordSimulator;

