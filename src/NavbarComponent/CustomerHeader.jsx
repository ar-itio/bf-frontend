import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill, faExchangeAlt, faUserPlus, faEye, faListAlt, faTicketAlt,faMortarBoard } from "@fortawesome/free-solid-svg-icons";

const CustomerHeader = ({toggleSidebar}) => {
  let navigate = useNavigate();

  const customer = JSON.parse(sessionStorage.getItem("active-customer"));

  const userLogout = () => {
    toast.success("logged out!!!", {
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

    setTimeout(() => {
      window.location.reload();
    }, 1000);
    navigate("/home");
  };

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/home"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faListAlt} className="icon sidebar-text" />&nbsp;
          <span className="sidebar-text"> <>Dashboard</></span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/customer/UserAccounts"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faListAlt} className="icon sidebar-text" />&nbsp;
          <span className="sidebar-text"> <>My Accounts</></span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/customer/add/money"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faMoneyBill} className="icon sidebar-text" />&nbsp;
          <span className="sidebar-text"> <>Add Money</></span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/customer/account/money/transfer"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faExchangeAlt} className="icon sidebar-text" />&nbsp;
          <span className="sidebar-text"> <>Account Transfer</></span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/customer/beneficiary/add"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faUserPlus} className="icon sidebar-text" />&nbsp;
          <span className="sidebar-text"> <>Add Beneficiary</></span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/customer/beneficiary/view"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faEye} className="icon sidebar-text" />&nbsp;
          <span className="sidebar-text"> <>View Beneficiary</></span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/customer/transaction/all"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faListAlt} className="icon sidebar-text" />&nbsp;
          <span className="sidebar-text"> <>My Transactions</></span>
        </Link>
      </li>
      <li className="nav-item " onClick={toggleSidebar}>
        <Link
          to="/customer/ticket/detail/UserTicket"
          className="nav-link active"
          aria-current="page"
        >
          <FontAwesomeIcon icon={faTicketAlt} className="icon sidebar-text" />&nbsp;
          <span className="sidebar-text"> <>User Tickets</></span>
        </Link>
      </li>
      <ToastContainer />
    </ul>
  );
};

export default CustomerHeader;
