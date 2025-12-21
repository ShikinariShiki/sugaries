export interface Letter {
  id: string;
  shortcode: string;
  senderName: string;
  recipientName: string;
  content: string;
  hasPIN: boolean;
  envelopeColor?: string;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  backgroundColor?: string;
  musicUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LetterCreateInput {
  senderName: string;
  recipientName: string;
  content: string;
  pin?: string;
  envelopeColor?: string;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  backgroundColor?: string;
  musicUrl?: string;
  imageUrl?: string;
}
