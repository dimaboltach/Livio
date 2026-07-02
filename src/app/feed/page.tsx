"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader/PageHeader";
import DevModal from "@/components/DevModal/DevModal";
import styles from "./page.module.scss";

interface Dish {
  id: number;
  name: string;
  createdAt: string;
}

const weekMenu = [
  { day: "Пн", meals: ["Овсянка с ягодами", "Куриный суп", "Запечённая рыба"] },
  { day: "Вт", meals: ["Яичница с овощами", "Борщ", "Греческий салат"] },
  { day: "Ср", meals: ["Творог с мёдом", "Щи", "Тушёные овощи"] },
  { day: "Чт", meals: ["Смузи боул", "Рассольник", "Куриная грудка"] },
  { day: "Пт", meals: ["Блины с йогуртом", "Уха", "Стейк с салатом"] },
  { day: "Сб", meals: ["Вафли с фруктами", "Солянка", "Пицца"] },
  { day: "Вс", meals: ["Омлет с сыром", "Плов", "Овощи-гриль"] },
];

export default function FeedPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [newDish, setNewDish] = useState("");
  const [loading, setLoading] = useState(false);
  const [devModal, setDevModal] = useState(false);
  const todayIdx = new Date().getDay();
  const [activeDay, setActiveDay] = useState(todayIdx === 0 ? 6 : todayIdx - 1);

  const fetchDishes = async () => {
    const res = await fetch("/api/feed");
    const data = await res.json();
    if (Array.isArray(data)) setDishes(data);
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/feed")
      .then((r) => r.json())
      .then((data) => { if (!cancelled && Array.isArray(data)) setDishes(data); });
    return () => { cancelled = true; };
  }, []);

  const addDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.trim()) return;
    setLoading(true);
    await fetch("/api/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newDish }),
    });
    setNewDish("");
    setLoading(false);
    fetchDishes();
  };

  const deleteDish = async (id: number) => {
    await fetch(`/api/feed?id=${id}`, { method: "DELETE" });
    fetchDishes();
  };

  return (
    <div className={styles.page}>
      <PageHeader title="Питание" />

      <div className={styles.content}>
        <p className={styles.sectionTitle}>Меню недели</p>

        <div className={styles.dayTabs}>
          {weekMenu.map((d, i) => (
            <button
              key={d.day}
              className={`${styles.dayTab} ${activeDay === i ? styles.active : ""}`}
              onClick={() => setActiveDay(i)}
            >
              {d.day}
            </button>
          ))}
        </div>

        <div className={styles.menuCard}>
          {weekMenu[activeDay].meals.map((meal, i) => (
            <div key={i} className={styles.mealItem}>
              <span className={styles.mealIcon}>{["🌅", "☀️", "🌙"][i]}</span>
              <span>{meal}</span>
            </div>
          ))}
        </div>

        <div className={styles.aiSection}>
          <button className={styles.aiBtn} onClick={() => setDevModal(true)}>
            🤖 AI-рекомендации по питанию
          </button>
        </div>

        <p className={styles.sectionTitle}>Мои блюда</p>

        <form className={styles.addForm} onSubmit={addDish}>
          <input
            type="text"
            placeholder="Добавить блюдо..."
            value={newDish}
            onChange={(e) => setNewDish(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "..." : "+"}
          </button>
        </form>

        {dishes.length === 0 ? (
          <div className={styles.empty}>
            <p>🥗</p>
            <span>Добавьте свои блюда!</span>
          </div>
        ) : (
          <div className={styles.dishesList}>
            {dishes.map((dish) => (
              <div key={dish.id} className={styles.dishCard}>
                <span className={styles.dishIcon}>🍽️</span>
                <span className={styles.dishName}>{dish.name}</span>
                <button className={styles.deleteBtn} onClick={() => deleteDish(dish.id)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {devModal && <DevModal onClose={() => setDevModal(false)} />}
    </div>
  );
}
