import type { ChatFilesListApi } from 'modules/info/model/info.api.schema';

export type GroupPanelProps = {
  uid: string;
  currentUid: string;
  wsUrl: string;
  filesList: ChatFilesListApi[] | undefined;
};
