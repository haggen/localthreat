import shortid from 'shortid';
import firebase from 'firebase';

const database = firebase.initializeApp({
  apiKey: 'AIzaSyCbVpgZHW9LE38m9J0YM3Tmrfob5rnqR9c',
  databaseURL: 'https://localthreat-a8372.firebaseio.com/',
});

export const PasteRepository = {
  fetch(id) {
    const ref = firebase.database().ref(`pastes/${id}`);
    return ref.once('value').then(snapshot => {
      return snapshot.val();
    });
  },

  create(contents) {
    const id = shortid.generate();
    const ref = firebase.database().ref(`pastes/${id}`);
    const paste = { id, timestamp: Date.now(), contents };
    return ref.set(paste).then(_ => {
      return paste;
    });
  },

  update(hashid, update) {
    // TODO: still reading/writing to local storage.
    return this.fetch(hashid).then(paste => {
      Object.assign(paste, update);
      const id = hashids.decode(hashid);
      localStorage.setItem(`paste-${id}`, JSON.stringify(paste));
      return paste;
    });
  },
};
