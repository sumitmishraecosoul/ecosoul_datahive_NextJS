"use client";;
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";
import { FaDownload } from "react-icons/fa";
import { motion, useAnimate } from "motion/react";

// Local utility previously imported from '@/lib/utils'
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({
  className,
  children,
  showDownloadIcon = false,
  ...props
}) => {
  const [scope, animate] = useAnimate();

  const animateLoading = async () => {
    await animate(".loader", {
      width: "20px",
      scale: 1,
      display: "block",
    }, {
      duration: 0.2,
    });
  };

  const animateSuccess = async () => {
    await animate(".loader", {
      width: "0px",
      scale: 0,
      display: "none",
    }, {
      duration: 0.2,
    });
    await animate(".check", {
      width: "20px",
      scale: 1,
      display: "block",
    }, {
      duration: 0.2,
    });

    await animate(".check", {
      width: "0px",
      scale: 0,
      display: "none",
    }, {
      delay: 2,
      duration: 0.2,
    });
  };

  const handleClick = async (event) => {
    await animateLoading();
    await props.onClick?.(event);
    await animateSuccess();
  };

  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onAnimationStart,
    onAnimationEnd,
    ...buttonProps
  } = props;

  return (
    <motion.button
      layout
      layoutId="button"
      ref={scope}
      className={cn(
        "px-5 py-3 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 ease-in-out min-w-20 text-center whitespace-nowrap outline-none flex items-center justify-center gap-2 bg-teal-500 text-white shadow-lg shadow-teal-500/30 hover:bg-teal-600 hover:shadow-teal-600/40 hover:shadow-lg hover:-translate-y-0.5 active:transform active:translate-y-0 active:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none",
        className
      )}
      {...buttonProps}
      onClick={handleClick}>
      <motion.div layout className="flex items-center gap-2">
        {showDownloadIcon && (
          <FaDownload size={16} />
        )}
        <Loader />
        <CheckIcon />
        <motion.span layout>{children}</motion.span>
      </motion.div>
    </motion.button>
  );
};

const Loader = () => {
  return (
    <motion.svg
      animate={{
        rotate: [0, 360],
      }}
      initial={{
        scale: 0,
        width: 0,
        display: "none",
      }}
      style={{
        scale: 0.5,
        display: "none",
      }}
      transition={{
        duration: 0.3,
        repeat: Infinity,
        ease: "linear",
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="loader text-white">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </motion.svg>
  );
};

const CheckIcon = () => {
  return (
    <motion.svg
      initial={{
        scale: 0,
        width: 0,
        display: "none",
      }}
      style={{
        scale: 0.5,
        display: "none",
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="check text-white">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M9 12l2 2l4 -4" />
    </motion.svg>
  );
};
