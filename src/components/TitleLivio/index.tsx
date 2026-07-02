import { createElement, PropsWithChildren } from "react";
import classnames from "classnames/bind";

import st from "./TitleLivio.module.scss";

const cn = classnames.bind(st);

export type TTitleSize = "h1" | "h2" | "h3" | "h4";
export type TTitleColor = "primary" | "secondary" | "brand" | "white";

export interface ITitleLivioProps {
  as?: "h1" | "h2" | "h3" | "h4" | "div" | "span" | "p";
  size?: TTitleSize;
  color?: TTitleColor;
  uppercase?: boolean;
  className?: string;
}

/**
 * Компонент для заголовков.
 * Адаптация TitleStoloto из gosloto-web под проект Livio.
 *
 * Размеры (десктоп → мобайл):
 * - h1 → 36px/40px → 24px/28px
 * - h2 → 24px/28px → 20px/24px
 * - h3 → 20px/24px → 16px/20px
 * - h4 → 16px/20px → 14px/16px
 */
const TitleLivio = ({
  as,
  size = "h1",
  color,
  uppercase,
  className,
  children,
  ...rest
}: PropsWithChildren<ITitleLivioProps>) =>
  createElement(
    as ?? size,
    {
      className: cn(size, color, { uppercase }, className),
      ...rest,
    },
    children
  );

export default TitleLivio;
