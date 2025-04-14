"use client"
import { specializations } from "@/lib/utils";
import Nav from "../(root)/Nav";
import ProfileCard from "./(components)/ProfileCard";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
	getTherapistBySpecialization,
	getTherapistsList,
} from "@/lib/db-functions";

export default function Therapists() {
	const [user, setUser] = useState<User | null>(null);
	const [therapists, setTherapists] = useState<TherapistData[]>([]);
	const [specialization, setSpecialization] = useState<string>("all");
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user?.uid) {
				setUser(user);
			} else {
				return router.push("/therapists/login");
			}
		});

		return () => unsubscribe();
	}, [router]);

	const fetchTherapists = useCallback(async () => {
		const therapistList = await getTherapistsList();
		if (therapistList.therapists) {
			setTherapists(therapistList.therapists);
		}
	}, []);

	useEffect(() => {
		fetchTherapists();
	}, [fetchTherapists]);

	const handleSearch = useCallback(async () => {
		if (specialization === "all") {
			fetchTherapists();
			return;
		}

		const therapists = await getTherapistBySpecialization(specialization);
		if (therapists.therapists) {
			setTherapists(therapists.therapists);
		}
	}, [specialization, fetchTherapists]);

	useEffect(() => {
		handleSearch();
	}, [handleSearch]);

	if (!user) {
		return (
			<main className='w-full min-h-screen flex items-center justify-center'>
				<Loader2 className='w-10 h-10 text-2xl animate-spin text-blue-500' />
			</main>
		);
	}

	return (
		<div>
			<Nav user={user} type="therapist"/>

			<form className='w-full px-8 py-4 flex items-center justify-center'>
				<label
					htmlFor='specialization'
					className='text-lg mr-4 text-gray-500'
				>
					Specialization:
				</label>
				<select
					className='w-1/3 border border-gray-300 rounded-md p-4'
					required
					name='specialization'
					id='specialization'
					value={specialization}
					onChange={(e) => setSpecialization(e.target.value)}
				>
					<option value='all'>All</option>
					{specializations.map((field) => (
						<option key={field.id} value={field.name}>
							{field.name}
						</option>
					))}
				</select>
			</form>

			<main className='w-full min-h-[90vh] px-8 py-4'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{therapists.length > 0 ? (
						therapists.map((therapist) => (
							<ProfileCard key={therapist.id} therapist={therapist} />
						))
					) : (
						<div className='w-full h-full flex items-center justify-center'>
							<p className='text-lg text-red-500 text-center'>
								No therapists for this category
							</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}