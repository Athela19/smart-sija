import { useState, useEffect } from 'react';

const TypingEffect = ({ text, speed = 200 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Reset saat text berubah
    setDisplayedText('');
  }, [text]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (displayedText.length < text.length) {
      const typingTimeout = setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(typingTimeout);
    }
  }, [displayedText, text, speed]);

  return (
    <span>
      {displayedText}
      <span
        className={`inline-block ${showCursor ? 'opacity-100' : 'opacity-0'}`}
        style={{ borderRight: '2px solid currentColor', marginLeft: '2px' }}
      >
        &nbsp;
      </span>
    </span>
  );
};

export default TypingEffect;
