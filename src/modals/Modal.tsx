/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import React from 'react';

interface ModalProps {
  isOpen?: boolean;
  minWidth?: string | number;
  minHeight?: string | number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  backdropStyle?: React.CSSProperties;
  containerClassName?: string;
  className?: string;
  backdropClassName?: string;
  noBackdrop?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

const Modal = ({
  isOpen,
  minWidth,
  minHeight,
  width,
  height,
  style,
  backdropStyle,
  containerClassName,
  className,
  backdropClassName,
  noBackdrop,
  onClose,
  children,
}: ModalProps) => {
  if (isOpen === false) return null;

  const modalStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 11,
    minWidth: minWidth || '50%',
    height: minHeight,
    minHeight: minHeight || '60%',
    background: '#fff',
  };

  if (width && height) {
    modalStyle.width = width;
    modalStyle.height = height;
    modalStyle.marginLeft = (width / 2) * -1;
    modalStyle.marginTop = (height / 2) * -1;
    modalStyle.transform = undefined;
  }

  if (style) {
    Object.assign(modalStyle, style);
  }

  const computedBackdropStyle: React.CSSProperties = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 10,
    background: 'rgba(0, 0, 0, 0.3)',
  };

  if (backdropStyle) {
    Object.assign(computedBackdropStyle, backdropStyle);
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={containerClassName}>
      <div className={className} style={modalStyle}>
        {children}
      </div>
      {!noBackdrop && (
        <div
          className={backdropClassName}
          style={computedBackdropStyle}
          onClick={handleBackdropClick}
        />
      )}
    </div>
  );
};

export default Modal;
