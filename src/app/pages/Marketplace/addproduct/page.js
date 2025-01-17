"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import useAuth from "@/app/lib/useAuth";

export default function AddProductForm() {
    useAuth();
    const router = useRouter();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");

    const api = createAPI();

    const handleNameChange = (e) => setProductName(e.target.value);
    const handleCategoryChange = (e) => setCategory(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handlePriceChange = (e) => setPrice(e.target.value);
    const handleCurrencyChange = (e) => setCurrency(e.target.value);
    const handleStockChange = (e) => setStock(e.target.value);
    const handleLocationChange = (e) => setLocation(e.target.value);
    const handleTypeChange = (e) => setType(e.target.value);

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setImage(files[0]);
        }
    };

    const addProduct = async () => {
        if (!productName || !category || !price || !stock || !image ) {
            setError("Please fill in all required fields!");
            return;
        }

        if (parseFloat(price) <= 0) {
            setError("Price must be greater than zero.");
            return;
        }

        if (parseInt(stock) < 0) {
            setError("Stock cannot be negative.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("product_name", productName);
            formData.append("category", category);
            formData.append("product_description", description);
            formData.append("price", price);
            formData.append("currency", currency);
            formData.append("units", stock);
            formData.append("location", location)
            formData.append("type", type)
            if (image) {
                formData.append("images[]", image);
            }

            const response = await api.post("/api/add-product", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.code == "200") {
                setError("");
                setSuccess(response.data.message);
                router.push("/pages/Marketplace/myproducts");
            } else {
                setError("Error from server: " + response.data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || "An unexpected error occurred");
            console.error(error);
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
                                    <h5 className="fw-bold mt-2 fs-4">Add Product</h5>
                                    {success && (
                                        <div className="alert alert-success mt-2">{success}</div>
                                    )}
                                    {error && <p className="text-center text-danger">{error}</p>}

                                    <div className="mt-4 gap-3 d-flex justify-content-between">
                                        <div className="w-50">
                                            <label className="form-label mx-1 text-muted">Product Name</label>
                                            <input
                                                className="form-control px-3"
                                                type="text"
                                                placeholder="Product Name (Required)"
                                                value={productName}
                                                onChange={handleNameChange}
                                            />
                                        </div>
                                        <div className="w-50">
                                            <label className="form-label mx-1 text-muted">Location</label>
                                            <input
                                                className="form-control px-3"
                                                type="text"
                                                placeholder="Location (Required)"
                                                value={location}
                                                onChange={handleLocationChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="form-label mx-1 text-muted">Description</label>
                                        <textarea
                                            className="form-control px-3"
                                            rows="3"
                                            placeholder="Description (Optional)"
                                            value={description}
                                            onChange={handleDescriptionChange}
                                        ></textarea>
                                    </div>

                                    <div className="mt-4 gap-3 d-flex justify-content-between">
                                        <div className="w-50">
                                            <label className="form-label text-muted px-2">Product Images</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                        <div className="w-50">
                                            <label className="form-label text-muted px-2">Category</label>
                                            <select
                                                className="form-select"
                                                value={category}
                                                onChange={handleCategoryChange}
                                            >
                                                <option value="">Select Category</option>
                                                <option value="1">Clothing</option>
                                                <option value="2">Business & Finance</option>
                                                <option value="3">Books & Media</option>
                                                <option value="4">Fashion & Beauty</option>
                                                <option value="5">Sports & Outdoors</option>
                                                <option value="6">Toys & Games</option>
                                                <option value="7">Automotive</option>
                                                <option value="8">Health & Wellness</option>
                                                <option value="9">Grocery & Food</option>
                                                <option value="10">Home & Furniture</option>
                                                <option value="11">ITs</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4 gap-3 d-flex justify-content-between">
                                        <div className="w-50">
                                            <label className="form-label text-muted px-2">Price</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={price}
                                                onChange={handlePriceChange}
                                                placeholder="Price (Required)"
                                            />
                                        </div>
                                        <div className="w-50">
                                            <label className="form-label text-muted px-2">Currency</label>
                                            <select
                                                className="form-select"
                                                value={currency}
                                                onChange={handleCurrencyChange}
                                            >
                                                <option value="">Select Currency</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                <option value="JPY">JPY</option>
                                                <option value="TRY">TRY</option>
                                                <option value="GBP">GBP</option>
                                                <option value="RUB">RUB</option>
                                                <option value="PLN">PLN</option>
                                                <option value="ILS">ILS</option>
                                                <option value="BRL">BRL</option>
                                                <option value="INR">INR</option>
                                                <option value="PKR">PKR</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="form-label mx-1 text-muted">Units</label>
                                        <input
                                            className="form-control px-3"
                                            type="number"
                                            placeholder="Units (Required)"
                                            value={stock}
                                            onChange={handleStockChange}
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="form-label mx-1 text-muted">Type</label>
                                        <select className="form-select" aria-label="Default select example"
                                            value={type}
                                            onChange={handleTypeChange}
                                        >
                                            <option value="1">New</option>
                                            <option value="2">Used</option>
                                        </select>
                                    </div>

                                    <div className="mt-4 d-flex justify-content-end">
                                        <button className="btn btn-primary" onClick={addProduct}>
                                            Add Product
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
