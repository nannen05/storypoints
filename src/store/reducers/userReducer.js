import { FETCH_USER } from "../actions/types";

const initialState = {
	user: null,
	loading: true,
	error: null
};

const userData = (state = initialState, action) => {
  switch (action.type) {
	case FETCH_USER:
		//console.log(action.payload)
		return {
			...state,
			loading: false,
			user: action.payload
		  };
    default:
      return state;
  }
};

export default userData;
