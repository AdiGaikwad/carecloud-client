import React, { useState, useEffect } from 'react';

interface TimerProps {
  targetDateTime: string; // Target date-time in "YYYY-MM-DD HH:mm:ss.SSS" format
}

const Timer: React.FC<TimerProps> = ({ targetDateTime }) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    const targetDate = new Date(targetDateTime).getTime(); // Convert target date-time to milliseconds
    const timer = setInterval(() => {
      const now = new Date().getTime(); // Get current time in milliseconds
      const timeLeft = Math.max(targetDate - now, 0); // Calculate remaining time
      setTimeRemaining(timeLeft);
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [targetDateTime]);

  // Format time to HH:MM:SS
  const formatTime = (ms: number | null) => {
    if (ms === null) return "Loading...";
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Determine text color based on remaining time
  const getTextColor = () => {
    if (timeRemaining === null) return 'black'; // Default color while loading
    const minutesRemaining = timeRemaining / (1000 * 60);
    if (minutesRemaining <= 5) {
      return 'red'; // Below 5 minutes
    } else if (minutesRemaining <= 10) {
      return 'yellow'; // Between 5 and 10 minutes
    }
    return 'white'; // Default color
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1 className='text-xl' style={{ color: getTextColor() }}>
        {timeRemaining !== null && timeRemaining > 0
          ? formatTime(timeRemaining)
          : "Access Expired"}
      </h1>
    </div>
  );
};

export default Timer;
