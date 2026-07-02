"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.scss";

const navItems = [
  {
    href: "/account",
    label: "Главная",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/services",
    label: "Услуги",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/help",
    label: "Помощь",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${styles.item} ${pathname === item.href ? styles.active : ""}`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
