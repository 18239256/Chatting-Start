'use client';

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";

import { useEffect, useRef, useState } from "react";

import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import { Knowledge } from "@prisma/client";

interface BodyProps {
    files: string[]
}
  
const Body: React.FC<BodyProps> = ({ files = [] }) => {
    console.log('files', files);
    return (
        <div className="flex-1 overflow-y-auto">
           {files}
        </div>
    )
}
 
export default Body;