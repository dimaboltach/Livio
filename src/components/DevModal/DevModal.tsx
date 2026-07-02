"use client";

import styles from "./DevModal.module.scss";

interface DevModalProps {
  onClose: () => void;
}

export default function DevModal({ onClose }: DevModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}>🔧</div>
        <h3>В разработке</h3>
        <p>Данная функция находится в разработке и будет доступна в ближайшее время.</p>
        <button className={styles.closeBtn} onClick={onClose}>
          Понятно
        </button>
      </div>
    </div>
  );
}
