import { useState, useEffect } from 'react';
import useLinkProvider from '../generateLink';
import { Link, Copy, Check, X } from 'lucide-react';

const LinkModal = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const { shareLink } = useLinkProvider();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-2 rounded-lg shadow-lg">
              <Link className="w-5 h-5 text-slate-900" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Share Your Screen
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-300 text-sm mb-4">
          Share this link with others to let them view your screen
        </p>

        {/* Link Display */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 mb-4 hover:border-teal-500/50 transition-colors">
          <a 
            href={shareLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 font-mono text-sm break-all block transition-colors"
          >
            {shareLink}
          </a>
        </div>

        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LinkModal;