import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,faEye } from "@fortawesome/free-solid-svg-icons";

const ViewCustomerTransactions = () => {
  const componentPDF = useRef();
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterType, setFilterType] = useState("user");
  const [filterValue, setFilterValue] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [editTransaction, setEditTransaction] = useState('');
  const [showModal, setShowModal] = useState(false); 

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const retrieveAllTransactions = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/transaction/fetch/transactions/success`,
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
        },
      }
    );
    return response.data;
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

  useEffect(() => {
    const filterTransactions = () => {
      let filtered = [...allTransactions];

      // Filter by text
      if (filterType === "user") {
        filtered = filtered.filter(
          (transaction) =>
            transaction.user.name.toLowerCase().includes(filterValue.toLowerCase())
        );
      } else if (filterType === "transactionId") {
        filtered = filtered.filter(
          (transaction) =>
            transaction.transactionRefId.toLowerCase().includes(filterValue.toLowerCase())
        );
      } else if (filterType === "billAmount") {
        filtered = filtered.filter(
          (transaction) =>
            transaction.amount.toString().toLowerCase() === filterValue.toLowerCase()
        );
      }

      // Filter by date range
      if (dateRange === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filtered = filtered.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate.getDay() === today.getDay();
        });
      } else if (dateRange === "last7days") {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        filtered = filtered.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= last7Days;
        });
      } else if (dateRange === "last30days") {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        filtered = filtered.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= last30Days;
        });
      } else if (dateRange === "custom") {
        if (customDate) {
          const customDateObj = new Date(customDate);
          filtered = filtered.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.toDateString() === customDateObj.toDateString();
          });
        }
      }

      // Filter by status
      if (filterStatus !== "All Status") {
        filtered = filtered.filter(
          (transaction) => transaction.status === filterStatus
        );
      }

      setFilteredTransactions(filtered);
    };

    filterTransactions();
  }, [allTransactions, filterType, filterValue, dateRange, customDate, filterStatus]);

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setDateRange(value);
    if (value !== "custom") {
      setCustomDate(""); // Reset custom date when another option is selected
    }
  };

  const handleCustomDateChange = (e) => {
    setCustomDate(e.target.value);
  };

  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
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

  const handleEditInputChange = (e, field) => {
    if (!e || !e.target || typeof e.target.value === 'undefined') {
      return; // Add a check for event object and target value
    }
    const { value } = e.target;
    setEditTransaction((prevTransaction) => ({
      ...prevTransaction,
      [field]: value,
    }));
  };

  const handleSubmitEdit = () => {
    // Implement your logic to submit the edited transaction data
    handleCloseEditForm();
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "customer-transactions",
    onAfterPrint: () => alert("Data saved in PDF"),
  });

  return (
    <div>
      <div className="mt-2" style={{ display: showModal ? "none" : "block" }}>
        <div
          className="card   "
          style={{
            height: "45rem",
          }}
        >
          <div className="card-header custom-bg-text text-center">
            <h4 className=" text-color " >Customer Success Transactions</h4>
          </div>
          <div
            className="card-body"
            style={{
              overflowY: "auto",
            }}
          >
            <div className="row">
              <div className="col">
                <select
                  className="form-select mb-3"
                  value={filterType}
                  onChange={handleFilterTypeChange}
                >
                  <option value="user">User</option>
                  <option value="transactionId">Transaction ID</option>
                  <option value="billAmount">Bill Amount</option>
                </select>
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control mb-3"
                  value={filterValue}
                  onChange={handleFilterChange}
                  placeholder="Filter..."
                />
              </div>
              <div className="col">
                <select
                  className="form-select mb-3"
                  value={dateRange}
                  onChange={handleDateRangeChange}
                >
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              {dateRange === "custom" && (
                <div className="col">
                  <input
                    type="date"
                    className="form-control mb-3"
                    value={customDate}
                    onChange={handleCustomDateChange}
                  />
                </div>
              )}
              <div className="col">
                <select
                  className="form-select mb-3"
                  value={filterStatus}
                  onChange={handleStatusChange}
                >
                  <option value="All Status">All Status</option>
                  <option value="Success">Success</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <div className="col">
                &nbsp;<button
                  className="btn bg-color custom-bg-text mb-3"
                  onClick={generatePDF}
                >
                  Download Statement
                </button>
              </div>
            </div>
            <div className="table-responsive mt-3">
              <div ref={componentPDF} style={{ width: "100%" }}>
                <h3 className="text-center text-color">Customer Transactions</h3>
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
                    {filteredTransactions.map((transaction, index) => (
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
                            <FontAwesomeIcon icon={faEye} />
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
      <div className="mt-2 " style={{ display: showModal ? "block" : "none" }}>
  <div className="modal-dialog">
    <div className="modal-content">
    <div
          className="card  custom-bg border-color "

        >
          <div className="card-header custom-bg-text text-center">
            <h4 className=" text-color " >Transactions Details</h4>
          </div>
      <div className="modal-header">
        <h3>User Name: {editTransaction?.user?.name || ""}</h3>
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
          <div className="col-md-6">
        <b>Status:</b> {editTransaction?.status || "None"}
        </div></div>
      </div>
      <div className="modal-footer">
        &nbsp;<button type="button" className="btn btn-primary" onClick={handleCloseEditForm}>
          Close
        </button>
      </div>
    </div>
  </div>
</div>
</div>

</div>

  );
};

export default ViewCustomerTransactions;