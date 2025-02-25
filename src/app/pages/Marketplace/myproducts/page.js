"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Image from "next/image";

export default function MyProducts() {
    const router = useRouter();
    const api = createAPI();
    const [userid, setUserid] = useState(null);
    const [products, setProducts] = useState([]);
    const [fproducts, setFproducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.post("/api/get-products");
                if (response.data.code === "200") {
                    setFproducts(response.data.data);
                } else {
                    console.error("Failed to fetch products", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = localStorage.getItem("userid");
            if (data) {
                setUserid(JSON.parse(data));
            } else {
                router.push("/login");
            }
        }
    }, []);

    useEffect(() => {
        if (userid) {
            const fetchMyProducts = async () => {
                try {
                    const response = await api.post("/api/get-products", {
                        user_id: userid,
                        limit: 20,
                    });

                    if (response.data.code === "200") {
                        setProducts(response.data.data);
                    } else {
                        console.error("Failed to fetch products:", response.data.message);
                    }
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            };

            fetchMyProducts();
        }
    }, [userid]);

    const handleAddProduct = () => {
        router.push("/pages/Marketplace/addproduct");
    };

    return (
        <div>
            {/* My Products Section */}
            <div className="bg-light py-5 mt-5">
                <div className="container">
                    <div className="card shadow-lg border-0 p-5 rounded-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="fw-bold text-primary">My Products</h2>
                            <div>
                                <button
                                    className="btn btn-outline-primary me-2 fw-bold px-4"
                                    onClick={handleAddProduct}
                                >
                                    + Add Product
                                </button>
                                <button className="btn btn-primary fw-bold px-4" disabled>
                                    My Products
                                </button>
                            </div>
                        </div>

                        <hr className="text-muted" />

                        <div className="row mt-4">
                            {products.length === 0 ? (
                                <div className="text-center text-muted py-5">
                                    <h4>No products available.</h4>
                                    <p className="fs-5">Start by adding new products to your store.</p>
                                </div>
                            ) : (
                                products.map((product) => (
                                    <div className="col-lg-4 col-md-6 mb-4" key={product.id}>
                                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                                            <Image
                                                src={product.images?.[0]?.image || "/assets/images/placeholder-image.png"}
                                                alt={product.product_name}
                                                className="card-img-top"
                                                width={400}
                                                height={250}
                                                style={{ objectFit: "cover" }}
                                            />
                                            <div className="card-body text-center">
                                                <h6 className="text-dark fw-bold">{product.product_name}</h6>
                                                <p className="text-muted small">
                                                    by {product.user_info.first_name} {product.user_info.last_name} in{" "}
                                                    {product.category}
                                                </p>
                                                <h5 className="text-success fw-bold">{product.currency} {product.price}</h5>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products Section */}
            <div className="container my-5">
                <div className="card shadow-lg border-0 p-5 rounded-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="fw-bold text-primary">Discover Featured Products</h2>
                    </div>

                    <p className="text-muted fs-5">
                        Every week we hand-pick some of the best items from our collection.
                    </p>
                    <hr className="text-muted" />

                    <div className="row">
                        {fproducts.map((product) => (
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

            {/* Custom Styles */}
            <style jsx>{`
                .card:hover {
                    transform: scale(1.03);
                    transition: transform 0.3s ease-in-out;
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
