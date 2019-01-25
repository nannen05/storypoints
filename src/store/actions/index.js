import { FETCH_USER} from "./types";

import { db } from '../../firebase'

export const fetchUser = (uid) => async dispatch => {
	db.getCurrentUser(uid).on("value", snapshot => {
		dispatch({
			type: FETCH_USER,
			payload: snapshot.val()
		})	
	})
}


