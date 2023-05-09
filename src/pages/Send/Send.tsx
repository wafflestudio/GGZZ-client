import styles from "./Send.module.scss";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

const Send = () => {
  const navigate = useNavigate();

  return <div className={styles.send}></div>;
};

export default Send;
