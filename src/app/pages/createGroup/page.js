'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import createAPI from "@/app/lib/axios";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import Rightnav from "@/app/assets/components/rightnav/page";
import { toast } from "react-toastify";

export default function GroupForm() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [category, setCategory] = useState("");
  const [privacy, setPrivacy] = useState("");
  const settings = useSiteSettings();
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

  if (!settings) return null;


  return (
    <div>
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
