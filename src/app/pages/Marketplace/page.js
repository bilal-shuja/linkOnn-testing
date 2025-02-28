"use client";

import { useRouter } from "next/navigation";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function MarketPlace() {
    const api = createAPI();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    
    const settings = useSiteSettings();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.post("/api/get-products");
                if (response.data.code === "200") {
                    setProducts(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError("Error fetching products: " + error.message);
            }
        };

        fetchProducts();
    }, []);

    const handleAddProduct = () => {
        router.push("/pages/Marketplace/addproduct");
    };

    const handleMyProducts = () => {
        router.push("/pages/Marketplace/myproducts");
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    if (!settings) return null;

    return error ? (
        <div className="alert alert-danger text-center mt-4">{error}</div>
    ) : (
        <div>
            <div className="bg-light py-5 mt-5">
                <div className="container">
                    <div className="card shadow-lg border-0 p-5 rounded-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="fw-bold text-primary">Discover Featured Products</h2>
                            <div>
                                <button
                                    className="btn btn-outline-primary me-2 fw-bold px-4"
                                    onClick={handleAddProduct}
                                >
                                    + Add Product
                                </button>
                                <button className="btn btn-primary fw-bold px-4" onClick={handleMyProducts}>
                                    My Products
                                </button>
                            </div>
                        </div>

                        <p className="text-muted fs-5">
                            Every week we hand-pick some of the best items from our collection.
                        </p>
                        <hr className="text-muted" />

                        <div className="row">
                            {products.map((product) => (
                                <div className="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center mb-4" key={product.id}>
                                    <div className="card border-0 shadow-sm p-3 rounded-4 text-center w-100">
                                        <Image
                                            src={product.images?.[0]?.image || "/assets/images/placeholder-image.png"}
                                            alt={product.product_name}
                                            className="img-fluid rounded"
                                            width={500}
                                            height={300}
                                            priority
                                            style={{ objectFit: "cover", height: "200px" }}
                                        />
                                        <h6 className="mt-3 text-dark">{product.product_name}</h6>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container my-5">
                <div className="card border-0 shadow-lg p-5 rounded-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="fw-bold text-primary">The Most Recent Products</h2>
                        <select
                            className="form-select w-auto fw-bold"
                            onChange={handleCategoryChange}
                            style={{
                                background: "#f8f9fa",
                                borderRadius: "8px",
                                border: "1px solid #ced4da",
                            }}
                        >
                            <option value="">Select Category</option>
                            {settings.product_categories &&
                                Object.entries(settings.product_categories).map(([id, category]) => (
                                    <option key={id} value={category}>
                                        {category}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <hr className="text-muted" />

                    <div className="row mt-4">
                        {products.slice(0, 3).map((product) => (
                            <div className="col-lg-4 col-md-6 mb-4" key={product.id}>
                                <div
                                    className="card border-0 shadow-lg rounded-4 overflow-hidden"
                                    style={{ transition: "transform 0.3s ease-in-out" }}
                                >
                                    <Image
                                        src={product.images?.[0]?.image || "/assets/images/placeholder-image.png"}
                                        alt={product.product_name}
                                        className="card-img-top"
                                        width={400}
                                        height={250}
                                        style={{ objectFit: "cover" }}
                                    />
                                    <div className="card-body text-center">
                                        <h6 className="text-primary fw-bold">{product.product_name}</h6>
                                        <p className="text-muted small">
                                            by {product.user_info.first_name} {product.user_info.last_name} in{" "}
                                            {product.category}
                                        </p>
                                        <h5 className="text-success fw-bold">${product.price}</h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .card:hover {
                    transform: scale(1.03);
                }
                .btn {
                    transition: all 0.3s ease-in-out;
                }
                .btn:hover {
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
                }
            `}</style>
        </div>
    );
}
