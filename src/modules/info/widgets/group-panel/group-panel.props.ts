import type { ChatFilesListApi } from 'modules/info/model/info.api.schema';

export type GroupPanelProps = {
  uid: string;
  currentUid: string;
  wsUrl: string;
  filesList: {
    imageFileList: ChatFilesListApi[] | undefined;
    fileFileList: ChatFilesListApi[] | undefined;
    voiceFileList: ChatFilesListApi[] | undefined;
  };
  refreshUrl: string;
};
