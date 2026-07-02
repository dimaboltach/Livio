import { createElement, HTMLAttributes, ReactNode } from "react";
import classnames from "classnames/bind";

import st from "./TextLivio.module.scss";

const cn = classnames.bind(st);

export type TTextSize =
  | ""
  | "l"
  | "m"
  | "base"
  | "s"
  | "caption"
  | "labelM"
  | "labelS"
  | "tapBar";

export type TTextWeight =
  | "light"
  | "w300"
  | "normal"
  | "w400"
  | "medium"
  | "w500"
  | "semiBold"
  | "w600"
  | "bold"
  | "w700"
  | "extraBold"
  | "w800"
  | "black"
  | "w900";

export type TTextColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "brand"
  | "error"
  | "success"
  | "white";

export type TTextTag =
  | "p"
  | "span"
  | "div"
  | "label"
  | "li"
  | "ol"
  | "section"
  | "aside";

export interface ITextLivioProps extends HTMLAttributes<HTMLElement> {
  as?: TTextTag;
  size?: TTextSize;
  weight?: TTextWeight;
  color?: TTextColor;
  uppercase?: boolean;
  ellipsis?: boolean;
  children?: ReactNode;
}

/**
 * Компонент для текстовых блоков.
 * Адаптация TextStoloto из gosloto-web под проект Livio.
 *
 * Размеры:
 * - l      → 18px / 24px (на мобайле 16px / 20px)
 * - base/m → 16px / 20px (на мобайле 14px / 18px)
 * - s      → 12px / 16px
 * - caption / labelM → 12px / 16px
 * - labelS → 10px / 14px
 * - tapBar → 10px / 12px
 */
const TextLivio = ({
  as = "p",
  size = "",
  weight,
  color,
  uppercase,
  ellipsis,
  className,
  children,
  ...rest
}: ITextLivioProps) =>
  createElement(
    as,
    {
      className: cn(size, weight, color, { uppercase, ellipsis }, className),
      ...rest,
    },
    children
  );

export default TextLivio;
