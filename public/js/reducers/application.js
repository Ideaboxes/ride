import * as Actions from '../actions';

const initialState = {
  user: null,
};

export default function Application(state = initialState, action) {
  switch (action.type) {
    case Actions.SET_USER_ACTIVITIES:
      return Object.assign({}, state, {
        activities: action.activities,
      });
    case Actions.SET_USER:
      return Object.assign({}, state, {
        user: action.user,
      });
    default:
      return state;
  }
}
