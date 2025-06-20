"use client"
import Link from "next/link"

interface AnimatedButtonProps {
  href: string;
  initialText: string;
  hoverText: string;
  className?: string;
  width?: string;
  height?: string;
}

export default function AnimatedButton({ 
  href, 
  initialText, 
  hoverText, 
  className = "",
  width = "200px",
  height = "60px"
}: AnimatedButtonProps) {
  return (
    <Link
      href={href}
      className={`relative inline-block bg-black text-white text-xl font-semibold px-10 py-4 border-2 border-black transition-all duration-300 ease-in-out shadow-lg overflow-hidden select-none active:scale-95 ${className}`}
      style={{
        width: width,
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLElement;
        const bgAnimation = target.querySelector('.bg-animation') as HTMLElement;
        const buttonText = target.querySelector('.button-text') as HTMLElement;

        bgAnimation.style.transform = 'translateX(0%)';
        buttonText.textContent = hoverText;
        target.style.boxShadow = '0 0 20px rgba(255, 189, 89, 0.4), 0 4px 14px 0 rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLElement;
        const bgAnimation = target.querySelector('.bg-animation') as HTMLElement;
        const buttonText = target.querySelector('.button-text') as HTMLElement;

        bgAnimation.style.transform = 'translateX(-100%)';
        buttonText.textContent = initialText;
        target.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Background animation layer */}
      <div className="bg-animation absolute inset-0 bg-[#ffbd59] transition-all duration-300 ease-in-out" style={{ transform: 'translateX(-100%)' }} />
      
      {/* Text content */}
      <span className="button-text relative z-10 inline-block transition-all duration-300 ease-in-out">
        {initialText}
      </span>
    </Link>
  );
}