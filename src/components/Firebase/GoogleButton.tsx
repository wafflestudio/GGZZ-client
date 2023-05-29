import React from "react";
import styles from "./GoogleButton.module.scss";
import { signInWithGoogle } from "../../lib/firebase";

type GoogleButtonProps = {
  isLogin: boolean;
};
function GoogleButton({ isLogin }: GoogleButtonProps) {
  const handleOnClick = async () => {
    const res = await signInWithGoogle();
    console.log(res);
  };

  return (
    <div className={styles["container"]}>
      <button className={styles["btn"]} onClick={handleOnClick}>
        구글로 {isLogin ? "로그인" : "회원가입"} 하기
      </button>
    </div>
  );
}

export default GoogleButton;
