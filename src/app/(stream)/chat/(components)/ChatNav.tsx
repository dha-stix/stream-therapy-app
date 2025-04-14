"use client";
import Link from "next/link";
import { authLogout } from "@/lib/auth-functions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";

interface ModalProps {
	members: Member;
	setOpenCallModal: (open: boolean) => void;
}

export default function ChatNav({
	user,
	members,
}: {
	user: ClientData | TherapistData;
	members: Member;
}) {
	const router = useRouter();
	const [openCallModal, setOpenCallModal] = useState<boolean>(false);

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

	return (
		<nav className='w-full px-8 py-4 flex items-center justify-between h-[10vh] border-b-[1px] border-gray-300 top-0 sticky bg-white z-50'>
			<Link href='/' className='font-bold text-2xl'>
				TherapyMart
			</Link>

			<div className='flex items-center gap-4'>
				<p className='text-sm text-gray-500'>{user?.email}</p>
				{user?.image && (
					<Dialog open={openCallModal} onOpenChange={setOpenCallModal}>
					<DialogTrigger asChild>
						<button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-md cursor-pointer'>
							Schedule a Session
						</button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-4xl'>
						<ScheduleInterviewModal
							members={members}
							setOpenCallModal={setOpenCallModal}
						/>
					</DialogContent>
				</Dialog>
				)}

				<button
					className='bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-md cursor-pointer'
					onClick={() => handleSignout()}
				>
					Log out
				</button>
			</div>
		</nav>
	);
}

const ScheduleInterviewModal = ({ setOpenCallModal, members }: ModalProps) => {
	const [description, setDescription] = useState<string>("");
	const [dateTime, setDateTime] = useState<string>("");

	const getCurrentDateTime = () => {
		const now = new Date();
		return now.toISOString().slice(0, 16);
	};

	const [minDateTime, setMinDateTime] = useState(getCurrentDateTime());
	const client = useStreamVideoClient();

	useEffect(() => {
		setMinDateTime(getCurrentDateTime());
	}, []);

	const handleScheduleMeeting = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!description || !dateTime || !client) return;

		try {
			const id = crypto.randomUUID();
			const call = client.call("default", id);
			if (!call) throw new Error("Failed to create meeting");

			await call.getOrCreate({
				data: {
					starts_at: new Date(dateTime).toISOString(),
					custom: {
						description,
					},
					members: [
						{ user_id: members.client.id },
						{ user_id: members.therapist.id },
					],
				},
			});
			toast("Call Scheduled", {
				description: `The call has been scheduled for ${dateTime}`,
			});
			setOpenCallModal(false);
		} catch (error) {
			console.error(error);
			toast.error("Error occured", {
				description: "Failed to schedule the call",
			});
		}
	};

	return (
		<section className='p-4 w-full'>
			<DialogHeader>
				<DialogTitle className='text-2xl font-bold text-blue-500'>
					Schedule a call
				</DialogTitle>
				<DialogDescription className='text-sm text-gray-500 mb-5'>
					Enter the name and description for the call
				</DialogDescription>

				<form className='w-full' onSubmit={handleScheduleMeeting}>
					<label
						className='block text-left font-medium text-gray-700'
						htmlFor='description'
					>
						Meeting Description
					</label>
					<input
						type='text'
						name='description'
						id='description'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className='mt-1 block w-full py-3 px-4 border-gray-200 border-[1px] rounded mb-3'
						required
						placeholder='Enter a description for the meeting'
					/>

					<label
						className='block text-left font-medium text-gray-700'
						htmlFor='date'
					>
						Date and Time
					</label>

					<input
						type='datetime-local'
						id='date'
						name='date'
						required
						className='mt-1 block w-full py-3 px-4 border-gray-200 border-[1px] rounded mb-3'
						value={dateTime}
						onChange={(e) => setDateTime(e.target.value)}
						min={minDateTime}
					/>

					<button className='w-full bg-blue-600 text-white py-3 rounded mt-4 cursor-pointer'>
						Schedule Call
					</button>
				</form>
			</DialogHeader>
		</section>
	);
};