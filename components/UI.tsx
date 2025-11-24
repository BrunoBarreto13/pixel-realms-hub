import React, { InputHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

// --- Input Component ---
interface GamerInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const GamerInput: React.FC<GamerInputProps> = ({ label, icon, className, ...props }) => {
  return (
    <div className="w-full mb-4 group">
      <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider group-focus-within:text-gamer-highlight transition-colors">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gamer-highlight transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-zinc-950 border border-zinc-800 rounded-md py-3 ${icon ? 'pl-10' : 'pl-4'} pr-4 text-white placeholder-zinc-600 outline-none focus:border-gamer-highlight focus:ring-1 focus:ring-gamer-highlight transition-all duration-300 hover:border-zinc-600 ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

// --- Button Component ---
interface GamerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'master' | 'super';
  loading?: boolean;
}

export const GamerButton: React.FC<GamerButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading,
  className,
  ...props 
}) => {
  const baseStyles = "relative w-full py-3 rounded-md font-bold uppercase tracking-wide transition-all duration-300 flex items-center justify-center overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-gamer-primary to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]",
    secondary: "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800",
    master: "bg-gradient-to-r from-gamer-master to-purple-800 text-white hover:from-purple-500 hover:to-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]",
    super: "bg-gradient-to-r from-gamer-super to-cyan-600 text-zinc-950 hover:from-cyan-300 hover:to-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${loading ? 'opacity-80 cursor-not-allowed' : ''} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      <span className="relative z-10">{children}</span>
      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
    </button>
  );
};

// --- Card Component ---
interface GamerCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  variant?: 'default' | 'map';
}

export const GamerCard: React.FC<GamerCardProps> = ({ children, className, noPadding = false, variant = 'default' }) => {
  const baseStyles = "rounded-xl shadow-2xl overflow-hidden border transition-all";
  const variants = {
    default: "bg-zinc-900 border-zinc-800", // Solid Dark Background
    map: "bg-[#141414] border-zinc-800",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
};