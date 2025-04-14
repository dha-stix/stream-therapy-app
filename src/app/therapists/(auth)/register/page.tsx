"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { countries, qualifications, specializations } from "@/lib/utils";
import { therapistSignUp } from "@/lib/auth-functions";

export default function Register() {
	const router = useRouter()
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
		e.preventDefault();
		setButtonClicked(true)
		const formData = new FormData(e.currentTarget);
      	const result = await therapistSignUp(formData);
		if (result.user) {
			toast.success("Authentication Successful", {
				description: result.message,
			});
			setButtonClicked(false);
			router.push("/therapists/login");
		} else {
			toast.error("Authentication Failed", {
				description: result.message,
			});
			setButtonClicked(false);
		}
	}

	return (
		<section className='md:w-3/4 w-full h-full flex flex-col justify-center md:px-8 px-6 py-8 '>
			<h2 className='text-3xl font-bold mb-3 md:text-left text-center'>
				Therapist Registration
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

                <label htmlFor='qualification' className='mb-2 opacity-60'>
					Highest Qualification Obtained
				</label>
                
                <select
					id='qualification'
					required
					name='qualification'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3  '
                >
                    <option value="">-- Select a highest qualification--</option>
					{qualifications.map((degree) => (
						<option key={degree.id} value={degree.name}>
							{degree.name}
						</option>
					))}
                </select>

                <label htmlFor='summary' className='mb-2 opacity-60'>
					Professional Summary
                </label>
                <textarea
                    required
                    id='summary'
                    name='summary'
                    rows={5}
                    maxLength={500}
                    className='w-full px-4 py-3 border-[1px] rounded-md mb-2'
                />

                <label htmlFor='specialization' className='mb-2 opacity-60'>
					Specialization
				</label>
                
                <select
					id='specialization'
					required
					name='specialization'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3  '
                >
                    <option value="">-- Select a specialization --</option>
					{specializations.map((field) => (
						<option key={field.id} value={field.name}>
							{field.name}
						</option>
					))}
				</select>

				 <label htmlFor='country' className='mb-2 opacity-60'>
					Country
				</label>
				
				 <select
					id='country'
					required
					name='country'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3  '
                >
                    <option value="">-- Select Country --</option>
					{countries.map((country) => (
						<option key={country.id} value={country.name}>
							{country.name}
						</option>
					))}
                </select>
                
                <label htmlFor='image' className='mb-2 opacity-60  '>
					Headshot
				</label>
				<input
					required
					type='file'
					name='image'
					accept='image/png, image/jpeg'
					id='image'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2  '
				/>

				<button type="submit" className='mt-6 mb-2 text-lg text-white rounded-md bg-blue-500 w-full px-8 py-4 cursor-pointer hover:bg-blue-600' disabled={buttonClicked}>
					{buttonClicked ? "Registering..." : "Register"}
				</button>
				<p className=' opacity-60 text-center'>
					Already have an account? {" "}
					<Link href='/therapists/login' className='text-blue-800'>
						Sign in
					</Link>
				</p>
			</form>
		</section>
	);
}