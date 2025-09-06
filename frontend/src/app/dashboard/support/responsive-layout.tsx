"use client";

import styles from "./responsive-layout.module.css";
import Sidebar from "../Sidebar";
import { ReactNode } from "react";

interface ResponsiveLayoutProps {
  children?: ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  return (
    <div className={styles.container}>
      {/* Fixed sidebar replicating the provided design */}
      <Sidebar />
      {/* Main content shifted to make room for the fixed sidebar */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
