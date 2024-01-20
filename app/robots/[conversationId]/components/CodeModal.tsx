'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/modals/Modal';
import Button from '@/app/components/Button';

interface CodeModalProps {
  isOpen?: boolean;
  onClose: () => void;
  robotId: string;
}

const CodeModal: React.FC<CodeModalProps> = ({
  isOpen,
  onClose,
  robotId,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const codeContent = `
  <head>
  ...
  //从这里开始复制
  <script type="module" >
      import { default as rob  } 
      from "${window.location.protocol}//${window.location.host}/embed/chatbot.js"; 
      rob({
        robotId:"${robotId}",
        apiHost:"${window.location.protocol}//${window.location.host}",  
        chatflowConfig:{},
        theme:{},
    });
  </script>
  //复制结束位置
  ...
  </head>
  `;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2
        className="
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
              "
      >
        嵌入开发说明
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        请按把下面的代码复制到前端页面文件中。
      </p>
      <div className='max-w-full'>
        <pre><code>{codeContent}</code></pre>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button
          disabled={isLoading}
          onClick={onClose}
          type="button"
        >
          关闭
        </Button>
      </div>
    </Modal>
  )

}

export default CodeModal;