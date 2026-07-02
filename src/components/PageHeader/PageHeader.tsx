"use client";

import Link from "next/link";
import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, backHref = "/account", action }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <Link href={backHref} className={styles.back}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Link>
      <h1>{title}</h1>
      {action}
    </header>
  );
}
