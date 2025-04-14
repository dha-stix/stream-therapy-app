import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import db, { auth, storage } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const clientSignUp = async (form: FormData) => {
	const { name, email, password } = {
		name: form.get("name") as string,
		email: form.get("email") as string,
		password: form.get("password") as string,
	};

	try {
		const { user } = await createUserWithEmailAndPassword(auth, email, password);

	if (!user) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Failed to create user",
		};
	}
	const docRef = doc(db, "clients", user.uid);
	await setDoc(docRef, {
		name,
		email,
	});

	return {
		code: "auth/success",
		status: 201,
		user,
		message: "Acount created successfully! 🎉",
	};
	} catch (err) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			err,
			message: "Failed to create user",
		};
	}
};

export const clientLogin = async (form: FormData) => {
	const email = form.get("email") as string;
	const password = form.get("password") as string;

	try {

		const { user } = await signInWithEmailAndPassword(auth, email, password);

	if (!user) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Failed to login",
		};
	}

	const docSnap = await getDoc(doc(db, "clients", user.uid));

	if (!docSnap.exists()) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "User is Not a Therapist",
		};
	}

	return {
		code: "auth/success",
		status: 200,
		user,
		message: "Login successful",
	};
		
	}catch(err) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			err,
			message: "Failed to login",
		};
	}

	

	
};

export const therapistSignUp = async (form: FormData) => {
	const userData = {
		name: form.get("name") as string,
		email: form.get("email") as string,
        password: form.get("password") as string,
        qualification: form.get("qualification") as string,
        summary: form.get("summary") as string,
        specialization: form.get("specialization") as string,
	    country: form.get("country") as string,   
		image: form.get("image") as File,
    };
	try {
	
		const { user } = await createUserWithEmailAndPassword(
			auth,
			userData.email,
			userData.password
		);

		if (!user) {
			return {
				code: "auth/failed",
				status: 500,
				user: null,
				message: "Failed to create user",
			};
		}

		const imageRef = ref(storage, `therapists/${user.uid}/image`);
		await uploadBytes(imageRef, userData.image).then(async () => {
			const downloadURL = await getDownloadURL(imageRef);
			if (!downloadURL) {
				return {
					code: "auth/failed",
					status: 500,
					user: null,
					message: "Failed to upload image",
				};
			}
			const docRef = doc(db, "therapists", user.uid);

			await setDoc(docRef, {
				name: userData.name,
				email: userData.email,
				specialization: userData.specialization,
				qualification: userData.qualification,
				summary: userData.summary,
				country: userData.country,
				image: downloadURL,
			});
		});

		return {
			code: "auth/success",
			status: 201,
			user: userData,
			message: "Acount created successfully! 🎉",
		};
	} catch (err) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			err,
			message: "Failed to create user",
		};
	 }
};

export const therapistLogin = async (form: FormData) => {
	const email = form.get("email") as string;
	const password = form.get("password") as string;

	try {
		const { user } = await signInWithEmailAndPassword(auth, email, password);

	if (!user) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Failed to login",
		};
	}

	const docSnap = await getDoc(doc(db, "therapists", user.uid));

	if (!docSnap.exists()) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "User is Not a Therapist",
		};
	}

	return {
		code: "auth/success",
		status: 200,
		user,
		message: "Login successful",
	};
	} catch (err) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			err,
			message: "Failed to login",
		};
	}
};

export const authLogout = async () => {
	try {
		await auth.signOut();
		return { code: "auth/success", status: 200, message: "Logout successful" };
	} catch (err) {
		return {
			code: "auth/failed",
			status: 500,
			message: "Failed to logout",
			err,
		};
	}
};