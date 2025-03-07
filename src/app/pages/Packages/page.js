"use client";

import Rightnav from "@/app/assets/components/rightnav/page";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import { useEffect, useState } from "react";
import ModuleUnavailable from "../Modals/ModuleUnavailable";

export default function Packages() {
    const settings = useSiteSettings();
    const api = createAPI();
    const [userdata, setUserdata] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserdata(JSON.parse(data));
        }
    }, []);

    const handleSelectPackage = (pkg) => {
        setSelectedPackage(pkg);
        setShowModal(true);
    };

    const handleConfirmUpgrade = async () => {
        if (!selectedPackage) return;

        try {
            setLoading(true);
            const response = await api.post("/api/upgrade-to-pro", {
                package_id: selectedPackage.id,
            });

            if (response.data.code == "200") {
                if (userdata) {
                    const updatedUserdata = {
                        ...userdata,
                        data: {
                            ...userdata.data,
                            level: selectedPackage.id
                        }
                    };
                    localStorage.setItem("userdata", JSON.stringify(updatedUserdata));
                    setUserdata(updatedUserdata);
                }
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error while upgrading user level");
        }
        finally {
            setLoading(false);
            setShowModal(false);
        }

    };

    if (!settings || !settings.packages) return null;

    const isPackageSelected = (packageId) => {
        if (!userdata || !userdata.data) return false;
        return userdata.data.level === packageId;
    };

    const getButtonText = (packageId) => {
        return isPackageSelected(packageId) ? "SELECTED" : "SELECT";
    };

    const getButtonClass = (packageId) => {
        const baseClass = "btn w-100 rounded-pill ";

        if (isPackageSelected(packageId)) {

            if (packageId === "1") return baseClass + "btn-primary";
            if (packageId === "2") return baseClass + "btn-success";
            return baseClass + "btn-danger";
        } else {

            if (packageId === "1") return baseClass + "btn-outline-primary";
            if (packageId === "2") return baseClass + "btn-outline-success";
            return baseClass + "btn-outline-danger";
        }
    };

    if (settings["chck-point_level_system"] !== "1")  {
        return <ModuleUnavailable />;
    }

    return (
        <div>
            <div className="container-fluid bg-light">
                <div className="container mt-5 pt-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Rightnav />
                        </div>
                        <div className="col-md-9 p-3">
                            <div className="card mb-3 shadow-lg border-0">
                                <div className="card-body p-4">
                                    <h4 className="fw-bold">Pick Your Plan</h4>
                                    <p className="text-secondary">
                                        Pro features give you complete control over your profile.
                                    </p>
                                    <hr className="text-muted my-4" />
                                    <div className="row">
                                        {settings.packages.map((pkg) => (
                                            <div className="col-md-4 mb-4" key={pkg.id}>
                                                <div className={`card h-100 shadow-lg border-0 p-2 package-card ${isPackageSelected(pkg.id) ? 'border border-2 border-primary' : ''}`}>
                                                    <div className="card-body">
                                                        <h5 className="fw-bold text-uppercase text-center">
                                                            {pkg.name}
                                                            {isPackageSelected(pkg.id) && (
                                                                <span className="badge bg-primary ms-2">Current</span>
                                                            )}
                                                        </h5>
                                                        <h2 className="fw-bold text-center my-3">
                                                            ${pkg.package_price}
                                                            <span className="fs-6 fw-semibold">/{pkg.duration}</span>
                                                        </h2>
                                                        <hr className="text-muted m-0" />
                                                        <ul className="list-unstyled my-4 mx-3">
                                                            <li className="my-2">
                                                                <i className={`fas pe-2 ${pkg.featured_member === "1" ? "fa-check text-success" : "fa-close text-danger"}`}></i>
                                                                Feature Members
                                                            </li>
                                                            <li className="my-2">
                                                                <i className={`fas pe-2 ${pkg.verified_badge === "1" ? "fa-check text-success" : "fa-close text-danger"}`}></i>
                                                                Verified Badge
                                                            </li>
                                                            <li className="my-2">
                                                                <i className={`fas pe-2 ${pkg.page_promo === "1" ? "fa-check text-success" : "fa-close text-danger"}`}></i>
                                                                Page Promotion
                                                            </li>
                                                            <li className="my-2">
                                                                <i className={`fas pe-2 ${pkg.post_promo === "1" ? "fa-check text-success" : "fa-close text-danger"}`}></i>
                                                                Post Promotion
                                                            </li>
                                                            <li className="my-2">
                                                                <i className={`fas pe-2 ${pkg.edit_post === "1" ? "fa-check text-success" : "fa-close text-danger"}`}></i>
                                                                Edit Post
                                                            </li>
                                                            <li className="my-2">
                                                                <i className="fas pe-2 fa-check text-success"></i>
                                                                {pkg.point_spendable} Point Spendable
                                                            </li>
                                                        </ul>

                                                        {settings["chck-upgrade_to_pro_system"] === "1" && (
                                                            <button
                                                                className={getButtonClass(pkg.id)}
                                                                onClick={() => handleSelectPackage(pkg)}
                                                                disabled={isPackageSelected(pkg.id)}
                                                            >
                                                                {getButtonText(pkg.id)}
                                                            </button>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <div className={`modal fade ${showModal ? 'show' : ''}`}
                id="confirmUpgradeModal"
                tabIndex="-1"
                aria-labelledby="confirmUpgradeModalLabel"
                aria-hidden={!showModal}
                style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="confirmUpgradeModalLabel">
                                Confirm Package Upgrade
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                                aria-label="Close">
                            </button>
                        </div>
                        <div className="modal-body">
                            {selectedPackage && (
                                <div>
                                    <p>Are you sure you want to upgrade to the <strong>{selectedPackage.name}</strong> package?</p>
                                    <p>Price: <strong>${selectedPackage.package_price}/{selectedPackage.duration}</strong></p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleConfirmUpgrade}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Upgrading...
                                    </>
                                ) : (
                                    "Confirm Upgrade"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-backdrop fade show"></div>
            )}
        </div>
    );
}