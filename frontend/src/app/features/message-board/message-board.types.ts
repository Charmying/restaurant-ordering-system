export interface MessageBoardItem {
  _id: string;
  userId: string;
  username: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface MessageBoardState {
  messages: MessageBoardItem[];
}
