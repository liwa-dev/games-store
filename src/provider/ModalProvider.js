import React, { createContext, useContext, useState } from 'react'
import Modal from '../libs/Modal';
const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [showCancel, setShowCancel] = useState(true);
  const [showOk, setShowOk] = useState(true);
  const [modalProps, setModalProps] = useState({});

  const openModal = (content, options = { showCancel: true, showOk: true, onOk: null }) => {
    setModalContent(content);
    setShowCancel(options.showCancel);
    setShowOk(options.showOk);
    setModalProps(options);
  };
  const closeModal = () => setModalContent(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal isOpen={!!modalContent} onClose={closeModal} showCancel={showCancel} showOk={showOk} {...modalProps}>
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  );
};