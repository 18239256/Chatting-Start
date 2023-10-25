import {  Conversation, Message, User, RobotTalk, Robot } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User, 
  seen: User[]
};

export type FullConversationType = Conversation & { 
  users: User[]; 
  messages: FullMessageType[]
};

export type FullRobotTalkType = RobotTalk & {
  robot: Robot,
  sender: User
};