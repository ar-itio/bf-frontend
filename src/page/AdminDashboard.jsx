import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Dashboard.css";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("active-Admin"));
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountTransactions, setAccountTransactions] = useState([
    {
      id: 1,
      date: new Date(),
      amount: 100,
      status: "Success",
      type: "Credit",
    },
    {
      id: 2,
      date: new Date(),
      amount: 50,
      status: "Pending",
      type: "Debit",
    },
    {
      id: 3,
      date: new Date(),
      amount: 200,
      status: "Rejected",
      type: "Transfer",
    },
    {
      id: 4,
      date: new Date(),
      amount: 75,
      status: "Cancelled",
      type: "Withdrawal",
    },
  ]);
  const [data, setData] = useState({
    users: {
      active: 0,
      pending: 0,
      closed: 0,
      rejected: 0,
    },
    beneficiary: {
      active: 0,
      pending: 0,
      closed: 0,
      rejected: 0,
    },
    transactions: {
      success: 0,
      pending: 0,
      rejected: 0,
      cancelled: 0,
    },
    revenue: 0,
    exchangeRates: {},
    currencyAmounts: [],
    activeAccounts: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const response1 = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/user/fetch/role?role=CUSTOMER`,
        {
          headers: {
            Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
          },
        }
      );
      const accounts = response1.data.users;
      console.log(response1);
      // Calculate account statuses and filter active accounts
      const statusCounts = accounts.reduce(
        (acc, account) => {
          acc[account.status.toLowerCase()] += 1;
          return acc;
        },
        { active: 0, suspended: 0, pending: 0, inactive: 0 }
      );

      const activeAccounts = accounts.filter(
        (account) => account.status.toLowerCase() === "active"
      );

      const currencyTotals = accounts.reduce((acc, account) => {
        const { currency, accountBalance } = account;
        if (!acc[currency]) {
          acc[currency] = 0;
        }
        acc[currency] += accountBalance;
        return acc;
      }, {});

      // Convert currencyTotals to an array format for the chart
      const currencyAmounts = Object.entries(currencyTotals).map(
        ([currency, amount]) => ({
          currency,
          amount,
        })
      );

      setData((prevData) => ({
        ...prevData,
        users: {
          active: statusCounts.active,
          pending: statusCounts.pending,
          closed: statusCounts.inactive,
          rejected: statusCounts.suspended,
        },
        currencyAmounts,
        activeAccounts,
      }));
    };

    const fetchtransactions = async () => {
      const response2 = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/transaction/fetch/transactions/success`,
        {
          headers: {
            Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
          },
        }
      );
      const transactions = response2.data.transactions;
      setTransactions(response2.data.transactions);

      // Calculate transaction statuses
      const statusCounts = transactions.reduce(
        (acc, account) => {
          acc[account.status.toLowerCase()] += 1;
          return acc;
        },
        { success: 0, pending: 0, cancelled: 0, rejected: 0 }
      );

      setData((prevData) => ({
        ...prevData,
        transactions: {
          success: statusCounts.success,
          pending: statusCounts.pending,
          cancelled: statusCounts.cancelled,
          rejected: statusCounts.rejected,
        },
      }));
    };

    const retrieveAllBeneficiary = async () => {
      const response1 = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/ticket/fetch/all`,
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("admin-jwtToken"),
          },
        }
      );
      const accounts = response1.data.ticketDetails;

      // Calculate beneficiary statuses
      const statusCounts = accounts.reduce(
        (acc, account) => {
          acc[account.status.toLowerCase()] += 1;
          return acc;
        },
        { close: 0, open: 0, hold: 0, inProgress: 0 }
      );
      setData((prevData) => ({
        ...prevData,
        beneficiary: {
          Open: statusCounts.open,
          InProgress: statusCounts.inProgress,
          Close: statusCounts.close,
          Hold: statusCounts.hold,
        },
      }));
    };

    fetchData();
    fetchtransactions();
    retrieveAllBeneficiary();
  }, []);

  const handleAccountClick = async (account) => {
    setSelectedAccount(account);
    // const response = await axios.get(
    //   `${process.env.REACT_APP_BASE_URL}/api/transaction/fetch/account/transactions?accountId=${account.id}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${customer_jwtToken}`,
    //     },
    //   }
    // );
    // setAccountTransactions(response.data.transactions);
  };

  const handleBackClick = () => {
    setSelectedAccount(null);
    setAccountTransactions([]);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-A">
        <h2>Admin Dashboard</h2>
      </div>
      <div className="dashboard-summary">
        <Link
          className="summary-item"
          aria-current="page"
          to="/admin/all/bank/customers"
        >
          <h3>All Users</h3>
          <div className="summary-details">
            <div className="summary-detail">
              <h6>Active</h6>
              <p>{data.users.active}</p>
            </div>
            <div className="summary-detail">
              <h6>Pending</h6>
              <p>{data.users.pending}</p>
            </div>
            <div className="summary-detail">
              <h6>Closed</h6>
              <p>{data.users.closed}</p>
            </div>
            <div className="summary-detail">
              <h6>Rejected</h6>
              <p>{data.users.rejected}</p>
            </div>
            <div className="summary-detail">
              <h6>Total</h6>
              <p>
                {data.users.active +
                  data.users.pending +
                  data.users.closed +
                  data.users.rejected}
              </p>
            </div>
          </div>
        </Link>
        <Link
          className="summary-item"
          aria-current="page"
          to="/admin/customer/transaction/success"
        >
          <h3>All Transactions</h3>
          <div className="summary-details">
            <div className="summary-detail">
              <h6>Success</h6>
              <p>{data.transactions.success}</p>
            </div>
            <div className="summary-detail">
              <h6>Pending</h6>
              <p>{data.transactions.pending}</p>
            </div>
            <div className="summary-detail">
              <h6>Rejected</h6>
              <p>{data.transactions.rejected}</p>
            </div>
            <div className="summary-detail">
              <h6>Cancelled</h6>
              <p>{data.transactions.cancelled}</p>
            </div>
            <div className="summary-detail">
              <h6>Total</h6>
              <p>
                {data.transactions.success +
                  data.transactions.pending +
                  data.transactions.cancelled +
                  data.transactions.rejected}
              </p>
            </div>
          </div>
        </Link>
        <Link
          className="summary-item"
          aria-current="page"
          to="/Admin/ticket/detail/AdminTicket"
        >
          <h3>All user Ticket</h3>
          <div className="summary-details">
            <div className="summary-detail">
              <h6>Active</h6>
              <p>{data.beneficiary.Open}</p>
            </div>
            <div className="summary-detail">
              <h6>Progress</h6>
              <p>{data.beneficiary.InProgress}</p>
            </div>
            <div className="summary-detail">
              <h6>Closed</h6>
              <p>{data.beneficiary.Close}</p>
            </div>
            <div className="summary-detail">
              <h6>Hold</h6>
              <p>{data.beneficiary.Hold}</p>
            </div>
            <div className="summary-detail">
              <h6>Total</h6>
              <p>
                {data.beneficiary.Open +
                  data.beneficiary.InProgress +
                  data.beneficiary.Close +
                  data.beneficiary.Hold}
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="dashboard-main">
        {/* <div className="currency-chart">
          <h3>Currency Amounts</h3>
          <CurrencyChart data={data.currencyAmounts} />
        </div> */}

        <div className="active-accounts">
          <div className="user-cards">
            <h3 className="card-heder dashboard-header-A">Active Users:</h3>
            {data.activeAccounts.map((account, index) => (
              <div
                key={account.id}
                className="user-card"
                onClick={() => handleAccountClick(account)}
              >
                <p>User Name: {account.name || "N/A"}</p>
                <p>Address: {account.address}</p>
                <p>Currency: {account.currency}</p>
                <div className="chip"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="currency-chart">
          <h3>Currency Use In Admin Account</h3>
          <CurrencyChart data={data.currencyAmounts} />
        </div>
        <CurrencyConverter
          transactions={transactions}
          setTransactions={setTransactions}
        />
      </div>
    </div>
  );
};

const CurrencyChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!data || data.length === 0) {
      ctx.font = "20px Arial";
      ctx.fillStyle = "#ccc";
      ctx.textAlign = "center";
      ctx.fillText("No data available", canvas.width / 2, canvas.height / 2);
      return;
    }

    // Check if all amounts are zero
    const allZero = data.every(({ amount }) => amount === 0);

    if (allZero) {
      // Equally divide the chart
      const sliceAngle = (2 * Math.PI) / data.length;
      let startAngle = 0;

      data.forEach(({ currency }, index) => {
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.fillStyle = getColor(index);
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          Math.min(canvas.width, canvas.height) / 3,
          startAngle,
          endAngle
        );
        ctx.closePath();
        ctx.fill();

        startAngle = endAngle;
      });
    } else {
      const total = data.reduce((acc, { amount }) => acc + amount, 0);
      let startAngle = 0;

      data.forEach(({ amount, currency }, index) => {
        const sliceAngle = (amount / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.fillStyle = getColor(index);
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          Math.min(canvas.width, canvas.height) / 3,
          startAngle,
          endAngle
        );
        ctx.closePath();
        ctx.fill();

        startAngle = endAngle;
      });
    }
  }, [data]);

  const getColor = (index) => {
    const colors = [
      "#f39c12",
      "#36d1dc",
      "#ff6f61",
      "#8e44ad",
      "#3498db",
      "#2ecc71",
    ];
    return colors[index % colors.length];
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ marginRight: "20px" }}>
        {data.map(({ currency, amount }, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: getColor(index),
                marginRight: "10px",
              }}
            ></div>
            <span>{`${currency}: ${amount}`}</span>
          </div>
        ))}
      </div>
      <canvas ref={canvasRef} width={400} height={400} />
    </div>
  );
};

const CurrencyConverter = ({ transactions }) => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/83884d86a5ce1df4d4ae528e/latest/USD`
        );
        console.log(transactions);
        setExchangeRates(response.data.conversion_rates);
      } catch (error) {
        const exchangeRates1 = {
          USD: 1.0,
          EUR: 0.85,
          GBP: 0.75,
          INR: 74.0,
          JPY: 110.0,
          CAD: 1.25,
        };
        setExchangeRates(exchangeRates1);
        console.error("Error fetching exchange rates:", error);
      }
    };
    fetchExchangeRates();
  }, []);

  const handleConvert = () => {
    if (fromCurrency === toCurrency) {
      setResult(amount);
    } else {
      const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
      setResult(amount * rate);
    }
  };

  return (
    <div className="currency-converter-container">
      <div className="transaction-form-A">
        <h3>Letest Transaction</h3>
        <table className="transaction-table-A">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Sender Name</th>
              <th>Description</th>
              <th>Transaction Ref ID</th>
              <th>Fee</th>
              <th>Date</th>
              <th>Currency</th>
              <th>Account Number</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((transaction, index) => (
              <tr key={index} className="">
                <td>{transaction.type || "N/A"}</td>
                <td>{transaction.amount || "N/A"}</td>
                <td>{transaction.status || "N/A"}</td>
                <td>{transaction.senderName || "N/A"}</td>
                <td>{transaction.description || "N/A"}</td>
                <td>{transaction.transactionRefId || "N/A"}</td>
                <td>{transaction.fee || "N/A"}</td>
                <td>{transaction.date || "N/A"}</td>
                <td>{transaction.currency || "N/A"}</td>
                <td>{transaction.accountNumber || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <div className="currency-converter">
        <h3>Currency Converter</h3>
        <div className="converter-form">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="amount-input"
          />
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="currency-select"
          >
            {Object.keys(exchangeRates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <span className="to-text">to</span>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="currency-select"
          >
            {Object.keys(exchangeRates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <button onClick={handleConvert} className="convert-button">
            Convert
          </button>
        </div>
        {result !== null && (
          <div className="conversion-result">
            <h4>Converted Amount: {result.toFixed(2)}</h4>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Dashboard;
