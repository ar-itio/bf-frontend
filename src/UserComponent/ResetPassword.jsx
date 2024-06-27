import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  let navigate = useNavigate();

  const { customerId } = useParams();

  const [registerRequest, setRegisterRequest] = useState({});

  const handleUserInput = (e) => {
    setRegisterRequest({ ...registerRequest, [e.target.name]: e.target.value });
  };

  const resetPassword = (e) => {
    if (registerRequest.password !== registerRequest.confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      e.preventDefault();
      return;
    }
    if (!registerRequest.password || !registerRequest.confirmPassword) {
      toast.error("Please enter both passwords", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      e.preventDefault();
      return;
    }

    registerRequest.userId = customerId;

    fetch(`${process.env.REACT_APP_BASE_URL}/api/user/reset-password`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    })
      .then((result) => {
        console.log("result", result);
        result.json().then((res) => {
          console.log(res);

          if (res.success) {
            console.log("Got the success response");

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
              window.location.href = "/user/login";
            }, 1000); // Redirect after 3 seconds
          } else {
            console.log("Didn't get success response");
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
    <div>
      <div className="mt-2 d-flex aligns-items-center justify-content-center">
        <div
          className="card form-card border-color custom-bg"
          style={{ width: "25rem" }}
        >
          <div className="card-header bg-color text-center custom-bg-text">
            <h4 className="card-title">Reset Password</h4>
          </div>
          <div className="card-body">
            <form>
              <div className="mb-3 text-color">
                <label htmlFor="password" className="form-label">
                  <b>Password</b>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  onChange={handleUserInput}
                  value={registerRequest.password || ""}
                />
              </div>
              <div className="mb-3 text-color">
                <label htmlFor="confirmPassword" className="form-label">
                  <b>Confirm Password</b>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={handleUserInput}
                  value={registerRequest.confirmPassword || ""}
                />
              </div>

              <button
                type="submit"
                className="btn bg-color custom-bg-text"
                onClick={resetPassword}
              >
                Reset Password
              </button>
              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;