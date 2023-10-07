export interface Conversation {
  id: number;
  participants: string[];
}

export interface Message {
  from: string;
  message: string;
}

export interface User {
  username: string;
  fullname: string;
  image: string;
}
