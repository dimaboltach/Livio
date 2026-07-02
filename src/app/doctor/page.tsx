"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader/PageHeader";
import Button from "@/components/Button";
import TitleLivio from "@/components/TitleLivio";
import TextLivio from "@/components/TextLivio";
import styles from "./page.module.scss";

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function DoctorPage() {
  const [form, setForm] = useState({ patientName: "", phone: "", appointmentDate: "", appointmentTime: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.appointmentTime) { setError("Выберите время приёма"); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/doctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) setSuccess(true);
    else {
      const d = await res.json();
      setError(d.error || "Ошибка");
    }
  };

  if (success) {
    return (
      <div className={styles.page}>
        <PageHeader title="Врач на дом" />
        <div className={styles.content}>
          <div className={styles.success}>
            <div className={styles.successIcon}>✅</div>
            <TitleLivio size="h2">Запись создана!</TitleLivio>
            <TextLivio size="base" color="secondary">Ваша заявка принята. Врач свяжется с вами для подтверждения.</TextLivio>
            <Button href="/account" theme="primary" size="medium">На главную</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Врач на дом" />
      <div className={styles.content}>
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>🏠</div>
          <div>
            <TitleLivio size="h4" as="h3">Вызов врача на дом</TitleLivio>
            <TextLivio size="s" color="secondary">Врач приедет в удобное для вас время</TextLivio>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <TextLivio size="s" color="error">{error}</TextLivio>}

          <div className={styles.inputGroup}>
            <label>Имя пациента</label>
            <input
              type="text" placeholder="Иван Иванов" required
              value={form.patientName}
              onChange={(e) => setForm({ ...form, patientName: e.target.value })}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Телефон</label>
            <input
              type="tel" placeholder="+7 (999) 999-99-99" required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Дата приёма</label>
            <input
              type="date" required
              min={new Date().toISOString().split("T")[0]}
              value={form.appointmentDate}
              onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Время приёма</label>
            <div className={styles.timeSlots}>
              {timeSlots.map((t) => (
                <button
                  key={t} type="button"
                  className={`${styles.slot} ${form.appointmentTime === t ? styles.selected : ""}`}
                  onClick={() => setForm({ ...form, appointmentTime: t })}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" loading={loading} fluid>
            {loading ? "Отправляем..." : "Записаться к врачу"}
          </Button>
        </form>
      </div>
    </div>
  );
}
