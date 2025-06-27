"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps extends ButtonProps {
  children?: React.ReactNode;
  className?: string;
  whatsappUrl?: string;
  showIcon?: boolean;
}

export default function WhatsAppButton({ 
  children, 
  className, 
  size = 'lg', 
  whatsappUrl = "https://chat.whatsapp.com/your-channel-invite-link",
  showIcon = true,
  ...props 
}: WhatsAppButtonProps) {
  const isLarge = size === 'lg';
  
  const glowStyle = {
    width: isLarge ? 200 : 140,
    height: isLarge ? 60 : 40,
  };

  // True Supabase green colors with enhanced glow
  const glowBackground = isLarge 
    ? 'radial-gradient(circle, rgba(62, 207, 142, 0.9) 0%, rgba(45, 212, 191, 0.5) 50%, rgba(16, 185, 129, 0.3) 100%)'
    : 'radial-gradient(circle, rgba(62, 207, 142, 1) 0%, rgba(45, 212, 191, 0.6) 50%, rgba(16, 185, 129, 0.4) 100%)';
  
  const glowFilter = isLarge ? 'blur(20px)' : 'blur(16px)';

  const buttonPadding = isLarge ? 'px-6' : 'px-4';

  const handleClick = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative group isolate">
      {/* Glow effect - ONLY on hover */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none" 
        style={glowStyle}
      >
        <div style={{
          width: '100%', 
          height: '100%', 
          borderRadius: '9999px', 
          background: glowBackground, 
          filter: glowFilter
        }} />
      </div>

      <Button 
        size={size} 
        onClick={handleClick}
        className={cn(
          "relative rounded-full bg-white text-black font-bold tracking-wide transition-all duration-300 border border-gray-200/50 z-0 overflow-hidden",
          // Completely clean default state - no shadows or effects
          "shadow-none border-gray-200/30",
          // Hover effects with green theme - ONLY on hover
          "hover:bg-gray-50 hover:scale-110 hover:shadow-xl hover:shadow-[#3ECF8E]/20 hover:border-[#3ECF8E]/30",
          // Active state
          "active:scale-100 active:shadow-lg",
          // Make it circular when no children (icon only)
          children ? buttonPadding : "w-10 h-10 p-0",
          className
        )} 
        {...props}
      >
        {/* Animated background shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3ECF8E]/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        
        <div className={cn(
          "relative z-10 flex items-center",
          children ? "gap-2" : "justify-center"
        )}>
          {showIcon && (
            <MessageCircle className={cn(
              "text-gray-700 transition-all duration-300 group-hover:scale-110 group-hover:text-[#3ECF8E]", 
              isLarge ? "h-5 w-5" : "h-4 w-4"
            )} />
          )}
          {children && (
            <span className="text-gray-800 font-bold text-sm tracking-wide transition-colors duration-300 group-hover:text-[#3ECF8E]">
              {children}
            </span>
          )}
        </div>
        
        {/* Top highlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full" />
      </Button>
    </div>
  )
} 