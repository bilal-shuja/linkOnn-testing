"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import createAPI from "@/app/lib/axios";
import { toast } from "react-toastify";
import { use } from "react";
import { Modal, Spinner } from "react-bootstrap";
import ChatWindow from "@/app/pages/Chat/ChatWindow/ChatWindow";

export default function ProductDetails({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const api = createAPI();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProductDetails = async () => {
      try {
        const response = await api.post(`/api/product-detail/${id}`);

        if (response.data.code === "200") {
          setProduct(response.data.data);
          if (response.data.data.images && response.data.data.images.length > 0) {
            setActiveImage(response.data.data.images[0].image);
          }
        } else {
          toast.error("Failed to fetch product details");
        }
      } catch (error) {
        toast.error("An error occurred while fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userid");

      if (product && storedUserId && product.user_id === storedUserId) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    }
  }, [product]);

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setLoading(true);

      const response = await api.post(`/api/delete-product`, { product_id: productToDelete });

      if (response.data.code === "200") {
        toast.success(response.data.message);
        setShowModal(false);
        router.push("/pages/Marketplace/myproducts");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const toggleChatWindow = (chat) => {
    setSelectedChat(chat);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card p-5 shadow text-center">
              <i className="bi bi-exclamation-circle text-warning" style={{ fontSize: "3rem" }}></i>
              <h3 className="mt-3">Product Not Found</h3>
              <p className="text-muted">The product details you are looking for could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container py-5 mt-5">
      <div className="row">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item text-info">MarketPlace</li>
            <li className="breadcrumb-item text-primary">{product.category}</li>
            <li className="breadcrumb-item text-info">{product.product_name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="col-lg-6 mb-4">
          {/* Main Product Image */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="product-img-container position-relative overflow-hidden" style={{ height: "400px" }}>
              {activeImage && (
                <div className="position-relative w-100 h-100">
                  <Image
                    src={activeImage}
                    alt={product.product_name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded object-fit-cover"
                    priority
                  />
                </div>
              )}
              <div className="position-absolute top-0 end-0 m-3 z-1">
                <span className="badge bg-primary rounded-pill px-3 py-2">
                  {product.currency} {product.price}
                </span>
              </div>
            </div>
          </div>

          {product.images && product.images.length > 0 && (
            <div className="d-flex gap-2 flex-wrap">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail-container border rounded overflow-hidden position-relative ${activeImage === img.image ? 'border-primary' : ''}`}
                  style={{ width: "80px", height: "80px", cursor: "pointer" }}
                  onClick={() => setActiveImage(img.image)}
                >
                  <Image
                    src={img.image}
                    alt={`${product.product_name} thumbnail ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-fit-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4">
            <h2 className="fw-bold mb-3">{product.product_name}</h2>

            {/* Category & Status */}
            <div className="d-flex gap-2 mb-3">
              <span className="badge bg-info rounded-pill px-3 py-2">{product.category}</span>
              <span className="badge bg-secondary rounded-pill px-3 py-2">
                {product.status === "0" ? "Available" : "Unavailable"}
              </span>
            </div>

            {/* Price */}
            <div className="price-section mb-4">
              <h3 className="text-primary fw-bold">
                {product.currency} {product.price}
              </h3>
              <p className="text-muted">
                <i className="bi bi-geo-alt-fill me-1"></i>
                {product.location}
              </p>
            </div>

            {/* Description */}
            <div className="description-section mb-4">
              <h5 className="fw-bold">Description</h5>
              <p>{product.product_description}</p>
            </div>

            {/* Product Details */}
            <div className="details-section mb-4">
              <h5 className="fw-bold">Details</h5>
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block">Units Available</small>
                    <span className="fw-semibold">{product.units}</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block">Listed On</small>
                    <span className="fw-semibold">{formatDate(product.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Actions or Seller Information */}
            {isOwner ? (
              <div className="owner-actions mt-4">
                <h5 className="fw-bold">Manage Your Product</h5>
                <div className="d-flex gap-3 mt-3">
                  <Link
                    href={`/pages/Marketplace/editproduct/${product.id}`}
                    className="btn btn-primary flex-grow-1"
                  >
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Product
                  </Link>
                  <button
                    className="btn btn-danger flex-grow-1"
                    onClick={() => handleDeleteClick(product.id)}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Delete Product
                  </button>
                </div>
              </div>
            ) : (
              <div className="seller-section mt-4">
                <h5 className="fw-bold">Seller Information</h5>
                <div className="d-flex align-items-center p-3 bg-light rounded">
                  <div className="position-relative me-3" style={{ width: "50px", height: "50px" }}>
                    <Image
                      src={product.user_info.avatar}
                      alt={product.user_info.username}
                      fill
                      sizes="50px"
                      className="rounded-circle object-fit-cover"
                    />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">
                      {product.user_info.first_name} {product.user_info.last_name}
                      {product.user_info.is_verified === "1" && (
                        <i className="bi bi-patch-check-fill text-primary ms-2"></i>
                      )}
                    </h6>
                    <small className="text-muted">@{product.user_info.username}</small>
                  </div>
                  <button className="btn btn-sm btn-outline-primary ms-auto"
                    onClick={() => toggleChatWindow(product.user_id)}
                  >
                    <i className="bi bi-chat-dots me-1"></i>Contact
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>


        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Body className="text-center">
            <i className="bi bi-trash3 text-danger" style={{ fontSize: "2rem" }}></i>
            <h5 className="mt-3 mb-3">Delete Product</h5>
            <p>Are you sure you want to delete this product?</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleConfirmDelete} disabled={loading}>
              {loading ? (
                <span>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* Additional CSS */}
      <style jsx>{`
        .object-fit-cover {
          object-fit: cover;
        }
        
        .product-img-container {
          transition: all 0.3s ease;
        }
        
        .product-img-container:hover {
          transform: scale(1.02);
        }
        
        .thumbnail-container {
          transition: all 0.2s ease;
        }
        
        .thumbnail-container:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .badge {
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .z-1 {
          z-index: 1;
        }
      `}</style>

      {selectedChat && (
        <ChatWindow chat={selectedChat} onClose={() => setSelectedChat(null)} />
      )}

    </div>
  );
}