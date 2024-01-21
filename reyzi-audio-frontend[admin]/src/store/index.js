import { combineReducers } from "redux";

import adminReducer from "./admin/reducer";
import bannerReducer from "./banner/reducer";
import coinPlanReducer from "./coinPlan/reducer";
import vipPlanReducer from "./vipPlan/reducer";
import giftCategoryReducer from "./giftCategory/reducer";
import spinnerReducer from "./spinner/reducer";
import giftReducer from "./gift/reducer";
import songReducer from "./song/reducer";
import hashtagReducer from "./hashtag/reducer";
import levelReducer from "./level/reducer";
import userReducer from "./user/reducer";
import postReducer from "./post/reducer";
import videoReducer from "./video/reducer";
import followerReducer from "./follower/reducer";
import settingReducer from "./setting/reducer";
import advertisementReducer from "./advertisement/reducer";
import complainReducer from "./complain/reducer";
import redeemReducer from "./redeem/reducer";
import dashboardReducer from "./dashboard/reducer";
import reportedUserReducer from "./reportedUser/reducer";
import stickerReducer from "./sticker/reducer";
import themeReducer from './Theme/theme.reducer'
import fakeUserReducer from "./FakeUser/Reducer";
import fakeCommentReducer from "./fakeComment/reducer";

export default combineReducers({
  admin: adminReducer,
  user: userReducer,
  post: postReducer,
  banner: bannerReducer,
  song: songReducer,
  gift: giftReducer,
  video: videoReducer,
  level: levelReducer,
  sticker: stickerReducer,
  complain: complainReducer,
  redeem: redeemReducer,
  report: reportedUserReducer,
  dashboard: dashboardReducer,
  hashtag: hashtagReducer,
  followersFollowing: followerReducer,
  giftCategory: giftCategoryReducer,
  vipPlan: vipPlanReducer,
  coinPlan: coinPlanReducer,
  setting: settingReducer,
  advertisement: advertisementReducer,
  spinner: spinnerReducer,
  fakeUser: fakeUserReducer,
  Comment : fakeCommentReducer,
  theme : themeReducer,
});
