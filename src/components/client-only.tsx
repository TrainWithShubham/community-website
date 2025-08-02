"use client";

import { useState, useEffect, type FC, type ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
}

export const ClientOnly: FC<ClientOnlyProps> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};
