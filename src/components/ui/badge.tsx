import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLDivElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <div
      className={className}
      {...props}
    />
  );
}
