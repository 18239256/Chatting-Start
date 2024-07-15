'use client';

import clsx from "clsx";
import React from "react";
import { 
  FieldErrors, 
  FieldValues, 
  UseFormRegister 
} from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  label: string,
  id: string,
  type?: string,
  required?: boolean;
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors,
  disabled?: boolean,
  placeholder?:string
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  id,
  register,
  required,
  errors,
  type = 'text',
  disabled,
  placeholder,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  return ( 
    <div>
      <label 
        htmlFor={id} 
        className="
          block 
          text-sm 
          font-medium 
          leading-6 
          text-gray-900
        "
      >
        {label}
      </label>
      <div className="flex mt-2">
        <input
          id={id}
          type={isVisible ? type : "password"}
          autoComplete={id}
          disabled={disabled}
          placeholder={placeholder}
          {...register(id, { required })}
          className={clsx(`
            form-input
            block 
            w-full 
            rounded-md 
            border-0 
            py-1.5
            px-1.5 
            text-gray-900 
            shadow-sm 
            ring-1 
            ring-inset 
            ring-gray-300 
            placeholder:text-gray-400 
            focus:ring-2 
            focus:ring-inset 
            focus:ring-sky-600 
            sm:text-sm 
            sm:leading-6`,
            errors[id] && 'focus:ring-rose-500',
            disabled && 'opacity-50 cursor-default'
          )}
        />
        <button className="focus:outline-none ml-2" type="button" onClick={toggleVisibility}>
          {isVisible ? (
            <FaRegEyeSlash  className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <FaRegEye  className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      </div>
    </div>
   );
}
 
export default PasswordInput;