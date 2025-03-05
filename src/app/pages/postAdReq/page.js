"use client";
import Image from "next/image";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import React, { useState, useEffect } from "react";
import Rightnav from "@/app/assets/components/rightnav/page";
import ApproveRejectAdvModal from "../Modals/Advertisment/ApproveRejectAdvModal";

export default function GamesPage() {
  const api = createAPI();
  const [advID, setAdvID] = useState('');
  const [advertisements, setAdvertisements] = useState([]);
  const [showApproveRejectAdvModal, setShowApproveRejectAdvModal] = useState(false);


  const fetchPostsReq = async () => {
    try {
      const response = await api.post(`/api/post/advertisement-requests`);
      if (response.data.status === "200") {
        if (response.data.message === "Post advertisement request not found") {
          setAdvertisements([]);
        } else {
          setAdvertisements(response.data.data);
        }
      } else {
        toast.error(response.data.message);
        setAdvertisements([]);
      }
    } catch (error) {
      toast.error("Error fetching advertisements");
      setAdvertisements([]);
    }
  };

  useEffect(() => {
    fetchPostsReq();
  }, []);

  return (
    <div>
      <div className="container-fluid">
        <div className="container mt-5 pt-5">
          <div className="row">
            <div className="col-md-3">
              <Rightnav />
            </div>
            <div className="col-md-9 p-3">
              <div className="card mb-3 shadow-lg border-0">
                <div className="card-body">
                  <h3>Advertisements <i className="bi bi-tv" /></h3>
                  <hr className="text-muted" />
                  {advertisements.length === 0 ? (
                    <p className="text-center">No advertisements found.</p>
                  ) : (
                    <table className="table table-striped table-responsive table-bordered text-center table-hover">
                      <thead className="table-secondary">
                        <tr>
                          <th>Sr</th>
                          <th>Image</th>
                          <th>Ad Link</th>
                          <th>Ad Title</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {advertisements.map((ad, index) => (
                          <tr key={ad.id}>
                            <td>{index + 1}</td>
                            <td>
                              <Image
                                src={ad?.image || "/assets/images/placeholder-image.png"}
                                alt={ad.title}
                                width={50}
                                height={50}
                                className="rounded rounded-5"
                                // loader={({ src }) => src}

                              />
                            </td>
                            <td>{ad.user_data.email}</td>
                            <td>{ad.title}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary" onClick={()=>{
                                setAdvID(ad.id)
                                setShowApproveRejectAdvModal(true)
                              }}>
                                <i className="bi bi-eye"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {
                  showApproveRejectAdvModal && (
                    <ApproveRejectAdvModal
                    advID = {advID}
                    showApproveRejectAdvModal = {showApproveRejectAdvModal}
                    setShowApproveRejectAdvModal = {setShowApproveRejectAdvModal}
                    fetchPostsReq = {fetchPostsReq}
                    />
                  )
                
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
