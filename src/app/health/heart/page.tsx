"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader/PageHeader";
import Button from "@/components/Button";
import styles from "./page.module.scss";

interface HeartExam {
  id: number;
  examDate: string;
  ecg: string | null;
  echo: string | null;
  mri: string | null;
  ctAngio: string | null;
}

export default function HeartPage() {
  const [exams, setExams] = useState<HeartExam[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ examDate: "", ecg: "", echo: "", mri: "", ctAngio: "" });
  const [loading, setLoading] = useState(false);

  const fetchExams = async () => {
    const res = await fetch("/api/heart");
    const data = await res.json();
    if (Array.isArray(data)) setExams(data);
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/heart")
      .then((r) => r.json())
      .then((data) => { if (!cancelled && Array.isArray(data)) setExams(data); });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/heart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setShowForm(false);
    setForm({ examDate: "", ecg: "", echo: "", mri: "", ctAngio: "" });
    fetchExams();
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Здоровье сердца"
        action={
          <Button theme={showForm ? "tertiary" : "primary"} size="small" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Отмена" : "+ Добавить"}
          </Button>
        }
      />

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Дата обследования *</label>
            <input type="date" required value={form.examDate}
              onChange={(e) => setForm({ ...form, examDate: e.target.value })} />
          </div>
          {[
            { key: "ecg", label: "ЭКГ (электрокардиограмма)" },
            { key: "echo", label: "ЭхоКГ (эхокардиограмма)" },
            { key: "mri", label: "МРТ сердца" },
            { key: "ctAngio", label: "КТ-ангиография" },
          ].map(({ key, label }) => (
            <div key={key} className={styles.inputGroup}>
              <label>{label}</label>
              <textarea placeholder="Результаты и комментарии..."
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          <Button type="submit" loading={loading} fluid>
            {loading ? "Сохраняем..." : "Сохранить запись"}
          </Button>
        </form>
      )}

      <div className={styles.content}>
        {exams.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>❤️</p>
            <p>Нет записей. Добавьте первую!</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className={styles.examCard}>
              <div className={styles.examHeader}>
                <span className={styles.examDate}>
                  {new Date(exam.examDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <Button theme="ghost" size="small" square
                  onClick={async () => { await fetch(`/api/heart?id=${exam.id}`, { method: "DELETE" }); fetchExams(); }}>
                  🗑️
                </Button>
              </div>
              <div className={styles.examValues}>
                {exam.ecg && <div className={styles.examItem}><strong>ЭКГ:</strong> <span>{exam.ecg}</span></div>}
                {exam.echo && <div className={styles.examItem}><strong>ЭхоКГ:</strong> <span>{exam.echo}</span></div>}
                {exam.mri && <div className={styles.examItem}><strong>МРТ:</strong> <span>{exam.mri}</span></div>}
                {exam.ctAngio && <div className={styles.examItem}><strong>КТ-ангио:</strong> <span>{exam.ctAngio}</span></div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
