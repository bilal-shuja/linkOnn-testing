import { useState } from 'react';
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


function MessageDeleteModal({chatMessageID,showMessageModal,setUserChat,setShowMessageModal}) {
    const api = createAPI();
    const handleClose = () => setShowMessageModal(!showMessageModal);


    function handleDeleteMessage(){
          try {
              const formData = new FormData();
              formData.append("message_id", chatMessageID);

        
             api.post("/api/chat/delete-message", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res)=>{
                if (res.data.status == 200) {
                    toast.success(res.data.message);
                    setUserChat((prevChat) =>
                        prevChat.filter((chat) => chat.id !== chatMessageID)
                    )
                    handleClose();
                  } else {
                    toast.error(res.data.message);
                  }

              })
        
             
            } catch (error) {
              toast.error("Error deleting message");
            }
    }
  return (
    <>
    
    <Modal
        show={showMessageModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>Delete this message <i className="bi bi-trash3"/></Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
         Are you sure you want to delete this message?
        </Modal.Body>
        <Modal.Footer>
      
          <Button variant="primary" onClick={handleDeleteMessage}>Delete it!</Button>

          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default MessageDeleteModal