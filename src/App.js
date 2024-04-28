import "./App.css";
import { Route, Routes } from "react-router-dom";
import AboutUs from "./page/AboutUs";
import ContactUs from "./page/ContactUs";
import logo from "./images/logo.png";
import bg from "./images/new.png";
import { Link } from "react-router-dom";
import RoleNav from "./NavbarComponent/RoleNav";
import ProfileHeader from "./NavbarComponent/ProfileHeader";
import HomePage from "./page/HomePage";
import UserRegister from "./UserComponent/UserRegister";
import UserLoginForm from "./UserComponent/UserLoginForm";
import AdminRegisterForm from "./UserComponent/AdminRegisterForm";
import AddBankForm from "./BankComponent/AddBankForm";
import ViewAllBanks from "./BankComponent/ViewAllBanks";
import ViewBankManagers from "./UserComponent/ViewBankManagers";
import ViewAllBankCustomers from "./UserComponent/ViewAllBankCustomers";
import ViewBankAccount from "./BankAccountComponent/ViewBankAccount";
import ViewBankCustomers from "./UserComponent/ViewBankCustomers";
import ViewAllBankAccounts from "./BankAccountComponent/ViewAllBankAccounts";
import ViewBankAccounts from "./BankAccountComponent/ViewBankAccounts";
import AddBankAccount from "./BankAccountComponent/AddBankAccount";
import ViewBankAllTransactions from "./BankTransactionComponent/ViewBankAllTransactions";
import ViewCustomerTransactions from "./BankTransactionComponent/ViewCustomerTransactions";
import ViewAllBankTransactions from "./BankTransactionComponent/ViewPendingTransactions";
import CustomerAccountFundTransfer from "./BankTransactionComponent/CustomerAccountFundTransfer";
import ViewAllPendingCustomers from "./UserComponent/ViewAllPendingCustomers";
import AddMoney from "./BankTransactionComponent/AddMoney";
import AccountTransfer from "./BankTransactionComponent/AccountTransfer";
import ViewPendingTransactions from "./BankTransactionComponent/ViewPendingTransactions";
import ViewMyTransactions from "./BankTransactionComponent/ViewMyTransactions";
import UserProfile from "./UserComponent/UserProfile";
import UserProfileUpdate from "./UserComponent/UserProfileUpdate";
import AddBeneficiaryForm from "./BeneficiaryComponent/AddBeneficiaryForm";
import ViewBeneficiaryAccounts from "./BeneficiaryComponent/ViewBeneficiaryAccounts";
import UpdateBeneficiaryForm from "./BeneficiaryComponent/UpdateBeneficiaryForm";
import QuickAccountTransfer from "./BankTransactionComponent/QuickAccountTransfer";
import QuickPay from "./BankTransactionComponent/QuickPay";
import AddFeeDetail from "./FeeDetailComponent/AddFeeDetail";
import ViewFeeDetail from "./FeeDetailComponent/ViewFeeDetail";
import EmailTemplate from "./FeeDetailComponent/EmailTemplate";
import UserTicket from "./TicketComponent/UsertTcket";
import AdminTicket from "./TicketComponent/AdminTicket";
import ForgetPassword from "./UserComponent/ForgetPassword";
import ResetPassword from "./UserComponent/ResetPassword";
import AddCurrency from "./CurrencyComponent/AddCurrency.jsx";
import CommonBankAccounts from "./CurrencyComponent/CommonBankAccount.jsx";
import { useEffect } from "react";

function App() {  
  useEffect(() => {
    document.body.style.backgroundImage = `url(${bg})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed"; // Keep the background image fixed while scrolling
    return () => {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundSize = "auto";
      document.body.style.backgroundAttachment = "scroll";
    };
  }, []);
  return (
    <div >
        <RoleNav />
    <div>
      <nav className="navbar navbar-expand-lg custom-bg text-color">
        <div className="container-fluid text-color" >
          <img 
            src={logo}
            width="50"
            height="40"
            className="d-inline-block align-top"
            alt=""
          />
          <Link  className="navbar-brand me-auto mb-2 mb-lg-0">
            <i>
              <h3 className="text-color ms-3"> Online Banking System</h3>
            </i>
          </Link>
          <div>
          <ProfileHeader /></div>
        </div>
      </nav>
    </div>       
       <Routes>
        <Route path="/" element={<UserLoginForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/home/all/hotel/location" element={<HomePage />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="/user/customer/register" element={<UserRegister />} />
        <Route path="/user/bank/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLoginForm />} />
        <Route path="/user/admin/register" element={<AdminRegisterForm />} />
        <Route path="/admin/bank/register" element={<AddBankForm />} />
        <Route path="/admin/bank/all" element={<ViewAllBanks />} />
        <Route path="/admin/bank/managers" element={<ViewBankManagers />} />
        <Route
          path="/admin/all/bank/customers"
          element={<ViewAllBankCustomers />}
        />
        <Route path="/bank/customer/all" element={<ViewBankCustomers />} />
        <Route
          path="customer/bank/account/detail"
          element={<ViewBankAccount />}
        />
        <Route
          path="/admin/bank/account/all"
          element={<ViewAllBankAccounts />}
        />
        <Route path="/bank/account/all" element={<ViewBankAccounts />} />
        <Route path="/bank/customer/account/add" element={<AddBankAccount />} />
        <Route
          path="/bank/customer/account/transactions"
          element={<ViewBankAllTransactions />}
        />
        {/* <Route
          path="/customer/bank/account/statement"
          element={<ViewCustomerTransactions />}
        /> */}
        <Route
          path="/admin/bank/customer/transaction/all"
          element={<ViewAllBankTransactions />}
        />
        <Route
          path="/customer/account/transfer"
          element={<CustomerAccountFundTransfer />}
        />
        <Route
          path="/admin/customer/pending"
          element={<ViewAllPendingCustomers />}
        />
        <Route path="/customer/add/money" element={<AddMoney />} />
        <Route
          path="/customer/account/money/transfer"
          element={<AccountTransfer />}
        />
        <Route
          path="/admin/customer/transaction/pending"
          element={<ViewPendingTransactions />}
        />
        <Route
          path="/admin/customer/transaction/success"
          element={<ViewCustomerTransactions />}
        />
        <Route
          path="/customer/transaction/all"
          element={<ViewMyTransactions />}
        />
        <Route path="/customer/profile" element={<UserProfile />} />
        <Route
          path="/customer/profile/update"
          element={<UserProfileUpdate />}
        />
        <Route
          path="/customer/beneficiary/add"
          element={<AddBeneficiaryForm />}
        />
        <Route
          path="/customer/beneficiary/view"
          element={<ViewBeneficiaryAccounts />}
        />
        <Route
          path="/customer/beneficiary/account/update"
          element={<UpdateBeneficiaryForm />}
        />
        <Route
          path="/customer/quick/account/transfer"
          element={<QuickAccountTransfer />}
        />
        <Route path="/customer/beneficiary/quick/pay" element={<QuickPay />} />
        <Route path="/admin/fee/detail/add" element={<AddFeeDetail />} />
        <Route path="/admin/fee/detail/view" element={<ViewFeeDetail />} />
        <Route path="/admin/fee/detail/email" element={<EmailTemplate />} />
        <Route path="/customer/ticket/detail/UserTicket" element={<UserTicket />} />
        <Route path="/Admin/ticket/detail/AdminTicket" element={<AdminTicket />} />
        <Route path="/Admin/Currency/AddCurrency" element={<AddCurrency />} />
        <Route path="/Admin/Currency/CommonBankAccounts" element={<CommonBankAccounts />} />
        <Route path="/user/forget/password" element={<ForgetPassword />} />

        <Route path="/:customerId/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;