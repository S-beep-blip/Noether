"use client";

import React from "react";
import clsx from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          "w-full rounded-md py-2 px-3 border focus:outline-none",
          "border-gray-300",
          hasError && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";