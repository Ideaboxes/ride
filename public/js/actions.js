/* Action Types
 */

export const SET_USER = 'SET_USER';

/* Action creators
 */
export function setUser(user) {
  return { type: SET_USER, user };
}
