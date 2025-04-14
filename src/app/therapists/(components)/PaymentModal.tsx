"use client";
import Link from "next/link";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { confirmPayment } from "@/lib/db-functions";
import { toast } from "sonner";

export default function PaymentModal({
	paymentLink,
	userId, therapistId, closeModal
}: {
		paymentLink: string | undefined;
		userId: string;
		therapistId: string;
		closeModal: () => void;
}) {
	const handleAfterPayment = async (e: React.FormEvent<HTMLFormElement>) => { 
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const { status, message } = await confirmPayment(formData, userId, therapistId);
		if (status === 200) {
			toast.success(message);
			
		} else {
			toast.error(message);
		}
		closeModal();
		
	}
	return (
		<DialogContent className='sm:max-w-4xl'>
			<DialogHeader>
				<DialogTitle className='text-2xl'>Payments</DialogTitle>
				<DialogDescription>
					Ensure you make payments before confirmation.
				</DialogDescription>
			</DialogHeader>
			<main className='w-full'>
				{paymentLink ? (
					<Link
						href={paymentLink}
						target='_blank'
						className=' text-lg font-extrabold text-blue-500 underline rounded-md'
					>
						Make Payment Now
					</Link>
				) : (
					<p className='text-lg font-extrabold text-red-500 underline rounded-md'>
						No Payment Link Available
					</p>
				)}

				{paymentLink && (
					<form className='flex flex-col mt-4' onSubmit={handleAfterPayment}>
						<h2 className='text-xl font-bold text-center'>
							Payment Confirmation
						</h2>
						<label htmlFor='paymentId'>Payment ID</label>

						<input
							type='text'
							className='w-full p-4 border-[1px] border-gray-300 mb-2 rounded-md'
							name='paymentId'
							id='paymentId'
							required
						/>

						<label htmlFor='payeeName'>Payee&apos;s Name</label>

						<input
							type='text'
							className='w-full p-4 border-[1px] border-gray-300 mb-2 rounded-md'
							name='payeeName'
							id='payeeName'
							required
						/>

						<label htmlFor='paymentDate'>Payment Date</label>

						<input
							type='date'
							className='w-full p-4 border-[1px] border-gray-300 mb-2 rounded-md'
							name='paymentDate'
							id='paymentDate'
							required
						/>

						<button
							className='bg-blue-500 text-lg mt-4 hover:bg-blue-700 text-white px-4 py-3 rounded-md'
							type='submit'
						>
							Submit Payment Details
						</button>
					</form>
				)}
			</main>
		</DialogContent>
	);
}