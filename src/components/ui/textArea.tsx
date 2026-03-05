"use client";

import clsx from "clsx";
import React, { ChangeEvent, useEffect, useState } from "react";

type TextAreaProps = {
  id?: string;
  placeholder?: string;
  value?: string;
  rows?: number;
  onChange?: (val: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholderClass?: string;
  className?: string;
};

export const TextArea = ({
  id,
  placeholder,
  value,
  rows = 6,
  onChange,
  required,
  disabled,
  placeholderClass,
  className,
}: TextAreaProps) => {
  const [input, setInput] = useState<string>(value || "");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (value !== undefined && value !== input)
      setInput(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    onChange?.(val);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const uid = id || Math.random().toString(36).substring(2, 15);

  return (
    <div className={clsx('w-full py-1 h-fit flex relative border border-gray-400 focus-within:border-[var(--primary)] focus-within:ring-[var(--accent)] focus-within:ring-[1px] rounded-2xl transition-all duration-150', className)}>
      <label
        htmlFor={uid}
        className={clsx('absolute ml-3 mt-2 transition-all duration-200 px-1 text-gray-500 cursor-text origin-left', (isFocused || input != "") && '!text-[var(--primary)] -translate-y-3 scale-80', placeholderClass)}>
        {placeholder}
      </label>
      <textarea
        id={uid}
        value={input}
        onChange={(e) => handleChange(e)}
        onFocus={handleFocus} onBlur={handleBlur}
        className={clsx('w-full resize-y min-h-20 py-2 px-4 outline-none border-none bg-transparent', (isFocused || input != "") && 'translate-y-2')}
        disabled={disabled}
        rows={rows}
        required={required}
      />

    </div>
  );
};
