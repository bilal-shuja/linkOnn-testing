"use client"
import { useState, useEffect } from "react";
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import useAuth from "@/app/lib/useAuth";
import createAPI from "@/app/lib/axios";
import { toast } from "react-toastify";
import { useSearchParams } from 'next/navigation';

import { useRouter } from 'next/navigation';
export default function EditEvent() {
    useAuth();


  const searchParams = useSearchParams();
  const eveID = searchParams.get('id');
  const router = useRouter();
    
  const [specificEventDetails, setSpecificEventDetails] = useState();

  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [coverImage, setCoverImage] = useState(null);


  const api = createAPI();


  const handleNameChange = (e) => setEventName(e.target.value);
  const handleLocationChange = (e) => setEventLocation(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleStartDate = (e) => setStartDate(e.target.value);
  const handleStartTime = (e) => setStartTime(e.target.value);
  const handleEndDate = (e) => setEndDate(e.target.value);
  const handleEndTime = (e) => setEndTime(e.target.value);

  
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
        setCoverImage(files[0]);
    }
  };

    function fetchSpecificEvent() {

        api.post("/api/event-details", { event_id: eveID })
            .then((res) => {
                if (res.data.code == "200") {
                    setSpecificEventDetails(res.data.data.event);
            }
                else {
                    toast.error("Error fetching event details");
                }

            })
            .catch((error) => {
                if (error)
                    toast.error("Error fetching event details");
            })

    }


    const updateEvent =  () =>{
        
    // try {
        const formData = new FormData();
        if (eveID) formData.append("event_id", eveID);
        if (eventName) formData.append("name", eventName);
        if (eventLocation) formData.append("location", eventLocation);
        if (description) formData.append("description", description);
        if (startDate) formData.append("start_date", startDate);
        if (startTime) formData.append("start_time", startTime);
        if (endDate) formData.append("end_date", endDate);
        if (endTime) formData.append("end_time", endTime);
        if (coverImage) formData.append("cover", coverImage);

  
         api.post("/api/update-event", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async (res) => {

         if (res.data.code == "200") {
          toast.success(res.data.message);
          setTimeout(() => {
            router.push('/pages/Events');
          }, 1000);
        }
         else {
          toast.error("Error from server: " + res.data.message);
        }
        })
        .catch((error) => {

            toast.error(error)
        })

    }
   

    // const handleStartDate =(e)=>{   
    //     const { value } = e.target;
    //     setStartDate(value);
    // if (specificEventDetails && new Date(value) < new Date(specificEventDetails.start_date)) {
    //   setIsInvalid(true);
    // } else {
    //   setIsInvalid(false);
    // }

    // }

    useEffect(() => {
        fetchSpecificEvent();
    }, [])


  return (
   <div>
         <Navbar />
         <div className="container-fluid bg-light">
           <div className="container mt-3 pt-5">
             <div className="row">
               <div className="col-md-3 p-3 rounded">
                 <Rightnav />
               </div>

               <div className="col-md-9 p-3 mt-2">
                 <div className="card shadow-lg border-0 p-3">
                   <div className="card-body">

                     <h5 className="fw-bold mt-2 fs-4">Update Event</h5>
   
                     <div className="mt-4">
                       <label className="form-label mx-1 text-muted">Event Name</label>
                       <input
                         className="form-control px-3"
                         type="text"
                         placeholder="Event Name"
                         defaultValue={specificEventDetails?.name}
                         onChange={handleNameChange}
                       />
                     </div>
                     <div className="mt-4">
                       <label className="form-label mx-1 text-muted">Location</label>
                       <input
                         className="form-control px-3"
                         type="text"
                         placeholder="Location"
                         defaultValue={specificEventDetails?.location}
                         onChange={handleLocationChange}
                       />
                     </div>
                     <div className="mt-4">
                       <label className="form-label mx-1 text-muted">Description</label>
                       <textarea
                         className="form-control px-3"
                         rows="3"
                         placeholder="Description"
                         defaultValue={specificEventDetails?.description}
                         onChange={handleDescriptionChange}
                       ></textarea>
                     </div>
                     <div className="mt-4 d-flex gap-3">
                       <div className="w-50">
                         <label className="form-label text-muted px-1">Start Date</label>
                         <input
                           type="date"
                           className={`form-control `}
                           defaultValue={specificEventDetails?.start_date}
                           onChange={handleStartDate}
                           min={specificEventDetails?.start_date}
                         />

                       </div>
                       <div className="w-50">
                         <label className="form-label text-muted px-1">Start Time</label>
                         <input
                           type="time"
                           className={"form-control"}
                           defaultValue={specificEventDetails?.start_time}
                           onChange={handleStartTime}
                         />
                       </div>
                     </div>
                     <div className="mt-4 d-flex gap-3">
                       <div className="w-50">
                         <label className="form-label text-muted px-1">End Date</label>
                         <input
                           type="date"
                           className="form-control"
                           defaultValue={specificEventDetails?.end_date}
                           onChange={handleEndDate}
                           min={specificEventDetails?.end_date}
                         />
                       </div>
                       <div className="w-50">
                         <label className="form-label text-muted px-1">End Time</label>
                         <input
                           type="time"
                           className="form-control"
                           defaultValue={specificEventDetails?.end_time}
                           onChange={handleEndTime}
                         />
                       </div>
                     </div>
                     <div className="mt-4">
                       <label className="form-label text-muted px-2">Cover Image</label>
                       <input
                         type="file"
                         className="form-control"
                         accept="image/*"
                         onChange={handleFileChange}
                       />
                     </div>
                     <div className="mt-4 d-flex justify-content-end">
                       <button className="btn btn-primary" 
                       onClick={updateEvent}
                       
                       >
                         Update Event
                       </button>
                     </div>

                     
                   </div>
                 </div>
               </div>

             </div>
           </div>
         </div>
       </div>
       
  )
}
