import type { ElementType } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/shared/lib/utils";

type SidebarItemProps = {
  to: string;
  icon: ElementType;
  label: string;
};

export function SidebarItem({ to, icon: Icon, label }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-body-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted hover:bg-muted/7",
        )
      }
    >
      <Icon className="h-5 w-5" />
      {label}
    </NavLink>
  );
}
