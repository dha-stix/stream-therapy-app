"use client";
import { SquareArrowOutUpRight, X } from "lucide-react";
import { Channel } from "stream-chat";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function OpenChats({
	channels,
	type,
}: {
	channels: Channel[];
	type: "client" | "therapist";
}) {
	return (
		<div className='bg-blue-100 h-full w-1/3 rounded-md py-6 px-4  overflow-y-scroll scrollbar-custom'>
			<h2 className='text-xl font-bold text-blue-600'>Open Chats</h2>
			<p className='text-sm opacity-60 mb-5'>
				Chat with the {type == "client" ? "therapist" : "client"} and book a
				session time
			</p>

			<section className='flex flex-col space-y-4 w-full'>
				{type == "client" && channels.length > 0 && (
					channels.map((channel) => (
						<ClientChatCard key={channel.id} channel={channel} />
					))
				)}

				{type == "therapist" && channels.length > 0 && (
					channels.map((channel) => (
						<TherapistChatCard key={channel.id} channel={channel} />
					))
				)}
				{channels.length == 0 && (
					
						<p className='text-sm text-red-500 text-center'>No open chats</p>
		
				)}
			</section>
		</div>
	);
}

const TherapistChatCard = ({ channel }: { channel: Channel }) => {
	const router = useRouter();

	const handleDeleteChannel = async () => {
		await channel.delete();
		toast.success("Channel deleted successfully");
		window.location.reload();
	};

	return (
		<div className='w-full flex items-center justify-between bg-blue-200 h-[100px] rounded-sm p-4 hover:shadow-md transition-all duration-200 ease-in-out'>
			<div className='w-2/3'>
				<h3 className='font-semibold'>{channel.data?.name}</h3>
			</div>

			<div className='w-1/3 px-2 flex items-center justify-end space-x-2'>
				<button
					onClick={() => router.push(`/chat/${channel.id}`)}
					className='p-2 bg-white rounded-md flex items-center justify-center space-x-2'
				>
					<SquareArrowOutUpRight className='text-green-600 font-bold' />
				</button>

				<button
					onClick={handleDeleteChannel}
					className='p-2 bg-white rounded-md flex items-center justify-center space-x-2'
				>
					<X className='text-red-600 font-bold' />
				</button>
			</div>
		</div>
	);
};

const ClientChatCard = ({ channel }: { channel: Channel }) => {
	return (
		<div className='w-full flex items-center justify-between bg-blue-200 h-[100px] rounded-sm p-4 hover:shadow-md transition-all duration-200 ease-in-out'>
			<div className='w-2/3'>
				<h3 className='font-semibold'>{channel.data?.name}</h3>
			</div>

			<div className='w-1/3 px-2 flex items-center justify-end space-x-2'>
				<Link
					href={`/chat/${channel.id}`}
					target='_blank'
					className='p-2 bg-white rounded-md flex items-center justify-center space-x-2'
				>
					<SquareArrowOutUpRight className='text-green-600 font-bold' />
				</Link>
			</div>
		</div>
	);
};