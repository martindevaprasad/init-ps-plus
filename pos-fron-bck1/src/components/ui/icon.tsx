import React from 'react';
import { cn } from '@/lib/utils';

export interface IconProps {
  icon: React.ComponentType<{ size?: number | string; stroke?: number; className?: string }>;
  size?: number;
  stroke?: number;
  className?: string;
}

export function Icon({ icon: IconComponent, size = 20, stroke = 1.5, className }: IconProps) {
  return (
    <IconComponent
      size={size}
      stroke={stroke}
      className={cn('shrink-0', className)}
    />
  );
}
