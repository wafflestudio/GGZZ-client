import styles from "./GoogleButton.module.scss";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "utils/firebase";
import { useRegisterInfoStore } from "store/useMyInfoStore";

type GoogleButtonProps = {
  isLogin: boolean;
};
function GoogleButton({ isLogin }: GoogleButtonProps) {
  const { setUsername, setNickname } = useRegisterInfoStore((state) => state);
  const navigate = useNavigate();
  const handleOnClick = async () => {
    const res = await signInWithGoogle();
    if (res === undefined) {
      alert("구글 로그인에 실패했습니다.\n" + "다시 시도해주세요.");
      return;
    }
    if (isLogin === false) {
      const email = res.user.email;
      if (email) {
        setUsername(email.split("@")[0]);
      } else {
        setUsername("");
      }
      setNickname(res.user.displayName || "");
      alert("구글 로그인에 성공했습니다. 회원정보 기입을 완료해주세요.");
    }
    if (isLogin === true) {
      alert("구글 로그인에 성공했습니다.");
      // TODO: 소셜 로그인 엔드포인트에 토큰 전달
      // 자체 JWT 토큰 발급
      // 1. 성공시 홈화면
      // 2. 실패시 회원가입 화면으로 이동
      navigate("/");
    }
    // 세션 스토리지에 토큰 저장
    sessionStorage.setItem("accessToken", await res.user.getIdToken());
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
