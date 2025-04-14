"use client";
import { createContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import db from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthContextType {
	user: ClientData | TherapistData | null;
	loading: boolean;
}

const StreamAuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
});

export function StreamAuthProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<TherapistData | ClientData | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user?.uid) {
				setUser(user);
				setLoading(false);
			} else {
				return router.push("/clients/login");
			}
		});

		return () => unsubscribe();
	}, [router]);

	const getUser = useCallback(async () => {
		if (!user) return null;
		const clientsRef = doc(db, "clients", user.uid);
		const therapistsRef = doc(db, "therapists", user.uid);
		const [clientsSnap, therapistsSnap] = await Promise.all([
			getDoc(clientsRef),
			getDoc(therapistsRef),
		]);

		if (clientsSnap.exists()) {
			setUserData({ id: user.uid, ...clientsSnap.data() } as ClientData);
		} else if (therapistsSnap.exists()) {
			setUserData({ id: user.uid, ...therapistsSnap.data() } as TherapistData);
		} else {
			return null;
		}
	}, [user]);

	useEffect(() => {
		getUser();
	}, [getUser]);

	return (
		<>
			{userData ? (
				<StreamAuthContext.Provider value={{ loading, user: userData }}>
					{children}
				</StreamAuthContext.Provider>
			) : (
				<div className='flex items-center justify-center w-full h-full'>
					<Loader2 className='w-10 h-10 animate-spin text-blue-500' />
				</div>
			)}
		</>
	);
}

export default StreamAuthContext;