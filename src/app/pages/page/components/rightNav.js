import React from 'react'

export default function RightNav({pageTimelineData}) {

    console.log("pageTimelineData", pageTimelineData)
  return (
    <>
     <div className="col-12 col-lg-4 mt-5">
     <div className="card shadow-lg border-0">
            <div className="card-body p-4">
                <h4>About</h4>
                <p>{pageTimelineData.page_description}</p>
                <i className="bi bi-bookmark-fill"></i>&nbsp;
                {pageTimelineData.page_category}
              </div>
              
         
              </div>

     </div>

    </>
  )
}
