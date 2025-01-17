"use client";

import Navbar from "@/app/assets/components/navbar/page";
import useAuth from "@/app/lib/useAuth";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Image from 'next/image';

export default function MyProducts() {
    useAuth();
    const router = useRouter();
    const api = createAPI();
    const [userid, setUserid] = useState(null);
    const [products, setProducts] = useState([]);
    const [fproducts, setFproducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.post('/api/get-products');
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
                router.push('/login');
            }
        }
    }, []);

    useEffect(() => {
        if (userid) {
            const fetchMyProducts = async () => {
                try {
                    const response = await api.post('/api/get-products', {
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
        router.push('/pages/Marketplace/addproduct');
    };

    return (
        <div>
            <Navbar />
            <div className="bg-primary mt-5 py-5 min-vh-50">
                <div className="container">
                    <div className="card shadow-lg border-0 p-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="fw-bold">My Products</h2>
                            <div>
                                <button className="btn btn-primary me-2" onClick={handleAddProduct}>
                                    Add New Product
                                </button>
                                <button className="btn btn-primary" disabled>My Products</button>
                            </div>
                        </div>
                        <hr className="text-muted" />
                        <div className="row mt-4">
                            {products.length === 0 ? (
                                <p>No products available.</p>
                            ) : (
                                products.map((product) => (
                                    <div className="col-lg-4 col-md-6 mb-3" key={product.id}>
                                        <div
                                            className="card"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                height: '100%'
                                            }}
                                        >
                                            <Image
                                                src={product.images[0].image}
                                                alt={product.product_name}
                                                className="card-img-top"
                                                width={400}
                                                height={200}
                                                style={{
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <div
                                                className="card-body text-center"
                                                style={{
                                                    flexGrow: 1
                                                }}
                                            >
                                                <div className="mb-3">{product.product_name}</div>
                                                <p className="text-muted small mb-1">
                                                    by {product.user_info.first_name} {product.user_info.last_name} in{" "}
                                                    {product.category}
                                                </p>
                                                <h5 className="mb-2">{product.product_name}</h5>
                                                <h6>{product.currency} {product.price}</h6>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="card shadow-lg border-0 p-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="fw-bold">Discover Featured Products</h2>
                    </div>

                    <p className="text-muted">
                        Every week we hand-pick some of the best items from our collection
                    </p>
                    <hr className="text-muted" />

                    <div className="row">
                        {fproducts.map((product) => (
                            <div
                                className="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center mb-4"
                                key={product.id}
                            >
                                <div className="border border-1 rounded-2 text-center w-100">
                                    <Image
                                        src={product.images[0].image}
                                        alt={product.product_name}
                                        className="img-fluid rounded"
                                        width={500}
                                        height={300}
                                        priority
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
