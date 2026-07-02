"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import DevModal from "@/components/DevModal/DevModal";
import TitleLivio from "@/components/TitleLivio";
import TextLivio from "@/components/TextLivio";

interface Props {
  user: { name: string; photo: string | null };
  notifications: Array<{ icon: string; text: string; date: string }>;
}

const quickActions = [
  { href: "/pharmacy", icon: "💊", label: "Аптека" },
  { href: "/feed", icon: "🥗", label: "Питание" },
  { href: "/doctor", icon: "🩺", label: "Врач" },
];

const healthCards = [
  { href: "/health/metrics", icon: "📊", bg: "#FFF3E0", title: "Метрики", sub: "Вес, рост, объёмы" },
  { href: "/health/water", icon: "💧", bg: "#E3F2FD", title: "Вода", sub: "Дневная норма" },
  { href: "/health/heart", icon: "❤️", bg: "#FCE4EC", title: "Сердце", sub: "ЭКГ, Эхо, МРТ" },
  { href: "/health/cycle", icon: "🗓️", bg: "#F3E5F5", title: "Цикл", sub: "Дневник цикла" },
];

export default function AccountClient({ user, notifications }: Props) {
  const [showDevModal, setShowDevModal] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const router = useRouter();

  const firstLetter = user.name.charAt(0).toUpperCase();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/profile" className={styles.userInfo}>
            <div className={styles.avatar}>
              {user.photo ? (
                <img src={user.photo} alt={user.name} />
              ) : (
                firstLetter
              )}
            </div>
            <div className={styles.greeting}>
              <TextLivio size="s" color="secondary">Добро пожаловать!</TextLivio>
              <TitleLivio size="h3" as="h2">{user.name}</TitleLivio>
            </div>
          </Link>

          <button
            className={styles.bellBtn}
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {notifications.length > 0 && (
              <span className={styles.notifBadge}>{notifications.length}</span>
            )}
          </button>
        </div>

        <div className={styles.searchBar}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            placeholder="Поиск по сервисам..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value.toLowerCase();
                if (val.includes("врач") || val.includes("doctor")) router.push("/doctor");
                else if (val.includes("аптек") || val.includes("pharmacy")) router.push("/pharmacy");
                else if (val.includes("вет")) router.push("/veterinary");
                else if (val.includes("вода") || val.includes("water")) router.push("/health/water");
                else if (val.includes("серд") || val.includes("heart")) router.push("/health/heart");
                else if (val.includes("цикл")) router.push("/health/cycle");
                else if (val.includes("метр")) router.push("/health/metrics");
                else if (val.includes("питан") || val.includes("блюд")) router.push("/feed");
              }
            }}
          />
        </div>
      </div>

      <div className={styles.content}>
        {showNotifs && notifications.length > 0 && (
          <div className={styles.notifPanel} style={{ marginBottom: 16 }}>
            {notifications.map((n, i) => (
              <div key={i} className={styles.notifItem}>
                <div className={styles.notifIcon}>{n.icon}</div>
                <div className={styles.notifText}>
                  <p>{n.text}</p>
                  <span>{n.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <TextLivio as="p" size="s" weight="semiBold" color="secondary" className={styles.sectionTitle}>Быстрый доступ</TextLivio>
        <div className={styles.quickActions}>
          {quickActions.map((a) => (
            <Link key={a.href} href={a.href} className={styles.quickCard}>
              <div className={styles.quickIcon}>{a.icon}</div>
              <div className={styles.quickLabel}>{a.label}</div>
            </Link>
          ))}
        </div>

        <TextLivio as="p" size="s" weight="semiBold" color="secondary" className={styles.sectionTitle} style={{ marginTop: 8 }}>Моё здоровье</TextLivio>
        <div className={styles.healthGrid}>
          {healthCards.map((c) => (
            <Link key={c.href} href={c.href} className={styles.healthCard}>
              <div className={styles.healthIcon} style={{ background: c.bg }}>
                {c.icon}
              </div>
              <div className={styles.healthTitle}>{c.title}</div>
              <div className={styles.healthSub}>{c.sub}</div>
            </Link>
          ))}
        </div>

        <TextLivio as="p" size="s" weight="semiBold" color="secondary" className={styles.sectionTitle} style={{ marginTop: 8 }}>Дополнительно</TextLivio>
        <div className={styles.quickActions}>
          <button onClick={() => setShowDevModal(true)} className={styles.quickCard} style={{ all: "unset", cursor: "pointer" }}>
            <div className={styles.quickCard}>
              <div className={styles.quickIcon}>🏥</div>
              <div className={styles.quickLabel}>Мед. карта</div>
            </div>
          </button>
          <Link href="/services" className={styles.quickCard}>
            <div className={styles.quickIcon}>🔧</div>
            <div className={styles.quickLabel}>Услуги</div>
          </Link>
          <Link href="/help" className={styles.quickCard}>
            <div className={styles.quickIcon}>❓</div>
            <div className={styles.quickLabel}>Помощь</div>
          </Link>
        </div>
      </div>

      {showDevModal && <DevModal onClose={() => setShowDevModal(false)} />}
    </div>
  );
}
