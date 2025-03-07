"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import createAPI from "@/app/lib/axios";
import { toast } from "react-toastify";
import { use } from "react";
import Rightnav from "@/app/assets/components/rightnav/page";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function ProductEdit({ params }) {
  const router = useRouter();
  const settings = useSiteSettings();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const api = createAPI();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [loading2, setLoading2] = useState(false);
  const [productImages, setProductImages] = useState([]);

  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
    category: '',
    price: '',
    location: '',
    currency: '',
    units: '',
    type: '1'
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  useEffect(() => {
    if (!id || !settings || !settings.product_categories) return;

    const fetchProductDetails = async () => {
      try {
        const response = await api.post(`/api/product-detail/${id}`);

        if (response.data.code === "200") {
          const productData = response.data.data;

          const categoryID = Object.entries(settings.product_categories).find(
            ([key, value]) => value === productData.category
          )?.[0] || '';

          setProduct(productData);
          setProductImages(productData.images || []);

          setFormData({
            product_name: productData.product_name,
            product_description: productData.product_description,
            category: categoryID,
            price: productData.price,
            location: productData.location,
            currency: productData.currency,
            units: productData.units,
            type: productData.type
          });
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
  }, [id, settings]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleImageDelete = (imageId, index) => {
    if (productImages.length === 1 && selectedFiles.length === 0) {
      toast.error("At least one product image is required");
      return;
    }

    if (imageId) {
      setImagesToDelete(prev => [...prev, imageId]);
    }

    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading2(true);

    if (productImages.length === 0 && selectedFiles.length === 0) {
      toast.error("At least one product image is required");
      setLoading2(false);
      return;
    }

    const submitData = new FormData();

    const updatedFormData = {
      ...formData,
      product_id: id,
      deleted_image_ids: imagesToDelete.join(',')
    };

    Object.keys(updatedFormData).forEach(key => {
      submitData.append(key, updatedFormData[key]);
    });

    selectedFiles.forEach(file => {
      submitData.append('images[]', file);
    });

    try {
      const response = await api.post(`/api/update-product`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.code === "200") {
        toast.success(response.data.message);
        router.push(`/pages/Marketplace/productdetails/${id}`)

      } else {
        toast.error(response.data.message || "Failed to update product");
      }
    } catch (error) {
      toast.error("An error occurred while updating the product");
      console.error(error);
    } finally {
      setLoading2(false);
    }
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

  if (!settings) return null;

  return (
    <>
      <div className="container-fluid bg-light">
        <div className="container mt-3 pt-5">
          <div className="row">
            <div className="col-md-3 p-3 rounded">
              <Rightnav />
            </div>

            <div className="col-md-9 p-3 mt-2">
              <div className="card shadow-lg border-0 p-3">
                <div className="card-body">
                  <h5 className="fw-bold fs-4">Edit Product</h5>

                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="product_name" className="form-label">Product Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="product_name"
                          value={formData.product_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="location" className="form-label">Location</label>
                        <input
                          type="text"
                          className="form-control"
                          id="location"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="product_description" className="form-label">Product Description</label>
                      <textarea
                        className="form-control"
                        id="product_description"
                        rows="4"
                        value={formData.product_description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Product Images <span className="text-muted">(Hold Ctrl to select Multiple)</span></label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleFileChange}
                          multiple
                          accept="image/*"
                        />

                        {productImages && productImages.length > 0 && (
                          <div className="mt-2 d-flex gap-2 flex-wrap">
                            {productImages.map((img, index) => (
                              <div key={index} style={{ position: 'relative', marginBottom: '5px' }}>
                                <Image
                                  src={img.image || "assets/images/placeholder-image.png"}
                                  alt="Product"
                                  width={80}
                                  height={80}
                                  style={{ objectFit: 'cover' }}
                                  className="border rounded"
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger p-0"
                                  style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '10px'
                                  }}
                                  onClick={() => handleImageDelete(img.id, index)}
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {selectedFiles.length > 0 && (
                          <div className="mt-2">
                            <p className="text-success mb-1">New images to upload: {selectedFiles.length}</p>
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select
                          className="form-select"
                          id="category"
                          value={formData.category}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Category</option>
                          {settings.product_categories &&
                            Object.entries(settings.product_categories).map(([id, categoryName]) => (
                              <option key={id} value={id}>
                                {categoryName}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="price" className="form-label">Price</label>
                        <input
                          type="number"
                          className="form-control"
                          id="price"
                          value={formData.price}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="currency" className="form-label">Currency</label>
                        <select
                          className="form-select"
                          id="currency"
                          value={formData.currency}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Currency</option>
                          {settings.currecy_array &&
                            settings.currecy_array.map((currencyCode, index) => (
                              <option key={index} value={currencyCode}>
                                {currencyCode}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="units" className="form-label">Units</label>
                      <input
                        type="number"
                        className="form-control"
                        id="units"
                        value={formData.units}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="type" className="form-label">Type</label>
                      <select
                        className="form-select"
                        id="type"
                        value={formData.type}
                        onChange={handleInputChange}
                      >
                        <option value="1">New</option>
                        <option value="0">Used</option>
                      </select>
                    </div>

                    <div className="col-12 text-end">
                      <Link href="/pages/Marketplace/myproducts" className="btn btn-danger me-2">Cancel</Link>
                      <button
                        type="submit"
                        className="btn btn-primary mb-0"
                        disabled={loading2}
                      >
                        {loading2 ? 'Updating...' : 'Update Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}