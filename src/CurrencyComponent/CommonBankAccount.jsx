import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { FaEdit, FaTrash,FaPlus   } from "react-icons/fa";

const CommonBankAccounts = ({ currencies, setCurrencies }) => {
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");
  const [showModal, setShowModal] = useState(false);
  const [editIndex, seteditIndex] = useState("");
  const [editedCurrency, setEditedCurrency] = useState({
    code: "",
    name: "",
    territory: "",
    icon: "",
    status: "Active",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make POST request to the API endpoint to add currency
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/currencies/add`,
        editedCurrency,
        {
          headers: {
            Authorization: "Bearer " + admin_jwtToken,
          },
        }
      );
      // Notify success
      toast.success("Currency added successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Pass new currency data to parent component      // Reset form fields
      // setCurrencies(editedCurrency, editedCurrency.id)
      setShowModal(false);

      setCurrencies((prevCurrencies) => {
        const updatedCurrencies = [...prevCurrencies];
        updatedCurrencies[editIndex] = editedCurrency;
        return updatedCurrencies;
      });
    } catch (error) {
      // Notify error
      toast.error("Failed to add currency", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error adding currency:", error);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleEdit = (index) => {
    setShowModal(true);
    setEditedCurrency(currencies[index]);
    seteditIndex(index);
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/currencies/delete`,
        id,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + admin_jwtToken,
          },
        }
      );
      // Display toast message after successful deletion
      toast.success("Currency deleted successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Find the index of the deleted currency
      const index = currencies.findIndex((currency) => currency.id === id);
      if (index !== -1) {
        // Create a new array without the deleted currency object
        const updatedCurrencies = [...currencies];
        updatedCurrencies.splice(index, 1);
        // Update the currency list state
        setCurrencies(updatedCurrencies);
      }
    } catch (error) {
      console.error("Error deleting currency:", error);
      // Handle error
    }
  };

  return (
    <div>
    <div style={{ display: showModal ? "none" : "block" }}>
      <h3>Added Common Bank Accounts</h3>
    <button className="btn btn-primary"   style={{
          position: "absolute",
          top: "80px", // Adjust as needed
          right: "50px", // Adjust as needed
        }}> add <FaPlus /></button>
      <table className="table">
        <thead>
          <tr>
            <th>
              <b>Beneficiary </b>
            </th>
            <th>
              <b>Bank Name</b>
            </th>
            <th>
              <b>IBAN/ Bank Account Number</b>
            </th>
            <th>
              <b>Swift Code/ BIC </b>
            </th>
            <th>
              <b> Bank Address</b>
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
          {currencies.map((currency, index) => (
            <tr key={index}>
              <td>{currency.code}</td>
              <td>{currency.name}</td>
              <td>{currency.territory}</td>
              <td>{currency.icon}</td>
              <td>{currency.icon}</td>
              <td>{currency.icon}</td>
              <td>{currency.status}</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => handleEdit(index)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(currency.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="mb-2" style={{ display: showModal ? "block" : "none" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Common Bank Accounts </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Beneficiary</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedCurrency.code}
                    onChange={(e) =>
                      setEditedCurrency({
                        ...editedCurrency,
                        code: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Bank Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedCurrency.name}
                    onChange={(e) =>
                      setEditedCurrency({
                        ...editedCurrency,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    IBAN/ Bank Account Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedCurrency.territory}
                    onChange={(e) =>
                      setEditedCurrency({
                        ...editedCurrency,
                        territory: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Swift Code/ BIC</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedCurrency.icon}
                    onChange={(e) =>
                      setEditedCurrency({
                        ...editedCurrency,
                        icon: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label"> Bank Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedCurrency.icon}
                    onChange={(e) =>
                      setEditedCurrency({
                        ...editedCurrency,
                        icon: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Currency</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedCurrency.icon}
                    onChange={(e) =>
                      setEditedCurrency({
                        ...editedCurrency,
                        icon: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editedCurrency.status}
                    onChange={(e) =>
                      setEditedCurrency({
                        ...editedCurrency,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
const CurrencyApp = () => {
  const [currencies, setCurrencies] = useState([]);

  const handleAddCurrency = (newCurrency) => {
    // Update the list of currencies with the new currency
    setCurrencies([...currencies, newCurrency]);
  };

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
          height: "45rem",
        }}
      >
        <div className="card-header custom-bg-text text-center bg-color">
          <h2>Common Bank Accounts Detail</h2>
        </div>
        <div
          className="card-body d-flex flex-column"
          style={{
            overflowY: "auto",
          }}
        >
          <CommonBankAccounts
            currencies={currencies}
            setCurrencies={setCurrencies}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrencyApp;
