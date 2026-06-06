import type { ChatFilesListApi } from 'modules/info/model/info.api.schema';
export type FilesTabProps = {
  items: ChatFilesListApi[];
};

export type CardFileProps = {
  item: ChatFilesListApi;
};
