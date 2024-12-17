'use client';

import React, { useState } from 'react'
import WidenModal from '@/app/components/modals/WidenModal';

interface GraphModalProps {
    knowledgeBaseRealName: string;
    isOpen?: boolean;
    onClose: () => void;
}

const GraphModal: React.FC<GraphModalProps> = ({
    knowledgeBaseRealName,
    isOpen,
    onClose,
}) => {
    return (
        <WidenModal isOpen={isOpen} onClose={onClose}>
            <h2
              className="
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
                mb-4
              "
            >知识库 {knowledgeBaseRealName.split('_')[0]} 的图谱</h2>
            <iframe src={process.env.NEXT_PUBLIC_LLM_API_URI+`/graph/${knowledgeBaseRealName}/`} width="100%" height="500px" allowFullScreen loading='lazy'></iframe>
        </WidenModal>
    )
}

export default GraphModal;