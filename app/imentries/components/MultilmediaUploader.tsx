"use client";

import { Button } from "@nextui-org/react";
import axios from "axios";
import React, { FormEvent, useRef } from "react";
import { FiUpload } from "react-icons/fi";

interface MultimediaUploaderProps {
  initFiles?: FileList,
  onChange?: (file: FileList) => void | null;
}

const MultimediaUploader: React.FC<MultimediaUploaderProps> = ({
  initFiles,
  onChange,
}) => {
  // 1. add reference to input elements
  const ref = useRef<HTMLInputElement>(null);
  const refPreview = useRef<HTMLDivElement>(null);
  const [mediaFiles, setMediaFiles] = React.useState<FileList>();

  React.useEffect(()=>{
    setMediaFiles(initFiles);
  });

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

  const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-m4v",
    "video/x-ms-wmv",
    "video/x-msvideo",
    "video/webm",
    "video/x-flv",
  ];

  const validFile = (file: File) => {
    if (!fileTypes.includes(file.type))
      return false;
    if (file.type.startsWith("video/") && file.size > 20 * 1048576) //视频文件小于等于20M
      return false;
    return true;
  };


  const returnFileSize = (number: number) => {
    if (number < 1024) {
      return `${number} bytes`;
    } else if (number >= 1024 && number < 1048576) {
      return `${(number / 1024).toFixed(1)} KB`;
    } else if (number >= 1048576) {
      return `${(number / 1048576).toFixed(1)} MB`;
    }
  };

  React.useEffect(() => {
    while (refPreview.current?.firstChild) {
      refPreview.current?.removeChild(refPreview.current?.firstChild);
    }

    if (mediaFiles?.length === 0) {
      const para = document.createElement("p");
      para.textContent = "未选择任何内容";
      para.className = "text-gray-300";
      refPreview.current?.appendChild(para);
    } else {
      const list = document.createElement("ol");
      refPreview.current?.appendChild(list);

      for (const file of Array.from(mediaFiles ?? [])) {
        const listItem = document.createElement("li");
        const para = document.createElement("p");
        if (validFile(file)) {
          para.textContent = `${file.name} (${returnFileSize(
            file.size,
          )})`;
          para.className = "text-gray-300";
          let mediaEle: any;
          if (file.type.startsWith("video")) {
            mediaEle = document.createElement("VIDEO");
            mediaEle.controls = true;
          }
          else
            mediaEle = document.createElement("img");
          mediaEle.src = URL.createObjectURL(file);

          listItem.appendChild(mediaEle);
          listItem.appendChild(para);
        } else {
          para.textContent = `文件 ${file.name}: 不是合法的文件类型，请重新选择.`;
          listItem.appendChild(para);
        }

        list.appendChild(listItem);
      }
    }
  }, [mediaFiles]);



  const fileSelected = (data: any) => {
    const input = ref.current!;
    setMediaFiles(input.files!);
    if (onChange) onChange(data.target.files);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Button
          variant="bordered"
          endContent={<FiUpload />}
          className="mb-2"
          onClick={() => document.getElementById("media_selector")?.click()}>
          图片/视频(小于20M)
        </Button>
        <input id="media_selector" type="file" name="files" ref={ref} accept="image/*,video/*" onChange={fileSelected} className="sr-only" />
        <div id="preview" ref={refPreview} className="flex justify-center">
          <p className="text-gray-300 h-24 content-center">未选择任何内容</p>
        </div>
      </form>
    </>
  );
};

export default MultimediaUploader;