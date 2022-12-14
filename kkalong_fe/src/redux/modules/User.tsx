import { handleActions } from "redux-actions";
import { Dispatch } from 'redux';
import axios from "../../api/axios";
import requests from '../../api/requests'
import { otherUserType, UserType } from "../../pages/MyPage/MyPage";

// User 정보 조회
const GET_LOGIN_PENDING = 'Profile/GET_LOGIN_PENDING' 
const GET_LOGIN_SUCCESS = 'Profile/GET_LOGIN_SUCCESS' 
const GET_LOGIN_FAILURE = 'Profile/GET_LOGIN_FAILURE' 

const FOLLOW_SUCCESS = 'Profile/FOLLOW_SUCCESS'
const PROFILE_CHANGE_SUCCESS = 'Profile/PROFILE_CHANGE_SUCCESS'
const LOVER_ID_SUCCESS = 'Profile/LOVER_ID_SUCCESS'
const LOVING_SUCCESS = 'Profile/LOVING_SUCCESS'
const CHANGE_USER_PROFILE = 'Profile/CHANGE_USER_PROFILE'
const CHANGE_USER_BODY = 'Profile/CHANGE_USER_BODY'
const CHANGE_USER_FACE = 'Profile/CHANGE_USER_FACE'


// 다른유저 정보 조희
const GET_OTHER_PENDING = 'Profile/GET_OTHER_PENDING' 
const GET_OTHER_SUCCESS = 'Profile/GET_OTHER_SUCCESS' 
const GET_OTHER_FAILURE = 'Profile/GET_OTHER_FAILURE' 

export interface UpdataProfile {
  nickname : string
  gender : string
  age : number
  height : number
  weight : number
}

export interface stateType {
  pending: boolean,
  error: boolean,
  User: UserType,
  otherUser: otherUserType
}

// 초기값 설정
const initialState: stateType = {
  pending: false,
  error: false,
  User: {} as UserType,
  otherUser: {} as otherUserType
}

// 상위 3개 게시물 표시
export const login = (email: string, password: string) => async (dispatch: Dispatch) => {
  dispatch({type: GET_LOGIN_PENDING})

  const data = {
    email: email,
    password: password
  }
  await axios.post(requests.login, data)
    .then(res => {
      const token = res.data.result;
      localStorage.setItem("token", JSON.stringify(token.token));
      localStorage.setItem("userProfile", JSON.stringify(token.user));
      dispatch({type:GET_LOGIN_SUCCESS, payload: token.user})
    }).catch(err => {
      dispatch({type:GET_LOGIN_FAILURE})
    })
}

// 사진 바꾸기
export const ProfileChange = (img: File) => async (dispatch: Dispatch) => {
  const formdata = new FormData()
  formdata.append('profile_img', img)

  const res = await axios.post(requests.changeImg, formdata, {headers: {'Context-type': "multipart/form-data"}})
  dispatch({type: PROFILE_CHANGE_SUCCESS, payload: res.data.profile_img})
}

// 다른이의 페이지 보여주기
export const otherProfile = (user_id: number) => async (dispatch: Dispatch) => {
  dispatch({type: GET_OTHER_PENDING})

  await axios.get(requests.otherProfile + String(user_id))
    .then(res => {
      dispatch({type: GET_OTHER_SUCCESS, payload: res.data.user})
    }).catch(err=> {
      dispatch({type:GET_OTHER_FAILURE})
    })
}

// 팔로우 요청
export const follow = (user_id: string) => async (dispatch: Dispatch) => {
  await axios.post(requests.follow + user_id)
    .then(res => {
      dispatch({type: FOLLOW_SUCCESS, payload: res.data.followings})
    })
}

// 애인 신청
export const lover = (user_id: string, req: boolean) => async (dispatch:Dispatch) => {
  await axios.post(requests.loving + user_id)
    .then(res => {
      if (req) {
        dispatch({type: LOVING_SUCCESS, payload: res.data.loving[0]})
      } else {
        dispatch({type: LOVER_ID_SUCCESS, payload: res.data.loving[0]})
      }
      
    })
}

// 유저 정보 변경
export const ChangeProfile = (data: UpdataProfile) => async (dispatch: Dispatch) => {
  const res = await axios.post(requests.updateProfile, data)
  dispatch({type: CHANGE_USER_PROFILE, payload: res.data.user})
} 

// body_img 등록
export const ChangeBody = (data: FormData, user_id: number) => async (dispatch: Dispatch) => {
  const res = await axios.post(requests.bodyImg, data, {headers: {"Content-Type": "multipart/form-data"}})
  dispatch({type:CHANGE_USER_BODY, payload: res.data.body_img})
}

export const ChangeFace = (data: FormData) => async (dispatch: Dispatch) => {
  const res = await axios.post(requests.faceImg, data, {headers: {"Content-Type": "multipart/form-data"}})
  dispatch({type:CHANGE_USER_BODY, payload: res.data.body_img})
}
// 액션에 따른 state 변경 
export default handleActions({
  [GET_LOGIN_PENDING]: (state, action) => {
    // 반환해줄 데이터
    return {
      ...state,
      pending: true,
      error: false,
    }
  },
  [GET_LOGIN_SUCCESS]: (state, {payload}) => {
    const adjust: UserType = payload as unknown as UserType
    console.log(adjust)
    return {
      ...state,
      pending: false,
      User: adjust
    };
  },
  [GET_LOGIN_FAILURE]: (state, action) => {
    return {
      ...state,
      pending: false,
      error: true
    };
  },
  [GET_OTHER_PENDING]: (state, action) => {
    // 반환해줄 데이터
    return {
      ...state,
      pending: true,
      error: false,
    }
  },
  [GET_OTHER_SUCCESS]: (state, {payload}) => {
    const adjust: otherUserType = payload as unknown as otherUserType
    return {
      ...state,
      pending: false,
      otherUser: adjust
    };
  },
  [GET_OTHER_FAILURE]: (state, action) => {
    return {
      ...state,
      pending: false,
      error: true
    };
  },
  [FOLLOW_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      User: {
        ...state.User,
        followings: payload as unknown as Array<number>  
      }
    }
  },
  [PROFILE_CHANGE_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      User: {
        ...state.User,
        profile_img: payload as unknown as string
      }
    }
  },
  // 연애중 설정
  [LOVING_SUCCESS]: (state, {payload}) => {
    const adjust = payload as unknown as number
    return {
      ...state,
      User: {
        ...state.User,
        loving: true,
        lover_id: (adjust !== undefined ? adjust : -1)
      }
    }
  },
  [LOVER_ID_SUCCESS]: (state, {payload}) => {
    const adjust = payload as unknown as number
    return {
      ...state,
      User: {
        ...state.User,
        lover_id: (adjust !== undefined ? adjust : -1)
      }
    }
  },
  [CHANGE_USER_PROFILE]: (state, {payload}) => {
    const adjust = payload as unknown as UserType
    return {
      ...state,
      User: {
        ...state.User,
        nickname: adjust.nickname,
        age: adjust.age,
        height: adjust.height,
        weight: adjust.weight
      }
    }
  },
  [CHANGE_USER_BODY]: (state, {payload}) => {
    const adjust = payload as unknown as string
    return {
      ...state,
      User: {
        ...state.User,
        body_img: adjust
      }
    }
  },
  [CHANGE_USER_FACE]: (state, {payload}) => {
    const adjust = payload as unknown as string
    return {
      ...state,
      User: {
        ...state.User,
        face_img: adjust
      }
    }
  },
}, initialState)
