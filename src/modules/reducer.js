import { ITINERLIST, PACCHLIST, LANGLIST, LOGIN, PAGE_REFRESH, INIT_REDUX, USER_UPDATE } from './constant';

const defaultState = {
  userInfo: {},
  email: "",
  password: "",
  onPageRefresh: false,
  loginSuccess: false,
  pacchettiList: [],
  itinerariList: [],
  languageList: [],
  purchaseList: []
};

function chatReducer(state = defaultState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        userInfo: action.payload.userInfo,
        purchaseList: action.payload.list,
        loginSuccess: true,
      };
    case USER_UPDATE:
      return {
        ...state,
        userInfo: action.payload,
      };
    case PACCHLIST:
      return {
        ...state,
        pacchettiList: action.payload.list,
      };
    case LANGLIST:
      return {
        ...state,
        languageList: action.payload.list,
      };
    case ITINERLIST:
      return {
        ...state,
        itinerariList: action.payload.list,
      };
    case PAGE_REFRESH:
      return {
        ...state,
        onPageRefresh: action.payload,
      };
    case INIT_REDUX:
      return {
        ...state
      };
    default:
      return state;
  }
}

export default chatReducer;
// export default createStore(chatStore);