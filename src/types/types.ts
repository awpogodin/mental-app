export type EntryType =
  | "party"
  | "birthday"
  | "newYear"
  | "kidsParty"
  | "anniversary"
  | "friendsMeeting"
  | "meeting";

export type Entry = {
  id: string;
  name: string;
  description: string;
  author: string;
  type: EntryType;
  guests: string;
  date: string;
  time: string;
  location?: string;
};
