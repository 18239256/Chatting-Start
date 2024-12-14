import {  Conversation, Knowledge, Message, Robot, User } from "@prisma/client";
import { BlobOptions } from "buffer";

export type FullMessageType = Message & {
  sender: User, 
  seen: User[]
};

export type FullConversationType = Conversation & { 
  users: User[],
  messages: FullMessageType[]
};

export type FullRobotConversationType = Conversation & { 
  users: FullUserType[],
  messages: FullMessageType[]
};

export type FullUserType = User & {
  robot: Robot | null
};

export type FullRobotMessageType = Message & {
  sender: FullUserType, 
  seen: User[]
};

// export type FullRobotUserType = User & {
//   robot: Robot,
//   robotTmpl: RobotTemplate
// };

export type RobotReplyType={
  answer:string,
  docs?:[],
}

export type OPENAIFastAPIParamType = {
  model: string,
  messages: any[],
  temperature: number,
  n?: number,
  max_tokens?: number,
  stop?: [],
  stream?: boolean,
  presence_penalty?: number,
  frequency_penalty?: number,
  top_k?: number,
  local_doc_url?: boolean,
  score_threshold?: number,
};

export type OPENAIFastAPIKBParamType = {
  // query: string,
  knowledge_base_name: string,
  top_k: number,
  score_threshold: number
  model: string,
  messages: any[],
  temperature: number,
  stream?: true,
  local_doc_url: boolean,
};

export type OPENAIFastAPISearchParamType = {
  query: string,
  search_engine_name: string,
  top_k: number,
  model_name: string,
  history: any[],
  temperature: number,
  stream?: true,
};

// export type knowledgeFileArrayType={
//   index: number,
//   fileName: string,
//   ext: string,
// };

export type knowledgeFileArrayType={
  index: number,
  kb_name?: string,
  file_name: string,
  file_ext: string,
  create_time: string,
  in_folder: boolean,
  in_db: boolean,
  file_size: number,
};

export type contactArrayType={
  id: string,
  index: number,
  name: string,
  robot: Robot | null,
  expired: Date | null,
  isRoom: boolean,
};

export type wxMessageArrayType={
  id: string,
  index: number,
  message: string,
  filename: string,
  isTextMessage: boolean,
  deliveried: boolean,
  createdAt: Date,
  deliveryAt: Date | null,
  issuedAt: Date,
  contact_name: string,
  contact_alias: string,
  contact_isRoom: boolean,
  contact_createdAt: boolean,
};