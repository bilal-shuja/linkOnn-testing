"use client";

import Rightnav from "@/app/assets/components/rightnav/page";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import Link from "next/link";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { use } from "react";

export default function Groups({ params }) {

    const api = createAPI();
    const router = useRouter();

    const { editGroup } = use(params)

    const [sepGroup, setSpecificGroup] = useState('');
    const settings = useSiteSettings();
    const [groupTitle, setGroupTitle] = useState('');
    const [groupCategory, setGroupCategory] = useState('');
    const [groupPrivacy, setGroupPrivacy] = useState('');
    const [groupAbout, setGroupAbout] = useState('');
    const [groupProfileImg, setGroupProfileImg] = useState(null);
    const [coverImg, setCoverImg] = useState(null);


    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];

        setGroupProfileImg(file);
    };


    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImg(file);
        }
    };

    function fetchSpecificGroup() {
        api.post("/api/get-group-data", { group_id: editGroup })
            .then((res) => {
                if (res.data.code == "200") {
                    const groupData = res.data.data;
                    setSpecificGroup(groupData);

                    setGroupTitle(groupData.group_title || '');
                    
                    setGroupCategory(groupData.category || '');
                    
                    setGroupPrivacy(groupData.privacy || '');
                    setGroupAbout(groupData.about_group || '');
                    
                }
            })
            .catch((error) => {
                if (error) toast.error("Error fetching group");
            });
    }


    const updateGroup = async () => {
        try {
            const formData = new FormData();
            if (editGroup) formData.append("group_id", editGroup);
            if (groupTitle) formData.append("group_title", groupTitle);
            if (groupCategory) formData.append("category", groupCategory);
            if (groupPrivacy) formData.append("privacy", groupPrivacy);
            if (groupAbout) formData.append("about_group", groupAbout);

            if (coverImg) formData.append("cover", coverImg);
            if (groupProfileImg) formData.append("avatar", groupProfileImg);

            const response = await api.post("/api/update-group", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.code == "200") {
                toast.success(response.data.message);
                await new Promise(resolve => setTimeout(resolve, 1000));
                router.push('/pages/groups')
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error)
                toast.error("Error updating group");
        }
    };


    useEffect(() => {
        fetchSpecificGroup();
        
    }, [settings]);

    if (!settings) return null;
    
    const findCategoryKey = () => {
        if (!settings.group_categories || !groupCategory) return '';
        
        if (settings.group_categories[groupCategory]) return groupCategory;
        
        const entry = Object.entries(settings.group_categories).find(
            ([key, value]) => value === groupCategory
        );
        
        return entry ? entry[0] : '';
    };
    
    const categoryKey = findCategoryKey();

    return (
        <>
            <div className="container-fluid bg-light">
                <div className="container pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded">
                            <Rightnav />
                        </div>

                        <div className="col-md-9 p-3 mt-2">
                            <div className="card shadow-lg bg-white border-0">
                                <div className="card-header border-0 border-bottom bg-white">
                                    <h1 className="h4 card-title mb-0 ">Edit Group</h1>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12 mb-2">
                                            <label className="form-label text-secondary">Group Title</label>
                                            <input type="text" className="form-control" id="group_title" name="group_title" placeholder="Group name (Required)" defaultValue={sepGroup.group_title}
                                                onChange={(e) => setGroupTitle(e.target.value)}
                                            />
                                            <small className="text-muted">Name that describes what the group is about.</small>
                                        </div>

                                        <div className="col-sm-6 col-lg-6 mb-2">
                                            <label htmlFor="category" className="form-label text-secondary">Category</label>
                                            <select
                                                className="form-select"
                                                aria-label="Default select example"
                                                value={categoryKey}
                                                onChange={(e) => setGroupCategory(e.target.value)}
                                            >
                                                <option value="">Select Category</option>
                                                {settings.group_categories &&
                                                    Object.entries(settings.group_categories).map(
                                                        ([key, value]) => (
                                                            <option key={key} value={key}>
                                                                {value}
                                                            </option>
                                                        )
                                                    )}
                                            </select>
                                        </div>

                                        <div className="col-sm-6 col-lg-6 mb-2">
                                            <label htmlFor="privacy" className="form-label text-secondary">Privacy</label>
                                            <select className="form-select" id="privacy" name="privacy" required aria-invalid="false"
                                                value={groupPrivacy}
                                                onChange={(e) => setGroupPrivacy(e.target.value)}
                                            >
                                                <option value="Public">Public</option>
                                                <option value="Private">Private</option>
                                            </select>

                                        </div>


                                        <div className="col-sm-6 col-lg-6 mb-3">
                                            <label htmlFor="avatar" className="form-label text-secondary">Group profile</label>
                                            <input type="file" name="avatar" className="form-control" id="avatar" accept="image/*"
                                                onChange={handleProfileImageChange}
                                            />

                                        </div>

                                        <div className="col-sm-6 col-lg-6 mb-3">
                                            <label htmlFor="cover" className="form-label text-secondary">Group Cover</label>
                                            <input type="file" name="cover" className="form-control" id="cover" accept="image/*"
                                                onChange={handleCoverImageChange}
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label text-secondary">About the group</label>
                                            <div className="form-floating">
                                                <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: "100px" }}
                                                    defaultValue={sepGroup.about_group}
                                                    onChange={(e) => setGroupAbout(e.target.value)}
                                                ></textarea>
                                                <label htmlFor="floatingTextarea2">About the group...</label>
                                            </div>
                                            <small>Character limit: 500</small>
                                        </div>

                                        <div className="col-12 text-end">
                                            <Link href="/pages/groups" className="btn btn-danger me-2">Cancel</Link>
                                            <button type="submit" className="btn btn-primary mb-0" onClick={updateGroup}>Update Group</button>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}