import { Link } from "react-router-dom";
import profileIcon from "../images/profileIcon.png";
import signOutIcon from "../images/signOut.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const customer = JSON.parse(sessionStorage.getItem("active-customer"));
  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const bank = JSON.parse(sessionStorage.getItem("active-bank"));
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = () => {
    toast.success("Logged out successfully!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    sessionStorage.removeItem("active-customer");
    sessionStorage.removeItem("customer-jwtToken");
    sessionStorage.removeItem("active-bank");
    sessionStorage.removeItem("bank-jwtToken");
    sessionStorage.removeItem("active-admin");
    sessionStorage.removeItem("admin-jwtToken");

    setTimeout(() => {
      window.location.reload();
    }, 1000);

    navigate("/");
  };

  if (customer) {
    return (
      <div className="dropdown">
        <button
          className="nav-link active"
          aria-current="page"
          onClick={toggleDropdown}
        >
          <b className="text-color">
            {customer.firstName} {customer.lastName}
          </b>
          <img
            src={profileIcon}
            width="35"
            height="35"
            className="d-inline-block align-right"
            alt=""
          />
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <Link className="dropdown-item" to="/customer/profile">
              Profile
            </Link>
            <button className="dropdown-item" onClick={handleSignOut}>
              Sign Out
              <img
                src={signOutIcon}
                width="25"
                height="25"
                className="d-inline-block align-right"
                alt=""
              />
            </button>
          </div>
        )}
      </div>
    );
  } else if (admin || bank) {
    return (
      <div className="row">
        <div className="col dropdown">
          <Link
            to="/Admin/Currency/AdminAccount"
            className="nav-link active"
            aria-current="page"
          >
            {/* <FontAwesomeIcon icon={faCheckCircle} className="icon" /> */}
            &nbsp;<b className="text-color">Admin Account</b>
          </Link>
        </div>
        <div className="col dropdown">
          <Link
            to="/Admin/Currency/EditHostDetailsPage"
            className="nav-link active"
            aria-current="page"
          >
            {/* <FontAwesomeIcon icon={faCheckCircle} className="icon" /> */}
            &nbsp;<b className="text-color">Hosting  Details </b>
          </Link>
        </div>
        <div className="col dropdown">
          <button onClick={handleSignOut}>
            <b className="text-color" style={{ marginRight: "5px" }}>
              Sign Out
            </b>
            <img
              src={signOutIcon}
              width="30"
              height="30"
              className="d-inline-block align-right"
              alt=""
            />
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default ProfileHeader;
