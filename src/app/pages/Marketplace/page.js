"use client";

import Navbar from "@/app/assets/components/navbar/page";
import useAuth from "@/app/lib/useAuth";
import { useRouter } from 'next/navigation';
import createAPI from "@/app/lib/axios";
import Image from 'next/image';
import { useState, useEffect } from "react";

export default function MarketPlace() {
    useAuth();
    const api = createAPI();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.post('/api/get-products');
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
        router.push('/pages/Marketplace/addproduct');
    };

    const handleMyProducts = () => {
        router.push('/pages/Marketplace/myproducts');
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    return error ? (
        <div>Error: {error}</div>
    ) : (
        <div>
            <Navbar />

            <div className="bg-primary mt-5 py-5">
                <div className="container">
                    <div className="card shadow-lg border-0 p-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="fw-bold">Discover Featured Products</h2>
                            <div>
                                <button className="btn btn-primary me-2" onClick={handleAddProduct}>
                                    Add New Product
                                </button>
                                <button className="btn btn-primary" onClick={handleMyProducts}>My Products</button>
                            </div>
                        </div>

                        <p className="text-muted">
                            Every week we hand-pick some of the best items from our collection
                        </p>
                        <hr className="text-muted" />

                        <div className="row">
                            {products.map((product) => (
                                <div
                                    className="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center mb-4"
                                    key={product.id}
                                >
                                    <div className="border border-1 rounded-2 text-center w-100">
                                        <Image
                                            src={product.images?.[0]?.image || '/default-image.jpg'}
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

            <div className="container my-5">
                <div className="card border-0 shadow-lg p-5">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>The Most Recent Products</h2>
                        <select className="form-select w-auto" onChange={handleCategoryChange}>
                            <option>Select Category</option>
                            <option>Clothing</option>
                            <option>Home and Furniture</option>
                            <option>Books and Media</option>
                            <option>Beauty and Personal Care</option>
                            <option>Sports and Outdoors</option>
                            <option>Toys and Games</option>
                            <option>Automotive</option>
                            <option>Health and Wellness</option>
                            <option>Grocery and Food</option>
                            <option>Electronics</option>
                        </select>
                    </div>
                    <hr className="text-muted" />
                    <div className="row mt-4">
                        {products.slice(0, 3).map((product) => (
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
                                        src={product.images?.[0]?.image || '/default-image.jpg'}
                                        alt={product.product_name}
                                        className="card-img-top"
                                        width={400} 
                                        height={200} 
                                        style={{ objectFit: 'cover' }}
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
                                        <h6>${product.price}</h6>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
