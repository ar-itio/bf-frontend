import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Dashboard.css";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");
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
        `${process.env.REACT_APP_BASE_URL}/api/user/fetch/userId?userId=${user.id}`
      );
      const accounts = response1.data.accounts;

      // Calculate account statuses and filter active accounts
      const statusCounts = accounts.reduce(
        (acc, account) => {
          acc[account.status.toLowerCase()] += 1;
          return acc;
        },
        { active: 0, pending: 0, closed: 0, rejected: 0 }
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
          closed: statusCounts.closed,
          rejected: statusCounts.rejected,
        },
        currencyAmounts,
        activeAccounts,
      }));
    };

    const fetchtransactions = async () => {
      const response1 = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/transaction/fetch/customer/transactions/all?customerId=` +
          user.id,
        {
          headers: {
            Authorization: "Bearer " + customer_jwtToken, // Replace with your actual JWT token
          },
        }
      );
      const transactions = response1.data.transactions;
      setTransactions(response1.data.transactions);

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
        `${process.env.REACT_APP_BASE_URL}/api/beneficiary/fetch?userId=` +
          user.id,
        {
          headers: {
            Authorization: "Bearer " + customer_jwtToken, // Replace with your actual JWT token
          },
        }
      );
      const accounts = response1.data.beneficiaryAccounts;

      // Calculate beneficiary statuses
      const statusCounts = accounts.reduce(
        (acc, account) => {
          acc[account.status.toLowerCase()] += 1;
          return acc;
        },
        { active: 0, pending: 0, closed: 0, rejected: 0 }
      );
      setData((prevData) => ({
        ...prevData,
        beneficiary: {
          active: statusCounts.active,
          pending: statusCounts.pending,
          closed: statusCounts.closed,
          rejected: statusCounts.rejected,
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
    setSelectedAccount("");
    setAccountTransactions([]);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h5>Dashboard</h5>
      </div>
      
      <div className="dashboard-content">
            <h6 className="accounts">accounts</h6>
            <h6 className="summary">Summary</h6>
        </div>
      <div className="account-container">

  <div className="account-cards">
    {data.activeAccounts.slice(0, 4).map((account) => (
      <div
        key={account.id}
        className="account-card"
        onClick={() => handleAccountClick(account)}
      >
        <h6 className="account-currency">{account.currency}</h6>
        <p className="account-number">{account.accountNumber}</p>
        <p className="account-balance">{account.accountBalance}</p>
        <div className="chip"></div>
      </div>
    ))}
  </div>
  <div className="account-summary">
    <div className="strip">
      Total Balance:   {data.activeAccounts.reduce((sum, account) => sum + account.accountBalance, 0)}
    </div>
    <div className="strip">
      Total Accounts:    4
    </div>
  </div>
</div>

      <div className="dashboard-main">
        <div className="currency-chart">
          <h3>Currency Amounts</h3>
          <CurrencyChart data={data.currencyAmounts} />
        </div>
        <div className="transaction-list">
          {/* <h3 className="transaction-header">
    Transactions for Account: {transactions[0].accountNumber}
  </h3> */}
          <div className="transaction-table">
            <div className="transaction-row transaction-header-row">
              <span className="transaction-header-item">ID</span>
              <span className="transaction-header-item">Date</span>
              <span className="transaction-header-item">Type</span>
              <span className="transaction-header-item">Amount</span>
              <span className="transaction-header-item">Status</span>
              <span className="transaction-header-item">View</span>
            </div>
            {accountTransactions.map((transaction, index) => (
              <div
                key={index}
                className={`transaction-row transaction-status-${transaction.status.toLowerCase()} transaction-type-${transaction.type.toLowerCase()}`}
              >
                <span className="transaction-id">{transaction.id}</span>
                <span className="transaction-date">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
                <span className="transaction-type">{transaction.type}</span>
                <span className="transaction-amount">{transaction.amount}</span>
                <span className="transaction-status">{transaction.status}</span>
                <span className="transaction-view">
                  &nbsp;<button>View</button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="dashboard-summary">
        <Link
          className="summary-item"
          aria-current="page"
          to="/customer/UserAccounts"
        >
          <h3>Accounts</h3>
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
          to="/customer/transaction/all"
        >
          <h3>Transactions</h3>
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
          to="/customer/beneficiary/view"
        >
          <h3>Beneficiary</h3>
          <div className="summary-details">
            <div className="summary-detail">
              <h6>Active</h6>
              <p>{data.beneficiary.active}</p>
            </div>
            <div className="summary-detail">
              <h6>Pending</h6>
              <p>{data.beneficiary.pending}</p>
            </div>
            <div className="summary-detail">
              <h6>Closed</h6>
              <p>{data.beneficiary.closed}</p>
            </div>
            <div className="summary-detail">
              <h6>Rejected</h6>
              <p>{data.beneficiary.rejected}</p>
            </div>
            <div className="summary-detail">
              <h6>Total</h6>
              <p>
                {data.beneficiary.active +
                  data.beneficiary.pending +
                  data.beneficiary.closed +
                  data.beneficiary.rejected}
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div>
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

    const drawDoughnutSlice = (startAngle, endAngle, color) => {
      const radius = Math.min(canvas.width, canvas.height) / 3;
      const holeRadius = radius / 2;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        radius,
        startAngle,
        endAngle
      );
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        holeRadius,
        endAngle,
        startAngle,
        true
      );
      ctx.closePath();
      ctx.fill();
    };

    if (allZero) {
      // Equally divide the chart
      const sliceAngle = (2 * Math.PI) / data.length;
      let startAngle = 0;

      data.forEach(({ currency }, index) => {
        const endAngle = startAngle + sliceAngle;
        drawDoughnutSlice(startAngle, endAngle, getColor(index));
        startAngle = endAngle;
      });
    } else {
      const total = data.reduce((acc, { amount }) => acc + amount, 0);
      let startAngle = 0;

      data.forEach(({ amount, currency }, index) => {
        const sliceAngle = (amount / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;
        drawDoughnutSlice(startAngle, endAngle, getColor(index));
        startAngle = endAngle;
      });
    }
  }, [data]);

  const getColor = (index) => {
    const colors = [
      "#1976D2",
      "#36d1dc",
      "#282f4b",
      "#8e44ad",
      "#3498db",
      "#2ecc71",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="">
      <div className="dataContainer">
        {data.map(({ currency, amount }, index) => (
          <div key={index} className="dataItem">
            <div className="colorBox" style={{ backgroundColor: getColor(index) }}
            ></div>
            <span>{`${currency}:  ${amount}`}</span>
          </div>
        ))}
      </div>
      <canvas ref={canvasRef} className="canvas"></canvas>
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
      <div className="transaction-form">
        <h3>Letest Transaction</h3>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th className="hide-on-mobile" >Description</th>
              <th>Transaction Ref ID</th>
              <th>Fee</th>
              <th >Date</th>
              <th className="hide-on-mobile" >Currency</th>
              <th>Account Number</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((transaction, index) => (
              <tr key={index} className="">
                <td>{transaction.type || "N/A"}</td>
                <td>{transaction.amount || "N/A"}</td>
                <td>{transaction.status || "N/A"}</td>
                <td className="hide-on-mobile">{transaction.description || "N/A"}</td>
                <td>{transaction.transactionRefId || "N/A"}</td>
                <td>{transaction.fee || "N/A"}</td>
                <td>{transaction.date || "N/A"}</td>
                <td className="hide-on-mobile" >{transaction.currency || "N/A"}</td>
                <td>{transaction.accountNumber || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="currency-converter">
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
          &nbsp;<button onClick={handleConvert} className="convert-button">
            Convert
          </button>
        </div>
        {result !== null && (
          <div className="conversion-result">
            <h4>Converted Amount: {result.toFixed(2)}</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
