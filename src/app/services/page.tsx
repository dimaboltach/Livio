"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav/BottomNav";
import DevModal from "@/components/DevModal/DevModal";
import styles from "./page.module.scss";

const allServices = [
  {
    category: "Медицина",
    items: [
      { href: "/doctor", icon: "🏠", title: "Врач на дом", sub: "Терапевт, педиатр", live: true },
      { href: "/veterinary", icon: "🐾", title: "Ветеринар", sub: "Выезд на дом", live: true },
      { href: null, icon: "🔬", title: "Лабораторные анализы", sub: "Сдача анализов", live: false },
    ],
  },
  {
    category: "Здоровье",
    items: [
      { href: "/pharmacy", icon: "💊", title: "Аптека", sub: "Лекарства и добавки", live: true },
      { href: "/feed", icon: "🥗", title: "Питание", sub: "Дневник блюд", live: true },
      { href: null, icon: "🛡️", title: "Страхование", sub: "ОМС и ДМС", live: false },
    ],
  },
];

export default function ServicesPage() {
  const [devModal, setDevModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = allServices.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (i) =>
        !search ||
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.sub.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Услуги</h1>
        <div className={styles.searchBar}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            placeholder="Поиск услуг..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.content}>
        {filtered.map((cat) => (
          <div key={cat.category}>
            <p className={styles.sectionTitle}>{cat.category}</p>
            <div className={styles.serviceList}>
              {cat.items.map((item) =>
                item.live && item.href ? (
                  <Link key={item.title} href={item.href} className={styles.serviceCard}>
                    <div className={styles.serviceIcon}>{item.icon}</div>
                    <div className={styles.serviceText}>
                      <h3>{item.title}</h3>
                      <p>{item.sub}</p>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className={styles.arrow}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                ) : (
                  <button key={item.title} className={styles.serviceCard} onClick={() => setDevModal(true)}>
                    <div className={styles.serviceIcon}>{item.icon}</div>
                    <div className={styles.serviceText}>
                      <h3>{item.title}</h3>
                      <p>{item.sub}</p>
                    </div>
                    <span className={styles.soon}>Скоро</span>
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
      {devModal && <DevModal onClose={() => setDevModal(false)} />}
    </div>
  );
}
