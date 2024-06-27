import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ViewPendingTransactions = () => {
  let navigate = useNavigate();
  const [allTransactions, setAllTransactions] = useState([]);
  const [editTransaction, setEditTransaction] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterType, setFilterType] = useState("user");
  const [filterValue, setFilterValue] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const [updateUserStatusRequest, setUpdateUserStatusRequest] = useState({
    userId: "",
    status: "",
  });

  const retrieveAllTransactions = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/transaction/fetch/transactions/pending`,
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );
    console.log(response.data);
    return response.data;
  };


  const approveTransaction = (transactionId, e) => {
    updateUserStatusRequest.userId = transactionId;
    updateUserStatusRequest.status = "Approve";

    fetch(`${process.env.REACT_APP_BASE_URL}/api/transaction/update/status`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //    Authorization: "Bearer " + admin_jwtToken,
      },
      body: JSON.stringify(updateUserStatusRequest),
    })
      .then((result) => {
        console.log("result", result);
        result.json().then((res) => {
          console.log(res);

          if (res.success) {
            console.log("Got the success response");

            toast.success(res.responseMessage, {
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
            }, 1000); // Redirect after 3 seconds
          } else {
            console.log("Didn't got success response");
            toast.error("It seems server is down", {
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
            }, 1000); // Redirect after 3 seconds
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
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
        }, 1000); // Redirect after 3 seconds
      });
  };

  const rejectTransaction = (transactionId) => {
    updateUserStatusRequest.userId = transactionId;
    updateUserStatusRequest.status = "Reject";

    fetch(`${process.env.REACT_APP_BASE_URL}/api/transaction/update/status`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + admin_jwtToken,
      },
      body: JSON.stringify(updateUserStatusRequest),
    })
      .then((result) => {
        console.log("result", result);
        result.json().then((res) => {
          console.log(res);

          if (res.success) {
            console.log("Got the success response");

            toast.success(res.responseMessage, {
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
            }, 1000); // Redirect after 3 seconds
          } else {
            console.log("Didn't got success response");
            toast.error("It seems server is down", {
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
            }, 1000); // Redirect after 3 seconds
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
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
        }, 1000); // Redirect after 3 seconds
      });
  };
  useEffect(() => {
    const getAllTransactions = async () => {
      const transactions = await retrieveAllTransactions();
      if (transactions) {
        setAllTransactions(transactions.transactions);
      }
    };

    getAllTransactions();
  }, []);



  const handleStatusChange = (e) => {
    setEditTransaction({
      ...editTransaction,
      status: e.target.value,
    });
  };

  const handleEditTransaction = (index) => {
    console.log(allTransactions[index])
    setEditTransaction(allTransactions[index]);
    console.log(editTransaction)
    setShowModal(true);
  };

  const handleCloseEditForm = () => {
    setEditTransaction('');
    setShowModal(false);
  };

  const handleSubmitEdit = () => {
    // Implement your logic to submit the edited transaction data
    // For example, sending a request to update the transaction status
    
    fetch(`${process.env.REACT_APP_BASE_URL}/api/transaction/update/status`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + admin_jwtToken,
      },
      body: JSON.stringify({
        userId: editTransaction?.id,
        status: editTransaction?.status,
      }),
    })
      .then((result) => {
        console.log("result", result);
        result.json().then((res) => {
          console.log(res);
  
          if (res.success) {
            console.log("Got the success response");
  
            toast.success(res.responseMessage, {
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
            }, 1000); // Redirect after 3 seconds
          } else {
            console.log("Didn't got success response");
            toast.error("It seems server is down", {
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
            }, 1000); // Redirect after 3 seconds
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
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
        }, 1000); // Redirect after 3 seconds
      });
  };

  return (
    <div>
      <div className="mt-2 "      style={{ display: showModal ? "none" : "block" }}>
        <div
          className="card   "
          style={{
            height: "45rem",
          }}
        >
          <div className="card-header custom-bg-text text-center">
            <h4 className=" text-color " >Customer Pending Transactionss</h4>
          </div>
          <div
            className="card-body"
            style={{
              overflowY: "auto",
            }}
          >
            <div className="table-responsive mt-3">
              <div style={{ width: "100%" }}>
                <table className="table table-hover text-color text-center">
                  <thead className="table-bordered border-color bg-color custom-bg-text">
                    <tr>
                      <th scope="col">TransId</th>
                      <th scope="col">Bill Amount</th>
                      <th scope="col">Customer Name</th>
                      <th scope="col">Type</th>
                      <th scope="col">Recivable Amount</th>
                      <th scope="col">Status</th>
                      <th scope="col">Date&Time</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td><b>{transaction.transactionRefId}</b></td>
                        <td><b>{transaction.billAmount}</b></td>
                        <td><b>{transaction.user.name}</b></td>
                        <td><b>{transaction.type}</b></td>
                        <td><b>{transaction.amount}</b></td>
                        <td><b>{transaction.status ? transaction.status : "-"}</b></td>
                        <td><b> {transaction.date}</b></td>
                        <td>
                          &nbsp;<button
                            className="btn btn-primary"
                            onClick={() => handleEditTransaction(index)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
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
      </div>
      <div className="modal " style={{ display: showModal ? "block" : "none" }}>
  <div className="modal-dialog">
    <div className="modal-content">
    <div
          className="card  custom-bg border-color "
          style={{
            height: "42rem",width:"40rem",
          }}
        >
          <div className="card-header custom-bg-text text-center">
            <h4 className=" text-color " >Transactions Details</h4>
          </div>
      <div className="modal-header">
      <div className="col-md-6">
        <h4>User Name: {editTransaction?.user?.name || ""}</h4>        
          </div>
      </div>
      <div className="modal-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <b>Address:</b> {editTransaction?.user?.address || "None"}
          </div>
          <div className="col-md-6">
            <b>Company Name:</b> {editTransaction?.companyName || "None"}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <b>Company Address:</b> {editTransaction?.companyAddress || "None"}
          </div>
          <div className="col-md-6">
            <b>Registration Number:</b> {editTransaction?.transactionRefId || "None"}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <b>Assign Currency:</b> {editTransaction?.currency || "None"}
          </div>
          <div className="col-md-6">
            <b>Assign Account No:</b> {editTransaction?.accountNumber || "None"}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <b>Amount:</b> {editTransaction?.amount || "None"}
          </div>
          <div className="col-md-6">
            <b>Sender Name:</b> {editTransaction?.senderName || "None"}
          </div>
        </div>
        <div className="row mb-3">
        <div className="col-md-6">
            <b>Fee:</b> {editTransaction?.fee || "None"}
          </div>
          <div className="col-md-6">
            <b>Description:</b> {editTransaction?.description || "None"}
          </div>
        </div>
        <div className="row mb-3">
        <div className="col-md-6">
        <b>Total Bill Amount:</b> {parseFloat(editTransaction?.billAmount||"0")}
          </div>
          <div className="col-md-6">
            <b>Transaction Type:</b> {editTransaction?.type || "None"}
          </div>
        </div>
        <div className="row mb-3">
        <div className="col-md-6">
            <b>Sender Address:</b> {editTransaction?.senderAddress || "None"}
          </div>
          <div className="col-md-6">
            <b>Date:</b> {editTransaction?.date || "None"}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <b>Swift Code:</b> {editTransaction?.swiftCode || "None"}
          </div>
          <div className="col-md-6">
            <b>Purpose:</b> {editTransaction?.purpose || "None"}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <b>Country:</b> {editTransaction?.country || "None"}
          </div>
          <div className="col-md-6">
            <b>Bank Name:</b> {editTransaction?.bankName || "None"}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <b>Bank Address:</b> {editTransaction?.bankAddress || "None"}
          </div>
          <div className="col-md-6">
            <b>Beneficiary Name:</b> {editTransaction?.beneficiaryName || "None"}
          </div>
        </div>
        <div className="row mb-3">
        <div className="col-md-2">
            <b>Status:</b>    </div>     <div className="col-md-6">      <select
                className="form-select"
                value={editTransaction?.status || "None"}
                onChange={handleStatusChange}
              >
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="Failed">Failed</option>
              </select>
          </div>
          <div className="modal-footer">
        <div className="col-md-">
        &nbsp;<button type="button" style={{ marginRight: '10px' }} className="btn btn-primary" onClick={handleCloseEditForm}>
          Close
        </button>
        &nbsp;<button type="button" className="btn btn-primary" onClick={handleSubmitEdit}>
          Save changes
        </button>
          </div>          </div>

      </div>
      </div>
    </div>
  </div>
</div>
</div>

</div>

  );
};

export default ViewPendingTransactions;