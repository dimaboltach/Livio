import styles from "./page.module.scss";
import Button from "@/components/Button";
import TitleLivio from "@/components/TitleLivio";
import TextLivio from "@/components/TextLivio";

const features = [
  { icon: "🩺", title: "Запись к врачу", desc: "Вызов врача на дом за несколько кликов" },
  { icon: "🐾", title: "Ветеринар", desc: "Помощь вашим питомцам рядом" },
  { icon: "💊", title: "Аптека", desc: "Каталог лекарств и добавок" },
  { icon: "🥗", title: "Питание", desc: "Дневник блюд и рекомендации" },
  { icon: "📊", title: "Здоровье", desc: "Метрики тела, вода, сердце, цикл" },
];

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      <div className={styles.hero}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>❤️</div>
          <span className={styles.logoText}>livio</span>
        </div>
        <TitleLivio size="h1" className={styles.heroTitle}>
          Ваше здоровье —<br />наша забота
        </TitleLivio>
        <TextLivio size="l" color="secondary" className={styles.heroSubtitle}>
          Управляйте здоровьем, записывайтесь к врачам<br />и следите за самочувствием
        </TextLivio>
      </div>

      <div className={styles.features}>
        {features.map((f) => (
          <div key={f.title} className={styles.featureItem}>
            <div className={styles.featureIcon}>{f.icon}</div>
            <div className={styles.featureText}>
              <TitleLivio size="h4" as="h3">{f.title}</TitleLivio>
              <TextLivio size="s" color="secondary" as="p">{f.desc}</TextLivio>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Button href="/login" theme="primary" size="default" fluid>
          Войти
        </Button>
        <Button href="/register" theme="tertiary" size="default" fluid>
          Зарегистрироваться
        </Button>
      </div>
    </div>
  );
}
