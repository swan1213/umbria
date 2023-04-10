import { ITINERLIST, PACCHLIST, LOGIN, LANGLIST, INIT_REDUX, USER_UPDATE } from './constant';

export function loginSuccess(userInfo, list) {
    return {
        type: LOGIN,
        payload: {userInfo, list}
    }
}

export function userInfoUpdate(userInfo) {
    return {
        type: USER_UPDATE,
        payload: userInfo
    }
}

export function PacchettiListChange(list) {
    return {
        type: PACCHLIST,
        payload: {list}
    }
}

export function LangListChange(list) {
    return {
        type: LANGLIST,
        payload: {list}
    }
}

export function ItinerartiListChange(list) {    
    return {
        type: ITINERLIST,
        payload: {list}
    }
}

export function PageRefresh(flag) {    
    return {
        type: ITINERLIST,
        payload: flag
    }
}

export function initialRedux(){
    return {
        type: INIT_REDUX
    }
}