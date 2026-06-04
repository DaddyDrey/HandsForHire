const paths = {
  home: "/",
  findAPro: "/pros",
  postJob: "/post-job",
  becomeAPro: "/become-a-pro",
  login: "/login",
  signup: "/signup",
  account: "/account",
  myListings: "/my-listings",
  contacts: "/contacts",
  about: "/about",
  terms: "/terms",
  admin: "/admin",
  proReviews: "/pros/:id/reviews",
};

export const proReviewsTo = (id: string) => `/pros/${id}/reviews`;

export default paths;
