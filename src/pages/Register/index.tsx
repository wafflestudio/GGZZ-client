import styles from "./index.module.scss";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRegister } from "../../lib/hooks/apiHooks";
import titleImage from "../../assets/icon/ggzz_title.svg";
import GoogleButton from "../../components/Firebase/GoogleButton";
import { useRegisterInfoStore } from "../../store/useMyInfoStore";

export default function Register() {
  const navigate = useNavigate();
  const [PW, setPW] = useState<string>("");
  const [PWCheck, setPWCheck] = useState<string>("");
  const { username, setUsername, nickname, setNickname } = useRegisterInfoStore((state) => state);

  async function handleRegister() {
    if (!nickname || nickname.length < 2 || nickname.length > 10) {
      alert("닉네임을 올바르게 입력하세요");
      return;
    }
    if (!username || username.length < 4 || username.length > 16) {
      alert("아이디를 올바르게 입력하세요");
      return;
    }
    if (
      !PW ||
      !PWCheck ||
      PW.length < 8 ||
      PW.length > 20 ||
      PWCheck.length < 8 ||
      PWCheck.length > 20
    ) {
      alert("비밀번호와 비밀번호 확인을 올바르게 입력하세요");
      return;
    }
    // if (!email || !email.includes("@") || !email.includes(".")) {
    //   alert("이메일을 올바르게 입력하세요");
    //   return;
    // }
    if (PW !== PWCheck) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다");
      return;
    }

    try {
      const registerData = { username, password: PW, nickname };
      const res = await apiRegister(registerData);
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  }

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
        className={styles["register-form"]}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* 이메일 */}
        {/* <div className={styles["input-box"]}>
          <div className={styles["label-container"]}>
            <label>이메일</label>
          </div>
          <div className={styles["input-container"]}>
            <input
              // TODO: 유효성 검사
              className={styles["text"]}
              type="text"
              placeholder="이메일"
              value={email}
              maxLength={20}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
        </div> */}

        {/* 아이디 */}
        <div className={styles["input-box"]}>
          <div className={styles["label-container"]}>
            <label>아이디</label>
            <p className={styles["info"]}>4~16자 영문, 숫자</p>
          </div>
          <div className={styles["input-container"]}>
            <input
              className={`${styles["text"]} ${
                username && (username.length < 4 ? styles["caution"] : styles["pass"])
              }`}
              type="text"
              placeholder="아이디"
              value={username}
              maxLength={16}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          {username && username.length < 4 && (
            <p className={styles["caution"]}>4자 이상 입력하세요</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className={styles["input-box"]}>
          <div className={styles["label-container"]}>
            <label>비밀번호</label>
            <p className={styles["info"]}>8~20자 영문, 숫자</p>
          </div>
          <div className={styles["input-container"]}>
            <input
              className={styles["text"]}
              type="password"
              placeholder="비밀번호"
              value={PW}
              maxLength={20}
              onChange={(e) => {
                setPW(e.target.value);
              }}
            />
          </div>
          {PW && PW.length < 8 && <p className={styles["caution"]}>8자 이상 입력하세요</p>}
        </div>

        {/* 비밀번호 확인 */}
        <div className={styles["input-box"]}>
          <div className={styles["label-container"]}>
            <label>비밀번호 확인</label>
          </div>
          <div className={styles["input-container"]}>
            <input
              className={`${styles["text"]} ${
                PWCheck && (PW === PWCheck ? styles["pass"] : styles["caution"])
              }`}
              type="password"
              placeholder="비밀번호 확인"
              value={PWCheck}
              maxLength={20}
              onChange={(e) => {
                setPWCheck(e.target.value);
              }}
            />
          </div>
          {PWCheck && PW !== PWCheck && (
            <p className={styles["caution"]}>비밀번호가 일치하지 않습니다</p>
          )}
        </div>

        {/* 닉네임 */}
        <div className={styles["input-box"]}>
          <div className={styles["label-container"]}>
            <label>닉네임</label>
            <p className={styles["info"]}>2~10자</p>
          </div>

          <div className={styles["input-container"]}>
            <input
              className={`${styles["text"]} ${
                nickname && (nickname.length < 2 ? styles["caution"] : styles["pass"])
              }`}
              type="text"
              placeholder="닉네임"
              value={nickname}
              maxLength={10}
              onChange={(e) => {
                setNickname(e.target.value);
              }}
            />
          </div>
          {nickname && nickname.length < 2 && (
            <p className={styles["caution"]}>2자 이상 입력하세요</p>
          )}
        </div>

        <div className={styles["submit-btn"]}>
          <input
            type="submit"
            value="회원가입"
            className={styles["text"]}
            onClick={handleRegister}
          />
        </div>
      </form>
      <div>
        <GoogleButton isLogin={false} />
      </div>
    </div>
  );
}
