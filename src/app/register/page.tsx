"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.scss";
import Button from "@/components/Button";
import TitleLivio from "@/components/TitleLivio";
import TextLivio from "@/components/TextLivio";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "";
    let formatted = "+7";
    if (digits.length > 1) formatted += " (" + digits.slice(1, 4);
    if (digits.length >= 4) formatted += ") " + digits.slice(4, 7);
    if (digits.length >= 7) formatted += "-" + digits.slice(7, 9);
    if (digits.length >= 9) formatted += "-" + digits.slice(9, 11);
    return formatted;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Ошибка регистрации");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <TitleLivio size="h2">Создать аккаунт</TitleLivio>
        <TextLivio size="base" color="secondary">Заполните данные для регистрации</TextLivio>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && (
          <TextLivio as="div" size="s" color="error" className={styles.error}>
            {error}
          </TextLivio>
        )}

        <div className={styles.inputGroup}>
          <label>Ваше имя</label>
          <input
            type="text" placeholder="Иван Иванов"
            value={name} onChange={(e) => setName(e.target.value)} required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Номер телефона</label>
          <input
            type="tel" placeholder="+7 (999) 999-99-99"
            value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Пароль</label>
          <input
            type="password" placeholder="Минимум 6 символов"
            value={password} onChange={(e) => setPassword(e.target.value)}
            required minLength={6}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Подтвердите пароль</label>
          <input
            type="password" placeholder="Повторите пароль"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} required
          />
        </div>

        <Button type="submit" loading={loading} fluid>
          {loading ? "Регистрируем..." : "Зарегистрироваться"}
        </Button>
      </form>

      <TextLivio as="div" size="s" color="secondary" className={styles.footer}>
        Уже есть аккаунт?{" "}
        <Link href="/login">Войти</Link>
      </TextLivio>
    </div>
  );
}
