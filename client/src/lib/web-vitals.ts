import { onCLS, onINP, onLCP } from "web-vitals";

export const report = () => {
  onLCP(console.log);
  onINP(console.log);
  onCLS(console.log);
};
