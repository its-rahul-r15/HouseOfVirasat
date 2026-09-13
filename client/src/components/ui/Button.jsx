import React from 'react';

/**
 * Button — House of Virasat Luxury Design System
 * Variants: primary (burgundy) | gold (warm velvet gold) | secondary (hairline gold) | dark (onyx) | text (understated link) | whatsapp (concierge green)
 * Sizes: sm | md (default) | lg
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-sans font-semibold uppercase tracking-[0.14em] transition-all duration-200 cursor-pointer whitespace-nowrap rounded-[2px] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variants = {
    primary:
      'bg-[#5C1A2E] text-white border border-[#5C1A2E] hover:bg-[#471222] hover:border-[#471222] focus-visible:ring-[#5C1A2E] shadow-2xs',
    gold:
      'bg-[#B89768] text-white border border-[#B89768] hover:bg-[#A07F52] hover:border-[#A07F52] focus-visible:ring-[#B89768] shadow-2xs',
    secondary:
      'bg-transparent text-[#2B2320] border border-[#D1CCC0] hover:border-[#2B2320] hover:bg-[#FAF6F0] focus-visible:ring-[#5C1A2E]',
    dark:
      'bg-[#1A1A1A] text-white border border-[#1A1A1A] hover:bg-[#333333] hover:border-[#333333] focus-visible:ring-[#1A1A1A] shadow-2xs',
    text:
      'bg-transparent text-[#B89768] border-none hover:text-[#96773E] underline-offset-4 hover:underline focus-visible:ring-[#B89768] p-0 shadow-none',
    whatsapp:
      'bg-[#25D366] text-white border border-[#25D366] hover:bg-[#1EBE5D] hover:border-[#1EBE5D] focus-visible:ring-[#25D366] shadow-2xs',
  };

  const sizes = {
    sm: 'py-2 px-3.5 text-[0.72rem] tracking-[0.1em]',
    md: 'py-3 px-6 text-[0.82rem]',
    lg: 'py-3.5 px-8 text-[0.9rem]',
  };

  const disabledStyle = disabled
    ? 'opacity-40 cursor-not-allowed pointer-events-none shadow-none'
    : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${disabledStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

