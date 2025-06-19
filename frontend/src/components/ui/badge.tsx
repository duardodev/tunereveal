import React from 'react';

const badgeVariants = {
  default:
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default';
}

const BadgeComponent = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return <div className={`${badgeVariants[variant]} ${className || ''}`} ref={ref} {...props} />;
  }
);
BadgeComponent.displayName = 'Badge';

export { BadgeComponent };
