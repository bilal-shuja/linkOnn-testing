'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import createAPI from "@/app/lib/axios";
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import useAuth from "@/app/lib/useAuth";
import { toast } from "react-toastify";

export default function GroupForm() {
  useAuth();
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState(null);  
  const [cover, setCover] = useState(null);   
  const [category, setCategory] = useState("");
  const [privacy, setPrivacy] = useState("");

  const api = createAPI();

  const handleGroupNameChange = (e) => setGroupName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handlePrivacyChange = (e) => setPrivacy(e.target.value);

  const handleAvatarChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setAvatar(files[0]);
    }
  };

  const handleCoverChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setCover(files[0]);
    }
  };

  const addGroup = async () => {
    if (!groupName || !description || !category) {
      toast.info("Please fill in all fields!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("group_title", groupName);
      formData.append("about_group", description);
      formData.append("category", category);
      formData.append("privacy", privacy);
      if (cover) formData.append("cover", cover);
      if (avatar) formData.append("avatar", avatar);

      const response = await api.post("/api/add-group", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code == "200") {
        setGroupName("");
        setCategory("");
        setPrivacy("");
        setDescription("");
        setAvatar(null); 
        setCover(null); 
        toast.success(response.data.message);
        router.push("/pages/groups");
      } else {
        toast.error("Error from server: " + response.data.message);
      }
    } catch (error) {
       toast.error("An unexpected error occurred");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid bg-light">
        <div className="container mt-3 pt-5">
          <div className="row">
            <div className="col-md-3 p-3 rounded">
              <Rightnav />
            </div>
            <div className="col-md-9 p-3">
              <div className="card shadow-lg border-0 p-3">
                <div className="card-body">
                  <h5 className="fw-bold mt-2 fs-4">Create a Group</h5>

                  <div className="mt-4">
                    <label className="form-label mx-1 text-muted">
                      Group Title
                    </label>
                    <input
                      className="form-control px-3"
                      type="text"
                      placeholder="Group Name (Required)"
                      value={groupName}
                      onChange={handleGroupNameChange}
                    />
                    <label className="text-secondary form-label">
                      <small>
                        Name that describes what the group is about.
                      </small>
                    </label>
                  </div>

                  <div className="mt-4 d-flex gap-3">
                    <div className="w-50">
                      <label className="form-label text-muted px-1">
                        Category (required)
                      </label>
                      <select
                        className="form-select bg-light"
                        aria-label="Default select example"
                        value={category}
                        onChange={handleCategoryChange}
                      >
                        <option value="">Select Category</option>
                        <option value="1">Healthcare</option>
                        <option value="2">Business & Finance</option>
                        <option value="3">Education & Learning</option>
                        <option value="4">Fashion & Beauty</option>
                        <option value="5">Food & Beverage</option>
                        <option value="6">Health & Wellness</option>
                        <option value="7">News & Media</option>
                        <option value="8">Science & Technology</option>
                        <option value="9">Sports & Recreation</option>
                        <option value="10">Travel & Tourism</option>
                        <option value="11">Home & Garden</option>
                        <option value="12">Real Estate</option>
                        <option value="13">Automotive</option>
                        <option value="14">Pets & Animals</option>
                        <option value="15">Music & Performing Arts</option>
                        <option value="16">Photography & Visual Arts</option>
                        <option value="17">Legal & Government</option>
                        <option value="18">Environmental & Nature</option>
                        <option value="19">Hobbies & Crafts</option>
                        <option value="20">Books & Literature</option>
                        <option value="21">Religion & Spirituality</option>
                        <option value="22">Technology & IT</option>
                      </select>
                    </div>
                    <div className="w-50">
                      <label className="form-label text-muted px-1">
                        Privacy
                      </label>
                      <select
                        className="form-select bg-light"
                        value={privacy}
                        onChange={handlePrivacyChange}
                      >
                        <option value="1">Public</option>
                        <option value="2">Private</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 d-flex gap-3">
                    <div className="w-50">
                      <label className="form-label text-muted px-1">
                        Group Profile
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <div className="w-50">
                      <label className="form-label text-muted px-1">
                        Group Cover
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleCoverChange}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="form-label mx-1 text-muted">
                      About the Group
                    </label>
                    <textarea
                      className="form-control px-3"
                      rows="3"
                      placeholder="Description (Required)"
                      value={description}
                      onChange={handleDescriptionChange}
                      maxLength={500}
                    ></textarea>

                    <label className="text-secondary form-label">
                      <small> Character limit: 500 </small>
                    </label>
                  </div>

                  <div className="mt-4 d-flex justify-content-end">
                    <button className="btn btn-primary" onClick={addGroup}>
                      Create Group
                    </button>
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
