export interface User {
  id: string;
  login: string;
  name: string | null;
  howFound: string | null;
  germanLevel: string | null;
  country: string | null;
  language: string | null;
  goals: string | null;
  newsletter?: boolean;
}

export type ProfileField =
  | "howFound"
  | "germanLevel"
  | "country"
  | "language"
  | "goals";

export type UpdateProfileRequest = Partial<
  Pick<User, ProfileField | "name">
>;
