import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function PrimaryButton({ children, className, size = 'lg', ...props }: PrimaryButtonProps) {
  const isLarge = size === 'lg';
  
  const glowStyle = {
    width: isLarge ? 220 : 180,
    height: isLarge ? 80 : 70,
  };

  const glowBackground = isLarge 
    ? 'radial-gradient(circle, rgba(168, 85, 247, 0.7) 0%, rgba(139, 92, 246, 0.3) 100%)'
    : 'radial-gradient(circle, rgba(168, 85, 247, 0.9) 0%, rgba(139, 92, 246, 0.5) 100%)';
  
  const glowFilter = isLarge ? 'blur(24px)' : 'blur(22px)';

  const buttonPadding = isLarge ? 'px-8' : 'px-6';

  return (
    <div className="relative group">
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
        style={glowStyle}
      >
        <div style={{width: '100%', height: '100%', borderRadius: '9999px', background: glowBackground, filter: glowFilter}} />
      </div>
      <Button 
        size={size} 
        className={cn(
          "relative rounded-full bg-white text-black hover:bg-violet-200 hover:scale-105 transition-all duration-300 z-10",
          buttonPadding,
          className
        )} 
        {...props}
      >
        {children}
      </Button>
    </div>
  )
} 