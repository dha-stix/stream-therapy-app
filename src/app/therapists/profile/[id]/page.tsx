"use client";
import { Star, Flag, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PaymentModal from "../../(components)/PaymentModal";
import Reviews from "../../(components)/Reviews";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
	getReviews,
	getTherapistProfile,
} from "@/lib/db-functions";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { calcAvgRating } from "@/lib/utils";
import Nav from "@/app/(root)/Nav";

export default function Profile() {
	const { id } = useParams<{ id: string }>();
	const [profile, setProfile] = useState<TherapistData | null>(null);
	const [reviews, setReviews] = useState<Reviews[] | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user?.uid) {
				setUser(user);
			} else {
				return router.push("/clients/login");
			}
		});

		return () => unsubscribe();
	}, [router]);

	const fetchTherapistData = useCallback(async () => {
		const [profileResult, reviewsResult] = await Promise.all([
			getTherapistProfile(id),
			getReviews(id),
		]);
		const { user } = profileResult;
		const { status, reviews } = reviewsResult;
		if (!user || status !== 200) {
			return router.back();
		}
		setProfile(user as TherapistData);
		setReviews(reviews as Reviews[]);
	}, [id, router]);

	useEffect(() => {
		fetchTherapistData();
	}, [fetchTherapistData]);

	if (!profile || !user) {
		return (
			<main className='w-full min-h-screen flex items-center justify-center'>
				<Loader2 className='w-10 h-10 text-2xl animate-spin text-blue-500' />
			</main>
		);
	}

	return (
		<div className='w-full'>
			<Nav user={user} type="therapist" />

			<main className='w-full px-8 py-4'>
				<section className='lg:w-4/6 mx-auto w-full shadow-md bg-gray-100 rounded-xl px-12 py-10'>
					<div className='w-full h-full flex items-center justify-between mb-6'>
						<div className='w-1/3 h-full flex flex-col justify-center '>
							<Avatar className='w-24 h-24 mb-4'>
								<AvatarImage src={profile.image} alt={profile.name} />
								<AvatarFallback>{profile.name}</AvatarFallback>
							</Avatar>
							<h1 className='text-2xl font-bold'>{profile.name}</h1>
							<p className='text-blue-600'>{profile.specialization}</p>
							<p className='text-gray-600 italic'>{profile.qualification}</p>

							<div className='flex items-center'>
								<Flag className='h-5 w-5 text-green-600' />
								<span className='ml-1 opacity-50 text-sm'>
									{profile.country}
								</span>
							</div>
						</div>

						<div className='w-2/3 h-full flex flex-col items-end justify-center'>
							<div className='flex items-center mb-4'>
								<Star className='h-5 w-5 text-yellow-600' />
								<h2 className='ml-1 font-bold text-4xl'>
									{calcAvgRating(reviews!)}{" "}
								</h2>
							</div>

							<p className='text-gray-600 mb-4'>{reviews?.length} Reviews</p>

							<Dialog open={openModal} onOpenChange={setOpenModal}>
								<DialogTrigger asChild>
									<button className='bg-blue-600 text-lg hover:bg-blue-700 text-white px-4 py-3 rounded-md'>
										Book a Session
									</button>
								</DialogTrigger>

								<PaymentModal
									paymentLink={profile?.paymentLink}
									userId={user.uid}
									therapistId={id}
									closeModal={() => setOpenModal(false)}
								/>
							</Dialog>
						</div>
					</div>

					<div className='w-full my-4  text-sm'>
						<p>{profile.summary}</p>
					</div>
				</section>

					<Reviews therapistId={id} userId={user.uid} reviews={reviews} />
			
			</main>
		</div>
	);
}