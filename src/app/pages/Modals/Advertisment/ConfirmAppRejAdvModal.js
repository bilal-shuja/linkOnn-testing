import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import Modal from 'react-bootstrap/Modal';
import React,{useState, useEffect} from 'react';
import Spinner from "react-bootstrap/Spinner"; 


function ConfirmAppRejAdvModal({advID,addIdenti,showConfirmAppRejModal, setShowConfirmAppRejModal , setShowApproveRejectAdvModal , fetchPostsReq}) {
    const [loading, setLoading] = useState(false); 
    const api = createAPI();
    const handleClose = () => setShowConfirmAppRejModal(false);


    
        const advPostAction = async () => {
            setLoading(true); 
    
            try {
                const response = await api.post("/api/post/advertisement-request-action", {
                    ad_id: advID,
                    action:addIdenti,
                });
    
                if (response.data.status === "200") {
            
                    toast.success(response.data.message);
                    handleClose();
                    setShowApproveRejectAdvModal(false);
                    fetchPostsReq()
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Error while performing this action");
            } finally {
                setLoading(false);
            }
        };

  return (
    <>
    <Modal
      size="md"
      aria-labelledby="contained-modal-title-vcenter2"
      show={showConfirmAppRejModal}
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter2">
       <span className='small'> 
        {
            addIdenti === "approve"?
            <i className="bi bi-check2-circle text-warning me-2"></i> 
            :
        <i className="bi bi-x-circle-fill text-danger me-2"></i>
        }
       
       Are you sure to {addIdenti} this ad request?</span> 
        </Modal.Title>
      </Modal.Header>

      <Modal.Footer>
      <button className="btn btn-outline-primary btn-sm" onClick={advPostAction}>
      {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            
                        </>
                    ) : (
                        "Confirm !"
                    )}
      </button>
    <button className="btn btn-outline-danger btn-sm" onClick={handleClose}> Cancel</button>
      </Modal.Footer>
    </Modal>
    </>
  )
}

export default ConfirmAppRejAdvModal