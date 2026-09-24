import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'black'
  | 'white'
  | 'primary'
  | 'secondary'
  | 'utility'
  | 'ghost'
  | 'danger'
  | 'icon'
  | 'dark'
  | 'light'
  | 'outline'
  | 'gold'
  | 'sage';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface MoneyMindButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
}

export const MoneyMindButton: React.FC<MoneyMindButtonProps> = ({
  children,
  variant = 'white',
  size = 'sm',
  icon,
  loading = false,
  fullWidth = false,
  iconOnly = false,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const isIconOnly = iconOnly || size === 'icon' || (!children && Boolean(icon));
  const normalizedVariant =
    variant === 'icon' || isIconOnly ? 'icon' :
    variant === 'black' || variant === 'primary' || variant === 'dark' || variant === 'gold' ? 'black' :
    'white';

  const sizeClasses = {
    sm: 'text-[11px] px-3 py-1 min-h-[28px] gap-1.5 font-medium',
    md: 'text-xs px-3.5 py-1.5 min-h-[34px] gap-2 font-medium',
    lg: 'text-xs sm:text-sm px-5 py-2 min-h-[40px] gap-2 font-medium',
    icon: 'p-1.5 min-h-[30px] min-w-[30px] justify-center',
  }[size];

  const widthClass = fullWidth ? 'w-full flex' : 'inline-flex';
  const isDisabled = disabled || loading;

  const renderedIcon = icon && React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, {
        className: `w-3.5 h-3.5 text-[#D4AF37] ${(icon.props as any).className || ''}`.replace(
          /text-(white|gray|black|slate|zinc|neutral|red|emerald|blue|amber)-\d+/g,
          ''
        ),
        style: { ...(icon.props as any).style, color: '#D4AF37' }
      })
    : icon;

  return (
    <div
      className={`btn-wrapper variant-${normalizedVariant} ${widthClass} ${isDisabled ? 'disabled' : ''} shrink-0 ${className}`}
    >
      <div className="gradient-layer" aria-hidden="true" />
      <div className="light" aria-hidden="true" />

      <button
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        aria-busy={loading}
        aria-label={ariaLabel}
        className={`gradient-btn ${sizeClasses} ${widthClass} focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1`}
        {...rest}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-1.5 w-full">
            <Loader2 className="w-3 h-3 animate-spin shrink-0 text-[#D4AF37]" style={{ color: '#D4AF37' }} />
            {children !== undefined && children !== null && (
              <span className="truncate whitespace-nowrap opacity-95">{children}</span>
            )}
          </span>
        ) : (
          <>
            {renderedIcon && (
              <span
                className="shrink-0 flex items-center justify-center text-[#D4AF37] transition-transform duration-200 hover:scale-105"
                style={{ color: '#D4AF37' }}
              >
                {renderedIcon}
              </span>
            )}
            {children !== undefined && children !== null && (
              <span className="truncate whitespace-nowrap">{children}</span>
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default MoneyMindButton;
