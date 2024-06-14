import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AddFeeDetail from "../FeeDetailComponent/AddFeeDetail";

const ViewFeeDetail = () => {
  const [showModal, setShowModal] = useState(false);
  const [feeDetails, setFeeDetails] = useState([]);
  const [selectedFeeDetail, setSelectedFeeDetail] = useState(null);
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const retrieveFeeDetails = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/fee/detail/fetch/all`,
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
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

  const handleEdit = (feeDetail) => {
    setSelectedFeeDetail(feeDetail);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedFeeDetail(null);
    setShowModal(true);
  };

  return (
    <div>
      <div className="mt-2" style={{ display: showModal ? "none" : "block" }}>
        <div
          className="card  "
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
              <h3>Added Fee Details</h3>
              <button
                className="btn btn-primary"
                style={{
                  position: "absolute",
                  top: "80px",
                  right: "50px",
                }}
                onClick={handleAdd}
              >
                Add <FaPlus />
              </button>
              <table className="table table-hover text-color text-center">
                <thead className="table-bordered border-color bg-color custom-bg-text">
                  <tr>
                    <th scope="col">Fee type</th>
                    <th scope="col">Fee %</th>
                    <th scope="col">Fee Minimum Amount</th>
                    <th scope="col">Edit Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {feeDetails.map((detail) => (
                    <tr key={detail.id}>
                      <td><b>{detail.type}</b></td>
                      <td><b>{detail.fee}</b></td>
                      <td><b>{detail.feeAmount}</b></td>
                      <td>
                        <button
                          className="btn btn-primary me-2"
                          onClick={() => handleEdit(detail)}
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <AddFeeDetail
          feeDetail={selectedFeeDetail}
          closeModal={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ViewFeeDetail;
