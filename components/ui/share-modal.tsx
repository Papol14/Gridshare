import { useEffect, useRef } from 'react';
import { Button } from './button';
import { Share2 } from 'lucide-react';

interface ShareModalProps {
  url: string;
  title: string;
}

export function ShareModal({ url, title }: ShareModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        modalRef.current.style.display = 'none';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(url);
      // You might want to show a toast notification here
    }
  };

  return (
    <div ref={modalRef} className="share-modal" style={{ display: 'none' }}>
      <div className="share-modal-content">
        <h3>Share this page</h3>
        <div className="share-options">
          <Button onClick={handleShare} variant="outline" className="w-full">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
} 