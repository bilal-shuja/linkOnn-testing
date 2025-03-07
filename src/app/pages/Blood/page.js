"use client";


import Rightnav from "@/app/assets/components/rightnav/page";
import Image from "next/image";
import { useSiteSettings } from "@/context/SiteSettingsContext"
import Link from "next/link";
import ModuleUnavailable from "../Modals/ModuleUnavailable";

export default function Blood() {
    const settings = useSiteSettings()

    if (!settings) return null

    if (settings["chck-blood"] !== "1") {
        return <ModuleUnavailable />;
    }

    return (
        <div>
              
            <div className="container-fluid ">

                <div className="container mt-5 pt-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Rightnav />
                        </div>
                        <div className="col-md-9 p-3">
                            <div className="card mb-3 shadow-lg border-0">
                                <div className="card-body">

                                    <Image
                                        src="/assets/images/blood.png"
                                        alt="Blood donation illustration"
                                        layout="responsive"
                                        width={600}
                                        height={400}
                                        className="rounded"
                                    />
                                </div>

                                <div className="row mt-4">
                                    <div className="col-md-10 offset-md-1">
                                        <Link href="/pages/Blood/finddonors" className="text-decoration-none">
                                            <div className="card clickable-card">
                                                <div className="card-body">
                                                    <i className="bi bi-droplet"></i> Find Donor
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>


                                <div className="row my-3">
                                    <div className="col-md-10 offset-md-1">
                                        <Link href="/pages/Blood/bloodrequests" className="text-decoration-none">
                                            <div className="card clickable-card">
                                                <div className="card-body">
                                                    <i className="bi bi-droplet-fill"></i> Blood Request
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
