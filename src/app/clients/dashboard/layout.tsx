import { GenericAuthProvider } from "@/app/(root)/AuthContext";
import { StreamVideoProvider } from "@/app/(stream)/providers/StreamVideoProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Clients Dashboard | TherapyMart",
	description: "Client Dashboard",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<main className='w-full h-full'>
			<GenericAuthProvider userType="clients" redirectPath="/clients/login">
				<StreamVideoProvider>
					{children}
				</StreamVideoProvider>
			</GenericAuthProvider>
			

		</main>
	);
}