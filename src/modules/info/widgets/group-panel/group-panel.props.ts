import type { ChatFilesListApi, MessageLinkApi } from 'modules/info/model/info.api.schema';
export type GroupPanelProps = {
  uid: string;
  currentUid: string;

  filesList: {
    imageFileList: ChatFilesListApi[] | undefined;
    fileFileList: ChatFilesListApi[] | undefined;
    voiceFileList: ChatFilesListApi[] | undefined;
    linksList: MessageLinkApi[] | undefined;
  };
};
