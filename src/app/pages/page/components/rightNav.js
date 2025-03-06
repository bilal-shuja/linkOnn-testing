import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import ConfirmModal from '../Modal/ConfirmModal';
import React, { useState, useEffect } from 'react'


export default function RightNav({ pageTimelineData }) {

  const api = createAPI();

  const pageID = pageTimelineData?.id;
  const [suggestedPages, setSuggestedPages] = useState([]);
  const [followersList, setFollowersList] = useState([]);



  function fetchAllPages() {

    api.get(`/api/get-all-pages`)
      .then((res) => {
        if (res.data.code == "200") {
          setSuggestedPages(res.data.data);
        }

      })
      .catch((error) => {
        if (error)
          toast.error("Error fetching page information.");
      })

  }


  const fetchFollowers = async () => {
    if (!pageID) return;  

    try {
      const response = await api.post("/api/get-page-followers", { page_id: pageID });
      if (response.data.code === "200") {
        setFollowersList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching page followers");
    }
  };

  useEffect(() => {
    if (pageID) {
      fetchFollowers();
    }
  }, [pageID]);

  useEffect(() => {
    fetchAllPages();

  }, [])





  function SuggestedPages({ items }) {

    const [pageID, setPageID] = useState("")
    const [showPageLikeModal, setShowPageLikeModal] = useState(false);
    const [pageLike, setPageLike] = useState("");



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
              // loader={({ src }) => src}
              />
              <Link
                className='suggested-pages-info text-decoration-none text-black'
                href={`/pages/page/myPageTimeline/${items.id}`}
              >
                <h6>{items.page_title}</h6>
                {/* <small className="mb-0 small text-truncate">2 Members</small> */}
              </Link>
            </div>

          </div>
          <div className="p-2 flex-shrink-1">

            <i
              className={
                items?.is_liked === true ? "bi bi-hand-thumbs-up-fill text-primary fs-3"
                  : "bi bi-hand-thumbs-up fs-3"
              }
              onClick={() => {
                setPageID(items.id);
                setShowPageLikeModal(true);
                setPageLike(items.is_liked)
              }}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
        </div>

        {
          showPageLikeModal && (
            <ConfirmModal
              pageID={pageID}
              showPageLikeModal={showPageLikeModal}
              setShowPageLikeModal={setShowPageLikeModal}
              fetchAllPages={fetchAllPages}
              pageLike={pageLike}

            />
          )



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
              <Link href={`/pages/page/Followers/${pageID}`} className='btn btn-outline-primary btn-sm'>See All Followers</Link>

            </div>


            {followersList.length > 0 ? (
              <div>
                {followersList.map((follower) => (
                  <div key={follower.id} className="d-flex align-items-center mb-3">
                    <Image
                      src={follower.avatar || "/assets/images/placeholder-image.png"}
                      className="img-fluid rounded-circle"
                      width={40}
                      height={40}
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      alt={follower.username}
                    />
                    <span className="ms-2">{follower.username}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-muted">No Followers Found!</span>
            )}


          </div>


        </div>

      </div>




    </>
  )
}
