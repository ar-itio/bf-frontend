import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AccountTransfer = () => {
  let navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [feeDetail, setFeeDetail] = useState({});
  const [feeAmt, setFeeAmt] = useState(0);

  const [addMoneyRequest, setAddMoneyRequest] = useState({});
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");
  const customer = JSON.parse(sessionStorage.getItem("active-customer"));

  const handleUserInput = (e) => {
    setAddMoneyRequest({ ...addMoneyRequest, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const getFee = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/fee/detail/fetch/type`
        );
        setFeeDetail(response.data);
        console.log(feeDetail )
      } catch (error) {
        console.error("Error fetching fee details:", error);
      }
    };

    getFee();
  }, []);

  const accountTransfer = (e) => {
    addMoneyRequest.userId = customer.id;

    fetch(`${process.env.REACT_APP_BASE_URL}/api/transaction/accountTransfer`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + customer_jwtToken,
      },
      body: JSON.stringify(addMoneyRequest),
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
              window.location.href = "/home";
            }, 1000); // Redirect after 3 seconds
          } else {
            console.log("Didn't get success response");
            toast.error(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
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
      });
    e.preventDefault();
  };

  const saveAccount = (e) => {
    if (!addMoneyRequest.amount || !addMoneyRequest.beneficiaryName || !addMoneyRequest.accountNumber || !addMoneyRequest.swiftCode || !addMoneyRequest.bankName || !addMoneyRequest.bankAddress || !addMoneyRequest.purpose) {
      // If any field is empty, show a toast message or any other indication to the user
      toast.error("Please fill in all the required fields.", {
        position: "top-center",
        autoClose: 2000, // Adjust as needed
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    const amount = parseFloat(addMoneyRequest.amount);
    const fee = parseFloat(feeDetail.fee);
    const perAmt = (amount * fee) / 100;
    setFeeAmt(perAmt > feeDetail.feeAmount ? parseFloat(perAmt) : parseFloat(feeDetail.feeAmount));
    setShowModal(true);
    e.preventDefault();
  };

  return (
    <div>
      <div className="mt-2 d-flex aligns-items-center justify-content-center">
        <div
          className="card form-card border-color custom-bg"
          style={{ width: "25rem", display: showModal ? "none" : "block" }}
        >
          <div className="card-header bg-color text-center custom-bg-text">
            <h4 className="card-title">Account Transfer</h4>
          </div>
          <div className="card-body">
            <form>
              <div className="mb-3 text-color">
                <label for="amount" class="form-label">
                  <b>Amount</b>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  name="amount"
                  onChange={handleUserInput}
                  value={addMoneyRequest.amount}
                  required
                />
              </div>
              <div className="mb-3 text-color">
                <label for="beneficiaryName" class="form-label">
                  <b>Beneficiary Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="beneficiaryName"
                  name="beneficiaryName"
                  onChange={handleUserInput}
                  value={addMoneyRequest.beneficiaryName}
                  required
                />
              </div>
              <div className="mb-3 text-color">
                <label for="accountNumber" class="form-label">
                  <b>Account Number</b>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="accountNumber"
                  name="accountNumber"
                  onChange={handleUserInput}
                  value={addMoneyRequest.accountNumber}
                  required
                />
              </div>

              <div className="mb-3 text-color">
                <label for="swiftCode" class="form-label">
                  <b>Swift Code</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="swiftCode"
                  name="swiftCode"
                  onChange={handleUserInput}
                  value={addMoneyRequest.swiftCode}
                  required
                />
              </div>

              <div className="mb-3 text-color">
                <label for="bankName" class="form-label">
                  <b>Bank Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bankName"
                  name="bankName"
                  onChange={handleUserInput}
                  value={addMoneyRequest.bankName}
                  required
                />
              </div>

              <div className="mb-3 text-color">
                <label for="bankAddress" class="form-label">
                  <b>Bank Address</b>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="bankAddress"
                  name="bankAddress"
                  onChange={handleUserInput}
                  value={addMoneyRequest.bankAddress}
                  required
                />
              </div>

              <div className="mb-3 text-color">
                <label for="purpose" class="form-label">
                  <b>Purpose</b>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="purpose"
                  name="purpose"
                  onChange={handleUserInput}
                  value={addMoneyRequest.purpose}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn bg-color custom-bg-text"
                onClick={saveAccount}
              >
                Transfer
              </button>
              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
      <div className="modal" style={{ display: showModal ? "block" : "none" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div
              className="card  custom-bg border-color "
              style={{
                height: "20rem",
              }}
            >
              <div className="card-header custom-bg-text text-center bg-color">
                <h2>Confirm Transfer</h2>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <b>Recevable Amount:</b>{" "}
                  </div>
                  <div className="col-md-6">{addMoneyRequest.amount}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <b>Fee Amount:</b>{" "}
                  </div>
                  <div className="col-md-6">{feeAmt}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <b>Total Amount:</b>{" "}
                  </div>
                  <div className="col-md-6">{parseFloat(addMoneyRequest.amount) + parseFloat(feeAmt)}</div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cencle
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={accountTransfer}
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTransfer;
