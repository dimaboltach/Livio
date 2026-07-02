"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader/PageHeader";
import Button from "@/components/Button";
import styles from "./page.module.scss";

interface Metric {
  id: number;
  date: string;
  weight: number | null;
  height: number | null;
  waist: number | null;
  chest: number | null;
  hips: number | null;
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", weight: "", height: "", waist: "", chest: "", hips: "" });
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    const res = await fetch("/api/metrics");
    const data = await res.json();
    if (Array.isArray(data)) setMetrics(data);
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/metrics")
      .then((r) => r.json())
      .then((data) => { if (!cancelled && Array.isArray(data)) setMetrics(data); });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setShowForm(false);
    setForm({ date: "", weight: "", height: "", waist: "", chest: "", hips: "" });
    fetchMetrics();
  };

  const deleteMetric = async (id: number) => {
    await fetch(`/api/metrics?id=${id}`, { method: "DELETE" });
    fetchMetrics();
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Метрики тела"
        action={
          <Button theme={showForm ? "tertiary" : "primary"} size="small" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Отмена" : "+ Добавить"}
          </Button>
        }
      />

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Дата *</label>
              <input type="date" required value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className={styles.inputGroup}>
              <label>Вес (кг)</label>
              <input type="number" step="0.1" placeholder="70.5"
                value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
            </div>
            <div className={styles.inputGroup}>
              <label>Рост (см)</label>
              <input type="number" step="0.1" placeholder="175"
                value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
            </div>
            <div className={styles.inputGroup}>
              <label>Талия (см)</label>
              <input type="number" step="0.1" placeholder="75"
                value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} />
            </div>
            <div className={styles.inputGroup}>
              <label>Грудь (см)</label>
              <input type="number" step="0.1" placeholder="90"
                value={form.chest} onChange={(e) => setForm({ ...form, chest: e.target.value })} />
            </div>
            <div className={styles.inputGroup}>
              <label>Бёдра (см)</label>
              <input type="number" step="0.1" placeholder="95"
                value={form.hips} onChange={(e) => setForm({ ...form, hips: e.target.value })} />
            </div>
          </div>
          <Button type="submit" loading={loading} fluid>
            {loading ? "Сохраняем..." : "Сохранить запись"}
          </Button>
        </form>
      )}

      <div className={styles.content}>
        {metrics.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>📊</p>
            <p>Нет записей. Добавьте первую!</p>
          </div>
        ) : (
          metrics.map((m) => (
            <div key={m.id} className={styles.metricCard}>
              <div className={styles.metricDate}>
                {new Date(m.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <div className={styles.metricValues}>
                {m.weight && <span><strong>{m.weight}</strong> кг</span>}
                {m.height && <span><strong>{m.height}</strong> см</span>}
                {m.waist && <span>Талия: <strong>{m.waist}</strong></span>}
                {m.chest && <span>Грудь: <strong>{m.chest}</strong></span>}
                {m.hips && <span>Бёдра: <strong>{m.hips}</strong></span>}
              </div>
              <Button theme="ghost" size="small" square onClick={() => deleteMetric(m.id)}>🗑️</Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
