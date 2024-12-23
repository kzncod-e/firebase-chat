export type Room = {
  id: string;
  name: string;
  imgUrl: string;
  participants: [];
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
};
