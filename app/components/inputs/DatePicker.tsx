'use client';

import { forwardRef } from "@nextui-org/react";
import clsx from "clsx";
import { useState } from "react";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";

import { 
  FieldErrors, 
  FieldValues, 
  UseFormRegister 
} from "react-hook-form";

interface DatePickerProps<
CustomModifierNames extends string = never,
WithRange extends boolean | undefined = undefined,
> extends ReactDatePickerProps<CustomModifierNames, WithRange> {
  id?: string,
  required?: boolean,
  disabled?: boolean,
}

const Datepicker: React.FC<DatePickerProps> = ({
  id,
  required,
  disabled,
  ...args
}) => {
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <input
          id={id}
          value={value}
          ref={ref}
          disabled={disabled}
          placeholder={value}
          onClick={onClick}
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
            disabled && 'opacity-50 cursor-default'
          )}
        />
  ));
  
  return (
    <div>
    <ReactDatePicker
      customInput={<ExampleCustomInput />}
      locale="zh-CN"
      {...args}
    /></div>
   );
}
 
export default Datepicker;