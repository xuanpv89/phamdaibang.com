import { PropsWithChildren } from "react";

export const Card: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-600 duration-700 hover:border-zinc-400/50 hover:bg-zinc-800/10">
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-zinc-100/10 via-zinc-100/5 to-transparent opacity-60 transition duration-700 group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
