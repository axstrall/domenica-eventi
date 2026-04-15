import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export function ImageModal({ isOpen, imageUrl, onClose }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 text-white hover:text-rose-400 transition-colors"
        onClick={onClose}
      >
        <X size={40} />
      </button>
      
      <img 
        src={imageUrl} 
        alt="Ingrandimento" 
        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  );
}