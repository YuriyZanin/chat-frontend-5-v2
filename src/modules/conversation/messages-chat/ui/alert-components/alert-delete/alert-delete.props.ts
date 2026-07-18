export type AlertDeleteProps = {
  id?: string | number;
  title?: string;
  message?: string;
  okText?: string;
  cancelText?: string;
  showCheckBox?: boolean;
  labelCheckBox?: string;
  onOk: () => void;
  onCancel: () => void;
};
export type CheckBoxProps = {
  labelCheckBox: string | undefined;
};
