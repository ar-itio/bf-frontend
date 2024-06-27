import AdminHeader from "./AdminHeader";
import NormalHeader from "./NormalHeader";
import CustomerHeader from "./CustomerHeader";
import BankHeader from "./BankHeader";
import { useState } from "react";

const RoleNav = () => {
  const customer = JSON.parse(sessionStorage.getItem("active-customer"));
  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const bank = JSON.parse(sessionStorage.getItem("active-bank"));

  if (admin != null) {
    return  <div className={`sidebar ${true ? "show" : "show"}`}><AdminHeader /></div>;
  } else if (customer != null) {
    return <div className={`sidebar ${true ? "show" : "show"}`}><CustomerHeader /></div>;
  } else if (bank != null) {
    return <div className={`sidebar ${true ? "show" : "show"}`}><BankHeader /></div>;
  } else {
  }
};

export default RoleNav;