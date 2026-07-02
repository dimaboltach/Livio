"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader/PageHeader";
import Button from "@/components/Button";
import TitleLivio from "@/components/TitleLivio";
import TextLivio from "@/components/TextLivio";
import styles from "./page.module.scss";

export default function VeterinaryPage() {
  const [form, setForm] = useState({
    animal: "", breed: "", petInfo: "", serviceDate: "", meetingPlace: "", wishes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");

    const res = await fetch("/api/veterinary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) setSuccess(true);
    else { const d = await res.json(); setError(d.error || "Ошибка"); }
  };

  if (success) {
    return (
      <div className={styles.page}>
        <PageHeader title="Ветеринар" />
        <div className={styles.content}>
          <div className={styles.success}>
            <div className={styles.successIcon}>✅</div>
            <TitleLivio size="h2">Заявка отправлена!</TitleLivio>
            <TextLivio size="base" color="secondary">Ветеринар свяжется с вами для подтверждения визита.</TextLivio>
            <Button href="/account" theme="primary" size="medium">На главную</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Ветеринар на дом" />
      <div className={styles.content}>
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>🐾</div>
          <div>
            <TitleLivio size="h4" as="h3">Ветеринар на дом</TitleLivio>
            <TextLivio size="s" color="secondary">Профессиональная помощь вашему питомцу</TextLivio>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <TextLivio size="s" color="error">{error}</TextLivio>}

          <div className={styles.inputGroup}>
            <label>Вид животного *</label>
            <input type="text" placeholder="Кошка, собака, кролик..." required
              value={form.animal} onChange={(e) => setForm({ ...form, animal: e.target.value })} />
          </div>

          <div className={styles.inputGroup}>
            <label>Порода</label>
            <input type="text" placeholder="Необязательно"
              value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} />
          </div>

          <div className={styles.inputGroup}>
            <label>Информация о питомце</label>
            <input type="text" placeholder="Возраст, вес, особенности"
              value={form.petInfo} onChange={(e) => setForm({ ...form, petInfo: e.target.value })} />
          </div>

          <div className={styles.inputGroup}>
            <label>Дата и время визита *</label>
            <input type="datetime-local" required
              min={new Date().toISOString().slice(0, 16)}
              value={form.serviceDate}
              onChange={(e) => setForm({ ...form, serviceDate: e.target.value })} />
          </div>

          <div className={styles.inputGroup}>
            <label>Место встречи *</label>
            <input type="text" placeholder="Ваш адрес" required
              value={form.meetingPlace} onChange={(e) => setForm({ ...form, meetingPlace: e.target.value })} />
          </div>

          <div className={styles.inputGroup}>
            <label>Пожелания</label>
            <textarea placeholder="Опишите проблему или пожелания..."
              value={form.wishes} onChange={(e) => setForm({ ...form, wishes: e.target.value })} />
          </div>

          <Button type="submit" loading={loading} fluid>
            {loading ? "Отправляем..." : "Вызвать ветеринара"}
          </Button>
        </form>
      </div>
    </div>
  );
}
