import { TLLCoordinates } from "./locationTypes";

export type Letter = {
  id: number;
  title: string;
  text: string;
  audio: string;
  image: string;
  coordinates: TLLCoordinates;
};
export type LetterResponse = {
  id: number;
  title: string;
  text?: string | null;
  audio?: string | null;
  image?: string | null;
  LLCoordinates: TLLCoordinates;
};

export type LetterSummary = {
  id: number;
  title: string;
  coordinates: TLLCoordinates;
};

export type LetterRequest = {
  title: string | null;
  text: string | null;
  audio: Blob | null;
  image: Blob | null;
};
