import copy from "copy-to-clipboard";
import { Fragment, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Tooltip, useTooltip } from "~/components/tooltip";

export const Share = () => {
  const [location] = useLocation();
  const tooltip = useTooltip();
  const timeoutRef = useRef(0);

  const onClick = () => {
    copy(window.location.href);
    tooltip.setOpen(true);
    timeoutRef.current = window.setTimeout(() => {
      tooltip.setOpen(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Fragment>
      <button
        ref={tooltip.floating.refs.setReference}
        onClick={onClick}
        disabled={location === "/"}
      >
        Share
      </button>
      <Tooltip tooltip={tooltip}>Copied to clipboard.</Tooltip>
    </Fragment>
  );
};
