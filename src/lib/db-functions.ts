import { createChannel } from "../../actions/stream.action";
import db from "./firebase";
import { formatPaymentDate } from "./utils";
import {
	collection,
	getDocs,
	getDoc,
	where,
	query,
	doc,
	updateDoc,
	addDoc, 
	deleteDoc,
} from "firebase/firestore";

interface PaymentProps {
	uid: string;
	user: "client_id" | "therapist_id";
}

interface UpdateTherapistProps {
	payPerHr: number;
	paymentLink: string;
	userId: string;
}

export const getPendingPayments = async ({ uid, user }: PaymentProps) => {
	try {
		const q = query(collection(db, "pending_payments"), where(user, "==", uid));
		const querySnapshot = await getDocs(q);
		const pendingPayments: PendingPayments[] = querySnapshot.docs.map(
			(doc) =>
				({
					id: doc.id,
					...doc.data(),
				} as PendingPayments)
		);
		return {
			code: "doc/success",
			status: 200,
			pendingPayments,
			message: "Pending payments fetched successfully",
		};
	} catch (err) {
		return {
			code: "doc/failed",
			status: 500,
			pendingPayments: null,
			err,
			message: "Failed to fetch pending payments",
		};
	}
};

export const updateTherapist = async ({
	payPerHr,
	paymentLink,
	userId,
}: UpdateTherapistProps) => {
	try {
		const therapistRef = doc(db, "therapists", userId);
		await updateDoc(therapistRef, {
			payPerHr,
			paymentLink,
		});
		return {
			code: "doc/success",
			status: 200,
			message: "Therapist updated successfully",
		};
	} catch (err) {
		return {
			code: "doc/failed",
			status: 500,
			err,
			message: "Failed to update therapist",
		};
	}
};

export const getTherapistProfile = async (uid: string) => {
	try {
		const docSnap = await getDoc(doc(db, "therapists", uid));

		if (!docSnap.exists()) {
			return {
				code: "auth/failed",
				status: 500,
				user: null,
				message: "Invalid ID",
			};
		}

		return {
			code: "auth/success",
			status: 200,
			user: docSnap.data(),
			message: "User found",
		};
	} catch (err) {
		return {
			code: "auth/failed",
			status: 404,
			user: null,
			err,
			message: "User Not Found",
		};
	}
};

export const confirmPayment = async (
	formData: FormData,
	userId: string,
	therapistId: string
) => {
	const paymentId = formData.get("paymentId") as string;
	const payeeName = formData.get("payeeName") as string;
	const paymentDate = formatPaymentDate(formData.get("paymentDate") as string);

	if (therapistId === userId) {
		return {
			code: "doc/failed",
			status: 500,
			message: "You cannot confirm your own payment",
		};
	}

	try {
		const { id } = await addDoc(collection(db, "pending_payments"), {
			client_name: payeeName,
			client_id: userId,
			therapist_id: therapistId,
			payment_id: paymentId,
			payment_date: paymentDate,
		});
		if (id) {
			return {
				code: "doc/success",
				status: 200,
				message: "Payment confirmation submitted",
			};
		} else {
			return {
				code: "doc/failed",
				status: 500,
				message: "Failed to submit details",
			};
		}
	} catch (err) {
		return {
			code: "doc/failed",
			status: 500,
			message: "Failed to submit details",
			err,
		};
	}
};

export const getTherapistsList = async () => {
	try {
		const q = query(collection(db, "therapists"));
		const querySnapshot = await getDocs(q);
		const therapists: TherapistData[] = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as TherapistData[];

		return {
			code: "doc/success",
			status: 200,
			therapists,
			message: "Therapists fetched successfully",
		};
	} catch (err) {
		return {
			code: "doc/failed",
			status: 500,
			err,
			therapists: null,
			message: "Failed to fetch therapists",
		};
	}
};

export const getTherapistBySpecialization = async (specialization: string) => {
	try {
		const q = query(
			collection(db, "therapists"),
			where("specialization", "==", specialization)
		);
		const querySnapshot = await getDocs(q);
		const therapists: TherapistData[] = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as TherapistData[];

		return {
			code: "doc/success",
			status: 200,
			therapists,
			message: "Therapists fetched successfully",
		};
	} catch (err) {
		return {
			code: "doc/failed",
			status: 500,
			err,
			therapists: null,
			message: "Failed to fetch therapists",
		};
	}
};

export const createReview = async (
	formData: FormData,
	therapistId: string,
	userId: string
) => {
	const rating = formData.get("rating") as string;
	const review = formData.get("review") as string;

	if (isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) { 
		return {
			code: "doc/failed",
			status: 500,
			message: "Invalid rating",
		};
	}

	try {
		const clientSnap = await getDoc(doc(db, "clients", userId));
		if (!clientSnap.exists()) {
			return {
				code: "doc/failed",
				status: 500,
				message: "User client not found",
			};
		}
		const reviewsRef = query(
			collection(db, "reviews"),
			where("client_id", "==", userId),
			where("therapist_id", "==", therapistId)
		);
		const querySnapshot = await getDocs(reviewsRef);
		if (!querySnapshot.empty) {
			return {
				code: "doc/failed",
				status: 500,
				message: "You have already submitted a review for this therapist",
			};
		}

		const { id } = await addDoc(collection(db, "reviews"), {
			client_name: clientSnap.data()?.name,
			client_id: userId,
			therapist_id: therapistId,
			rating: Number(rating),
			review,
		});
		if (id) {
			return {
				code: "doc/success",
				status: 200,
				message: "Review submitted successfully",
			};
		} else {
			return {
				code: "doc/failed",
				status: 500,
				message: "Failed to submit review",
			};
		}
	} catch (err) {
		return {
			code: "doc/failed",
			status: 500,
			message: "Failed to submit review",
			err,
		};
	}
};

export const getReviews = async (therapistId: string) => { 

	try {
		const q = query(
			collection(db, "reviews"),
			where("therapist_id", "==", therapistId)
		);

		const querySnapshot = await getDocs(q);
		const reviews: Reviews[] = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as Reviews[];

		return {
			code: "doc/success",
			status: 200,
			reviews,
			message: "Reviews fetched successfully",
		}

	
	} catch (err) { 
		return {
			code: "doc/failed",
			status: 500,
			err,
			reviews: null,
			message: "Failed to fetch reviews",
		}
	}

}

export const approvePayment = async (payment: PendingPayments, therapist: TherapistData) => { 
	try {
		const createChat = await createChannel({
			therapist,
			clientName: payment.client_name,
			clientId: payment.client_id,
		})

		if (!createChat.success) {
			return {
				code: "doc/failed",
				status: 500,
				message: createChat.error,
			}
		}
		await deleteDoc(doc(db, "pending_payments", payment.id));

		return {
			code: "doc/success",
			status: 200,
			message: "Payment approved successfully",
		}
	} catch (err) { 
		return {
			code: "doc/failed",
			status: 500,
			err,
			message: "Failed to approve payment",
		}
	}

}

export const cancelPayment = async (payment: PendingPayments) => {

	try {
		await deleteDoc(doc(db, "pending_payments", payment.id));
		return {
			code: "doc/success",
			status: 200,
			message: "Payment cancelled successfully",
		}

	} catch (err) { 
		return {
			code: "doc/failed",
			status: 500,
			err,
			message: "Failed to cancel payment",
	
		}
	}
	
}
 



 