import React from "react";
import { Routes, Route, Navigate, useParams, useSearchParams } from "react-router-dom";
import { apiLogin } from "./hooks/apiHooks";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Receive from "./pages/Receive/Receive";
import Register from "./pages/Register";
import Send from "./pages/Send/Send";

function InValidateURL() {
  return <Navigate to="/" />;
}

const checkLoginnedOrNot = () => {
  throw new Error();
};

function LoginAndRedirectPage({ redirectPath }: { redirectPath: string }) {
  const params = useParams();
  const paramPath = Object.values(params).join("/");
  const [searchParams] = useSearchParams();
  const searchParamsPath = searchParams.toString();
  return (
    <Navigate
      to={`/login?redirect=${redirectPath}${params ? "/" + paramPath : ""}${
        searchParamsPath ? "?" + searchParamsPath : ""
      }`}
    />
  );
}

const redirectLoginPageIfNotLoginned = async (page: JSX.Element, redirectPath: string) => {
  try {
    const dummyData = { username: "121213", password: "1331432" };
    const res = await apiLogin(dummyData); // TODO: api 연결 후 수정
    // checkLoginnedOrNot();
    return page;
  } catch (e) {
    return <LoginAndRedirectPage redirectPath={redirectPath} />;
  }
};
// 사용 예시: <Route path="/send" element={redirectLoginPageIfNotLoginned(<Send />, '/send')} />

function App() {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/send" element={<Send />} />
      <Route path="/receive" element={<Receive />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<InValidateURL />} />
    </Routes>
  );
}

export default App;
