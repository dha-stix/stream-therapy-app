"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { clientSignUp } from "@/lib/auth-functions";

export default function Register() {
	const router = useRouter()
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
		e.preventDefault();
		setButtonClicked(true)
		const formData = new FormData(e.currentTarget);
		const result = await clientSignUp(formData);
		if (result.user) {
			toast.success("Authentication Successful", {
				description: result.message,
			});
			setButtonClicked(false);
			router.push("/clients/login");
		}else {
			toast.error("Authentication Failed", {
				description: result.message,
			});
			setButtonClicked(false);
		}
	}

	return (
		<section className='md:w-3/4 w-full h-screen flex flex-col justify-center md:px-8 px-6 items-center'>
			<h2 className='text-3xl font-bold mb-3 md:text-left text-center'>
				Client Registration
			</h2>
            <form className='w-full' onSubmit={handleSubmit}>
                <label htmlFor='name' className='mb-2 opacity-60'>
					Full Name
				</label>
				<input
					required
					type='text'
					id='name'
					name='name'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>
				<label htmlFor='email' className='mb-2 opacity-60'>
					Email Address
				</label>
				<input
					required
					type='email'
					id='email'
					name='email'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>

				<label htmlFor='password' className='mb-2 opacity-60'>
					Password
				</label>
				<input
					required
					type='password'
					id='password'
					name='password'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2'
				/>

				<button type="submit" className='mt-6 mb-2 text-lg text-white rounded-md bg-blue-500 w-full px-8 py-4 cursor-pointer hover:bg-blue-600' disabled={buttonClicked}>
					{buttonClicked ? "Registering..." : "Register"}
				</button>
				<p className=' opacity-60 text-center'>
					Already have an account? {" "}
					<Link href='/clients/login' className='text-blue-800'>
						Sign in
					</Link>
				</p>
			</form>
		</section>
	);
}