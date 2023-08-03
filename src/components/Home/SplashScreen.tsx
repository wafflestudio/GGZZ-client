import styles from "./SplashScreen.module.scss";
import { Link } from "react-router-dom";
import titleImage from "assets/icon/ggzzTitle/ggzz_title.svg";

export default function SplashScreen() {
  return (
    <div className={styles["container"]}>
      <h1 className={styles["title"]}>
        <Link className={styles["logo"]} to="/">
          <img src={titleImage} />
        </Link>
        <div className={styles["marker"]}></div>
        <div className={styles["marker-endpoint"]}></div>
        <h2 className={styles["subtitle"]}></h2>
      </h1>
    </div>
  );
}
