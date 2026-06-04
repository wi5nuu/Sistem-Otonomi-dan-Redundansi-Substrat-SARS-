import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export function FormField({ children, className }: FormFieldProps) {
  return <div className={cn('space-y-2', className)}>{children}</div>;
}

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function FormLabel({ children, className, ...props }: FormLabelProps) {
  return (
    <label className={cn('text-sm font-medium text-sars-200', className)} {...props}>
      {children}
    </label>
  );
}

export interface FormMessageProps {
  children?: React.ReactNode;
  className?: string;
}

export function FormMessage({ children, className }: FormMessageProps) {
  if (!children) return null;
  return <p className={cn('text-sm text-red-400', className)}>{children}</p>;
}
