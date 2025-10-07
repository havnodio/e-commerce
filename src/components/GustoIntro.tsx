import React, { useState, useEffect } from 'react';
import SplitText from './SplitText';

const GustoIntro: React.FC = () => {
  const [showSecondText, setShowSecondText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecondText(true);
    }, 3000); // show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <SplitText
        text="GUSTO CLUB"
        tag="h1"
        className="text-6xl font-bold"
        splitType="chars"
        duration={0.8}
        delay={60}
        ease="power4.out"
      />

      {showSecondText && (
        <div className="mt-6">
          <SplitText
            text="vous avez aimer"
            tag="h2"
            className="text-3xl font-medium"
            splitType="chars"
            duration={0.7}
            delay={50}
            ease="power3.out"
          />
        </div>
      )}
    </div>
  );
};

export default GustoIntro;