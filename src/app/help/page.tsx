"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav/BottomNav";
import DevModal from "@/components/DevModal/DevModal";
import styles from "./page.module.scss";

const helpItems = [
  { icon: "👨‍⚕️", title: "Специалист онлайн", sub: "Консультация врача" },
  { icon: "📞", title: "Колл-центр", sub: "8-800-xxx-xx-xx" },
  { icon: "🏥", title: "Найти больницу", sub: "Ближайшие клиники" },
  { icon: "🚑", title: "Скорая помощь", sub: "103 — экстренный вызов" },
  { icon: "💬", title: "Онлайн-чат", sub: "Поддержка 24/7" },
  { icon: "📋", title: "FAQ", sub: "Часто задаваемые вопросы" },
];

export default function HelpPage() {
  const [devModal, setDevModal] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Помощь</h1>
        <p>Мы всегда рядом</p>
      </div>

      <div className={styles.content}>
        <div className={styles.cta}>
          <div className={styles.ctaIcon}>🩺</div>
          <div className={styles.ctaText}>
            <h2>Нужен врач?</h2>
            <p>Запишитесь на приём прямо сейчас</p>
          </div>
          <Link href="/doctor" className={styles.ctaBtn}>Записаться</Link>
        </div>

        <p className={styles.sectionTitle}>Каналы поддержки</p>
        <div className={styles.helpList}>
          {helpItems.map((item) => (
            <button key={item.title} className={styles.helpCard} onClick={() => setDevModal(true)}>
              <div className={styles.helpIcon}>{item.icon}</div>
              <div className={styles.helpText}>
                <h3>{item.title}</h3>
                <p>{item.sub}</p>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
      {devModal && <DevModal onClose={() => setDevModal(false)} />}
    </div>
  );
}
