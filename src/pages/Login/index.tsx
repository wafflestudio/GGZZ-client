import styles from "./index.module.scss";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { apiLogin } from "../../lib/hooks/apiHooks";
import titleImage from "../../assets/icon/ggzz_title.svg";
import GoogleButton from "../../components/Firebase/GoogleButton";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [ID, setID] = useState("");
  const [PW, setPW] = useState("");

  // TODO: 로그인 유지 추가
  const handleLogin = async () => {
    try {
      const loginData = {
        username: ID,
        password: PW,
      };
      const res = await apiLogin(loginData);
      if (redirect) navigate(redirect);
      else navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles["container"]}>
      <h1 className={styles["title"]}>
        <Link className={styles["logo"]} to="/">
          <img src={titleImage} />
        </Link>
        <div className={styles["marker"]}></div>
        <div className={styles["marker-endpoint"]}></div>
      </h1>

      <form
        className={styles["login-form"]}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className={styles["input-container"]}>
          <input
            type="text"
            name="userid"
            className={styles["text"]}
            placeholder="아이디"
            value={ID}
            onChange={(e) => setID(e.target.value)}
          />
        </div>

        <div className={styles["input-container"]}>
          <input
            type="password"
            name="password"
            className={styles["text"]}
            placeholder="비밀번호"
            value={PW}
            onChange={(e) => setPW(e.target.value)}
          />
        </div>

        <div className={styles["submit-btn"]}>
          <input type="submit" value="로그인" className={styles["text"]} onClick={handleLogin} />
        </div>
      </form>

      <div>
        <GoogleButton isLogin />
      </div>
      <div className={styles["register-link"]}>
        <Link to="/register">회원가입</Link>
      </div>
    </div>
  );
}
