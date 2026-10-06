import { useEffect, useState } from "react";

export function readStored(key, fallback, validate = () => true) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// Keys stay constant for a mounted hook. Separate calls retain separate state.
export function useStoredState(key, initial, validate) {
  const [value, setValue] = useState(() => readStored(key, initial, validate));
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [key, value]);
  return [value, setValue, storageError];
}
