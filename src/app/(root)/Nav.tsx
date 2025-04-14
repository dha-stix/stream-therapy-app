"use client";
import { authLogout } from "@/lib/auth-functions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { User } from "firebase/auth";

interface ClientProps {
	user: ClientData;
	type: "client"
}

interface TherapistProps {
	user: User;
	type: "therapist"
}

export default function Nav({ user, type }: ClientProps | TherapistProps) {
    
	const router = useRouter();

	const handleSignout = async () => {
		const { status, message } = await authLogout();

		if (status === 500)
			return toast.error("Failed to logout", {
				description: message,
			});
		if (status === 200) {
			toast.success("Logged out successfully", {
				description: message,
			});
			router.push("/clients/login");
		}
	};

	return (
		<nav className='w-full px-8 py-4 flex items-center justify-between h-[10vh] border-b-[1px] border-gray-300'>
			<Link href='/' className='font-bold text-2xl'>
				TherapyMart
            </Link>
            
            {type== "client" ? (
                <div className='flex items-center gap-4'>
				<p className='opacity-60 text-sm'>{user?.name}</p>
				<Link
					href='/therapists'
					target='_blank'
					className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md cursor-pointer'
				>
					Book a Therapist
				</Link>
				<button
					className='bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md cursor-pointer'
					onClick={handleSignout}
				>
					Log out
				</button>
			</div>
            ) : (
              <div className='flex items-center gap-4'>
				<p className='text-sm text-gray-500'>{user.email}</p>
				<button
					className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer'
					onClick={handleSignout}
				>
					Log out
				</button>
			</div>
                    
            )}

			
		</nav>
	);
}