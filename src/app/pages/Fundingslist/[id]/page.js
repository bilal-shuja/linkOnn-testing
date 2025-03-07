"use client";

import Rightnav from "@/app/assets/components/rightnav/page";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { use } from "react";
import styles from './FundingDetails.module.css';

export default function Fundingslist({ params }) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;
    const api = createAPI();
    const [fundingData, setFundingData] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFundings = async () => {
        if (!id) return;
        try {
            const response = await api.post("/api/funding-details", { post_id: id });
            if (response.data.status === 200) {
                setFundingData(response.data.data.funding);
                setUsersList(response.data.data.users);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error fetching funding details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFundings();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="container mt-3 pt-5">
                <div className="row">
                   
                    <div className="col-md-3">
                        <Rightnav />
                    </div>

                    <div className="col-md-9 mt-2 mb-3">
                        {fundingData ? (
                            <div className={styles.fundingCard}>
                                <h4 className={styles.fundingTitle}>Fundings</h4>
                                <h2 className={`mt-2 ${styles.fundingTitle}`}>{fundingData.title}</h2>
                                <p className={styles.fundingDate}>{fundingData.created_at}</p>
                                <Image
                                    src={fundingData.image || "/assets/images/placeholder-image.png"}
                                    alt={fundingData.title}
                                    width={800}
                                    height={300}
                                    className={styles.fundingImage}
                                />
                                <p className={styles.fundingDescription}>{fundingData.description}</p>
                                <p className={styles.fundingAmount}>Required Amount: ${fundingData.amount}</p>
                            </div>
                        ) : (
                            <p className="text-center">No funding details available.</p>
                        )}

                        {/* Users List */}
                        <div className={styles.usersTable}>
                            <h4 className={styles.fundingTitle}>Fund Raisers List</h4>
                            <table className="table table-hover mt-3">
                                <thead>
                                    <tr className={styles.usersTableHeader}>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersList.length > 0 ? (
                                        usersList.map((user, index) => (
                                            <tr key={`${user.id}-${index}`} className={styles.userRow}>
                                                <td>{index + 1}</td>
                                                <td className="d-flex align-items-center">
                                                    <Image
                                                        src={user.avatar || "/assets/images/userplaceholder.png"}
                                                        alt={user.username}
                                                        width={50}
                                                        height={50}
                                                        className={styles.userAvatar}
                                                    />
                                                    {user.first_name} {user.last_name}
                                                </td>
                                                <td>{user.email}</td>
                                                <td>{user.amount}</td>
                                                <td>{user.created_at}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No fund raisers available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}