"use client"
import { formatCallDate } from "@/lib/utils";
import { Call } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ScheduledSessions({ ongoingCalls, isLoading, upcomingCalls }: { ongoingCalls: Call[], isLoading: boolean, upcomingCalls: Call[] }) {

	if (isLoading) { 
		return (
			<div className='bg-green-100 h-full w-1/3 rounded-md py-6 px-4 overflow-y-scroll scrollbar-custom flex items-center justify-center'>
				<Loader2 className='animate-spin text-green-600' />
			</div>
		);
	}

	return (
		<div className='bg-green-100 h-full w-1/3 rounded-md py-6 px-4 overflow-y-scroll scrollbar-custom'>
			<h2 className='text-xl font-bold text-green-600'>Scheduled Sessions</h2>
			<p className='text-sm opacity-60 mb-5'>
				Mark your calendar and join the sessions
			</p>

			<section className='flex flex-col space-y-4 w-full'>
				{ongoingCalls.map(call => (
					<SessionCard key={call.id} call={call} type="ongoing"/>
				))}

				{upcomingCalls.map(call => (
					<SessionCard key={call.id} call={call} type="upcoming"/>
				))}

				{upcomingCalls.length === 0 && ongoingCalls.length === 0 && (
					<p className='text-sm text-gray-500'>No scheduled sessions</p>
				)}
			</section>
		</div>
	);
}

const SessionCard = ({ call, type }: { call: Call, type: "ongoing" | "upcoming" }) => {
	const router = useRouter();
	const handleBtnClick = (call: Call) => {
		if(type === "upcoming") {
			toast.error("You cannot join this call yet.");
			return;
		}
		router.push(`/call/${call.id}`);
	};
	
	return (
		<div className='w-full flex items-center justify-between bg-green-200 h-[100px] rounded-sm p-4 hover:shadow-md transition-all duration-200 ease-in-out'>
			<div className='w-2/3'>
				<h3>{call.state?.custom?.description}</h3>

				<p className='text-sm text-blue-500'>Date: {formatCallDate(call.state?.startsAt?.toLocaleString())}</p>
			</div>

			<div className='w-1/3 px-2 flex items-center justify-end space-x-2'>
				<button
					className={`${
						type === "ongoing" ? "text-red-500" : "text-blue-400"
					} p-2 rounded-md flex items-center justify-center space-x-2 px-4 py-3 bg-white`}
					onClick={() => handleBtnClick(call)}
					disabled={type === "upcoming"}
				>

					{type === "ongoing" ? "Join Now" : "Not Yet"}
				</button>
			</div>
		</div>
	);
};