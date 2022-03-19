import React from 'react';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';

const Button = (props) => {
  return (
    <div>
      <Link to={props.path}>
        <button className={styles.btn} style={{ backgroundColor: props.color }}>
          {props.name}
        </button>
      </Link>
    </div>
  );
};

export default Button;
