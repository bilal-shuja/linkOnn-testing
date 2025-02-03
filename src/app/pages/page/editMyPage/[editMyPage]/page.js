"use client"
import { useState, useEffect } from "react";
import { use } from "react";
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import createAPI from "@/app/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import Link from "next/link";


export default function EditMyPage({ params }) {


    const api = createAPI();
    const router = useRouter();

    const { editMyPage } = use(params);

    const [specificPageInfo, setSpecificPageInfo] = useState('');
    
    const[pageTitle, setPageTitle] = useState('');
    const[selectedCategory, setSelectedCategory] = useState('');
    const[pageURL, setPageURL] = useState('');
    const[pageDescription, setPageDescription] = useState('');

    const [groupProfileImg, setGroupProfileImg] = useState(null);
    const [coverImg, setCoverImg] = useState(null);



    const categories = [
        { id: 1, name: "Arts & Entertainment" },
        { id: 2, name: "Business & Finance" },
        { id: 3, name: "Education & Learning" },
        { id: 4, name: "Fashion & Beauty" },
        { id: 5, name: "Food & Beverage" },
        { id: 6, name: "Health & Wellness" },
        { id: 7, name: "News & Media" },
        { id: 8, name: "Science & Technology" },
        { id: 9, name: "Sports & Recreation" },
        { id: 10, name: "Travel & Tourism" },
        { id: 11, name: "Community & Social Services" },
        { id: 12, name: "Home & Garden" },
        { id: 13, name: "Real Estate" },
        { id: 14, name: "Automotive" },
        { id: 15, name: "Pets & Animals" },
        { id: 16, name: "Music & Performing Arts" },
        { id: 17, name: "Photography & Visual Arts" },
        { id: 18, name: "Legal & Government" },
        { id: 19, name: "Environmental & Nature" },
        { id: 20, name: "Hobbies & Crafts" },
        { id: 21, name: "Books & Literature" },
        { id: 22, name: "Religion & Spirituality" }
    ];


    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];

        setGroupProfileImg(file); // Preview the image
    };


    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImg(file); // Preview the image
        }
    };


    function fetchSpecificPage() {

        api.post(`/api/get-page-data?page_id=${editMyPage}`)
            .then((res) => {
                if (res.data.code == "200") {
                    setSpecificPageInfo(res.data.data);
                }

            })
            .catch((error) => {
                if (error)
                    toast.error("Error fetching group");
            })

    }



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
                if(error)
                toast.error("Error updating page");
            }
        };
    



    useEffect(() => {
        fetchSpecificPage()
    }, []);


    return (
        <>
            <Navbar />
            <div className="container-fluid bg-light">
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
                                        <input type="text" className="form-control" id="page_title" name="page_title" placeholder="Page name"
                                            onChange={(e)=>setPageTitle(e.target.value)}
                                            defaultValue={specificPageInfo.page_title}

                                        />
                                    </div>

                                    <div className="row mb-2">

                                        <div className="col-sm-6 col-lg-6">
                                            <label htmlFor="category" className="form-label">Category</label>

                                            {/* <select className="form-select" id="category" name="page_category"
                                                value={specificPageInfo?.page_category}
                                                onChange={(e) => {
                                                    setSelectedCategory(e.target.value);
                                                }}
                                            >
                                                <option value disabled>Select Category</option>
                                                <option value={1}>Arts &amp; Entertainment</option>
                                                <option value={2}>Business &amp; Finance</option>
                                                <option value={3}>Education &amp; Learning</option>
                                                <option value={4}>Fashion &amp; Beauty</option>
                                                <option value={5}>Food &amp; Beverage</option>
                                                <option value={6}>Health &amp; Wellness</option>
                                                <option value={7}>News &amp; Media</option>
                                                <option value={8}>Science &amp; Technology</option>
                                                <option value={9}>Sports &amp; Recreation</option>
                                                <option value={10}>Travel &amp; Tourism</option>
                                                <option value={11}>Community &amp; Social Services</option>
                                                <option value={12}>Home &amp; Garden</option>
                                                <option value={13}>Real Estate</option>
                                                <option value={14}>Automotive</option>
                                                <option value={15}>Pets &amp; Animals</option>
                                                <option value={16}>Music &amp; Performing Arts</option>
                                                <option value={17}>Photography &amp; Visual Arts</option>
                                                <option value={18}>Legal &amp; Government</option>
                                                <option value={19}>Environmental &amp; Nature</option>
                                                <option value={20}>Hobbies &amp; Crafts</option>
                                                <option value={21}>Books &amp; Literature</option>
                                                <option value={22}>Religion &amp; Spirituality</option>
                                            </select> */}

                                            {/* 
                                                <select
                                                    className="form-select"
                                                    id="category"
                                                    name="page_category"
                                                    value={specificPageInfo.page_category?.toString() || ''}
                                                    onChange={(e) => {
                                                        setSelectedCategory(e.target.value);
                                                    }}
                                                >
                                                    <option value="" disabled>Select Category</option>
                                                    <option value disabled>Select Category</option>
                                                <option value={1}>Arts &amp; Entertainment</option>
                                                <option value={2}>Business &amp; Finance</option>
                                                <option value={3}>Education &amp; Learning</option>
                                                <option value={4}>Fashion &amp; Beauty</option>
                                                <option value={5}>Food &amp; Beverage</option>
                                                <option value={6}>Health &amp; Wellness</option>
                                                <option value={7}>News &amp; Media</option>
                                                <option value={8}>Science &amp; Technology</option>
                                                <option value={9}>Sports &amp; Recreation</option>
                                                <option value={10}>Travel &amp; Tourism</option>
                                                <option value={11}>Community &amp; Social Services</option>
                                                <option value={12}>Home &amp; Garden</option>
                                                <option value={13}>Real Estate</option>
                                                <option value={14}>Automotive</option>
                                                <option value={15}>Pets &amp; Animals</option>
                                                <option value={16}>Music &amp; Performing Arts</option>
                                                <option value={17}>Photography &amp; Visual Arts</option>
                                                <option value={18}>Legal &amp; Government</option>
                                                <option value={19}>Environmental &amp; Nature</option>
                                                <option value={20}>Hobbies &amp; Crafts</option>
                                                <option value={21}>Books &amp; Literature</option>
                                                <option value={22}>Religion &amp; Spirituality</option>
                                                </select> */}


                                            <select
                                                className="form-select"
                                                aria-label="Default select example"
                                                value={selectedCategory || categories.find(cat => cat.name === specificPageInfo.page_category)?.id || ''}
                                                onChange={(e) => {
                                                    setSelectedCategory(e.target.value);
                                                }}
                                            >
                                                <option value="" disabled>Select Category</option>
                                                {categories?.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="invalid-feedback">Please select a category.</div>
                                        </div>
                                        <div className="col-sm-6 col-lg-6">
                                            <label className="form-label">Website URL</label>
                                            <input type="url" className="form-control" id="website" name="website" placeholder="https://www.example.com/" defaultValue={specificPageInfo.call_action_type_url}
                                            onChange={(e)=> setPageURL(e.target.value)}
                                            />
                                        </div>

                                    </div>


                                    <div className="row mb-2">
                                        <div className="col-sm-6 col-lg-6">
                                            <label className="form-label">Avatar</label>
                                            <input type="file" className="form-control" id="avatar" name="avatar"
                                                onChange={handleProfileImageChange}
                                            />
                                        </div>
                                        <div className="col-sm-6 col-lg-6">
                                            <label className="form-label">Cover</label>
                                            <input type="file" className="form-control" id="cover" name="cover"
                                                onChange={handleCoverImageChange}
                                            />
                                        </div>

                                    </div>


                                    <div className="col-12">
                                        <label className="form-label">About page</label>
                                        <textarea className="form-control" id="page_description" name="page_description" rows={3} placeholder="Description"
                                            defaultValue={specificPageInfo.page_description}
                                            onChange={(e)=>setPageDescription(e.target.value)}
                                        />
                                        <small>Character limit: 500</small>
                                    </div>

                                    <div className="col-12 text-end">
                                        <button type="submit" className="btn btn-primary mb-0"
                                        
                                        onClick={updateMyPage}
                                        >Update page</button>
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
