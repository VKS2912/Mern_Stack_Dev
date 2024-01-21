import React, { useEffect } from "react";

// js
import "../assets/js/main.min.js";

//router
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";

// css
import "../assets/css/main.min.css";
import "../assets/css/custom.css";

// component
import Navbar from "../component/navbar/Navbar";
import Topnav from "../component/navbar/Topnav";
import BannerTable from "../component/table/Banner";
import CoinPlanTable from "../component/table/CoinPlan";
import PurchaseCoinPlanHistoryTable from "../component/table/PurchaseCoinPlanHistory";
import VIPPlanTable from "../component/table/VIPPlan";
import PurchaseVIPPlanTable from "../component/table/PurchaseVipPlanHistory";
import GiftCategoryTable from "../component/table/GiftCategory";
import GiftTable from "../component/table/Gift";
import SongTable from "../component/table/Song";
import SongDialog from "../component/dialog/Song";
import GiftDialog from "../component/dialog/Gift/Add";
import HashtagTable from "../component/table/Hashtag";
import LevelTable from "../component/table/Level";
import UserTable from "../component/table/User";
import PostTable from "../component/table/Post";
import VideoTable from "../component/table/Video";
import UserDetail from "./UserDetail";
import UserHistory from "./UserHistory";
import PostDetail from "./PostDetail";
import VideoDetail from "./VideoDetail";
import Dashboard from "./Dashboard";
import Setting from "./Settings";
import ThemeTable from "../component/table/Theme.js";
import Advertisement from "../component/table/Advertisement";
import PendingComplainTable from "../component/table/PendingComplain";
import SolvedComplainTable from "../component/table/SolvedComplain";
import PendingRedeemTable from "../component/table/PendingRedeem";
import AcceptedRedeemTable from "../component/table/AcceptedRedeem";
import DeclineRedeemTable from "../component/table/DeclineRedeem";
import ReportedUserTable from "../component/table/ReportedUser";
import StickerTable from "../component/table/Sticker";
// import FakeUser from "../component/table/FakeUser";
// import FakeUserPage from "../component/dialog/FakeUserPage";
// import FakePost from "../component/table/FakePost";
// import FakeVideo from "../component/table/FakeVideo";
// import FakePostPage from "../component/dialog/FakePostPage";
// import FakeVideoPage from "../component/dialog/FakeVideoPage";

//loader
import Spinner from "./Spinner";
import Profile from "./Profile.js";
import FakeComment from "../component/table/FakeComment.js";



const Admin = () => {
  const location = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    if (history.location.pathname === "/admin") {
      history.push("/admin/dashboard");
    } // eslint-disable-next-line
  }, []);

  return (
    <>
      <div class="page-container">
        <Navbar />
        <div class="page-content">
          <Topnav />
          <div class="main-wrapper">
            <Switch>
              <Route
                path={`${location.path}/dashboard`}
                exact
                component={Dashboard}
              />
              <Route
                path={`${location.path}/profile`}
                exact
                component={Profile}
              />
              <Route
                path={`${location.path}/banner`}
                exact
                component={BannerTable}
              />
              <Route
                path={`${location.path}/coinplan`}
                exact
                component={CoinPlanTable}
              />
              <Route
                path={`${location.path}/coinplan/history`}
                exact
                component={PurchaseCoinPlanHistoryTable}
              />
              <Route
                path={`${location.path}/vipplan`}
                exact
                component={VIPPlanTable}
              />
              <Route
                path={`${location.path}/vipplan/history`}
                exact
                component={PurchaseVIPPlanTable}
              />
              <Route
                path={`${location.path}/giftCategory`}
                exact
                component={GiftCategoryTable}
              />
              <Route
                path={`${location.path}/theme`}
                exact
                component={ThemeTable}
              />
              <Route
                path={`${location.path}/giftCategory/gift`}
                exact
                component={GiftTable}
              />
              <Route
                path={`${location.path}/giftCategory/gift/dialog`}
                exact
                component={GiftDialog}
              />
              <Route
                path={`${location.path}/gift`}
                exact
                component={GiftTable}
              />
              <Route
                path={`${location.path}/gift/dialog`}
                exact
                component={GiftDialog}
              />
              <Route
                path={`${location.path}/song`}
                exact
                component={SongTable}
              />
              <Route
                path={`${location.path}/song/dialog`}
                exact
                component={SongDialog}
              />
              <Route
                path={`${location.path}/hashtag`}
                exact
                component={HashtagTable}
              />
              <Route
                path={`${location.path}/level`}
                exact
                component={LevelTable}
              />
              <Route
                path={`${location.path}/user`}
                exact
                component={UserTable}
              />
              {/* <Route
                path={`${location.path}/fakeUser`}
                exact
                component={FakeUser}
              />
              <Route
                path={`${location.path}/fake/fakeUserdialog`}
                exact
                component={FakeUserPage}
              /> */}
              <Route
                path={`${location.path}/user/detail`}
                exact
                component={UserDetail}
              />
              <Route
                path={`${location.path}/user/history`}
                exact
                component={UserHistory}
              />

              <Route
                path={`${location.path}/post`}
                exact
                component={PostTable}
              />
              <Route
                path={`${location.path}/post/detail`}
                exact
                component={PostDetail}
              />
              {/* <Route
                path={`${location.path}/post/dialog`}
                exact
                component={FakePostPage}
              />
                <Route
                path={`${location.path}/post/fake`}
                exact
                component={FakePost}
              /> */}
              <Route
                path={`${location.path}/video`}
                exact
                component={VideoTable}
              />
                 {/* <Route
                path={`${location.path}/video/fake`}
                exact
                component={FakeVideo}
              /> */}
              <Route
                path={`${location.path}/setting`}
                exact
                component={Setting}
              />
              <Route
                path={`${location.path}/video/detail`}
                exact
                component={VideoDetail}
              />
              <Route
                path={`${location.path}/reportedUser`}
                exact
                component={ReportedUserTable}
              />
              <Route
                path={`${location.path}/advertisement`}
                exact
                component={Advertisement}
              />
              <Route
                path={`${location.path}/pendingComplain`}
                exact
                component={PendingComplainTable}
              />
              <Route
                path={`${location.path}/solvedComplain`}
                exact
                component={SolvedComplainTable}
              />
              <Route
                path={`${location.path}/pendingRedeem`}
                exact
                component={PendingRedeemTable}
              />
              <Route
                path={`${location.path}/acceptedRedeem`}
                exact
                component={AcceptedRedeemTable}
              />
              <Route
                path={`${location.path}/declineRedeem`}
                exact
                component={DeclineRedeemTable}
              />
              <Route
                path={`${location.path}/sticker`}
                exact
                component={StickerTable}
              />
              {/* <Route
                path={`${location.path}/post/dialog`}
                exact
                component={FakePostPage}
              />
              <Route
                path={`${location.path}/post/fake`}
                exact
                component={FakePost}
              />

              <Route
                path={`${location.path}/video/fake`}
                exact
                component={FakeVideo}
              />
              <Route
                path={`${location.path}/video/dialog`}
                exact
                component={FakeVideoPage}
              />*/}
                <Route
                path={`${location.path}/comment`}
                exact
                component={FakeComment}
              /> 
            </Switch>
            <Spinner />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
