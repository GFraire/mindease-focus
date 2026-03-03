import type { ComponentProps } from "react";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";

interface BaseButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean;
}

export function BaseButton({
  loading,
  disabled,
  children,
  ...props
}: BaseButtonProps) {
  return (
    <Button size="lg" disabled={loading || disabled} {...props}>
      {loading && <Spinner />}

      {children}
    </Button>
  );
}
