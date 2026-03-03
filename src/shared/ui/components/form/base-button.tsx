import type { ButtonHTMLAttributes } from "react";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function BaseButton({
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading && <Spinner />}
      
      {children}
    </Button>
  );
}
