"use client";

import clsx from 'clsx';
import { Eye, EyeClosed } from 'lucide-react';
import React, { ChangeEvent, useEffect, useState } from 'react'

type InputProps = {
    id?: string,
    placeholder?: string,
    value?: string,
    type?: string,
    onChange?: (e: string) => void,
    required?: boolean,
    disabled?: boolean,
    placeholderClass?: string
    className?: string
}

export const Input = ({ placeholder, value, type = 'text', onChange, id, required, disabled, placeholderClass, className }: InputProps) => {

    // states for input 
    const [input, setInput] = useState<string>(value || "");
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [inputType, setInputType] = useState<string>(type)

    useEffect(() => {
        if (value !== undefined && value !== input)
            setInput(value);
    }, [value]);

    // Handle Input Change
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setInput(val);
        onChange?.(val)
    }

    const handleFocus = () => {
        setIsFocused(true)
    }

    const handleBlur = () => {
        setIsFocused(false)
    }

    // handle password type input
    useEffect(() => {
        if (type === "password")
            setInputType(showPassword ? "text" : "password")
    }, [showPassword])

    const uid = id || Math.random().toString(36).substring(2, 15);

    return (
        <div className={clsx('w-full py-1 h-fit flex items-center relative border border-gray-400 focus-within:border-[var(--primary)] focus-within:ring-[var(--accent)] focus-within:ring-[1px] rounded-2xl transition-all duration-150 overflow-hidden', className)}>
            <label
                htmlFor={uid}
                className={clsx('absolute ml-3 transition-all duration-200 px-1 text-gray-500 cursor-text z-1 origin-left', (isFocused || input != "") && '!text-[var(--primary)] -translate-y-3 scale-80', placeholderClass)}>
                {placeholder}
            </label>
            <input
                id={uid}
                value={input}
                type={inputType}
                onChange={(e) => handleChange(e)}
                onFocus={handleFocus} onBlur={handleBlur}
                className={clsx('w-full py-2 px-4 outline-none border-none bg-transparent', ((isFocused || input != "") && !(["date", "time"].includes(inputType))) && 'translate-y-1.5', placeholderClass)}
                disabled={disabled}
                required={required}
            />
            {type === 'password' &&
                <label htmlFor={uid} className='text-[var(--primary)] absolute right-3 cursor-pointer' onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Eye /> : <EyeClosed />}
                </label>
            }
        </div>
    )
}
