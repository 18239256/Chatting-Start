"use client";

import axios from "axios";
import React, { FormEvent, useRef } from "react";

interface MultimediaUploaderProps {
  onChange?: (file:File[]) => void | null;
}

const MultimediaUploader : React.FC<MultimediaUploaderProps> = ({
  onChange,
}) => {
  // 1. add reference to input elements
  const ref = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 2. get reference to the input element
    const input = ref.current!;

    // 3. build form data
    const formData = new FormData();
    for (const file of Array.from(input.files ?? [])) {
      formData.append(file.name, file);
    }

    // 4. use axios to send the FormData
    await axios.post("/api/upload", formData);
  };

  const fileSelected = (data: any) => {
    if(onChange) onChange(data.target.files);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" name="files" ref={ref} accept="image/*,video/*" onChange={fileSelected}/>
        {/* <button
          type="submit"
          className="px-2 py-1 rounded-md bg-violet-50 text-violet-500"
        >
          Upload
        </button> */}
      </form>
    </>
  );
};

export default MultimediaUploader;
