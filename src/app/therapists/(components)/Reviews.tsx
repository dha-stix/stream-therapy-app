import ReviewForm from "./ReviewForm";
import { Star } from "lucide-react";

export default function Reviews({therapistId, userId, reviews}: {therapistId: string, userId: string, reviews: Reviews[] | null}) {
	return (
		<section className='mt-10 w-full flex items-center flex-col'>
			<ReviewForm therapistId={therapistId} userId={userId}/>
			<section className='w-full flex flex-wrap items-center justify-center mb-4'>
				{reviews&& reviews.length > 0 && reviews.map(review => (
					<ReviewCard key={review.id} review={review} />
				))}
			</section>
		</section>
	);
}

const ReviewCard = ({review}: {review: Reviews}) => {
	return (
		<div className='lg:w-[450px] w-full bg-gray-100 p-4 rounded-md my-2 mx-[4px] text-center'>
			<p className='font-bold opacity-70'>{review.client_name}</p>
			<div className='flex items-center mb-2 text-center justify-center'>
				<Star className='h-5 w-5 text-yellow-600' />
				<span className='ml-1 text-yellow-600 text-sm font-bold'>{review.rating}</span>
			</div>
			<p className='text-sm opacity-60'>
				{`${review.review.length > 300 ? review.review.slice(0, 300) + '...' : review.review}`}
			</p>
		</div>
	);
};