import React from 'react'
import createAPI from "@/app/lib/axios";
import { toast } from "react-toastify";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function ConfirmModal({pageID , showPageLikeModal, setShowPageLikeModal,pageLike, fetchAllPages}) {

    const api = createAPI();

    const endpoint = `/api/like-unlike-page`;

    function likeDislikePage(){
        api.post(endpoint,{
            page_id:pageID
        })
        .then((res) => {
          if (res.data.code == "200") {
             toast.success(res.data.message);
            //  setThumbsClick(prevState => !prevState)
            console.log(res.data.data)

            // setThumbsClick(res.data.data === 1);
             setShowPageLikeModal(!showPageLikeModal)
             fetchAllPages()
          }
  
        })
        .catch((error) => {
          if (error)
            toast.error("Something went wrong.");
        })
    }


  return (
    <>
        <Modal show={showPageLikeModal}>
        <Modal.Header >
          <Modal.Title> Are you sure? <i className="bi bi-file-earmark-fill text-warning"></i></Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to  {pageLike === true ? "unlike" : "like"} this page?</Modal.Body>
        <Modal.Footer>

        <Button variant="primary" onClick={likeDislikePage}>
           Yes !
          </Button>

          <Button variant="danger" onClick={()=>setShowPageLikeModal(!showPageLikeModal)}>
            Cancel
          </Button>

        </Modal.Footer>
      </Modal>
    </>
  )
}
