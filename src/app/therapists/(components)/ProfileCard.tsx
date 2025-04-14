import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Flag, Star } from "lucide-react";

export default function ProfileCard({therapist}: {therapist: TherapistData}) {
	return (
		<Link
			href={`/therapists/profile/${therapist.id}`}
			target="_blank"
			className='border border-gray-300 rounded-md p-4 flex flex-col items-center relative hover:shadow-lg transition-shadow duration-300'
		>
			<Avatar className='w-24 h-24 mb-4'>
				<AvatarImage src={therapist.image} alt={therapist.name} />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
			<h2 className='text-lg font-bold'>{therapist.name}</h2>
			<p className='opacity-40'>{therapist.specialization}</p>
			<div className='flex items-center'>
				<Star className='h-5 w-5 text-blue-300' />
				<span className='ml-1'>5.0</span>
			</div>

			<div className='flex items-center'>
				<Flag className='h-5 w-5 text-green-600' />
				<span className='ml-1 opacity-50 text-sm'>{therapist.country}</span>
			</div>

			{therapist.payPerHr && (
				<div className='absolute top-2 right-2 p-2  rounded-md'>
				<p className='text-md text-blue-600'>{`$${therapist.payPerHr}/hr`}</p>
			</div>
				
			)}

			
		</Link>
	);
}