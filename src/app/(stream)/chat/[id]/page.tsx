"use client";
import { Loader2 } from "lucide-react";
import StreamChatUI from "../(components)/StreamChatUI";
import { useState, useContext, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetStreamClient } from "@/app/(stream)/hooks/useGetStreamClient";
import StreamAuthContext from "../../providers/StreamAuthProvider";

export default function Chat() {
	const { user, loading } = useContext(StreamAuthContext);
	const { id } = useParams<{ id: string }>();
	const [members, setMembers] = useState<Member>();
	const { client: chatClient } = useGetStreamClient(user! as TherapistData);

	const fetchCallMembers = useCallback(async () => {
		if (!chatClient) return;
		const channel = chatClient.channel("messaging", id);
		await channel.watch(); // Ensure the channel is loaded
		const members = Object.values(channel.state.members).map((member) => {
			return {
				id: member.user_id,
				name: member.user?.name,
				image: member.user?.image,
				role: member.role,
			};
		});
		const therapist = members.find((member) => member.role === "owner");
		const client = members.find((member) => member.role !== "client");

		setMembers({ therapist, client } as Member);
	}, [chatClient, id]);

	useEffect(() => {
		if (chatClient) {
			fetchCallMembers();
		}
	}, [chatClient, fetchCallMembers]);

	if (loading) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<Loader2 className='w-10 h-10 text-2xl animate-spin text-blue-500' />
			</div>
		);
	}

	return (
		<div>
			{user && members ? (
				<StreamChatUI user={user} members={members} />
			) : (
				<ConfirmMember />
			)}
		</div>
	);
}

const ConfirmMember = () => {
	const router = useRouter();
	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<button
				className='text-lg mb-4 p-4 bg-blue-500 text-white rounded-md'
				onClick={() => router.back()}
			>
				Go Back
			</button>

			<div className='loader'>
				<Loader2 size={48} className='animate-spin' />
			</div>
		</div>
	);
};