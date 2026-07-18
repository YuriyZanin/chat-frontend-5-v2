import type { ChatFilesListApi } from 'modules/info/model/info.api.schema';

export type VoicesTabProps = {
  items: ChatFilesListApi[] | undefined;
};
export type VoiceProps = {
  item: ChatFilesListApi;
};
