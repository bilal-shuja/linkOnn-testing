"use client";

import Navbar from "@/app/assets/components/navbar/page";
import useAuth from "@/app/lib/useAuth";
import { useRouter } from 'next/navigation';

export default function MyProducts() {
    useAuth();
    const router = useRouter();

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
                            {[1, 2, 3].map((item) => (
                                <div className="col-lg-4 col-md-6 mb-3" key={item}>
                                    <div className="card">
                                        <div className="card-body text-center">
                                            <div className="mb-3">Product {item}</div>
                                            <p className="text-muted small mb-1">
                                                by Muhammad {item === 1 ? "Saif" : "Taha Ilyas"} in{" "}
                                                {item === 1 ? "Grocery and Food" : "Clothing"}
                                            </p>
                                            <h5 className="mb-2">
                                                {item === 1 ? "Avram Kennedy" : item === 2 ? "Robo" : "Logo"}
                                            </h5>
                                            <h6>${item === 1 ? 101 : 20}</h6>
                                        </div>
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
                        <div>
                            <h2 className="fw-bold">Discover Featured Products</h2>
                            <p className="text-muted">
                                Every week we hand-pick some of the best items from our collection
                            </p>
                        </div>
                        <div>
                            <select className="form-select w-auto">
                                <option>Select Category</option>
                                <option>Clothing</option>
                                <option>Groceries</option>
                                <option>Electronics</option>
                            </select>
                        </div>
                    </div>
                    <hr className="text-muted" />
                    <div className="row">
                        {[0, 1, 2, 3].map((item) => (
                            <div
                                className="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center mb-4"
                                key={item}
                            >
                                <div className="border rounded text-center py-5 w-100">
                                    <span>Image {item}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
