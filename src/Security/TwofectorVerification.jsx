import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthenticationService = () => {
  const register = async (registerRequest) => {
    console.log(registerRequest);
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/user/tfa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    });
    return response.json();
  };

  const verifyCode = async (verificationRequest) => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/user/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verificationRequest),
    });

    return response;
  };

  return {
    register,
    verifyCode,
  };
};

const RegisterComponent = () => {
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const [customer, setCustomer] = useState({});
  const [registerRequest, setRegisterRequest] = useState({});
  const [authResponse, setAuthResponse] = useState({});
  const [otpCode, setOtpCode] = useState("");
  const authService = AuthenticationService();
  const navigate = useNavigate();

  const retrieveCustomerData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/fetch/id?id=${user.id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching customer data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const getCustomer = async () => {
      const customerData = await retrieveCustomerData();
      if (customerData && customerData.users && customerData.users.length > 0) {
        setCustomer(customerData.users[0]);
        setRegisterRequest((prevRequest) => ({
          ...prevRequest,
          twoFactorRequired: customerData.users[0].twoFactorEnabled || false, // Set default value from customer.twoFactorEnabled
        }));
      }
    };
    getCustomer();
  }, []);

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    const response = await authService.register(registerRequest);
    if (response.twoFactorEnabled) {
      setAuthResponse(response);
      toast.success("Scan the QR code in Google Authenticator", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(response);
    } else {
      setAuthResponse(response);
      toast.success("2FA Disabled Successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(response);
    }
  };

  const handleVerifyTfa = async () => {
    const verifyRequest = {
      emailId: customer.email,
      twoFactorCode: otpCode,
    };
    try {
      const response = await authService.verifyCode(verifyRequest);
      console.log(response);
      if (response.status === 200) {
        toast.success("Code Verified Successfully. Redirecting to the Welcome page...", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          localStorage.setItem("token", response.accessToken || "");
          navigate("/home");
        }, 3000);
      } else {
        toast.error("Code does not verify", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCheckboxChange = async (e) => {
    const updatedRequest = {
      ...registerRequest,
      twoFactorRequired: e.target.checked,
      emailId: customer.email, // Hardcoded emailId
    };
    setRegisterRequest(updatedRequest);
    e.preventDefault();
    const response = await authService.register(updatedRequest);
    if (response.mfaEnabled) {
      setAuthResponse(response);
      toast.success("For 2FA Enabled Scan And Verify Code", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(response);
    } else {
      setAuthResponse(response);
      toast.success("2FA Disabled Successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(response);
    }
  };

  return (
    <div className="auth-container mt-5">
      {authResponse.mfaEnabled ? (
        <div className="card p-4">
          <div className="auth-success-message-panel">
            <div className="auth-success-icon">&#10004;</div>
          </div>
          <h2 className="mb-4">Set Up Two-Factor Authentication</h2>
          <div className="auth-qr-code mb-4">
            <img src={authResponse.secretImageUri} alt="QR Code" />
          </div>
          <div className="auth-form-group">
            <label htmlFor="validationCode" className="auth-label">
              Enter 6 digits Validation Code Generated by the app
            </label>
            <input
              type="text"
              id="validationCode"
              name="validationCode"
              className="form-control auth-input"
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleVerifyTfa}
            className={`auth-button btn btn-primary mt-3 ${otpCode.length < 6 ? "auth-button-disabled" : ""}`}
          >
            Verify code
          </button>
        </div>
      ) : (
        <div className="card p-4">
          <div className="auth-success-message-panel">
            <div className="auth-success-icon">&#10004;</div>
          </div>
          <h2 className="mb-4">Security</h2>
          <form onSubmit={handleRegisterUser}>
            <div className="auth-form-group form-check">
              <input
                id="twoFactorRequired"
                name="twoFactorRequired"
                type="checkbox"
                className="form-check-input auth-checkbox"
                checked={registerRequest.twoFactorRequired || false}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="twoFactorRequired" className="form-check-label auth-label">
                Enable 2FA (Two Factors Authentication)
              </label>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegisterComponent;
