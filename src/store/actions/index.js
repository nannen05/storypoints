import { FETCH_USER, AUTH_USER } from "./types";

import { db, firebase } from '../../firebase'

export const fetchUser = (uid) => async dispatch => {
	db.getCurrentUser(uid).on("value", snapshot => {
		dispatch({
			type: FETCH_USER,
			payload: snapshot.val()
		})	
	})
}

// export const userAuthed = () => {
// 	firebase.auth.onAuthStateChanged(authUser => {
// 		if(authUser) {
// 			dispatch({
// 				type: AUTH_USER,
// 				payload: true
// 			})
// 		}
// 	})
// }


