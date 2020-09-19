import { useState, useEffect } from "react";

export const usePaste = () => {
  const [data, setData] = useState<string>();

  useEffect(() => {
    const onPaste = (e: Event) => {
      const { clipboardData } = e as ClipboardEvent;
      if (!clipboardData) {
        throw Error("clipboardData is not available");
      }
      setData(clipboardData.getData("Text"));
    };

    window.addEventListener("paste", onPaste);
    return () => {
      window.removeEventListener("paste", onPaste);
    };
  }, []);

  return data;
};
