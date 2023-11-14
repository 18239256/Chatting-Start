import {  Conversation, Knowledge, Message, Robot, User } from "@prisma/client";

export type FullMessageType = Message & {
  sender: FullUserType, 
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

// export type FullRobotUserType = User & {
//   robot: Robot,
//   robotTmpl: RobotTemplate
// };

export type OPENAIFastAPIParamType = {
  model: string,
  messages: any[],
  temperature: number,
  n: number,
  max_tokens: number,
  stop: [],
  stream: boolean,
  presence_penalty: number,
  frequency_penalty: number
};

export type OPENAIFastAPIKBParamType = {
  query: string,
  knowledge_base_name: string,
  top_k: number,
  score_threshold: number
  model_name: string,
  history: any[],
  temperature: number,
  stream: boolean,
  local_doc_url: boolean,
};

export type knowledgeFileArrayType={
  index: number,
  fileName: string,
  ext: string,
};