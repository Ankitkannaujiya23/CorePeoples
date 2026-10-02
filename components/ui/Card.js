import { cn } from "@/lib/utils";

export default function Card({ children, className, hoverable = false, as: Comp = "div", ...props }) {
  return (
    <Comp
      className={cn(
        "rounded-2xl border border-line-100 bg-white shadow-subtle",
        hoverable && "transition-all duration-200 hover:shadow-card hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
