import { db } from './firebase';

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

export const getCurrentUser = (uid) => {
	return db.ref('users/' + uid)
}

