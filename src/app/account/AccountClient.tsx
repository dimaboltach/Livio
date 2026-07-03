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
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const allServices = [
    { label: "Врач на дом", keywords: ["врач", "доктор", "doctor"], href: "/doctor" },
    { label: "Аптека", keywords: ["аптек", "pharmacy", "лекарств", "таблетк"], href: "/pharmacy" },
    { label: "Ветеринар", keywords: ["вет", "питомец", "животн", "кош", "собак"], href: "/veterinary" },
    { label: "Вода", keywords: ["вода", "water", "питьё"], href: "/health/water" },
    { label: "Здоровье сердца", keywords: ["серд", "heart", "экг", "мрт"], href: "/health/heart" },
    { label: "Цикл", keywords: ["цикл", "cycle"], href: "/health/cycle" },
    { label: "Метрики тела", keywords: ["метр", "вес", "рост", "талия"], href: "/health/metrics" },
    { label: "Питание", keywords: ["питан", "еда", "блюд", "food", "feed"], href: "/feed" },
    { label: "Услуги", keywords: ["услуг", "сервис"], href: "/services" },
    { label: "Помощь", keywords: ["помощ", "help", "вопрос"], href: "/help" },
  ];

  const filteredServices = searchQuery.trim()
    ? allServices.filter(({ keywords }) =>
        keywords.some((k) => k.includes(searchQuery.toLowerCase()) || searchQuery.toLowerCase().includes(k))
      )
    : allServices;

  const handleSearch = (href: string) => {
    router.push(href);
    setShowSearch(false);
    setSearchQuery("");
  };

  const firstLetter = user.name.charAt(0).toUpperCase();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        {/* Верхняя строка: логотип + иконки */}
        <div className={styles.headerTop}>
          <span className={styles.logo}>livio</span>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn} onClick={() => setShowNotifs(!showNotifs)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              {notifications.length > 0 && (
                <span className={styles.notifBadge}>{notifications.length}</span>
              )}
            </button>
            <button className={styles.iconBtn} onClick={() => setShowSearch(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>

        {/* Нижняя строка: аватар + имя */}
        <Link href="/profile" className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.photo ? (
              <img src={user.photo} alt={user.name} />
            ) : (
              firstLetter
            )}
          </div>
          <TitleLivio size="h3" as="h2" color="white">{user.name}</TitleLivio>
        </Link>
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

      {showSearch && (
        <div className={styles.searchOverlay} onClick={() => setShowSearch(false)}>
          <div className={styles.searchModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.searchHeader}>
              <TextLivio size="base" weight="semiBold">Поиск по сервисам</TextLivio>
              <button className={styles.searchClose} onClick={() => setShowSearch(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={styles.searchInputWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                autoFocus
                className={styles.searchInput}
                placeholder="Врач, аптека, вода..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className={styles.searchClear} onClick={() => setSearchQuery("")}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className={styles.searchResults}>
              {filteredServices.length === 0 ? (
                <TextLivio size="s" color="tertiary" className={styles.searchEmpty}>Ничего не найдено</TextLivio>
              ) : (
                filteredServices.map((s) => (
                  <button key={s.href} className={styles.searchResultItem} onClick={() => handleSearch(s.href)}>
                    {s.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
