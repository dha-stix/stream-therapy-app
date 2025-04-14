"use client";
import PendingPayments from "@/app/(root)/PendingPayments";
import { useEffect, useState, useCallback, useContext } from "react";
import { getPendingPayments as getPP } from "@/lib/db-functions";
import { Loader2 } from "lucide-react";
import { Channel } from "stream-chat";
import { useGetStreamClient } from "@/app/(stream)/hooks/useGetStreamClient";
import AuthContext from "@/app/(root)/AuthContext";
import Nav from "@/app/(root)/Nav";
import OpenChats from "../../(root)/OpenChats";
import ScheduledSessions from "@/app/(root)/ScheduleSessions";
import { useGetCalls } from "@/app/(stream)/hooks/useGetCalls";

export default function Dashboard() {
	const { user, loading } = useContext(AuthContext);
	const [pendingPayments, setPendingPayments] = useState<
		PendingPayments[] | null
	>(null);
	const [channels, setChannels] = useState<Channel[] | null>(null);
	const { upcomingCalls, isLoading, ongoingCalls } = useGetCalls(user.id);
	const { client: chatClient } = useGetStreamClient(user! as ClientData);

	console.log({upcomingCalls, ongoingCalls, isLoading});

	const getDashboardData = useCallback(async () => {
		if (!chatClient || !user) return;
		const [ppResult, channelList] = await Promise.all([
			getPP({
				uid: user.id,
				user: "client_id",
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

	return (
		<div>
			{loading || !user ? (
				<main className='w-full min-h-screen flex items-center justify-center'>
					<Loader2 className='w-10 h-10 text-2xl animate-spin text-blue-500' />
				</main>
			) : (
				<>
					<Nav user={user} type='client' />
					<section className='w-full px-8 py-4 h-[90vh] flex items-start justify-between space-x-3'>
						<PendingPayments payments={pendingPayments} />
						{channels && <OpenChats channels={channels} type='client' />}
						{upcomingCalls && ongoingCalls && (
							<ScheduledSessions
								upcomingCalls={upcomingCalls}
								ongoingCalls={ongoingCalls}
								isLoading={isLoading}
							/>
						)}
					</section>
				</>
			)}
		</div>
	);
}