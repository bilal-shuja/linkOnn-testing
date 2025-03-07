"use client"
import { useState, useEffect } from "react";
import { use } from "react";
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import createAPI from "@/app/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { useSiteSettings } from "@/context/SiteSettingsContext";
import Image from "next/image";


export default function EditMyPage({ params }) {
    const api = createAPI();
    const router = useRouter();

    const { editMyPage } = use(params);

    const settings = useSiteSettings();
    const [specificPageInfo, setSpecificPageInfo] = useState(null);
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    const [pageTitle, setPageTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [pageURL, setPageURL] = useState('');
    const [pageDescription, setPageDescription] = useState('');

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

    // Fetch page data
    function fetchSpecificPage() {
        api.post(`/api/get-page-data?page_id=${editMyPage}`)
            .then((res) => {
                if (res.data.code == "200") {
                    const pageData = res.data.data;
                    setSpecificPageInfo(pageData);
                    
                    // Set basic form fields
                    setPageTitle(pageData.page_title || '');
                    setPageURL(pageData.call_action_type_url || '');
                    setPageDescription(pageData.page_description || '');
                    
                    // Mark as loaded so we can process category in useEffect
                    setIsPageLoaded(true);
                }
            })
            .catch((error) => {
                console.log(error);
                if (error)
                    toast.error("Error fetching page");
            });
    }

    // Process category mapping when both settings and page data are available
    useEffect(() => {
        if (settings && settings.page_categories && specificPageInfo && isPageLoaded) {
            const pageCategoryName = specificPageInfo.page_category;
            
            if (pageCategoryName) {
                // Find the category key based on the category name
                const categoryEntry = Object.entries(settings.page_categories).find(
                    ([key, value]) => value === pageCategoryName
                );
                
                if (categoryEntry) {
                    setSelectedCategory(categoryEntry[0]);
                }
            }
        }
    }, [settings, specificPageInfo, isPageLoaded]);

    // Initial data fetch
    useEffect(() => {
        fetchSpecificPage();
    }, []);

    const updateMyPage = async () => {
        try {
            const formData = new FormData();
            if (editMyPage) formData.append("page_id", editMyPage);
            if (pageTitle) formData.append("page_title", pageTitle);
            if (pageDescription) formData.append("page_description", pageDescription);
            if (pageURL) formData.append("website", pageURL);
            if (selectedCategory) formData.append("page_category", selectedCategory);

            if (coverImg) formData.append("cover", coverImg);
            if (groupProfileImg) formData.append("avatar", groupProfileImg);

            const response = await api.post("/api/update-page", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.code == "200") {
                toast.success(response.data.message);
                await new Promise(resolve => setTimeout(resolve, 1000));
                router.push('/pages/page')
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error)
                toast.error("Error updating page");
        }
    };

    // Show loading state while everything loads
    if (!settings || !isPageLoaded) {
        return (
            <>
                <Navbar />
                <div className="container-fluid mt-5 pt-5">
                    <div className="container mt-5 pt-5">
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                      
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container-fluid">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded">
                            <Rightnav />
                        </div>

                        <div className="col-md-9 p-3 mt-2">
                            <div className="card shadow-lg border-0 p-3">
                                <div className="card-body">

                                    <h5 className="fw-bold  fs-4">Update Page</h5>

                                    <div className="col-12 mb-2">
                                        <label className="form-label">Page name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="page_title" 
                                            name="page_title" 
                                            placeholder="Page name"
                                            value={pageTitle}
                                            onChange={(e) => setPageTitle(e.target.value)}
                                        />
                                    </div>

                                    <div className="row mb-2">
                                        <div className="col-sm-6 col-lg-6">
                                            <label htmlFor="category" className="form-label">Category</label>

                                            <select
                                                className="form-select"
                                                aria-label="Default select example"
                                                value={selectedCategory}
                                                onChange={(e) => {
                                                    setSelectedCategory(e.target.value);
                                                }}
                                            >
                                                <option value="">Select Category</option>
                                                {settings.page_categories &&
                                                    Object.entries(settings.page_categories).map(
                                                        ([key, value]) => (
                                                            <option key={key} value={key}>
                                                                {value}
                                                            </option>
                                                        )
                                                    )}
                                            </select>

                                            <div className="invalid-feedback">Please select a category.</div>
                                        </div>
                                        <div className="col-sm-6 col-lg-6">
                                            <label className="form-label">Website URL</label>
                                            <input 
                                                type="url" 
                                                className="form-control" 
                                                id="website" 
                                                name="website" 
                                                placeholder="https://www.example.com/" 
                                                value={pageURL}
                                                onChange={(e) => setPageURL(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-2">
                                        <div className="col-sm-6 col-lg-6">
                                            <label className="form-label">Avatar</label>
                                            <input 
                                                type="file" 
                                                className="form-control" 
                                                id="avatar" 
                                                name="avatar"
                                                onChange={handleProfileImageChange}
                                            />
                                            {specificPageInfo && specificPageInfo.avatar && (
                                                <div className="mt-2">
                                                    <small>Current avatar:</small>
                                                    <Image 
                                                        src={specificPageInfo.avatar} 
                                                        alt="Current avatar" 
                                                        className="img-thumbnail mt-1" 
                                                        width={100}
                                                        height={50}
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-sm-6 col-lg-6">
                                            <label className="form-label">Cover</label>
                                            <input 
                                                type="file" 
                                                className="form-control" 
                                                id="cover" 
                                                name="cover"
                                                onChange={handleCoverImageChange}
                                            />
                                            {specificPageInfo && specificPageInfo.cover && (
                                                <div className="mt-2">
                                                    <small>Current cover:</small>
                                                    <Image 
                                                        src={specificPageInfo.cover} 
                                                        alt="Current cover" 
                                                        className="img-thumbnail mt-1" 
                                                        width={100}
                                                        height={50}
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">About page</label>
                                        <textarea 
                                            className="form-control" 
                                            id="page_description" 
                                            name="page_description" 
                                            rows={3} 
                                            placeholder="Description"
                                            value={pageDescription}
                                            onChange={(e) => setPageDescription(e.target.value)}
                                        />
                                        <small>Character limit: 500</small>
                                    </div>

                                    <div className="col-12 text-end">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary mb-0"
                                            onClick={updateMyPage}
                                        >
                                            Update page
                                        </button>
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