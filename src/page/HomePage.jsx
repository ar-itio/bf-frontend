import Carousel from "./Carousel";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import travel_1 from "../images/banking_image3.png";
import travel_2 from "../images/banking_image2.png";

import UserDashboard from "../page/UserDashboard";
const customer = JSON.parse(sessionStorage.getItem("active-customer"));
const admin = JSON.parse(sessionStorage.getItem("active-admin"));

const HomePage = () => {
  if (customer) {
    return (
      <div>
        <UserDashboard />
      </div>
    );
  } else if (admin) {
    return (
      <div>
       
      </div>
    );
  }
};

export default HomePage;
