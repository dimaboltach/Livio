"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader/PageHeader";
import Button from "@/components/Button";
import styles from "./page.module.scss";

export default function WaterPage() {
  const [data, setData] = useState({ consumed: 0, goalMl: 2000 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/water")
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d.consumed !== undefined) setData(d); });
    return () => { cancelled = true; };
  }, []);

  const action = async (type: "add" | "remove") => {
    setLoading(true);
    const res = await fetch("/api/water", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: type }),
    });
    const d = await res.json();
    if (d.consumed !== undefined) setData(d);
    setLoading(false);
  };

  const glasses = Math.round(data.goalMl / 250);
  const filledGlasses = Math.round(data.consumed / 250);
  const percent = Math.round((data.consumed / data.goalMl) * 100);

  return (
    <div className={styles.page}>
      <PageHeader title="Вода" />

      <div className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.dropIcon}>💧</div>
          <div className={styles.progress}>
            <div className={styles.progressBar} style={{ width: `${Math.min(percent, 100)}%` }} />
          </div>
          <div className={styles.stats}>
            <span className={styles.current}>{data.consumed} мл</span>
            <span className={styles.goal}>/ {data.goalMl} мл</span>
          </div>
          <p className={styles.percent}>{percent}% от нормы</p>
        </div>

        <div className={styles.glasses}>
          {Array.from({ length: glasses }).map((_, i) => (
            <button
              key={i}
              className={`${styles.glass} ${i < filledGlasses ? styles.filled : ""}`}
              onClick={() => action(i < filledGlasses ? "remove" : "add")}
              disabled={loading}
            >
              {i < filledGlasses ? "🥛" : "🫙"}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <Button theme="primary" size="default" fluid
            disabled={loading || data.consumed >= data.goalMl}
            onClick={() => action("add")}>
            + Стакан воды (250 мл)
          </Button>
          <Button theme="tertiary" size="default" fluid
            disabled={loading || data.consumed <= 0}
            onClick={() => action("remove")}>
            − Убрать стакан
          </Button>
        </div>

        {percent >= 100 && (
          <div className={styles.congrats}>
            🎉 Отлично! Вы выполнили дневную норму!
          </div>
        )}
      </div>
    </div>
  );
}
