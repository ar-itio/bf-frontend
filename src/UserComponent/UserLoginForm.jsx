import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa"; // Import the user plus icon from Font Awesome

const UserLoginForm = () => {
  let navigate = useNavigate();

  const [loginRequest, setLoginRequest] = useState({});
  const [authResponse, setAuthResponse] = useState({});
  const [userRes, setUserRes] = useState({});
  const [otpCode, setOtpCode] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleUserInput = (e) => {
    setLoginRequest({ ...loginRequest, [e.target.name]: e.target.value });
  };

  const handleOtpInput = (e) => {
    setOtpCode(e.target.value);
  };

  const loginAction = (e) => {
    e.preventDefault();
    fetch(`https://api.pro.oyefin.com/api/user/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    })
      .then((result) => result.json())
      .then((res) => {
        if (res.success) {
          if (res.user && res.user.twoFactorEnabled !== null) {
            if (res.user.twoFactorEnabled) {
              setUserRes(res);
              setAuthResponse(res);
              setShowOtpInput(true);
            } else {
              handleLoginSuccess(res);
            }
          } else {
            handleLoginSuccess(res);
          }
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
  };

  const handleLoginSuccess = (res) => {
    const { user, jwtToken } = res;
    if (jwtToken) {
      sessionStorage.setItem(
        `active-${user.roles.toLowerCase()}`,
        JSON.stringify(user)
      );
      sessionStorage.setItem(`${user.roles.toLowerCase()}-jwtToken`, jwtToken);
      toast.success(res.responseMessage, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        if (user.roles === "CUSTOMER" && !user.profileComplete) {
          navigate("/customer/profile/update", { state: user });
        } else {
          window.location.href = "/home";
        }
      }, 1000);
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
  };

  const verifyCode = () => {
    const verifyRequest = {
      emailId: loginRequest.emailId,
      twoFactorCode: otpCode,
    };
    fetch(`${process.env.REACT_APP_BASE_URL}/api/user/verify`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifyRequest),
    })
      .then((result) => result.json())
      .then((res) => {
        console.log(res.mfaEnabled);
        if (res.mfaEnabled) {
          handleLoginSuccess(userRes);
        } else {
          toast.error("Code Not Correct", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
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
  };

  return (
    <div className="container mt-5 mt-2 p">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-color text-white text-center">
              <span className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="white"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 15a2 2 0 0 0 2-2V9a2 2 0 0 0-4 0v4a2 2 0 0 0 2 2zM10 9V7a4 4 0 0 1 8 0v2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V11c0-1.1.9-2 2-2h2z" />
                </svg>
              </span>
              <h4>User Login</h4>
            </div>
            <div className="card-body">
              {!showOtpInput ? (
                <form onSubmit={loginAction}>
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
                    &nbsp;<button type="submit" className="btn btn-primary">
                      Login
                    </button>
                    <div>
                      <NavLink to="/user/customer/register">
                        <FaUserPlus
                          style={{
                            fontSize: "2.5em",
                            color: "#007bff",
                            paddingRight: "0.2em",
                          }}
                        />
                      </NavLink>
                    </div>
                  </div>
                  <NavLink to="/user/forget/password" className="nav-link">
                    <b>Forgot Password?</b>
                  </NavLink>
                </form>
              ) : (
                <div>
                  <h4 className=" text-color " >Two-Factor Authentication</h4>
                  <div className="form-group">
                    <label htmlFor="validationCode" className="form-label">
                      Enter 6 digits Validation Code Generated by the app
                    </label>
                    <input
                      type="text"
                      id="validationCode"
                      name="validationCode"
                      className="form-control"
                      required
                      value={otpCode}
                      onChange={handleOtpInput}
                    />
                  </div>
                  &nbsp;<button
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="btn btn-secondary mt-3 "
                  >
                    Back
                  </button>
                  &nbsp;<button
                    type="button"
                    onClick={verifyCode}
                    className={`btn btn-primary mt-3 ${
                      otpCode.length < 6 ? "button-disabled" : ""
                    }`}
                  >
                    Verify code
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default UserLoginForm;
