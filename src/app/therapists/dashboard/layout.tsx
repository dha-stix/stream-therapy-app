import { StreamVideoProvider } from "@/app/(stream)/providers/StreamVideoProvider";
import { GenericAuthProvider } from "@/app/(root)/AuthContext";
import type { Metadata } from "next";


export const metadata: Metadata = {
	title: "Therapists Dashboard | TherapyMart",
	description: "Therapists Dashboard",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<main className='w-full h-full'>
			<GenericAuthProvider userType="therapists" redirectPath="/therapists/login">
				<StreamVideoProvider>
					{children}
				</StreamVideoProvider>
				
			</GenericAuthProvider>
			

		</main>
	);
}