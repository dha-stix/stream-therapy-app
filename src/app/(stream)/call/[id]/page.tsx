"use client";
import { useGetCallById } from "@/app/(stream)/hooks/useGetCallById";
import { useParams } from "next/navigation";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import SetUp from "../components/SetUp";
import CallRoom from "../components/CallRoom";

export default function CallPage() {
	const { id } = useParams<{ id: string }>();
	const { call, isCallLoading } = useGetCallById(id);
	const [isCallJoined, setIsCallJoined] = useState(false);

	if (!call || isCallLoading) {
		return (
			<main className='min-h-screen w-full items-center justify-center'>
				<Loader2 className='animate-spin text-blue-500' />
			</main>
		);
	}

	return (
		<main className='min-h-screen w-full items-center justify-center'>
			<StreamCall call={call}>
				<StreamTheme>
					{isCallJoined ? (
						<CallRoom call={call} />
					) : (
						<SetUp call={call} setIsCallJoined={setIsCallJoined} />
					)}
				</StreamTheme>
			</StreamCall>
		</main>
	);
}