import {css} from 'emotion';
import React, {ReactElement} from 'react';
import {createPortal} from 'react-dom';
import ZIndex from '../styles/ZIndex';

interface Props {
  children: ReactElement;
  onClose: () => void;
}

export function Modal({children, onClose}: Props): JSX.Element | null {
  const modalRoot = document.getElementById('modal');
  if (!modalRoot) return null;

  return createPortal(
    <>
      <div className={styles.modalBackground} onClick={onClose} />
      <div className={styles.modalContainer}>{children}</div>
    </>,
    modalRoot,
  );
}

const styles = {
  modalBackground: css`
    background: #000a;
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: ${ZIndex.ModalBackground};
  `,
  modalContainer: css`
    background: var(--background-empty);
    box-sizing: border-box;
    padding: var(--m);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100vw;
    z-index: ${ZIndex.Modal};
  `,
};
