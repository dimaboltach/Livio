"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import PageHeader from "@/components/PageHeader/PageHeader";
import Button from "@/components/Button";
import TitleLivio from "@/components/TitleLivio";
import TextLivio from "@/components/TextLivio";
import styles from "./page.module.scss";

interface Profile {
  name: string;
  phone: string;
  clinic: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ name: "", clinic: "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then((r) => r.json()).then((data) => {
      if (data.name) {
        setProfile(data);
        setForm({ name: data.name, clinic: data.clinic || "" });
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!profile) return <div className={styles.loading}><div className={styles.spinner} /></div>;

  const firstLetter = profile.name.charAt(0).toUpperCase();

  return (
    <div className={styles.page}>
      <PageHeader title="Мой профиль" />

      <div className={styles.content}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>{firstLetter}</div>
          <TitleLivio size="h3">{profile.name}</TitleLivio>
          <TextLivio size="base" color="secondary">
            {profile.phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5")}
          </TextLivio>
        </div>

        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.inputGroup}>
            <label>Имя и фамилия</label>
            <input
              type="text" required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Поликлиника / Клиника</label>
            <input
              type="text" placeholder="Название вашей клиники"
              value={form.clinic}
              onChange={(e) => setForm({ ...form, clinic: e.target.value })}
            />
          </div>

          <Button type="submit" loading={loading} theme={saved ? "secondary" : "primary"} fluid>
            {saved ? "✓ Сохранено!" : loading ? "Сохраняем..." : "Сохранить изменения"}
          </Button>
        </form>

        <div className={styles.separator} />

        <Button theme="danger" size="default" fluid onClick={() => signOut({ callbackUrl: "/" })}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" style={{ marginRight: 8 }}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  );
}
