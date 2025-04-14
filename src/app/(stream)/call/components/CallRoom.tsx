"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	PaginatedGridLayout,
	SpeakerLayout,
	CallControls,
	Call,
	useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { toast } from "sonner";
type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

export default function CallRoom({ call }: { call: Call }) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [layout, setLayout] = useState<CallLayoutType>("grid");
	const router = useRouter();

	const handleLeave = () => {
		if (confirm("Are you sure you want to leave the call?")) {
			router.push("/");
		}
	};

	const CallLayout = () => {
		switch (layout) {
			case "grid":
				return <PaginatedGridLayout />;
			case "speaker-right":
				return <SpeakerLayout participantsBarPosition='left' />;
			default:
				return <SpeakerLayout participantsBarPosition='right' />;
		}
	};

	return (
		<section className='relative min-h-screen w-full overflow-hidden pt-4'>
			<div className='relative flex size-full items-center justify-center'>
				<div className='flex size-full max-w-[1000px] items-center'>
					<CallLayout />
				</div>
				<div className='fixed bottom-0 flex w-full items-center justify-center gap-5'>
					<CallControls onLeave={handleLeave} />
				</div>

				<div className='fixed bottom-0 right-0 flex items-center justify-center gap-5 p-5'>
					<EndCallButton call={call} />
				</div>
			</div>
		</section>
	);
}

const EndCallButton = ({ call }: { call: Call }) => {
	const { useLocalParticipant } = useCallStateHooks();
	const localParticipant = useLocalParticipant();
	const router = useRouter();

	const participantIsHost =
		localParticipant &&
		call.state.createdBy &&
		localParticipant.userId === call.state.createdBy.id;

	if (!participantIsHost) return null;

	const handleEndCall = () => {
		call.endCall();
		toast.success("Call Ended", {
			description: "The call has been ended for everyone.",
		});
		router.push("/");
	};

	return (
		<button
			className='bg-red-400 text-white p-4 rounded-md mt-2 hover:bg-red-600'
			onClick={handleEndCall}
		>
			End Call for Everyone
		</button>
	);
};