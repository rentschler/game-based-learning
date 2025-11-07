import { ReactNode } from 'react';

interface MobileViewportProps {
  children: ReactNode;
  className?: string;
  frameClassName?: string;
}

const MobileViewport = ({ children, className = '', frameClassName = '' }: MobileViewportProps) => {
  return (
    <div className={`min-h-screen w-full bg-slate-100 flex items-center justify-center py-6 ${className}`}>
      <div className={`relative w-full max-w-[412px] h-[918px] bg-white shadow-2xl border border-slate-200 rounded-[36px] overflow-hidden ${frameClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default MobileViewport;

