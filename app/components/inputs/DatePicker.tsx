'use client';

import { forwardRef } from "@nextui-org/react";
import clsx from "clsx";
import { useEffect } from "react";
import ReactDatePicker, { ReactDatePickerProps, registerLocale } from "react-datepicker";
import zhCN from "date-fns/locale/zh-CN"
import "react-datepicker/dist/react-datepicker.css"

interface DatePickerProps<
CustomModifierNames extends string = never,
WithRange extends boolean | undefined = undefined,
> extends ReactDatePickerProps<CustomModifierNames, WithRange> {
  id?: string,
  required?: boolean,
  disabled?: boolean,
  secondary?: boolean,
  success?: boolean,
  warning?:boolean,
  danger?:boolean,
}

const DatePicker: React.FC<DatePickerProps> = ({
  id,
  required,
  disabled,
  secondary,
  success,
  warning,
  danger,
  ...args
}) => {

  useEffect(() => {
    registerLocale("zh-CN", zhCN);
  }, []);

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className={clsx(`
    form-input
    block 
    w-full 
    rounded-md 
    border-0 
    py-1.5
    px-1.5 
    text-gray-600 
    shadow-sm 
    ring-1 
    ring-inset 
    placeholder:text-gray-400 
    focus:ring-2 
    focus:ring-inset 
    sm:text-sm 
    sm:leading-6`,
    !secondary && !warning && !success && !danger && 'ring-gray-300 focus:ring-sky-600 ',
    warning && 'ring-pink-400 focus:ring-pink-600 ',
    secondary && 'ring-orange-400 focus:ring-orange-600 ',
    success && 'ring-green-400 focus:ring-green-600 ',
    danger && 'ring-rose-400 focus:ring-rose-600 ',
    disabled && 'opacity-50 cursor-default'
  )}
   onClick={onClick} ref={ref}>
      {value === "" ? args.placeholderText : value}
    </button>
  ));
  
  return (
    <div>
    <ReactDatePicker
      customInput={<CustomInput />}
      locale='zh-CN'
      dateFormat="yyyy年MM月dd日"
      {...args}
    /></div>
   );
}
 
export default DatePicker;