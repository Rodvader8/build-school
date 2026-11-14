import { useEffect, useState } from 'react';

const time = () => new Date().toLocaleTimeString('en-AU', { hour12: false });

export default function Clock() {
  const [now, setNow] = useState(time);

  useEffect(() => {
    const id = setInterval(() => setNow(time()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="muted">
      Updated <time>{now}</time>
    </p>
  );
}
