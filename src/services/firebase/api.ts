import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// types
import {Employee, RegistrationForm} from 'src/types/redux';
import {Platform} from 'react-native';

export const isAuth = async () => {
  const user = await auth().currentUser;
  return !!user;
};

export const checkAuth = (
  onSignIn: (user: any | null) => void,
  onSignOut: () => void,
) => {
  auth().onAuthStateChanged(function (user) {
    if (user) {
      onSignIn(user);
    } else {
      onSignOut();
    }
  });
};

export const signIn = async (email: string, password: string) => {
  return await auth().signInWithEmailAndPassword(email, password);
};

export const signUp = async (email: string, password: string) => {
  return await auth().createUserWithEmailAndPassword(email, password);
};

export const signOut = async () => {
  return await auth().signOut();
};

export const createUserInfo = async (
  data: Omit<
    RegistrationForm,
    'password' | 'groupName' | 'groupMembers' | 'avatar'
  >,
) => {
  const user = auth().currentUser;

  const updatedData = {...data, avatar: '', uuid: user?.uid};

  return await firestore().collection('users').doc(user?.uid).set(updatedData);
};

export const createGroup = async (title: string, members: Employee[]) => {
  const user = auth().currentUser;

  const updatedData = {title, members, created_by: user?.uid};

  return await firestore().collection('groups').add(updatedData);
};

export const getGroups = async () => {
  const user = auth().currentUser;

  return firestore()
    .collection('groups')
    .where('created_by', '==', user?.uid)
    .get();
};

export const getProfile = async () => {
  const user = auth().currentUser;

  try {
    return await firestore().collection('users').doc(user?.uid).get();
  } catch (e) {
    console.log('LOG ::::::> e <::::::', e);
  }
};

export const uploadAvatar = async (path: string) => {
  const user = auth().currentUser;
  const uri =
    Platform.OS === 'ios' ? path.replace('file://', '') : 'file://' + path;

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log({e});
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const url =
    'avatars/' + Math.random().toString(36).replace('0.', '') + '.jpeg';

  const ref = storage().ref().child(url);
  await ref.put(blob);
  blob.close();

  let downloadedURL = await storage().ref(url).getDownloadURL();

  await firestore().collection('users').doc(user?.uid).update({
    avatar: downloadedURL,
  });
};
