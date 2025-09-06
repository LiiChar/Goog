export type MethodExecute = 'browser' | 'cmd' | 'steam' | 'mouse' | 'keyboard' | 'wait';

export type ExecuteAccomplition = 'sync' | 'async';

export type CommandElement = {
  method: MethodExecute;
  command: string;
  accomplition: ExecuteAccomplition;
};

export type Command = {
  name: string;
  description?: string;
  commands: CommandElement[];
};
