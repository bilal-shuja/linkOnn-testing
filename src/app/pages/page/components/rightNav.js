import React, { useState, useEffect } from 'react'
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import Link from "next/link";
import ConfirmModal from '../Modal/ConfirmModal';


export default function RightNav({ pageTimelineData , pageTimelineID }) {

  const api = createAPI();
  const [suggestedPages, setSuggestedPages] = useState([])



  function fetchAllPages() {

    api.get(`/api/get-all-pages`)
      .then((res) => {
        if (res.data.code == "200") {
          setSuggestedPages(res.data.data);
        }

      })
      .catch((error) => {
        if (error)
          toast.error("Error fetching page timeline.");
      })

  }

  useEffect(() => {
    fetchAllPages()
  }, [])



  function SuggestedPages({ items }) {
    
  const [pageID, setPageID] = useState("")
  const [showPageLikeModal , setShowPageLikeModal] = useState(false);
  const [thumbsClick , setThumbsClick] = useState(false)
  


    return (
      <>
        <div className="d-flex">
          <div className="p-2 w-100">

            <div className='d-flex'>
              <Image
                src={!items?.avatar || items.avatar.trim() === ""
                  ? '/assets/images/placeholder-image.png'
                  : items.avatar}
                className="img-fluid rounded me-2"
                alt="cover"
                width={50}
                height={50}
                style={{ objectFit: 'cover', height: '50px', width: '50px' }}
              />
              <div className='suggested-pages-info'>
                <h6>{items.page_title}</h6>
                <small className="mb-0 small text-truncate">2 Members</small>
              </div>
            </div>

          </div>
          <div className="p-2 flex-shrink-1">

            <i className={thumbsClick ? "bi bi-hand-thumbs-up-fill text-primary fs-3": "bi bi-hand-thumbs-up fs-3"} onClick={()=>{
              setPageID(items.id)
              setShowPageLikeModal(true)

            }} style={{cursor:"pointer"}}></i>
          </div>
        </div>

        {
          showPageLikeModal === true ?
          <ConfirmModal
          pageID ={pageID}
          showPageLikeModal = {showPageLikeModal}
          setShowPageLikeModal = {setShowPageLikeModal}
          thumbsClick = {thumbsClick}
          setThumbsClick = {setThumbsClick}
          />
          :
          null

        }

      </>

    )
  }


  return (
    <>
      <div className="col-12 col-lg-4 mt-5">
        <div className="card shadow-lg border-0">
          <div className="card-body p-4">
            <h5>About</h5>
            <p className='text-muted'>{pageTimelineData?.page_description}</p>
            <i className="bi bi-bookmark-fill"></i>&nbsp;
            {pageTimelineData?.page_category}
          </div>


        </div>


        <div className="card shadow-lg border-0 mt-4">
          <div className="card-body p-4">
            <div className='d-flex justify-content-between mb-4'>
              <h5>Suggested Pages</h5>

              <Link href="/pages/page/" className='btn btn-outline-primary btn-sm'>See All Pages</Link>
            </div>

            {

              suggestedPages && suggestedPages?.slice(0, 3).map((items) => {

                return (
                  <SuggestedPages key={items.id} items={items} />

                )
              })
            }

          </div>


        </div>


        

        <div className="card shadow-lg border-0 mt-4">
          <div className="card-body p-4">
            <div className='d-flex justify-content-between mb-4'>
              <h5>Followers</h5>

              {/* href={`/pages/page/Followers/${}`} */}
              <a  className='btn btn-outline-primary btn-sm'>See All Followers</a>

            </div>


            <span className="text-muted">No Followers Found!</span>


            </div>


</div>

      </div>



      




    </>
  )
}
