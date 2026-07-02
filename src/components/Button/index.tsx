"use client";

import {
  ComponentPropsWithRef,
  MouseEventHandler,
  PropsWithChildren,
  SyntheticEvent,
} from "react";
import classnames from "classnames/bind";
import Link from "next/link";

import st from "./Button.module.scss";

const cn = classnames.bind(st);

export type TButtonTheme =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "danger";

export type TButtonSize = "default" | "large" | "medium" | "small" | "none";

export interface IButtonProps
  extends Omit<ComponentPropsWithRef<"button">, "onClick"> {
  theme?: TButtonTheme;
  size?: TButtonSize;
  fluid?: boolean;
  square?: boolean;
  circle?: boolean;
  uppercase?: boolean;
  loading?: boolean;
  href?: string;
  external?: boolean;
  onClick?: (event: SyntheticEvent) => void;
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  className?: string;
  disabledClassName?: string;
}

const Button = ({
  theme = "primary",
  size = "default",
  fluid,
  square,
  circle,
  uppercase,
  loading,
  href,
  external,
  disabled,
  className,
  disabledClassName,
  children,
  onClick,
  onMouseEnter,
  type = "button",
  ...rest
}: PropsWithChildren<IButtonProps>) => {
  const isDisabled = disabled || loading;

  const buttonClass = cn(
    "button",
    theme,
    {
      fluid,
      square,
      circle,
      loading,
      uppercase,
      disabled: isDisabled,
      [`${size}Size`]: !(square || circle) && size !== "none",
      [`square${size.charAt(0).toUpperCase() + size.slice(1)}Size`]:
        square || circle,
    },
    className,
    isDisabled && disabledClassName
  );

  if (href) {
    const linkProps = external
      ? { href, target: "_blank", rel: "noopener noreferrer" }
      : { href };
    return (
      <Link
        {...linkProps}
        className={buttonClass}
        aria-disabled={isDisabled}
        onMouseEnter={onMouseEnter}
        onClick={isDisabled ? (e) => e.preventDefault() : onClick as never}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      type={type}
      className={buttonClass}
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </button>
  );
};

export default Button;
