import { useState, useEffect } from "react";

const Counter: React.FC<{ maxLength: number; currentLength: number }> = ({
  maxLength,
  currentLength,
}) => {
  const [count, setCount] = useState<number>(maxLength - currentLength);
  useEffect(() => {
    setCount(maxLength - currentLength);
  }, [maxLength, currentLength]);
  return <>残り: {count} 字</>;
};

export default Counter;
