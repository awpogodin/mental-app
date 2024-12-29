import { EntryType } from "../types/types";

export const entryTypeList = [
  { id: "party", emoji: "🎉", label: "Вечеринка" },
  { id: "dinner", emoji: "🍽️", label: "Ужин" },
  { id: "sport", emoji: "🏋️", label: "Спорт" },
  { id: "culture", emoji: "🎭", label: "Культура" },
  { id: "work", emoji: "💼", label: "Работа" },
  { id: "study", emoji: "🎓", label: "Учеба" },
  { id: "art", emoji: "🎨", label: "Искусство" },
  { id: "music", emoji: "🎵", label: "Музыка" },
  { id: "nature", emoji: "🏞️", label: "Природа" },
  { id: "games", emoji: "🎮", label: "Игры" },
  { id: "travel", emoji: "✈️", label: "Путешествия" },
  { id: "birthday", emoji: "🎂", label: "День рождения" },
  { id: "wedding", emoji: "💍", label: "Свадьба" },
  { id: "kids_party", emoji: "👶", label: "Детский праздник" },
  { id: "new_year", emoji: "🎄", label: "Новый год" },
  { id: "anniversary", emoji: "🥳", label: "Юбилей" },
  { id: "friends_meeting", emoji: "🍻", label: "Встреча друзей" },
  { id: "competition", emoji: "🏆", label: "Соревнование" },
  { id: "meeting", emoji: "🧑‍🤝‍🧑", label: "Встреча" },
] as const;

export const entryTypeMap: Record<EntryType, { emoji: string; label: string }> =
  {
    party: { emoji: "🎉", label: "Вечеринка" },
    birthday: { emoji: "🎂", label: "День\n рождения" },
    newYear: { emoji: "🎄", label: "Новый\n год" },
    kidsParty: { emoji: "👶", label: "Детский\n праздник" },
    anniversary: { emoji: "🥳", label: "Юбилей" },
    friendsMeeting: { emoji: "🍻", label: "Встреча\n друзей" },
    meeting: { emoji: "🧑‍🤝‍🧑", label: "Встреча" },
  };
