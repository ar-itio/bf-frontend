import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaTrash,
  FaPlus,
  FaMoneyBill,
  FaMoneyBillWaveAlt,
} from "react-icons/fa";

const CommonBankAccounts = ({ accounts, setAccounts, currencies }) => {
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState("");
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const [editedAccount, setEditedAccount] = useState({
    id: 0,
    userId: "",
    status: "",
    accountNumber: "",
    accountBalance: 0,
    currency: "", // Array to store selected currencies
  });
  useEffect(() => {
    // If you want to set a different default value based on some logic or props
    if (!editedAccount.currency && currencies.length > 0) {
      setEditedAccount({
        ...editedAccount,
        currency: currencies[0].code
      });
    }
  }, [currencies]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(currencies.find(currency => currency.code === editedAccount.currency)?.id);
      // Make POST request to the API endpoint to add account
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/user/addAccount`,
        {
          userId: user.id, // Assuming user.id is the correct property
          currency: editedAccount.currency,
          currencyId: currencies.find(currency => currency.code === editedAccount.currency)?.id,
        },
        {
          headers: {
            Authorization: "Bearer " + customer_jwtToken,
          },
        }
      );
      // Notify success
      toast.success("Account added successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Pass new account data to parent component
      fetchAccountData();
      handleCloseModal();
    } catch (error) {
      // Notify error
      toast.error("Failed to add account", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error adding account:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditedAccount({
      id: 0,
      userId: "",
      status: "",
      accountNumber: "",
      accountBalance: 0,
      currency: "",
    });
  };

  const handleEdit = (index) => {
    setShowModal(true);
    setEditedAccount(accounts[index]);
    setEditIndex(index);
  };

  const handleDelete = async (id) => {
    try {
      console.log(id);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/user/deleteAccount/acno?acno=${id.accountNumber}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + customer_jwtToken,
          },
        }
      );
      // Display toast message after successful deletion
      toast.success("Account deleted successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Find the index of the deleted account
      fetchAccountData();
      setEditedAccount({
        id: 0,
        userId: "",
        status: "",
        accountNumber: "",
        accountBalance: 0,
        currency: "",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      // Handle error
    }
  };
  const fetchAccountData = async () => {
    try {
      // Fetch account data from the server
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/user/fetch/userId?userId=${user.id}`
      );
      // Update the account state with the fetched data
      setAccounts(response.data.accounts);
    } catch (error) {
      // Handle error
      console.error("Error fetching account data:", error);
      // Notify error
      toast.error("Failed to fetch account data", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <div>
      <div style={{ display: showModal ? "none" : "block" }}>
        <div className="mt-2">
          <div
            className="card form-card ms-5 me-5 mb-5 custom-bg border-color"
            style={{
              height: "50rem",
            }}
          >
            <div className="card-header custom-bg-text text-center bg-color">
              <h2>My Accounts Detail</h2>
            </div>
            <div
              className="card-body d-flex flex-column"
              style={{
                overflowY: "auto",
              }}
            >
              <h3>Added User Accounts</h3>
              <button
                className="btn btn-primary"
                style={{
                  position: "absolute",
                  top: "80px", // Adjust as needed
                  right: "50px", // Adjust as needed
                }}
                onClick={() => setShowModal(true)}
              >
                Add Account <FaPlus />
              </button>
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <b>Account Number </b>
                    </th>
                    <th>
                      <b>Account Balance</b>
                    </th>
                    <th>
                      <b>Add Amount</b>
                    </th>
                    <th>
                      <b>Send Amount</b>
                    </th>
                    <th>
                      <b>Withdraw Amount</b>
                    </th>
                    <th>
                      <b>Currency </b>
                    </th>
                    <th>
                      <b>Status</b>
                    </th>
                    <th>
                      <b>Action</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account, index) => (
                    <tr key={index}>
                      <td>{account.accountNumber}</td>
                      <td>{account.accountBalance}</td>
                      <td>
                        <Link
                          to="/customer/add/money"
                          className="btn btn-primary me-2"
                          // onClick={() => handleEdit(index)}
                        >
                          Add &nbsp;
                          <FaMoneyBill />
                        </Link>
                      </td>
                      <td>
                      <Link
                          to="/customer/account/money/transfer"
                          className="btn btn-primary me-2"
                          // onClick={() => handleEdit(index)}
                        >
                          Send &nbsp;
                          <FaMoneyBillWaveAlt />
                        </Link>
                      </td>
                      <td>
                      <Link
                          to="/customer/account/money/transfer"
                          className="btn btn-primary me-2"
                          // onClick={() => handleEdit(index)}
                        >
                          Withdraw &nbsp;
                          <FaMoneyBillWaveAlt />
                        </Link>
                      </td>
                      <td>{account.currency}</td>
                      <td>{account.status}</td>
                      <td>
                        {/* <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEdit(index)}
                  >
                    <FaEdit />
                  </button> */}
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(account)}
                        >
                          <FaTrash />
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
      <div className="mb-2" style={{ display: showModal ? "block" : "none" }}>
        <div className="mt-2 d-flex aligns-items-center justify-content-center">
          <div
            className="card form-card border-color custom-bg"
            style={{ width: "25rem" }}
          >
            <div className="card-header bg-color text-center custom-bg-text">
              <h2>Create New Accounts </h2>
            </div>
            <div
              className="card-body d-flex flex-column"
              style={{
                overflowY: "auto",
              }}
            ></div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Currencies</label>
                  <select
                    className="form-select"
                    value={editedAccount?.currency}
                    onChange={(e) =>
                      setEditedAccount({
                        ...editedAccount,
                        currency: e.target.value,
                      })
                    }
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Add Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CurrencyApp = () => {
  const [currencies, setCurrencies] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const handleAddCurrency = (newCurrency) => {
    // Update the list of currencies with the new currency
    setCurrencies([...currencies, newCurrency]);
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("active-customer"));
    // Function to fetch currencies data from the API
    const fetchCurrencies = async () => {
      try {
        // Make GET request to the API endpoint to fetch currencies
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/currencies/fatch`
        );
        // Set the fetched currencies data to state
        setCurrencies(response.data.currencyDetails);
        const response1 = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/user/fetch/userId?userId=${user.id}`
        );
        console.log(response1);
        setAccounts(response1.data.accounts);
      } catch (error) {
        // Handle error if fetching data fails
        console.error("Error fetching accounts:", error);
        // Notify error
        toast.error("Failed to fetch accounts", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };

    // Call the fetchCurrencies function when the component mounts
    fetchCurrencies();
  }, []); // Empty dependency array ensures that the effect runs only once, on component mount

  return (
    <CommonBankAccounts
      accounts={accounts}
      setAccounts={setAccounts}
      currencies={currencies}
    />
  );
};

export default CurrencyApp;
