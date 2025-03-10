import React from 'react'

interface ModalProps {
  isOpen: boolean,
  onClose: () => void,
  children: React.ReactNode,
}

const FullScreenModal: React.FC<ModalProps> = ({ isOpen, onClose, children, }) => {
  //TODO only display content when it's finished loading
  if (!isOpen) return null

  return (
    <div
      className='fixed bg-black bg-opacity-50 top-0 left-0 w-full h-full flex items-center justify-center'
      onClick={onClose}
    > 
      {children}
    </div>
  )
}

export default FullScreenModal
