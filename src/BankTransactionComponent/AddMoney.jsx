import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddMoney = () => {
  let navigate = useNavigate();

  const [addMoneyRequest, setAddMoneyRequest] = useState({});
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const customer = JSON.parse(sessionStorage.getItem("active-customer"));
  const handleUserInput = (e) => {
    setAddMoneyRequest({ ...addMoneyRequest, [e.target.name]: e.target.value });
  };

  const addMoney = (e) => {
    addMoneyRequest.userId = customer.id;

    fetch(`${process.env.REACT_APP_BASE_URL}/api/transaction/addMoney`, {
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

  return (
    <div>
      <div className="mt-2 d-flex aligns-items-center justify-content-center">
        <div
          className="card form-card border-color custom-bg"
          style={{ width: "25rem" }}
        >
          <div className="card-header text-center custom-bg-text">
            <h4 className="text-color">Add Money</h4>
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
                <label for="senderName" class="form-label">
                  <b>Sender Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="senderName"
                  name="senderName"
                  onChange={handleUserInput}
                  value={addMoneyRequest.senderName}
                  required
                />
              </div>
              <div className="mb-3 text-color">
                <label for="senderAddress" class="form-label">
                  <b>Sender Address</b>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="senderAddress"
                  name="senderAddress"
                  onChange={handleUserInput}
                  value={addMoneyRequest.senderAddress}
                  required
                />
              </div>

              <div className="mb-3 text-color">
                <label for="description" class="form-label">
                  <b>Description</b>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="description"
                  name="description"
                  onChange={handleUserInput}
                  value={addMoneyRequest.description}
                  required
                />
              </div>
              &nbsp;<button
                type="submit"
                className="btn bg-color custom-bg-text"
                onClick={addMoney}
              >
                Add Money
              </button>
              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMoney;
