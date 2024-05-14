import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const CommonBankAccounts = ({ accounts, setAccounts, currencies }) => {
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");
  const [showModal, setShowModal] = useState(false);
  const [editedAccount, setEditedAccount] =  useState( {
    beneficiary: "",
    beneficiaryAddress: "",
    bankName: "",
    iban: "",
    swiftCode: "",
    bankAddress: "",
    currencyMap: [], // Assuming currencyMap is an array
  });


  useEffect(() => { fetchAccountData(); 
}, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editedAccount.currencyMap[0].id === accounts.currencyMap[0].id) {
      // Notify the user to select currencies
      toast.error("Please select currencies", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return; // Exit the function
    }
    try {
      // Make POST request to the API endpoint to add account
      console.log(editedAccount);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/currencies/addAdminAccount`,
        editedAccount,
        {
          headers: {
            Authorization: "Bearer " + admin_jwtToken,
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

  const fetchAccountData = async () => {
    try {
      // Fetch account data from the server
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/currencies/fatchAdminAccount`
      );
      // Update the account state with the fetched data
      setEditedAccount(response.data.adminAccountDetais[0]|| {
        beneficiary: "",
        beneficiaryAddress: "",
        bankName: "",
        iban: "",
        swiftCode: "",
        bankAddress: "",
        currencyMap: [], // Assuming currencyMap is an array
      });
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
      <div className="mb-2">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {accounts ? "Edit" : "Add"} Operating Account
              </h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Beneficiary</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedAccount.beneficiary}
                    onChange={(e) =>
                      setEditedAccount({
                        ...editedAccount,
                        beneficiary: e.target.value,
                      })
                    }
                    placeholder="Beneficiary"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label"> Beneficiary Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedAccount.beneficiaryAddress}
                    onChange={(e) =>
                      setEditedAccount({
                        ...editedAccount,
                        beneficiaryAddress: e.target.value,
                      })
                    }
                    placeholder="Bank Address"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Bank Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedAccount.bankName}
                    onChange={(e) =>
                      setEditedAccount({
                        ...editedAccount,
                        bankName: e.target.value,
                      })
                    }
                    placeholder="Bank Name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    IBAN/ Bank Account Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedAccount.iban}
                    onChange={(e) =>
                      setEditedAccount({
                        ...editedAccount,
                        iban: e.target.value,
                      })
                    }
                    placeholder="IBAN/ Bank Account Number"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Swift Code/ BIC</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedAccount.swiftCode}
                    onChange={(e) =>
                      setEditedAccount({
                        ...editedAccount,
                        swiftCode: e.target.value,
                      })
                    }
                    placeholder="Swift Code/ BIC"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label"> Bank Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedAccount.bankAddress}
                    onChange={(e) =>
                      setEditedAccount({
                        ...editedAccount,
                        bankAddress: e.target.value,
                      })
                    }
                    placeholder="Bank Address"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Currencies</label>
                  <select
                    className="form-select"
                    value={editedAccount.currencyMap}
                    onChange={(e) =>
                      setEditedAccount({
                        ...editedAccount,
                        currencyMap: Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        ),
                      })
                    }
                    multiple // Enable multiple selection
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
              &nbsp;
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminAccount = () => {
  const [currencies, setCurrencies] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
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
          `${process.env.REACT_APP_BASE_URL}/api/currencies/fatchAdminAccount`
        );
        console.log(response1)
        setAccounts(response1.data.adminAccountDetais[0]);
      } catch (error) {
        // Handle error if fetching data fails
        console.error("Error fetching currencies:", error);
        // Notify error
        toast.error("Failed to fetch currencies", {
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
    <div className="mt-2">
      <div
        className="card form-card ms-5 me-5 mb-5 custom-bg border-color"
        style={{
          height: "50rem",
        }}
      >
        <div className="card-header custom-bg-text text-center bg-color">
          <h2>Admin Accounts Detail</h2>
        </div>
        <div
          className="card-body d-flex flex-column"
          style={{
            overflowY: "auto",
          }}
        >
          <CommonBankAccounts
            accounts={accounts}
            setAccounts={setAccounts}
            currencies={currencies}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;