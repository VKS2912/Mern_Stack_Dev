import {
  BLOCK_UNBLOCK_SWITCH,
  GET_HISTORY,
  EDIT_COIN,
  GET_FAKE_USER,
  GET_COUNTRY,
  INSERT_FAKE_USER,
  EDIT_FAKE_USER,
} from "./Type";

const initialState = {
  user: [],
  male: 0,
  female: 0,
  totalUser: 0,
  activeUser: 0,
  history: [],
  country: [],
  link:[],
  totalHistoryUser: 0,
  income: 0,
  outgoing: 0,
  totalCallCharge: 0,
  liveStreamingIncome: 0,
};

const fakeUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FAKE_USER:
      return {
        ...state,
        user: action.payload.user,
        male: action.payload.male,
        female: action.payload.female,
        totalUser: action.payload.total,
        activeUser: action.payload.activeUser,
      };

    case BLOCK_UNBLOCK_SWITCH:
      return {
        ...state,
        user: state.user.map((user) => {
          if (user._id === action.payload._id)
            return {
              ...user,
              isBlock: action.payload.isBlock,
            };
          else return user;
        }),
      };

    case GET_HISTORY:
      return {
        ...state,
        history: action.payload.history,
        totalHistoryUser: action.payload.total,
        income: action.payload.incomeTotal,
        outgoing: action.payload.outgoingTotal,
        totalCallCharge: action.payload.totalCallCharge,
        liveStreamingIncome: action.payload.income,
      };
    case EDIT_COIN:
      return {
        ...state,
        user: state.user.map((user) => {
          if (user._id === action.payload.id) return action.payload.data;
          else return user;
        }),
      };

    case GET_COUNTRY:
      return {
        ...state,
        country: action.payload,
      };
    case INSERT_FAKE_USER:
      const data = [...state.user];
      data.unshift(action.payload);
      return {
        ...state,
        user: data,
        link: action.payload,
      };
    case EDIT_FAKE_USER:
      return {
        ...state,
        user: state.user.map((user) => {
          if (user._id === action.payload.id) return action.payload.data;
          else return user;
        }),
      };

    default:
      return state;
  }
};

export default fakeUserReducer;
