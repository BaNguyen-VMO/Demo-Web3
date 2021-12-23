import clsx from 'clsx';
import React from 'react';
import styles from '../styles/Input.module.css';

interface InputProps {
  className?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e?: any) => any;
  onBlur?: (e?: any) => any;
}

const Input: React.FC<InputProps> = ({ className, ...rest }) => {
  return <input className={clsx(styles.input__base, className)} {...rest} />;
};

export default Input;
