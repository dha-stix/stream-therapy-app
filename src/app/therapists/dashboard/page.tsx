"use client";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
	useEffect,
	useState,
	useCallback,
	SetStateAction,
	useContext,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authLogout } from "@/lib/auth-functions";
import { toast } from "sonner";
import {
	getPendingPayments as getPP,
	updateTherapist,
} from "@/lib/db-functions";
import { Channel } from "stream-chat";
import { useGetStreamClient } from "@/app/(stream)/hooks/useGetStreamClient";
import AuthContext from "@/app/(root)/AuthContext";
import { useGetCalls } from "@/app/(stream)/hooks/useGetCalls";
import OpenChats from "@/app/(root)/OpenChats";
import PendingPayments from "@/app/(root)/PendingPayments";
import ScheduledSessions from "@/app/(root)/ScheduleSessions";

export default function Dashboard() {
	const { user, loading } = useContext(AuthContext);
	const [channels, setChannels] = useState<Channel[] | null>(null);
	const { client: chatClient } = useGetStreamClient(user! as TherapistData);
	const [pendingPayments, setPendingPayments] = useState<
		PendingPayments[] | null
	>(null);
	const { upcomingCalls, isLoading, ongoingCalls } = useGetCalls(user.id);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const router = useRouter();

	const getDashboardData = useCallback(async () => {
		if (!chatClient || !user) return;
		const [ppResult, channelList] = await Promise.all([
			getPP({
				uid: user.id,
				user: "therapist_id",
			}),
			chatClient.queryChannels({
				type: "messaging",
				members: { $in: [user.id] },
			}),
		]);
		setChannels(channelList);
		const { code, pendingPayments } = ppResult;

		if (code === "doc/success") {
			setPendingPayments(pendingPayments);
		}
	}, [user, chatClient]);

	useEffect(() => {
		getDashboardData();
	}, [getDashboardData]);

	const handleSignout = async () => {
		const { status, message } = await authLogout();

		if (status === 500)
			return toast.error("Failed to logout", {
				description: message,
			});
		if (status === 200) {
			toast.success("Logged out successfully", {
				description: message,
			});
			router.push("/clients/login");
		}
	};

	if (!user || loading) {
		return (
			<main className='w-full min-h-screen flex items-center justify-center'>
				<Loader2 className='w-10 h-10 text-2xl animate-spin text-blue-500' />
			</main>
		);
	}

	return (
		<main className='w-full min-h-screen'>
			<nav className='w-full px-8 py-4 flex items-center justify-between h-[10vh] border-b-[1px] border-gray-300'>
				<Link href='/' className='font-bold text-2xl'>
					TherapyMart
				</Link>

				<div className='flex items-center space-x-5'>
					<Dialog
						open={openModal}
						onOpenChange={() => setOpenModal(!openModal)}
					>
						<DialogTrigger asChild>
							<button className='opacity-70 hover:opacity-100 text-lg'>
								Payments
							</button>
						</DialogTrigger>

						<PaymentInfoModal userId={user.id} setOpen={setOpenModal} />
					</Dialog>

					<Link
						href={`/therapists/profile/${user.id}`}
						target='_blank'
						className='opacity-70 hover:underline hover:text-blue-500 text-lg hover:opacity-100'
					>
						Profile
					</Link>

					<button
						className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer'
						onClick={handleSignout}
					>
						Log out
					</button>
				</div>
			</nav>

			<section className='w-full px-8 py-4 h-[90vh] flex items-start justify-between space-x-3'>
				<PendingPayments payments={pendingPayments} therapist={user} />
				{channels && <OpenChats channels={channels} type='therapist' />}

				{upcomingCalls && ongoingCalls && (
					<ScheduledSessions
						upcomingCalls={upcomingCalls}
						ongoingCalls={ongoingCalls}
						isLoading={isLoading}
					/>
				)}
			</section>
		</main>
	);
}

const PaymentInfoModal = ({
	userId,
	setOpen,
}: {
	userId: string;
	setOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);

	const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setButtonClicked(true);
		const formData = new FormData(e.currentTarget);
		const payPerHr = formData.get("payPerHr") as string;
		const paymentLink = formData.get("paymentLink") as string;

		if (Number(payPerHr) < 0 || isNaN(Number(payPerHr))) {
			return toast.error("Pay per hour must be a positive number");
		}
		const { code, status, message } = await updateTherapist({
			payPerHr: Number(payPerHr),
			paymentLink,
			userId,
		});

		if (code === "doc/success" && status === 200) {
			toast.success("Payment information updated successfully", {
				description: message,
			});
			setOpen(false);
		} else {
			toast.error("Failed to update payment information", {
				description: message,
			});
		}
		setButtonClicked(false);
	};
	return (
		<DialogContent className='sm:max-w-4xl'>
			<DialogHeader>
				<DialogTitle className='text-2xl'>Payments Information</DialogTitle>
				<DialogDescription>
					Update your payment information here.
				</DialogDescription>
			</DialogHeader>

			<form className='flex flex-col mt-4 w-full' onSubmit={handleUpdate}>
				<label htmlFor='payPerHr'>Pay Per Hour</label>

				<input
					type='text'
					className='w-full p-4 border-[1px] border-gray-300 mb-2 rounded-md'
					name='payPerHr'
					id='payPerHr'
					required
				/>

				<label htmlFor='paymentLink'>Payment Link</label>

				<input
					type='url'
					className='w-full p-4 border-[1px] border-gray-300 mb-2 rounded-md'
					name='paymentLink'
					id='paymentLink'
					required
				/>

				<button
					className='bg-blue-500 text-lg mt-4 hover:bg-blue-700 text-white px-4 py-3 rounded-md'
					type='submit'
					disabled={buttonClicked}
				>
					{buttonClicked ? "Updating..." : "Update Payment Info"}
				</button>
			</form>
		</DialogContent>
	);
};