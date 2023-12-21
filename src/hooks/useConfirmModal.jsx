import { useRef, useState } from "react";
import { Modal } from "@shopify/polaris";

/**
 *
 * @param confirmAction
 * @param cancelAction
 * @param title
 * @param content
 * @param buttonTitle
 * @param closeTitle
 * @param loading
 * @param disabled
 * @param destructive
 * @param closeCallback
 * @param canCloseAfterFinished
 * @param successCallback
 * @param sectioned
 * @param large
 * @param isConfirmButton
 * @param disabledSecondBtn
 * @param loadingSecondBtn
 * @param titleHidden
 * @param secondaryActions
 * @returns {{openModal: openModal, closeModal: closeModal, modal: JSX.Element, open: boolean}}
 */
export default function useConfirmModal({
  confirmAction,
  cancelAction,
  title,
  content,
  buttonTitle = "Confirm",
  closeTitle = "Cancel",
  loading = false,
  disabled = false,
  destructive = false,
  closeCallback = () => {},
  canCloseAfterFinished = true,
  successCallback = () => {},
  sectioned = true,
  large = false,
  isConfirmButton = true,
  disabledSecondBtn = false,
  loadingSecondBtn = false,
  titleHidden = false,
  secondaryActions = [],
}) {
  const [open, setOpen] = useState(false);
  const input = useRef(null);

  const openModal = (id = null) => {
    setOpen(true);
    if (id) input.current = id;
  };

  const closeModal = () => {
    if (!loading) setOpen(false);
  };

  const handleClose = () => {
    closeModal();
    closeCallback();
  };

  const handleConfirm = async () => {
    const success = await confirmAction(input.current);
    if (!success) return;
    successCallback(success);
    canCloseAfterFinished && handleClose();
  };

  const modal = (
    <Modal
      titleHidden={titleHidden}
      large={large}
      sectioned={sectioned}
      open={open}
      onClose={() => handleClose()}
      title={title}
      primaryAction={
        isConfirmButton && {
          content: buttonTitle,
          loading,
          disabled,
          destructive,
          onAction: () => handleConfirm(),
        }
      }
      secondaryActions={
        closeTitle !== ""
          ? [
              {
                content: closeTitle,
                loading: loadingSecondBtn,
                onAction: () => cancelAction?.() || handleClose(),
                disabled: disabledSecondBtn,
              },
            ]
          : secondaryActions
      }
    >
      {content}
    </Modal>
  );

  return { modal, open, closeModal, openModal };
}
