import React, { useEffect, useRef, useState } from 'react';
import hljs from '@/app/libs/highlight';
import 'highlight.js/styles/github-dark.css';
import toast from 'react-hot-toast';
import { CopyTextToClipboard } from '../libs/clipboard';

interface CodeBlockProps {
    language: string,
    code: any,
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
    const preRef = useRef(null);
    const [copied, setCopied] = useState(false);

    // onClick handler function for the copy button
    const handleCopyClick = () => {
        // Asynchronously call copyTextToClipboard
        CopyTextToClipboard(code)
            .then(() => {
                // If successful, update the isCopied state value
                setCopied(true);
                toast.success("复制成功");
                setTimeout(() => {
                    setCopied(false);
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (preRef.current) {
            hljs.highlightBlock(preRef.current);
            return ;
          }
    }, [code]);

    return (
        <div className="code-block" style={{ position: 'relative' }}>
            <pre>
                <code id={language} ref={preRef} className={language}>
                    {code}
                </code>
            </pre>
            <button id={`${language}copy_btn`} style={{ position: 'absolute', top: 4, right: 4, lineHeight: '14px'}} 
                className="text-gray-400 cursor-pointer" 
                onClick={handleCopyClick}>
                {copied ? '已复制' : '复制'}
            </button>
        </div>
    );
}

export default CodeBlock;