import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListAlt,
  faEye,
  faEnvelope,
  faUserClock,
  faUsers,
  faMoneyCheckAlt,
  faCheckCircle,
  faTicketAlt,
} from "@fortawesome/free-solid-svg-icons";

const AdminHeader = ({ toggleSidebar }) => {
  let navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-admin"));
  console.log(user);

  const adminLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    sessionStorage.removeItem("active-admin");
    sessionStorage.removeItem("admin-jwtToken");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    navigate("/home");
  };

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      <li className="nav-item " onClick={toggleSidebar}>
        <Link to="/home" className="nav-link active" aria-current="page">
          <FontAwesomeIcon icon={faListAlt} className=" icon  sidebar-text" />
          &nbsp;
          <span className="sidebar-text">
            <>Dashboard</>
          </span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/admin/fee/detail/view"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faEye} className=" icon  sidebar-text" /> &nbsp;
          <span className="sidebar-text">View Fee Details</span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/admin/fee/detail/email"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faEnvelope} className=" icon  sidebar-text" />
          &nbsp;<span className="sidebar-text">Email Templates</span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/admin/customer/pending"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faUserClock} className=" icon  sidebar-text" />
          &nbsp;<span className="sidebar-text">Pending Customers</span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/admin/customer/pendingAccounts"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faUserClock} className=" icon  sidebar-text" />
          &nbsp;<span className="sidebar-text">Pending Accounts</span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/admin/all/bank/customers"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faUsers} className=" icon  sidebar-text" />
          &nbsp;<span className="sidebar-text">All Customers</span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/admin/customer/transaction/pending"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faMoneyCheckAlt} className=" icon  sidebar-text" />
          &nbsp;<span className="sidebar-text">Pending Transactions</span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/admin/customer/transaction/success"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faCheckCircle} className=" icon  sidebar-text" />
          &nbsp;<span className="sidebar-text">ALL Transactions</span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/Admin/ticket/detail/AdminTicket"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faTicketAlt} className=" icon  sidebar-text" />
          &nbsp;<span className="sidebar-text">User Tickets</span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/Admin/Currency/AddCurrency"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faCheckCircle} className=" icon  sidebar-text" />
          &nbsp;<span className="sidebar-text">Add Currency</span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/Admin/Currency/CommonBankAccounts"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faCheckCircle} className=" icon  sidebar-text" />
          &nbsp;<span className="sidebar-text">Common Bank Accounts</span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/Admin/Currency/AdminAccount"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faCheckCircle} className=" icon  sidebar-text" />
          &nbsp;<span className="sidebar-text">Admin Account</span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/Admin/Currency/EditHostDetailsPage"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faCheckCircle} className=" icon  sidebar-text" />
          &nbsp;<span className="sidebar-text">Hosting Details </span>
        </Link>
      </li>
      <ToastContainer />
    </ul>
  );
};

export default AdminHeader;
