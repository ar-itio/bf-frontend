import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft } from "react-icons/fa"; // Import the arrow left icon from Font Awesome

const UserRegister = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    recaptchaToken: null,
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (document.URL.indexOf("customer") !== -1) {
      setUser((prevUser) => ({ ...prevUser, roles: "CUSTOMER" }));
    } else if (document.URL.indexOf("bank") !== -1) {
      setUser((prevUser) => ({ ...prevUser, roles: "BANK" }));
    }
  }, []);

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleRecaptcha = (token) => {
    setUser((prevUser) => ({
      ...prevUser,
      recaptchaToken: token,
    }));
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  const saveUser = (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{10,}$/;

    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!passwordRegex.test(user.password)) {
      toast.error(
        "Password must be at least 10 characters long, include at least one uppercase letter, one lowercase letter, and one special character",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return;
    }

    if (!user.recaptchaToken) {
      toast.error("Please verify that you are not a robot", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    fetch(`${process.env.REACT_APP_BASE_URL}/api/user/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((result) => result.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.responseMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setRegistrationSuccess(true);
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
      .catch(() => {
        toast.error("It seems server is down", {
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
    <div>
      <div className="register">
        <div className="card form-card border-color text-color custom-bg">
          <div className="card-header custom-bg-text text-center">
            <h5 className="text-color">Register Customer</h5>
          </div>
          <div className="card-body">
            {registrationSuccess ? (
              <div>
                <div className="alert alert-success" role="alert">
                  We have sent an email with a confirmation link to your email
                  address. In order to complete the registration process, please
                  click on the confirmation link. If you don't receive any
                  email, please check your spam folder and wait for a moment to
                  receive the email. Also, please verify that you entered a
                  valid email address during registration.
                </div>
                <button
                  type="button"
                  className="btn btn-link text-color"
                  style={{ textDecoration: "none" }} // Remove underline from links
                  onClick={handleBackToLogin}
                >
                  <FaArrowLeft /> Back to Login
                </button>
              </div>
            ) : (
              <form className="" onSubmit={saveUser}>
                <div className="row-md-6 mb-3 text-color">
                  <label htmlFor="username" className="form-label">
                    <>userName</>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    name="userName"
                    onChange={handleUserInput}
                    value={user.userName}
                    required
                  />
                </div>

                <div className="row-md-6 mb-3 text-color">
                  <label className="form-label">
                    <>Email</>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    onChange={handleUserInput}
                    value={user.email}
                    required
                  />
                </div>

                <div className="row-md-6 mb-3 text-color">
                  <label htmlFor="password" className="form-label">
                    <>Password</>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    onChange={handleUserInput}
                    value={user.password}
                    required
                  />
                </div>

                <div className="row-md-6 mb-3 text-color">
                  <label htmlFor="confirmPassword" className="form-label">
                    <>Confirm Password</>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={handleUserInput}
                    value={user.confirmPassword}
                    required
                  />
                </div>

                <div className="col-12 mb-3 text-color">
                  <ReCAPTCHA
                    sitekey={'6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                    onChange={handleRecaptcha}
                  />
                </div>

                <div className="d-flex aligns-items-center justify-content-center">
                  <input
                    type="submit"
                    className="btn bg-color custom-bg-text"
                    value="Register User"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-link text-color"
                  style={{ textDecoration: "none" }} // Remove underline from links
                  onClick={handleBackToLogin}
                >
                  <FaArrowLeft /> Back
                </button>
                <ToastContainer />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
