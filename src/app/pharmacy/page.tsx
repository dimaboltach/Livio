"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav/BottomNav";
import styles from "./page.module.scss";

type Category = "all" | "discounts" | "medicines" | "supplements";

const products = [
  { id: 1, name: "Ибупрофен 400мг", category: "medicines", price: "89₽", oldPrice: "120₽", icon: "💊", desc: "Обезболивающее, жаропонижающее", discount: true },
  { id: 2, name: "Омега-3 1000мг", category: "supplements", price: "450₽", oldPrice: null, icon: "🐟", desc: "60 капсул, рыбий жир", discount: false },
  { id: 3, name: "Витамин D3 2000МЕ", category: "supplements", price: "320₽", oldPrice: "400₽", icon: "☀️", desc: "90 таблеток", discount: true },
  { id: 4, name: "Парацетамол 500мг", category: "medicines", price: "65₽", oldPrice: null, icon: "💊", desc: "Жаропонижающее средство", discount: false },
  { id: 5, name: "Магний B6", category: "supplements", price: "380₽", oldPrice: "500₽", icon: "🌿", desc: "60 таблеток, стресс и сон", discount: true },
  { id: 6, name: "Но-шпа 40мг", category: "medicines", price: "195₽", oldPrice: null, icon: "💊", desc: "Спазмолитическое средство", discount: false },
  { id: 7, name: "Цинк + Витамин C", category: "supplements", price: "290₽", oldPrice: "350₽", icon: "🍋", desc: "Иммунитет и антиоксидант", discount: true },
  { id: 8, name: "Амоксициллин 500мг", category: "medicines", price: "145₽", oldPrice: null, icon: "💊", desc: "Антибиотик широкого спектра", discount: false },
];

const categories: Array<{ id: Category; label: string }> = [
  { id: "all", label: "Все" },
  { id: "discounts", label: "Скидки 🔥" },
  { id: "medicines", label: "Лекарства" },
  { id: "supplements", label: "Добавки" },
];

export default function PharmacyPage() {
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    if (category === "discounts" && !p.discount) return false;
    if (category !== "all" && category !== "discounts" && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Аптека</h1>
        <div className={styles.searchBar}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            placeholder="Поиск товаров..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.categories}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.catBtn} ${category === cat.id ? styles.active : ""}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>😔</p>
            <span>Ничего не найдено</span>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {filtered.map((p) => (
              <div key={p.id} className={styles.productCard}>
                {p.discount && <span className={styles.discountBadge}>Скидка</span>}
                <div className={styles.productIcon}>{p.icon}</div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{p.price}</span>
                  {p.oldPrice && <span className={styles.oldPrice}>{p.oldPrice}</span>}
                </div>
                <button className={styles.addBtn}>Подробнее</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
