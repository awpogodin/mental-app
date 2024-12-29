import { useEffect, useState } from "react";

export const useCountdownTimer = (endTime: number) => {
  const [secondsRemaining, setSecondsRemaining] = useState(
    Math.max(0, Math.round((endTime - Date.now()) / 1000))
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeDifference = endTime - now;
      setSecondsRemaining(Math.max(0, Math.round(timeDifference / 1000)));

      if (timeDifference <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTime]);

  return secondsRemaining.toString();
};
