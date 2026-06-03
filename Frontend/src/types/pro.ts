export type ReviewSummary = {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
};

export type ProProfile = {
  id: string;
  name: string;
  age: number | null;
  trade: string;
  city: string;
  rating: number;
  reviewsCount: number;
  hourlyFrom: number;
  tags: string[];
  description: string;
  reviews: ReviewSummary[];
};
