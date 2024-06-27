import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewFeeDetail = () => {
  let navigate = useNavigate();
  const [feeDetails, setFeeDetails] = useState([]);

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const retrieveFeeDetails = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/fee/detail/fetch/all`,
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );
    console.log(response.data);
    return response.data;
  };

  useEffect(() => {
    const getAllFeeDetails = async () => {
      const feeResponse = await retrieveFeeDetails();
      if (feeResponse) {
        setFeeDetails(feeResponse.feeDetails);
      }
    };

    getAllFeeDetails();
  }, []);

  return (
    <div>
      <div className="mt-2">
        <div
          className="card form-card ms-5 me-5 mb-5 custom-bg border-color "
          style={{
            height: "45rem",
          }}
        >
          <div className="card-header custom-bg-text text-center bg-color">
            <h2>Fee Details</h2>
          </div>
          <div
            className="card-body"
            style={{
              overflowY: "auto",
            }}
          >
            <div className="table-responsive mt-3">
              <table className="table table-hover text-color text-center">
                <thead className="table-bordered border-color bg-color custom-bg-text">
                  <tr>
                    <th scope="col">Fee type</th>
                    <th scope="col">Fee %</th>
                    <th scope="col">Fee Minimum Amount</th> 
                  </tr>
                </thead>
                <tbody>
                  {feeDetails.map((detail) => {
                    return (
                      <tr>
                        <td>
                          <b>{detail.type}</b>
                        </td>
                        <td>
                          <b>{detail.fee}</b>
                        </td>
                        <td>
                          <b>{detail.feeAmount}</b>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFeeDetail;
