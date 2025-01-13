"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";

export default function GamesPage() {
  useAuth();

  const [advertisements, setAdvertisements] = useState([]);
  const api = createAPI();

  const fetchPostsReq = async () => {
    try {
      const response = await api.post(`/api/post/advertisement-requests`);
      if (response.data.status === "200") {
        setAdvertisements(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Error fetching advertisements");
    }
  };

  useEffect(() => {
    fetchPostsReq();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container-fluid bg-light">
        <div className="container mt-5 pt-5">
          <div className="row">
            <div className="col-md-3">
              <Rightnav />
            </div>
            <div className="col-md-9 p-3">
              <div className="card mb-3 shadow-lg border-0">
                <div className="card-body">
                  <h3>Advertisements</h3>
                  <hr className="text-muted" />
                  <table className="table table-secondary table-hover">
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
                              src={ad.image}
                              alt={ad.title}
                              width={50}
                              height={50}
                            />
                          </td>
                          <td>{ad.user_data.email}</td>
                          <td>{ad.title}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
