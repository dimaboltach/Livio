"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.scss";
import Button from "@/components/Button";
import TitleLivio from "@/components/TitleLivio";
import TextLivio from "@/components/TextLivio";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(true);

    const digits = phone.replace(/\D/g, "");
    const result = await signIn("credentials", {
      phone: digits,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Неверный номер телефона или пароль");
    } else {
      router.push("/account");
      router.refresh();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <TitleLivio size="h2">Добро пожаловать!</TitleLivio>
        <TextLivio size="base" color="secondary">Войдите, чтобы продолжить</TextLivio>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && (
          <TextLivio as="div" size="s" color="error" className={styles.error}>
            {error}
          </TextLivio>
        )}

        <div className={styles.inputGroup}>
          <label>Номер телефона</label>
          <input
            type="tel"
            placeholder="+7 (999) 999-99-99"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Пароль</label>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <Button type="submit" loading={loading} fluid>
          {loading ? "Входим..." : "Войти"}
        </Button>
      </form>

      <TextLivio as="div" size="s" color="secondary" className={styles.footer}>
        Нет аккаунта?{" "}
        <Link href="/register">Зарегистрироваться</Link>
      </TextLivio>
    </div>
  );
}
