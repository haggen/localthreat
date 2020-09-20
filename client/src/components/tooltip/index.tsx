import React, {
  Children,
  cloneElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import c from "classnames";
import { usePopper } from "react-popper";
import style from "./style.module.css";

const { setTimeout } = window;

type Props = {
  trigger: "hover" | "click";
  children: ReactElement;
  text: ReactNode;
  placement?: "top" | "bottom";
};

export const Tooltip = ({
  trigger,
  text,
  children,
  placement = "bottom",
}: Props) => {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef(0);
  const triggerRef = useRef(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const popper = usePopper(triggerRef.current, tooltipRef.current, {
    placement,
  });

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const child = Children.only(children);
  if (!child) {
    throw new Error("<Tooltip /> requires a single child");
  }

  const onClick = () => {
    if (trigger === "click") {
      setActive(true);
    }
  };

  const onMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActive(false);
    }, 1000);
  };

  const onMouseEnter = () => {
    if (trigger === "hover") {
      setActive(true);
    }
    clearTimeout(timeoutRef.current);
  };

  return (
    <>
      {createPortal(
        <div
          ref={tooltipRef}
          className={c(style.tooltip, { [style.active]: active })}
          style={popper.styles.popper}
          {...popper.attributes.popper}
        >
          {text}
        </div>,
        document.body
      )}
      <span
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
      >
        {cloneElement(child, { ref: triggerRef })}
      </span>
    </>
  );
};
