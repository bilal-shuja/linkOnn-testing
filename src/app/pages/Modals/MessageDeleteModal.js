import { useState } from 'react';
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


function MessageDeleteModal({chatMessageID,showMessageModal,setUserChat,setShowMessageModal, setIsUserAtBottom}) {
    const api = createAPI();
    const [isDeleting, setIsDeleting] = useState(false);
    const handleClose = () => setShowMessageModal(!showMessageModal);


    async  function handleDeleteMessage(){
      setIsDeleting(true);
      setIsUserAtBottom(false);

      try {
        const formData = new FormData();
        formData.append("message_id", chatMessageID);

        const res = await api.post("/api/chat/delete-message", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.status === 200) {
            toast.success(res.data.message);
            setUserChat((prevChat) => prevChat.filter((chat) => chat.id !== chatMessageID));
            handleClose();
        } else {
            toast.error(res.data.message);
        }
    } catch (error) {
        toast.error("Error deleting message");
    } finally {
        setIsDeleting(false); // Enable button after request finishes
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
      
          <button className='btn btn-primary' onClick={handleDeleteMessage} disabled={isDeleting}> {isDeleting ? "Deleting..." : "Delete it!"} </button>
        {
          isDeleting ? null :
          <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
        }
         
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default MessageDeleteModal