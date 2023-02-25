import styles from "./index.module.scss";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [ID, setID] = useState("");
  const [PW, setPW] = useState("");

  // TODO: 로그인 유지 추가
  // const handleLogin = async () => {
  //   const data = {
  //     id: ID,
  //     password: PW,
  //   };
  //   try {
  //     await dispatch(login(data));
  //     if (redirect) navigate(redirect);
  //     else navigate("/");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  const handleLogin = () => {
    if (redirect) navigate(redirect);
    else navigate("/");
    console.log();
  };

  return (
    <div id="container" className={styles["login"]}>
      <h1 className={styles["logo"]}>
        <Link to="/">(서비스이름)</Link>
      </h1>
      <p className={styles["input"]}>
        <input
          type="text"
          name="userid"
          className={styles["text"]}
          placeholder="아이디"
          value={ID}
          onChange={(e) => setID(e.target.value)}
        />
      </p>
      <p className={styles["input"]}>
        <input
          type="password"
          name="password"
          className={styles["text"]}
          placeholder="비밀번호"
          value={PW}
          onChange={(e) => setPW(e.target.value)}
        />
      </p>
      <input type="hidden" name="redirect" value="/" />
      <p className={styles["submit"]}>
        <input type="submit" value="로그인" className={styles["text"]} onClick={handleLogin} />
      </p>
      <p className={styles["register"]}>
        <Link to="/register">(서비스이름) 회원가입하기</Link>
      </p>
    </div>
  );
}
