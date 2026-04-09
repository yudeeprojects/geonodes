import { useState, useCallback } from "react";

export function useNumericBuffer() {
  const [buffer, setBuffer] = useState("");

  const handleKey = useCallback((key: string) => {
    const k = key.toLowerCase();
    
    // Accept numbers, decimals, and minus signs
    if ((k >= "0" && k <= "9") || k === "." || k === "-") {
      setBuffer((prev) => prev + k);
      return true; 
    }
    
    if (k === "backspace") {
      setBuffer((prev) => prev.slice(0, -1));
      return true;
    }
    
    return false;
  }, []);

  const clear = useCallback(() => setBuffer(""), []);

  const getValue = useCallback(() => {
    if (buffer === "") return null;
    const val = parseFloat(buffer);
    return isNaN(val) ? null : val;
  }, [buffer]);

  return { buffer, handleKey, clear, getValue };
}
