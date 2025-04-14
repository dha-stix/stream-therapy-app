"use client";
import { Call } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { VideoPreview, DeviceSettings } from "@stream-io/video-react-sdk";


export default function SetUp({ call, setIsCallJoined }: { call: Call, setIsCallJoined: (value: boolean) => void }) {
		const [camEnabled, setCamEnabled] = useState<boolean>(false);
	const [micEnabled, setMicEnabled] = useState<boolean>(false);

	const handleEnableCamera = () => {
		if (!camEnabled) {
			call?.camera.enable();
			setCamEnabled(true);
			toast.success("Camera enabled");
		} else {
			call?.camera.disable();
			setCamEnabled(false);
			toast.error("Camera disabled");
		}
    };
    
	const handleEnableMic = () => {
		if (!micEnabled) {
			call?.microphone.enable();
			setMicEnabled(true);
			toast.success("Microphone enabled");
		} else {
			call?.microphone.disable();
			setMicEnabled(false);
			toast.error("Microphone disabled");
		}
	};

	const handleJoinCall = () => { 
		call.join()
		setIsCallJoined(true);
	}
	
	return (
		<main className='min-h-screen w-full flex flex-col items-center justify-center'>
				<h2 className='text-3xl font-bold text-center text-blue-500'>
					{call.state.custom.description}
				</h2>
				<p className='text-center mb-4 text-gray-400'>
					Please update your microphone and camera settings
				</p>

				<h2 className='text-2xl font-bold text-center mb-4'> </h2>

				<div className='w-2/5 h-[400px] my-4 rounded-lg shadow-md'>
					<VideoPreview className='w-full h-full mt-4' />
				</div>

				<div className='flex gap-4 my-4'>
					<div
						className='shadow-md rounded-full p-3 bg-gray-100 hover:bg-gray-200 transition-all duration-200 cursor-pointer'
						onClick={handleEnableCamera}
					>
						{camEnabled ? (
							<CameraOff className='text-blue-500' size={40} />
						) : (
							<Camera className='text-blue-500' size={40} />
						)}
					</div>

					<div
						className='shadow-md rounded-full p-3 bg-gray-100 hover:bg-gray-200 transition-all duration-200 cursor-pointer'
						onClick={handleEnableMic}
					>
						{micEnabled ? (
							<MicOff className='text-blue-500' size={40} />
						) : (
							<Mic className='text-blue-500' size={40} />
						)}
						</div>
						
                        
                        <div className="shadow-md rounded-full p-3 bg-gray-100 hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                            <DeviceSettings />
                        </div>
				</div>

            <button className='bg-blue-500 text-lg mt-4 text-white rounded-lg  px-8 py-4 shadow-md hover:bg-blue-600 transition-all duration-200'
                onClick={handleJoinCall}
            >
					Join Call
				</button>
		</main>
		
	)
}