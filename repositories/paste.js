import Hashids from 'hashids';
import firebase from 'firebase';

const hashids = new Hashids('localthreat');

const database = firebase.initializeApp({
  apiKey: 'AIzaSyCbVpgZHW9LE38m9J0YM3Tmrfob5rnqR9c',
  databaseURL: 'https://localthreat-a8372.firebaseio.com/',
});

export const PasteRepository = {
  fetch(hashid) {
    return new Promise((resolve, reject) => {
      const id = hashids.decode(hashid);
      const paste = localStorage.getItem(`paste-${id}`);
      if (!paste) {
        reject(null);
      } else {
        resolve(JSON.parse(paste));
      }
    });
  },

  create(contents) {
    return new Promise((resolve, reject) => {
      const id = parseInt(localStorage.getItem(`paste-count`) || 1, 10);
      const paste = { id: hashids.encode(id), timestamp: Date.now(), contents };
      localStorage.setItem(`paste-${id}`, JSON.stringify(paste));
      localStorage.setItem(`paste-count`, id + 1);
      resolve(paste);
    });
  },

  update(hashid, update) {
    return this.fetch(hashid).then(paste => {
      Object.assign(paste, update);
      const id = hashids.decode(hashid);
      localStorage.setItem(`paste-${id}`, JSON.stringify(paste));
      return paste;
    });
  },
};
