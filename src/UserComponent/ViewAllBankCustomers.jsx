import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

const ViewAllBankCustomers = () => {
  let navigate = useNavigate();
  const [allCustomer, setAllCustomer] = useState([]);
  const [customerName, setCustomerNumber] = useState("");
  const [tempCustomerName, setTempCustomerName] = useState("");
  const [editTransaction, setEditTransaction] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [updateUserStatusRequest, setUpdateUserStatusRequest] = useState({
    userId: "",
    status: "",
  });

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const retrieveBankAllCustomerByName = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/user/all/customer/search?` +
        "customerName=" +
        customerName,
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );
    console.log(response.data);
    return response.data;
  };

  const retrieveAllCustomers = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/user/fetch/role?role=CUSTOMER`,
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
    if (customerName !== "") {
      const getAllCustomersByName = async () => {
        const customers = await retrieveBankAllCustomerByName();
        if (customers) {
          setAllCustomer(customers.users);
        }
      };
      getAllCustomersByName();
    } else {
      const getAllCustomers = async () => {
        const customers = await retrieveAllCustomers();
        if (customers) {
          setAllCustomer(customers.users);
        }
      };

      getAllCustomers();
    }
  }, [customerName]);

  const handleCloseEditForm = () => {
    setEditTransaction("");
    setShowModal(false);
  };
  const handleStatusChange = (e) => {
    setEditTransaction((prevState) => ({
      ...prevState,
      status: e.target.value,
    }));
  };
  const handleSubmitEdit = async (e) => {
    try {
      // Make a POST request to the API endpoint with the user data
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/user/update-profile`,
        editTransaction
      );
      console.log(response.status); // Log response data
      if (response.status === 200) {
        // Display success message to the user
        toast.success("Profile updated successfully.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          window.location.reload(true);
          handleCloseEditForm();
        }, 1000);
        return;
      } else {
        // Handle other status codes if needed
        console.error("Unexpected status code:", response.status);
        toast.error("Failed to update profile. Unexpected status code.");
      }
    } catch (error) {
      // If there was an error with the request, display an error message
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again later.");
    }
  };
  const handleEdit = (customer) => {
    console.log(customer);
    setEditTransaction(customer);
    console.log(editTransaction);
    setShowModal(true);
  };
  return (
    <div>
      <div className="mt-2" style={{ display: showModal ? "none" : "block" }}>
        <div
          className="card   "
          style={{
            height: "45rem",
          }}
        >
          <div className="card-header custom-bg-text text-center bg-color">
            <h2>All Bank Customers</h2>
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
                    <th scope="col">Customer Name</th>

                    <th scope="col">Email</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Street</th>
                    <th scope="col">City</th>
                    <th scope="col">Pincode</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allCustomer.map((customer) => {
                    return (
                      <tr>
                        <td>
                          <b>{customer.name}</b>
                        </td>

                        <td>
                          <b>{customer.email}</b>
                        </td>
                        <td>
                          <b>{customer.gender}</b>
                        </td>
                        <td>
                          <b>{customer.contact}</b>
                        </td>
                        <td>
                          <b>{customer.street}</b>
                        </td>
                        <td>
                          <b>{customer.city}</b>
                        </td>
                        <td>
                          <b>{customer.pincode}</b>
                        </td>
                        <td>
                          <b>{customer.status}</b>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => handleEdit(customer)}
                          >
                            <FaEdit />
                          </button>
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
      <div className="modal-2" style={{ display: showModal ? "block" : "none" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div
              className="card custom-bg border-color"
              style={{
                height: "45rem",
                width: "50rem",
              }}
            >
              <div className="card-header custom-bg-text text-center bg-color">
                <h2>Customer Details</h2>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
            <div className="col-md-3">
              <label><b>User Name:</b></label>
              <input type="text" value={editTransaction?.name || ""} onChange={(e) => setEditTransaction({ ...editTransaction, name: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Account Balance:</b></label>
              <input type="text" value={editTransaction?.accountBalance || ""} onChange={(e) => setEditTransaction({ ...editTransaction, accountBalance: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Account ID:</b></label>
              <input type="text" value={editTransaction?.accountId || ""} onChange={(e) => setEditTransaction({ ...editTransaction, accountId: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Account Number:</b></label>
              <input type="text" value={editTransaction?.accountNumber || ""} onChange={(e) => setEditTransaction({ ...editTransaction, accountNumber: e.target.value })} className="form-control"/>
            </div>
          </div> <div className="row mb-3">
            <div className="col-md-3">
              <label><b>Address:</b></label>
              <input type="text" value={editTransaction?.street || ""} onChange={(e) => setEditTransaction({ ...editTransaction, street: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>City:</b></label>
              <input type="text" value={editTransaction?.city || ""} onChange={(e) => setEditTransaction({ ...editTransaction, city: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>State:</b></label>
              <input type="text" value={editTransaction?.state || ""} onChange={(e) => setEditTransaction({ ...editTransaction, state: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Country:</b></label>
              <input type="text" value={editTransaction?.country || ""} onChange={(e) => setEditTransaction({ ...editTransaction, country: e.target.value })} className="form-control"/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <label><b>Pincode:</b></label>
              <input type="text" value={editTransaction?.pincode || ""} onChange={(e) => setEditTransaction({ ...editTransaction, pincode: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Company Name:</b></label>
              <input type="text" value={editTransaction?.companyName || ""} onChange={(e) => setEditTransaction({ ...editTransaction, companyName: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Company Address:</b></label>
              <input type="text" value={editTransaction?.companyAddress || ""} onChange={(e) => setEditTransaction({ ...editTransaction, companyAddress: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Company Registration Number:</b></label>
              <input type="text" value={editTransaction?.companyRegistrationNumber || ""} onChange={(e) => setEditTransaction({ ...editTransaction, companyRegistrationNumber: e.target.value })} className="form-control"/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <label><b>Date of Incorporation:</b></label>
              <input type="date" value={editTransaction?.dateOfIncorporation || ""} onChange={(e) => setEditTransaction({ ...editTransaction, dateOfIncorporation: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Contact Number:</b></label>
              <input type="text" value={editTransaction?.contact || ""} onChange={(e) => setEditTransaction({ ...editTransaction, contact: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Email:</b></label>
              <input type="email" value={editTransaction?.email || ""} onChange={(e) => setEditTransaction({ ...editTransaction, email: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Date of Birth:</b></label>
              <input type="date" value={editTransaction?.dateOfBirth || ""} onChange={(e) => setEditTransaction({ ...editTransaction, dateOfBirth: e.target.value })} className="form-control"/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <label><b>Place of Birth:</b></label>
              <input type="text" value={editTransaction?.placeOfBirth || ""} onChange={(e) => setEditTransaction({ ...editTransaction, placeOfBirth: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Nationality:</b></label>
              <input type="text" value={editTransaction?.nationality || ""} onChange={(e) => setEditTransaction({ ...editTransaction, nationality: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Gender:</b></label>
              <input type="text" value={editTransaction?.gender || ""} onChange={(e) => setEditTransaction({ ...editTransaction, gender: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>ID Type:</b></label>
              <input type="text" value={editTransaction?.idType || ""} onChange={(e) => setEditTransaction({ ...editTransaction, idType: e.target.value })} className="form-control"/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <label><b>ID Number:</b></label>
              <input type="text" value={editTransaction?.idNumber || ""} onChange={(e) => setEditTransaction({ ...editTransaction, idNumber: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>ID Expiry Date:</b></label>
              <input type="date" value={editTransaction?.idExpiryDate || ""} onChange={(e) => setEditTransaction({ ...editTransaction, idExpiryDate: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Employment Status:</b></label>
              <input type="text" value={editTransaction?.employmentStatus || ""} onChange={(e) => setEditTransaction({ ...editTransaction, employmentStatus: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Business Activity:</b></label>
              <input type="text" value={editTransaction?.businessActivity || ""} onChange={(e) => setEditTransaction({ ...editTransaction, businessActivity: e.target.value })} className="form-control"/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <label><b>Profile Complete:</b></label>
              <select className="form-select" value={editTransaction?.profileComplete ? true : false} onChange={(e) => setEditTransaction({ ...editTransaction, profileComplete: e.target.value  })}>
                <option value= "true">Yes</option>
                <option value ="false">No</option>
              </select>
            </div>
            <div className="col-md-3">
              <label><b>Profile Image URL:</b></label>
              <input type="text" value={editTransaction?.profileImg || ""} onChange={(e) => setEditTransaction({ ...editTransaction, profileImg: e.target.value })} className="form-control"/>
            </div>
            <div className="col-md-3">
              <label><b>Status:</b></label>
              <select className="form-select" value={editTransaction?.status || "None"} onChange={handleStatusChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    style={{ marginRight: "10px" }}
                    className="btn btn-primary"
                    onClick={handleCloseEditForm}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmitEdit}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllBankCustomers;
