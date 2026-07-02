"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader/PageHeader";
import styles from "./page.module.scss";

const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const DAYS = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

export default function CyclePage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [marked, setMarked] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/cycle").then((r) => r.json()).then((dates: string[]) => {
      if (Array.isArray(dates)) setMarked(new Set(dates));
    });
  }, []);

  const toggleDate = async (dateStr: string) => {
    const isMarked = marked.has(dateStr);
    await fetch("/api/cycle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: dateStr, action: isMarked ? "remove" : "add" }),
    });
    setMarked((prev) => {
      const next = new Set(prev);
      if (isMarked) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
  };

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => {
    const d = new Date(y, m, 1).getDay();
    return d === 0 ? 6 : d - 1;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const todayStr = today.toISOString().split("T")[0];
  const markedCount = Array.from(marked).filter((d) => d.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).length;

  return (
    <div className={styles.page}>
      <PageHeader title="Дневник цикла" />

      <div className={styles.content}>
        <div className={styles.calendarHeader}>
          <button className={styles.navBtn} onClick={prevMonth}>‹</button>
          <h2>{MONTHS[month]} {year}</h2>
          <button className={styles.navBtn} onClick={nextMonth}>›</button>
        </div>

        <div className={styles.weekdays}>
          {DAYS.map((d) => <span key={d}>{d}</span>)}
        </div>

        <div className={styles.grid}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isMarked = marked.has(dateStr);
            const isToday = dateStr === todayStr;
            return (
              <button
                key={day}
                className={`${styles.day} ${isMarked ? styles.marked : ""} ${isToday ? styles.today : ""}`}
                onClick={() => toggleDate(dateStr)}
              >
                {day}
              </button>
            );
          })}
        </div>

        {markedCount > 0 && (
          <div className={styles.summary}>
            <span>🩸</span>
            
            <p>В этом месяце отмечено <strong>{markedCount}</strong> {markedCount === 1 ? "день" : markedCount < 5 ? "дня" : "дней"}</p>
          </div>
        )}

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.markedDot}`} />
            <span>Дни цикла</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.todayDot}`} />
            <span>Сегодня</span>
          </div>
        </div>
      </div>
    </div>
  );
}
