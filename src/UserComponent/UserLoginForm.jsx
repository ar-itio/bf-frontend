import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from 'react-icons/fa'; // Import the user plus icon from Font Awesome


const UserLoginForm = () => {
  let navigate = useNavigate();

  const [loginRequest, setLoginRequest] = useState({});

  const handleUserInput = (e) => {
    setLoginRequest({ ...loginRequest, [e.target.name]: e.target.value });
  };

  const loginAction = (e) => {
    fetch(`${process.env.REACT_APP_BASE_URL}/api/user/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    })
      .then((result) => {
        console.log("result", result);
        result.json().then((res) => {
          console.log(res);

          if (res.success) {
            console.log("Got the success response");

            if (res.jwtToken !== null) {
              if (res.user.roles === "ADMIN") {
                sessionStorage.setItem(
                  "active-admin",
                  JSON.stringify(res.user)
                );
                sessionStorage.setItem("admin-jwtToken", res.jwtToken);
              } else if (res.user.roles === "CUSTOMER") {
                sessionStorage.setItem(
                  "active-customer",
                  JSON.stringify(res.user)
                );
                sessionStorage.setItem("customer-jwtToken", res.jwtToken);
                if (!res.user.profileComplete) {
                  toast.error("Profile Not Completed", {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });          
                   setTimeout(() => {
                    navigate("/customer/profile/update", { state: res.user });

                  }, 2000);
                  // Profile is not complete, redirect to update profile page
                  return;
                }
              } else if (res.user.roles === "BANK") {
                sessionStorage.setItem(
                  "active-bank",
                  JSON.stringify(res.user)
                );
                sessionStorage.setItem("bank-jwtToken", res.jwtToken);
              }
            }

            if (res.jwtToken !== null) {
              toast.success(res.responseMessage, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              setTimeout(() => {
                window.location.href = "/home";
              }, 1000); // Redirect after 3 seconds
            } else {
              toast.error(res.responseMessage, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          } else {
            console.log("Didn't get a success response");
            toast.error("It seems the server is down", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems the server is down", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    e.preventDefault();
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-color text-white text-center">
              {/* <div className="position-relative">
                <img
                  src={logo}
                  alt="User Avatar"
                  className="img-fluid rounded-circle"
                  style={{ width: "80px", height: "80px" }}
                />
           </div> */}
     <span className="icon">
        {/* Lock icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="white" // Set the fill color to white
        >
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 15a2 2 0 0 0 2-2V9a2 2 0 0 0-4 0v4a2 2 0 0 0 2 2zM10 9V7a4 4 0 0 1 8 0v2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V11c0-1.1.9-2 2-2h2z"/>
        </svg>
      </span>
              <h4>User Login</h4>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    <b>User Role</b>
                  </label>
                  <select
                    onChange={handleUserInput}
                    className="form-control"
                    name="role"
                  >
                    <option value="0">Select Role</option>
                    <option value="ADMIN">Admin</option>
                    <option value="CUSTOMER">Customer</option>
                    <option value="BANK">Bank</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="emailId" className="form-label">
                    <b>Email Id</b>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailId"
                    name="emailId"
                    onChange={handleUserInput}
                    value={loginRequest.emailId}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <b>Password</b>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    onChange={handleUserInput}
                    value={loginRequest.password}
                    autoComplete="on"
                  />
                </div>
                <div className="d-flex justify-content-between">
                   <button type="submit" className="btn btn-primary" onClick={loginAction}>
                     Login</button>
                <div >
                  <NavLink to="/user/customer/register" >
                  <FaUserPlus style={{ fontSize: '2.5em', color: '#007bff', paddingRight: '0.2em' }} /> {/* Adjust size, color, and padding */}
                 </NavLink>
                </div>
                </div>
                <NavLink to="/user/forget/password" className="nav-link">
                  <b>Forgot Password?</b>
                </NavLink>
                <ToastContainer />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginForm;

