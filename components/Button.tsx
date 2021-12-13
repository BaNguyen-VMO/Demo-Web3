import clsx from 'clsx';
import React from 'react';
import styles from '../styles/Button.module.css';

interface ButtonProps {
  children: any;
  className?: string;
  onClick?: () => any;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...rest }) => {
  return (
    <button className={clsx(styles.button, className)} {...rest}>
      {children}
    </button>
  );
};

export default Button;
