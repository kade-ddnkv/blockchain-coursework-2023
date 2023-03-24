import { useEffect, useState } from 'react';

const useCountdown = (endTime) => {
  const countDownDate = new Date(endTime).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  const secondsLeft = Math.floor(countDown / 1000);

  return [secondsLeft];
};

export { useCountdown }