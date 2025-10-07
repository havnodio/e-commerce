import React from 'react';
import SplitText from './SplitText';

const GustoIntro: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <SplitText
        text="WELCOME"
        tag="h2"
        className="text-4xl font-bold mb-4"
        splitType="chars"
        duration={0.7}
        delay={50}
        ease="power4.out"
      />
      <div className="mt-4"> {/* Adjusted margin for "TO" */}
        <SplitText
          text="TO"
          tag="h2"
          className="text-4xl font-bold"
          splitType="chars"
          duration={0.7}
          delay={50}
          ease="power4.out"
        />
      </div>
      <SplitText
        text="GUSTO CLUB"
        tag="h1"
        className="text-6xl font-bold"
        splitType="chars"
        duration={0.8}
        delay={60}
        ease="power4.out"
      />

      

      <div className="mt-6">
        <SplitText
          text="vous avez aimer 😊"
          tag="h2"
          className="text-3xl font-medium"
          splitType="chars"
          duration={0.7}
          delay={50}
          ease="power3.out"
        />
      </div>
    </div>
  );
};

export default GustoIntro;