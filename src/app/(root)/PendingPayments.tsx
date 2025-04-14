import { approvePayment, cancelPayment } from "@/lib/db-functions";
import { Check, X, CircleEllipsis } from "lucide-react";

import { toast } from "sonner";

interface Props {
	payments: PendingPayments[] | null;
	therapist?: TherapistData;
}
export default function PendingPayments({ payments, therapist }: Props) {
	if (!payments)
		return null

	return (
		<div className='bg-gray-100 h-full w-1/3 rounded-md py-6 px-4  overflow-y-scroll scrollbar-custom'>
			<h2 className='text-xl font-bold text-gray-600'>Pending Payments</h2>
			<p className='text-sm opacity-60 mb-5'>
				{therapist
					? "Verify these payments and start the sessions"
					: "Payments yet to be verified"}
			</p>
			<section className='flex flex-col space-y-4 w-full'>
				{therapist && payments.length > 0 && (
					payments.map((payment) => (
						<TherapistPayCard
							key={payment.payment_id}
							payment={payment}
							therapist={therapist}
						/>
					))
				)}

				{!therapist && payments.length > 0 && (
					payments.map((payment) => (
						<ClientPayCard key={payment.payment_id} payment={payment} />
					))
				)}

				{payments.length === 0 && (
					<div className='w-full h-full flex items-center justify-center'>
						<p className='text-sm text-red-500 text-center'>
							No pending payments
						</p>
					</div>
				)}
			</section>
		</div>
	);
}

const TherapistPayCard = ({
	payment,
	therapist,
}: {
	payment: PendingPayments;
	therapist: TherapistData;
}) => {
	const handleApprove = async (payment: PendingPayments) => {
		const { message, status } = await approvePayment(payment, therapist);
		if (status === 200) {
			toast.success("Payment approved successfully", {
				description: message,
			});
			window.location.reload();
		} else {
			toast.error("Failed to approve payment", {
				description: message,
			});
		}
	};

	const handleDelete = async (payment: PendingPayments) => {
		const { status, message } = await cancelPayment(payment);
		if (status === 200) {
			toast.success("Payment cancelled successfully", {
				description: message,
			});
			window.location.reload();
		} else {
			toast.error("Failed to cancel payment", {
				description: message,
			});
		}
	};

	return (
		<div className='w-full flex items-center justify-between bg-gray-200 h-[100px] rounded-sm p-4 hover:shadow-md transition-all duration-200 ease-in-out'>
			<div className='w-2/3'>
				<h3>{payment.client_name}</h3>
				<p className='text-sm text-red-600'>#ID: {payment.payment_id}</p>
				<p className='text-sm text-blue-500'>Date: {payment.payment_date}</p>
			</div>

			<div className='w-1/3 px-2 flex items-center justify-end space-x-2'>
				<button
					className='p-2 bg-white rounded-md flex items-center justify-center space-x-2 cursor-pointer'
					onClick={() => handleApprove(payment)}
				>
					<Check className='text-green-600 font-bold' />
				</button>

				<button
					className='p-2 bg-white rounded-md flex items-center justify-center space-x-2 cursor-pointer'
					onClick={() => handleDelete(payment)}
				>
					<X className='text-red-600 font-bold' />
				</button>
			</div>
		</div>
	);
};

const ClientPayCard = ({ payment }: { payment: PendingPayments }) => {
	const handleClick = () => alert("Payment yet to be verified...");

	return (
		<div className='w-full flex items-center justify-between bg-gray-200 h-[100px] rounded-sm p-4 hover:shadow-md transition-all duration-200 ease-in-out'>
			<div className='w-2/3'>
				<h3>{payment.client_name}</h3>
				<p className='text-sm text-red-600'>#ID: {payment.payment_id}</p>
				<p className='text-sm text-blue-500'>Date: {payment.payment_date}</p>
			</div>

			<div className='w-1/3 px-2 flex items-center justify-end space-x-2'>
				<button
					className='p-2 bg-white rounded-md flex items-center justify-center space-x-2'
					onClick={handleClick}
				>
					<CircleEllipsis className='text-gray-600 font-bold' />
				</button>
			</div>
		</div>
	);
};