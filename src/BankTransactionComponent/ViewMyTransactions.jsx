import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

const ViewMyTransactions = () => {
  let navigate = useNavigate();
  const conponentPDF = useRef();
  const [allTransactions, setAllTransactions] = useState([]);

  const [transactionRefId, setTransactionRefId] = useState("");

  const [tempTransactionRefId, setTempTransactionRefId] = useState("");

  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");
  const customer = JSON.parse(sessionStorage.getItem("active-customer"));

  const retrieveAllTransactions = async () => {
    // search transactions by ref id
    if (transactionRefId !== "") {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/transaction/search/customer/transactions/ref-id?customerId=` +
          customer.id +
          "&transactionRefId=" +
          transactionRefId,
        {
          headers: {
            Authorization: "Bearer " + customer_jwtToken, // Replace with your actual JWT token
          },
        }
      );

      return response.data;
    } else {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/transaction/fetch/customer/transactions/all?customerId=` +
          customer.id,
        {
          headers: {
            Authorization: "Bearer " + customer_jwtToken, // Replace with your actual JWT token
          },
        }
      );

      return response.data;
    }
  };

  useEffect(() => {
    const getAllTransactions = async () => {
      const transactions = await retrieveAllTransactions();
      if (transactions) {
        setAllTransactions(transactions.transactions);
      }
    };

    getAllTransactions();
  }, [transactionRefId]);

  const convertToEpochTime = (dateString) => {
    const selectedDate = new Date(dateString);
    const epochTime = selectedDate.getTime();
    return epochTime;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  const searchTxns = (e) => {
    e.preventDefault();

    setTransactionRefId(tempTransactionRefId);
  };

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "customer-transactions",
    onAfterPrint: () => alert("Data saved in PDF"),
  });

  return (
    <div>
      <div className="mt-2">
        <div
          className="card   "
          style={{
            height: "45rem",
          }}
        >
          <div className="card-header custom-bg-text text-center bg-color">
            <h2>Customer Transactions</h2>
          </div>
          <div
            className="card-body"
            style={{
              overflowY: "auto",
            }}
          >
            <div className=" mt-3">
              <form class="row">
                <div class="col">
                  <input
                    onChange={(e) => setTempTransactionRefId(e.target.value)}
                    className="form-control"
                    placeholder="Enter Transaction Ref Id..."
                    required
                  />
                </div>

                <div class="col">
                  <button 
                    type="submit"
                    class="btn bg-color custom-bg-text  ms-5 mb-3"
                    onClick={searchTxns}
                  >
                    Search
                  </button>
                </div>
                <div class="col">
                <button
                class="btn bg-color custom-bg-text ms-5 mb-3"
                onClick={generatePDF}
              >
                Download Statement
              </button>
              </div>
              </form>


            </div>

            <div className="table-responsive mt-3">
              <div ref={conponentPDF} style={{ width: "100%" }}>
                <h3 className="text-center text-color">
                  Customer Transactions
                </h3>
                <table className="table table-hover text-color text-center">
                  <thead className="table-bordered border-color bg-color custom-bg-text">
                    <tr>
                      <th scope="col">Type</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Fee</th>
                      <th scope="col">Transaction Ref Id</th>
                      <th scope="col">Sender Name</th>
                      <th scope="col">Sender Address</th>
                      <th scope="col">Description</th>
                      <th scope="col">Beneficiary Name</th>
                      <th scope="col">Account Number</th>
                      <th scope="col">Swift Code</th>
                      <th scope="col">Bank Name</th>
                      <th scope="col">Bank Address</th>
                      <th scope="col">Purpose</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTransactions.map((transaction) => {
                      return (
                        <tr>
                          <td>
                            <b>{transaction.type}</b>
                          </td>
                          <td>
                            <b>{transaction.amount}</b>
                          </td>
                          <td>
                            <b>{transaction.fee}</b>
                          </td>
                          <td>
                            <b>{transaction.transactionRefId}</b>
                          </td>
                          <td>
                            <b>
                              {transaction.senderName
                                ? transaction.senderName
                                : "-"}
                            </b>
                          </td>
                          <td>
                            <b>
                              {transaction.senderAddress
                                ? transaction.senderAddress
                                : "-"}
                            </b>
                          </td>
                          <td>
                            <b>
                              {transaction.description
                                ? transaction.description
                                : "-"}
                            </b>
                          </td>
                          <td>
                            <b>
                              {transaction.beneficiaryName
                                ? transaction.beneficiaryName
                                : "-"}
                            </b>
                          </td>
                          <td>
                            <b>
                              {transaction.accountNumber
                                ? transaction.accountNumber
                                : "-"}
                            </b>
                          </td>
                          <td>
                            <b>
                              {transaction.swiftCode
                                ? transaction.swiftCode
                                : "-"}
                            </b>
                          </td>
                          <td>
                            <b>
                              {transaction.bankName
                                ? transaction.bankName
                                : "-"}
                            </b>
                          </td>
                          <td>
                            <b>
                              {transaction.bankAddress
                                ? transaction.bankAddress
                                : "-"}
                            </b>
                          </td>
                          <td>
                            <b>
                              {transaction.purpose ? transaction.purpose : "-"}
                            </b>
                          </td>
                          <td>
                            <b>
                              {transaction.status ? transaction.status : "-"}
                            </b>
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
    </div>
  );
};

export default ViewMyTransactions;
