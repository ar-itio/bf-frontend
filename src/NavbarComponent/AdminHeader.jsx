import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt, faEye, faEnvelope, faUserClock, faUsers, faMoneyCheckAlt, faCheckCircle, faTicketAlt } from "@fortawesome/free-solid-svg-icons";

const AdminHeader = () => {
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
      <li className="nav-item card">
        <Link
          to="/home"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faListAlt} className="icon" />&nbsp;
          <span className="text-color"> <strong>Dashboard</strong></span>
        </Link>
      </li>
      <li className="nav-item card">
        <Link
          to="/admin/all/bank/customers"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faUsers} className="icon" />
          &nbsp;<b className="text-color">All Customers</b>
        </Link>
      </li>
      <li className="nav-item card">
        <Link
          to="/admin/customer/pending"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faUserClock} className="icon" />
          &nbsp;<b className="text-color">Pending Customers</b>
        </Link>
      </li>
      <li className="nav-item card">
        <Link
          to="/admin/customer/pendingAccounts"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faUserClock} className="icon" />
          &nbsp;<b className="text-color">Wallet ApprovedRequest</b>
        </Link>
      </li>
      <li className="nav-item card">
        <Link
          to="/admin/customer/transaction/success"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faCheckCircle} className="icon" />
          &nbsp;<b className="text-color">Success Transactions</b>
        </Link>
      </li>
      <li className="nav-item card">
        <Link
          to="/admin/customer/transaction/pending"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faMoneyCheckAlt} className="icon" />
          &nbsp;<b className="text-color">Pending Transactions</b>
        </Link>
      </li>
      <li className="nav-item card">
          <Link
            to="/Admin/Currency/AdminAccount"
            className="nav-link active"
            aria-current="page"
          >
            <FontAwesomeIcon icon={faCheckCircle} className="icon" />
            &nbsp;<b className="text-color">Admin BankAccount</b>
          </Link>
        </li>
      
        <li className="nav-item card">
        <Link
          to="/Admin/Currency/CommonBankAccounts"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faCheckCircle} className="icon" />
          &nbsp;<b className="text-color">Common BankAccounts</b>
        </Link>
      </li>
      <li className="nav-item card">
          <Link
            to="/Admin/Currency/EditHostDetailsPage"
            className="nav-link active"
            aria-current="page"
          >
            <FontAwesomeIcon icon={faCheckCircle} className="icon" />
            &nbsp;<b className="text-color">Hosting Details </b>
          </Link>
        </li>
        <li className="nav-item card">
        <Link
          to="/Admin/Currency/AddCurrency"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faCheckCircle} className="icon" />
          &nbsp;<b className="text-color">Add Currency</b>
        </Link>
      </li>
      <li className="nav-item card">
        <Link
          to="/admin/fee/detail/view"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faEye} className="icon" />
          &nbsp;<b className="text-color">View FeeDetails</b>
        </Link>
      </li>
      <li className="nav-item card">
        <Link
          to="/admin/fee/detail/email"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          &nbsp;<b className="text-color">Email Templates</b>
        </Link>
      </li>
      <li className="nav-item card">
        <Link
          to="/Admin/ticket/detail/AdminTicket"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faTicketAlt} className="icon" />
          &nbsp;<b className="text-color">User Tickets</b>
        </Link>
      </li>
      <ToastContainer />
    </ul>
  );
};

export default AdminHeader;