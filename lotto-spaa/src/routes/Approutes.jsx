import { Routes, Route } from "react-router";
import SignIn from "../pages/login";
import SignUp from "../pages/createAccount";
import NotFound from "../pages/NotFound";
import Landing from "../pages/LandingPage";
import DrawPage from "../pages/DrawPage";
import AccountProfilePage from "../pages/AccountProfile";
import History from "../pages/DrawHistoryPage";
import Notification from "../components/DisplayWinningNotification";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Landing />} /> 
      <Route path="/home" element={<DrawPage />} />
      <Route path="/profile" element={<AccountProfilePage />} />
      <Route path="/history" element={<History />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="*" element={<NotFound />} />
  </Routes>
  );
};

export default AppRoutes;
