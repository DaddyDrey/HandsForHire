const paths = {
  home: "/",
  findAPro: "/pros",
  becomeAPro: "/become-a-pro",
  login: "/login",
  signup: "/signup",
  account: "/account",
  contacts: "/contacts",
  about: "/about",
  terms: "/terms",
  admin: "/admin",
  proReviews: "/pros/:id/reviews",
};

export const proReviewsTo = (id: string) => `/pros/${id}/reviews`;

export default paths;
