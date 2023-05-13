import styles from "./NavigationTab.module.scss";
import { Link } from "react-router-dom";
import writeIcon from "../../assets/icon/Home/NavigationTab/write.svg";
import BlueWriteIcon from "../../assets/icon/Home/NavigationTab/write_blue.svg";
import mapIcon from "../../assets/icon/Home/NavigationTab/map.svg";
import BlueMapIcon from "../../assets/icon/Home/NavigationTab/map_blue.svg";
import mypageIcon from "../../assets/icon/Home/NavigationTab/mypage.svg";
import useNavigationTabStore from "../../store/useNavigationTabStore";

export default function NavigationTab() {
  const currentTabId = useNavigationTabStore((state) => state.currentTabId);
  const setCurrentTabId = useNavigationTabStore((state) => state.setCurrentTabId);
  return (
    <nav>
      <ul className={styles["menus"]}>
        <li id="1" className={currentTabId === 1 ? styles["currentTab"] : ""}>
          <Link
            to="/send"
            onClick={() => {
              setCurrentTabId(1);
            }}
          >
            <img src={currentTabId === 1 ? BlueWriteIcon : writeIcon} />
            <p className={styles["menu-name"]}>끄적이기</p>
          </Link>
        </li>
        <li id="2" className={currentTabId === 2 ? styles["currentTab"] : ""}>
          <Link
            to="/"
            onClick={() => {
              setCurrentTabId(2);
            }}
          >
            <img src={currentTabId === 2 ? BlueMapIcon : mapIcon} />
            <p className={styles["menu-name"]}>지도</p>
          </Link>
        </li>
        <li id="3" className={currentTabId === 3 ? styles["currentTab"] : ""}>
          {/* 마이페이지는 일단 클릭 이벤트X 처리 */}
          <Link
            to="/mypage"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <img src={mypageIcon} />
            <p className={styles["menu-name"]}>마이페이지</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
