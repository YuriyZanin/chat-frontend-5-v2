import type { ChatFilesListApi } from 'modules/info/model/info.api.schema';

export type MediaTabProps = {
  items: ChatFilesListApi[] | undefined;
};

export type MediaProps = {
  item: ChatFilesListApi;
};
