import { useEffect } from "react";
import { useLiveRef } from "~/lib/liveRef";

export function copy(value: string) {
  if ("clipboard" in navigator) {
    navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("input");
  input.value = value;
  input.style.all = "unset";
  input.style.position = "fixed";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

export function usePaste(fn: (text: string) => void) {
  const ref = useLiveRef(fn);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      event.preventDefault();

      const text = event.clipboardData?.getData("text/plain");
      if (text) {
        ref.current(text);
      }
    };
    document.addEventListener("paste", onPaste);
    return () => {
      document.removeEventListener("paste", onPaste);
    };
  }, [ref]);
}
