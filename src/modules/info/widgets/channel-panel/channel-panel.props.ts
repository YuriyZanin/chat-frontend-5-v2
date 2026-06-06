import type { ChatFilesListApi } from 'modules/info/model/info.api.schema';

export type ChannelPanelProps = {
  uid: string;
  currentUid: string;
  wsUrl: string;
  filesList: ChatFilesListApi[] | undefined;
};
