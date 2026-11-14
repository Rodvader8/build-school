import { useEffect, useState } from 'react';

const time = () => new Date().toLocaleTimeString('en-AU', { hour12: false });

export default function Clock() {
  const [now, setNow] = useState(time);

  useEffect(() => {
    // This starts a timer, but nothing ever stops it. Step 3: make the effect clean up after itself.
    setInterval(() => setNow(time()), 1000);
  }, []);

  return (
    <p className="muted">
      Updated <time>{now}</time>
    </p>
  );
}
