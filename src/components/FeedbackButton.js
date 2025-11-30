import React, { useState } from 'react';
import { IoClose, IoLinkOutline } from 'react-icons/io5';
import { FaQuestion, FaRegCopy,  FaCheck  } from "react-icons/fa6";

const FeedbackButton = ({ email = 'alyona.art.dev@gmail.com', groupLink = 'https://t.me/Andreiavtoinstryktor' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 p-2.5 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl"
        title="Обратная связь"
        aria-label="Send feedback"
      >
        <FaQuestion className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full p-6">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <IoClose className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-4 pr-8">
              Обратная связь
            </h2>

            <p className="text-gray-600 mb-6">
              Если у вас есть вопросы или предложения по улучшению карты, пожалуйста, свяжитесь с нами.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email для связи:
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="flex-1 text-gray-900 font-mono text-sm">{email}</span>
                  <button
                    onClick={handleCopyEmail}
                    className="hover:bg-gray-100 rounded-md transition-colors"
                    title="Copy email"
                  >
                    {copied ?<FaCheck className="w-4 h-4 fill-green-500" /> :<FaRegCopy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Группа с материалами:
                </label>
                <a
                  href={groupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors"
                >
                  <IoLinkOutline className="w-4 h-4" />
                  <span className="text-sm">Перейти в группу</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;

