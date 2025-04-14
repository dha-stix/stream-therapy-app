import type { Metadata } from "next";
import { StreamVideoProvider } from "../(stream)/providers/StreamVideoProvider";
import { StreamAuthProvider } from "./providers/StreamAuthProvider";

export const metadata: Metadata = {
	title: "Chat & Interviews | Jobber",
	description: "Sign in to your recruiter account on Jobber",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className='w-full min-h-screen'>
			<StreamAuthProvider>
				<StreamVideoProvider>{children}</StreamVideoProvider>
			</StreamAuthProvider>
			
		</main>
	);
}