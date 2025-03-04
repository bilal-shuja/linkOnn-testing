import Link from "next/link";

const ModuleUnavailable = () => {
    return (
      <div className="module-unavailable-container">
        <div className="error-card">
          <div className="error-icon">
            <i className="far fa-frown"></i>
          </div>
          <h2>Oops! Page Unavailable</h2>
          <p>
            Sorry, but this page is currently unavailable. 
            Please contact your administrator for access.
          </p>
          <Link className="home-button" href="/">
            Back to Homepage
          </Link>
        </div>
        
        <style jsx>{`
          .module-unavailable-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f8f9fa;
          }
          
          .error-card {
            text-align: center;
            padding: 2.5rem;
            max-width: 450px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .error-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
          }
          
          .error-icon {
            font-size: 4rem;
            color: #dc3545;
            margin-bottom: 1.5rem;
          }
          
          h2 {
            font-size: 1.75rem;
            font-weight: 600;
            color: #dc3545;
            margin-bottom: 1rem;
          }
          
          p {
            font-size: 1.125rem;
            color: #6c757d;
            line-height: 1.6;
            margin-bottom: 1.5rem;
          }
          
          .home-button {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: #007bff;
            color: white;
            font-weight: 500;
            border-radius: 50px;
            text-decoration: none;
            transition: background-color 0.2s ease;
          }
          
          .home-button:hover {
            background-color: #0069d9;
          }
        `}</style>
      </div>
    );
  };
  
  export default ModuleUnavailable;