"use client";
import { createReview } from "@/lib/db-functions";
import { reviewRatings } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

export default function ReviewForm({ therapistId, userId }: { therapistId: string, userId: string }) {
	const [buttonClicked, setButtonClicked] = useState(false);
	
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setButtonClicked(true);
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const { status, message } = await createReview(formData, therapistId, userId);
		if (status === 200) {
			toast.success(message);
			window.location.reload();
		} else {
			toast.error(message);	
		}
		setButtonClicked(false);
	};

	return (
		<form
			className='w-full my-6 flex flex-col items-center'
			onSubmit={handleSubmit}
		>
			<label className='font-bold mb-2 text-2xl' htmlFor='review'>
				Leave a Review
			</label>
			<textarea
				className='lg:w-2/3 w-full h-32 border-[1px] border-gray-500 rounded-md p-4 mb-4'
				placeholder='Write your review here...'
				required
				name='review'
				id='review'
			/>
			<div className='flex items-center mb-4'>
				<select
					className='ml-2 border border-gray-300 rounded-md p-4'
					required
					name='rating'
					id='rating'
				>
					<option value=''>Select Rating</option>
					{reviewRatings.map((rating) => (
						<option key={rating.id} value={rating.id}>
							{rating.name}
						</option>
					))}
				</select>
			</div>
			<button
				type='submit'
				disabled={buttonClicked}
				className='w-1/3 text-lg bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-md'
			>
				{buttonClicked ? "Processing..." : "Submit Review"}
			</button>
		</form>
	);
}