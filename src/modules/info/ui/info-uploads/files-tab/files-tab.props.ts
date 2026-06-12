import type { ChatFilesListApi } from 'modules/info/model/info.api.schema';
export type FilesTabProps = {
  items: ChatFilesListApi[] | undefined;
};

export type CardFileProps = {
  item: ChatFilesListApi;
};
