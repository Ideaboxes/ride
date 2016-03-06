/* Action Types
 */

export const SET_USER = 'SET_USER';
export const UNLINK_USER_SERVICE = 'UNLINK_USER_SERVICE';

/* Action creators
 */
export function setUser(user) {
  return { type: SET_USER, user };
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
