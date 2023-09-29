import { initializeApp } from '@firebase/app';
import {
	getAuth,
	signInWithRedirect,
	signInWithPopup,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from '@firebase/auth';
import {
	getFirestore,
	collection,
	writeBatch,
	doc,
	getDoc,
	setDoc,
	query,
	getDocs,
} from '@firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyCqnHnBNb_fps855eDloBtJAZ2PDOJpwxI',
	authDomain: 'crwn-clothing-db-ad35a.firebaseapp.com',
	projectId: 'crwn-clothing-db-ad35a',
	storageBucket: 'crwn-clothing-db-ad35a.appspot.com',
	messagingSenderId: '1006250831883',
	appId: '1:1006250831883:web:dc7749095c96d7c7f6970e',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const auth = getAuth();

// Sign in with Google
export const signInWithGooglePopup = () =>
	signInWithPopup(auth, googleProvider);

// Google redirect login
export const signInWithGoogleRedirect = () =>
	signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

// Adding data to firestore db
export const addCollectionAndDocuments = async (
	collectionKey,
	objectsToAdd,
) => {
	const collectionRef = collection(db, collectionKey);

	const batch = writeBatch(db);

	objectsToAdd.forEach((obj) => {
		const newDocRef = doc(collectionRef, obj.title.toLowerCase());
		batch.set(newDocRef, obj);
	});

	await batch.commit();
};

export const getCategoriesCollectionFromFirestore = async () => {
	const collectionRef = collection(db, 'categories');
	const q = query(collectionRef);

	const querySnapshot = await getDocs(q);
	const categoryMap = querySnapshot.docs.reduce((accumulator, docSnapshot) => {
		const { title, items } = docSnapshot.data();
		accumulator[title.toLowerCase()] = items;
		return accumulator;
	}, {});

	return categoryMap;
};

export const createUserDocumentFromAuth = async (
	userAuth,
	additionalInformation = {},
) => {
	if (!userAuth) return;

	const userDocRef = doc(db, 'users', userAuth.uid);

	const userSnapshot = await getDoc(userDocRef);

	if (!userSnapshot.exists()) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
				...additionalInformation,
			});
		} catch (error) {
			console.log('Error creating user', error.message);
		}
	}

	return userDocRef;
};

// Sign in with email and password
export const signInAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;

	return await signInWithEmailAndPassword(auth, email, password);
};

// Create user with email and password
export const createUserWithEmailAndPasswordFn = async (email, password) => {
	if (!email || !password) return;

	return await createUserWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => {
	onAuthStateChanged(auth, callback);
};
