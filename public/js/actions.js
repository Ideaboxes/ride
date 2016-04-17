/* Action Types
 */

export const SET_USER = 'SET_USER';
export const UNLINK_USER_SERVICE = 'UNLINK_USER_SERVICE';
export const SET_USER_ACTIVITIES = 'SET_USER_ACTIVITIES';

export const FETCHING_USER_ACTIVITIES = 'FETCHING_USER_ACTIVITIES';

/* Action creators
 */
export function setUser(user) {
  return { type: SET_USER, user };
}

export function setUserActivities(activities) {
  return { type: SET_USER_ACTIVITIES, activities };
}

export function unlinkService(name) {
  return dispatch => {
    // TODO: Change this to /v1/services/{service_name}/unlink.json
    fetch(`/v1/${name}/unlink.json`, { credentials: 'include' })
      .then(() => fetch('/v1/users/me.json', { credentials: 'include' }))
      .then(data => data.json())
      .then(json => {
        dispatch(setUser(json.user));
      });
  };
}

export function fetchUserActivities() {
  return dispatch => {
    fetch('/v1/users/activities.json', { credentials: 'include' })
      .then(data => data.json())
      .then(json => {
        dispatch(setUserActivities(json));
      });
  };
}
