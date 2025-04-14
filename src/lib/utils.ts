import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const specializations: { name: string; id: string }[] = [
  { "name": "Cognitive Behavioral Therapy (CBT)", "id": "cbt" },
  { "name": "Dialectical Behavior Therapy (DBT)", "id": "dbt" },
  { "name": "Eye Movement Desensitization and Reprocessing (EMDR)", "id": "emdr" },
  { "name": "Family Therapy", "id": "family_therapy" },
  { "name": "Child and Adolescent Therapy", "id": "child_adolescent" },
  { "name": "Trauma-Focused CBT (TF-CBT)", "id": "tf_cbt" },
  { "name": "Marriage and Couples Therapy", "id": "couples_therapy" },
  { "name": "Art Therapy", "id": "art_therapy" },
  { "name": "LGBTQ+ Affirmative Therapy", "id": "lgbtq_affirmative" },
  { "name": "Addiction Counseling", "id": "addiction_counseling" }
]

export const qualifications: { name: string; id: string }[] = 
[
  { "name": "High School Diploma", "id": "high_school", },
  { "name": "Associate Degree", "id": "associate_degree" },
  { "name": "Bachelor's Degree", "id": "bachelor_degree",  },
  { "name": "Postgraduate Diploma", "id": "postgraduate_diploma" },
  { "name": "Master's Degree", "id": "masters_degree" },
  { "name": "Doctorate (PhD)", "id": "phd" },
  { "name": "Doctor of Medicine (MD)", "id": "md" },
  { "name": "Juris Doctor (JD)", "id": "jd" },
  { "name": "Professional Certification", "id": "certification" },
  ]

export const countries: { name: string; id: string }[] = [
  { "name": "Nigeria", "id": "nigeria" },
  { "name": "Kenya", "id": "kenya" },
  { "name": "South Africa", "id": "south_africa" },
  { "name": "Ghana", "id": "ghana" },
  { "name": "Uganda", "id": "uganda" },
  { "name": "Tanzania", "id": "tanzania" },
  { "name": "Ethiopia", "id": "ethiopia" },
  { "name": "Morocco", "id": "morocco" },
  { "name": "Egypt", "id": "egypt" },
  { "name": "Rwanda", "id": "rwanda" },
  { "name": "United Kingdom", "id": "united_kingdom" },
  { "name": "Germany", "id": "germany" },
  { "name": "France", "id": "france" },
  { "name": "Italy", "id": "italy" },
  { "name": "Spain", "id": "spain" },
  { "name": "Netherlands", "id": "netherlands" },
  { "name": "Sweden", "id": "sweden" },
  { "name": "Norway", "id": "norway" },
  { "name": "Poland", "id": "poland" },
  { "name": "Portugal", "id": "portugal" },
  { "name": "United States", "id": "united_states" }
]

export const reviewRatings: { name: string; id: string }[] = [
  { "name": "1 Star", "id": "1" },
  { "name": "2 Stars", "id": "2" },
  { "name": "3 Stars", "id": "3" },
  { "name": "4 Stars", "id": "4" },
  { "name": "5 Stars", "id": "5" }
]

export const formatPaymentDate = (dateStr: string): string => {
  const date = new Date(dateStr);

  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'long' });

  const ordinal = (n: number) =>
    n + (['th', 'st', 'nd', 'rd'][(n % 10 > 3 || Math.floor((n % 100) / 10) === 1) ? 0 : n % 10] || 'th');

  return `${ordinal(day)} ${month}, ${year}`;
}

export const calcAvgRating = (reviews: Reviews[]) => {
	if (!reviews || reviews.length === 0) {
		return 0;
	}
	const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
	const averageRating = totalRating / reviews.length;
	return Math.round(averageRating * 10) / 10;
}

export const formatCallDate = (dateString: string | undefined): string => {
  if (!dateString) return ""
  const dt = dateString.toLocaleString()
  return dt.replace(",", " at")
}