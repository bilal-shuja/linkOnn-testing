"use client";

 
import Rightnav from "@/app/assets/components/rightnav/page";
import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
   
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateWithdraw() {
      
    const router = useRouter();
    const [balance, setBalance] = useState(null);
    const [withdrawMethod, setWithdrawMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [paypalEmail, setPaypalEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [iban, setIban] = useState("");
    const [country, setCountry] = useState("");
    const [swiftCode, setSwiftCode] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const api = createAPI();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/api/user-wallet");
                setBalance(response.data.amount);
            } catch (err) {
                toast.error("Error fetching wallet data.");
            }
        };

        fetchData();
    }, []);

    const handleMethodChange = (e) => {
        setWithdrawMethod(e.target.value);
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!withdrawMethod || !amount || parseFloat(amount) <= 0) {
            toast.info("Please fill in all fields and enter a valid amount.");
            return;
        }

        if (parseFloat(amount) > balance) {
            toast.error("Insufficient balance.");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("amount", amount);
            formData.append("type", withdrawMethod);
            formData.append("paypal_email", paypalEmail);
            formData.append("full_name", fullName);
            formData.append("address", address);
            formData.append("iban", iban);
            formData.append("country", country);
            formData.append("swift_code", swiftCode);
            formData.append("mbl_no", mobileNumber);

            const response = await api.post("/api/withdraw-requset/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });


            if (response.data.status == "200") {
                toast.success(response.data.message);
                router.push("/pages/Wallet/withdraw-requests");
            } else {
                toast.error(response.data.message);
            }
        } catch (err) { 
            toast.error("Error creating withdrawal request.");
        }
    };

    return (
        <div>
              
            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded mt-4">
                            <Rightnav />
                        </div>
                        <div className="col-md-9 p-3 mt-4">
                            <div className="card shadow-lg border-0 mb-4 p-1">
                                <div className="card-body p-4">
                                    <div className="card shadow-sm border-0 p-4">
                                        <h5 className="text-dark fw-bold">Total Balance</h5>
                                        <h4 className="text-dark fw-bold">
                                        {balance === null ? <p></p> : `$${(Number(balance) || 0).toFixed(2)}`}
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            <div className="card shadow-lg border-0 mb-4 p-1">
                                <div className="card-body p-4">
                                    <div className="card shadow-sm border-0 p-4">
                                        <h5 className="card-title fw-bold text-dark">Withdraw Balance</h5>
                                        <hr className="text-muted" />
                                        <div>
                                            <div className="mt-4">
                                                <label className="form-label text-muted">Withdraw Request Via</label>
                                                <select
                                                    className="form-select"
                                                    aria-label="Withdraw Via"
                                                    value={withdrawMethod}
                                                    onChange={handleMethodChange}
                                                >
                                                    <option value="">Select Method</option>
                                                    <option value="Paypal">Paypal</option>
                                                    <option value="Bank">Bank</option>
                                                </select>
                                            </div>
                                            <div className="mt-3">
                                                <label className="form-label text-muted">Amount</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={amount}
                                                    onChange={handleAmountChange}
                                                />
                                            </div>

                                            {withdrawMethod === "Paypal" && (
                                                <div className="mt-4">
                                                    <label className="form-label">PayPal Email</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Enter PayPal Email"
                                                        value={paypalEmail}
                                                        onChange={(e) => setPaypalEmail(e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {withdrawMethod === "Bank" && (
                                                <div className="mt-4">
                                                    <div className="gap-3 d-flex mt-3">
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">Full Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Your Full Name"
                                                                value={fullName}
                                                                onChange={(e) => setFullName(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">Address</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Address"
                                                                value={address}
                                                                onChange={(e) => setAddress(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="gap-3 d-flex mt-3">
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">IBAN</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Your IBAN"
                                                                value={iban}
                                                                onChange={(e) => setIban(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">Country</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Your Country"
                                                                value={country}
                                                                onChange={(e) => setCountry(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="gap-3 d-flex mt-3">
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">SWIFT Code</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Your SWIFT Code"
                                                                value={swiftCode}
                                                                onChange={(e) => setSwiftCode(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">Mobile Number</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Your Mobile Number"
                                                                value={mobileNumber}
                                                                onChange={(e) => setMobileNumber(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <button className="btn btn-success mt-4" onClick={handleSubmit}>Withdraw</button>
                                        </div>
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
