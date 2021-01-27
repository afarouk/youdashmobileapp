import { useEffect, useState } from 'react';

export default (polls) => {
  const [poll, setPoll] = useState(null);
  useEffect(() => {
    if (polls && polls.length) {
      setPoll(polls[0]);
    }
  }, [polls]);
  return [poll];
};
