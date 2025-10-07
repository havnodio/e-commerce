import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

interface SplitTextProps {
  text: string;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  splitType?: 'chars' | 'words' | 'lines';
  duration?: number;
  delay?: number;
  ease?: string;
}

const SplitTextComponent: React.FC<SplitTextProps> = ({
  text,
  tag: Tag = 'div',
  className,
  splitType = 'chars',
  duration = 0.8,
  delay = 0,
  ease = 'power4.out',
}) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const split = new SplitText(textRef.current, { type: splitType });

      gsap.from(split[splitType], {
        opacity: 0,
        y: 20,
        rotationX: -90,
        stagger: delay / 1000, // Removed 'from: random' to ensure sequential animation
        duration,
        ease,
        delay: 0.5, // Small initial delay for the whole animation to start
      });

      return () => {
        split.revert(); // Clean up SplitText instance on unmount
      };
    }
  }, [text, splitType, duration, delay, ease]);

  return (
    <Tag ref={textRef} className={className}>
      {text}
    </Tag>
  );
};

export default SplitTextComponent;