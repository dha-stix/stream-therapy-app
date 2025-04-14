interface TherapistData {
	name: string;
	email: string;
	qualification: string;
	summary: string;
	specialization: string;
	country: string;
	image: string;
	id: string;
	payPerHr?: number;
	paymentLink?: string;
}
interface ClientData { name: string; email: string; id: string; image?: string; }

interface PendingPayments {
	id: string;
	client_id: string;
	client_name: string;
	therapist_id: string;
	payment_id: string;
	payment_date: string;
}

interface Reviews {
	id: string;
	therapist_id: string;
	client_id: string;
	client_name: string;
	review: string;
	rating: number;
}

interface Person {
	id: string;
name: string;
image: string;
role: string;
}

interface Member {
	therapist: Person;
	client: Person;
}