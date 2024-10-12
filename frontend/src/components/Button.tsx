import styles from '@/components/Button.module.scss';
import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  type?: HTMLButtonElement['type'];
  children: React.ReactNode;
  href?: string;
  width?: React.CSSProperties['width'];
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = (props) => (
  <button
    onMouseDown={props.onMouseDown}
    onClick={props.onClick}
    disabled={props.disabled}
    type={props.type}
    className={styles.button}
    style={{ width: props.width, ...props.style }}
  >
    {props.children}
  </button>
);
