"use client";

import {
	createContext,
	useState,
	useEffect,
	useCallback,
	ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import db from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Shared type
interface AuthContextType<T> {
	user: T | null;
	loading: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthContext = createContext<AuthContextType<any>>({
	user: null,
	loading: true,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface GenericAuthProviderProps<T> {
	children: ReactNode;
	userType: "clients" | "therapists";
	redirectPath?: string;
}

export function GenericAuthProvider<T extends { id: string }>({
	children,
	userType,
	redirectPath = "/clients/login",
}: GenericAuthProviderProps<T>) {
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<T | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser?.uid) {
				setUser(firebaseUser);
				setLoading(false);
			} else {
				router.push(redirectPath);
			}
		});

		return () => unsubscribe();
	}, [router, redirectPath]);

	const getUser = useCallback(async () => {
		if (!user) return;
		const ref = doc(db, userType, user.uid);
		const docSnap = await getDoc(ref);
		if (docSnap.exists()) {
			setUserData({ id: user.uid, ...docSnap.data() } as T);
		}
	}, [user, userType]);

	useEffect(() => {
		getUser();
	}, [getUser]);

	return userData ? (
		<AuthContext.Provider value={{ loading, user: userData }}>
			{children}
		</AuthContext.Provider>
	) : (
		<div className="flex items-center justify-center w-full h-full">
			<Loader2 className="w-10 h-10 animate-spin text-blue-500" />
		</div>
	);
}

export default AuthContext;