import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const QuickPay = () => {
  let navigate = useNavigate();

  const location = useLocation();

  const [addBeneficiaryRequest, setaddBeneficiaryRequest] = useState(
    location.state
  );
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const customer = JSON.parse(sessionStorage.getItem("active-customer"));

  const [addMoneyRequest, setAddMoneyRequest] = useState({});

  const handleUserInput = (e) => {
    setAddMoneyRequest({ ...addMoneyRequest, [e.target.name]: e.target.value });
  };

  const accountTransfer = (e) => {
    addMoneyRequest.userId = customer.id;
    addMoneyRequest.beneficiaryId = addBeneficiaryRequest.id;

    fetch(`${process.env.REACT_APP_BASE_URL}/api/transaction/quick/accountTransfer`, {
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

  return (
    <div>
      <div className="mt-2 d-flex aligns-items-center justify-content-center">
        <div
          className="card form-card border-color custom-bg"
          style={{ width: "45rem" }}
        >
          <div className="card-header bg-color text-center custom-bg-text">
            <h4 className="card-title">Quick Pay</h4>
          </div>
          <div className="card-body">
            <h4 className="card-title text-color-second text-center">
              Beneficiary Details
            </h4>

            <div className="row mt-4">
              <div className="col-md-4">
                <p className="mb-2">
                  <b>Acount Number</b> 
                </p>
                <p>{addBeneficiaryRequest.accountNumber}</p>
              </div>
              <div className="col-md-4">
                <p className="mb-2">
                  <b>Swift Code</b> 
                </p>
                <p>{addBeneficiaryRequest.swiftCode}</p>
              </div>
              <div className="col-md-4">
                <p className="mb-2">
                  <b>Bank Name</b> 
                </p>
                <p>{addBeneficiaryRequest.bankName}</p>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-md-4">
                <p className="mb-2">
                  <b>Bank Address</b> 
                </p>
                <p>{addBeneficiaryRequest.bankAddress}</p>
              </div>
              <div className="col-md-4">
                <p className="mb-2">
                  <b>Beneficiary Name</b>{" "}
                  
                </p>
                <p>{addBeneficiaryRequest.beneficiaryName}</p>
              </div>

              <div className="col-md-4">
                <p className="mb-2">
                  <b>Beneficiary Address:</b>{" "}
                  
                </p>
                <p>{addBeneficiaryRequest.bankAddress}</p>
              </div>
            </div>

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
                <label className="form-label">
                  <b>Currency</b>
                </label>
                <select
                  name="currency"
                  onChange={handleUserInput}
                  className="form-control"
                >
                  <option value="">Select Currency</option>
                  <option value="USD">United States Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                  <option value="GBP">British Pound Sterling (GBP)</option>
                  <option value="AUD">Australian Dollar (AUD)</option>
                  <option value="CAD">Canadian Dollar (CAD)</option>
                  <option value="CHF">Swiss Franc (CHF)</option>
                  <option value="CNY">Chinese Yuan (CNY)</option>
                  <option value="SEK">Swedish Krona (SEK)</option>
                  <option value="NZD">New Zealand Dollar (NZD)</option>
                  <option value="KRW">South Korean Won (KRW)</option>
                  <option value="SGD">Singapore Dollar (SGD)</option>
                  <option value="NOK">Norwegian Krone (NOK)</option>
                  <option value="MXN">Mexican Peso (MXN)</option>
                  <option value="INR">Indian Rupee (INR)</option>
                  <option value="BRL">Brazilian Real (BRL)</option>
                  <option value="RUB">Russian Ruble (RUB)</option>
                  <option value="ZAR">South African Rand (ZAR)</option>
                  <option value="TRY">Turkish Lira (TRY)</option>
                  <option value="HKD">Hong Kong Dollar (HKD)</option>
                  <option value="IDR">Indonesian Rupiah (IDR)</option>
                  <option value="TWD">New Taiwan Dollar (TWD)</option>
                  <option value="PLN">Polish Zloty (PLN)</option>
                  <option value="THB">Thai Baht (THB)</option>
                  <option value="PHP">Philippine Peso (PHP)</option>
                  <option value="CZK">Czech Koruna (CZK)</option>
                  <option value="HUF">Hungarian Forint (HUF)</option>
                  <option value="ILS">Israeli New Shekel (ILS)</option>
                  <option value="DKK">Danish Krone (DKK)</option>
                  <option value="MYR">Malaysian Ringgit (MYR)</option>
                  <option value="ARS">Argentine Peso (ARS)</option>
                  <option value="CLP">Chilean Peso (CLP)</option>
                  <option value="COP">Colombian Peso (COP)</option>
                  <option value="AED">United Arab Emirates Dirham (AED)</option>
                  <option value="SAR">Saudi Riyal (SAR)</option>
                  <option value="EGP">Egyptian Pound (EGP)</option>
                  <option value="VND">Vietnamese Dong (VND)</option>
                  <option value="NGN">Nigerian Naira (NGN)</option>
                  <option value="KES">Kenyan Shilling (KES)</option>
                  <option value="PKR">Pakistani Rupee (PKR)</option>
                  <option value="IQD">Iraqi Dinar (IQD)</option>
                  <option value="UAH">Ukrainian Hryvnia (UAH)</option>
                  <option value="QAR">Qatari Riyal (QAR)</option>
                  <option value="BDT">Bangladeshi Taka (BDT)</option>
                  <option value="RON">Romanian Leu (RON)</option>
                  <option value="GHS">Ghanaian Cedi (GHS)</option>
                  <option value="MAD">Moroccan Dirham (MAD)</option>
                  <option value="CRC">Costa Rican Colón (CRC)</option>
                  <option value="PEN">Peruvian Nuevo Sol (PEN)</option>
                  <option value="HRK">Croatian Kuna (HRK)</option>
                  <option value="DZD">Algerian Dinar (DZD)</option>
                  <option value="UGX">Ugandan Shilling (UGX)</option>
                  <option value="KWD">Kuwaiti Dinar (KWD)</option>
                  <option value="OMR">Omani Rial (OMR)</option>
                  <option value="LKR">Sri Lankan Rupee (LKR)</option>
                  <option value="BDT">Bangladeshi Taka (BDT)</option>
                  <option value="GEL">Georgian Lari (GEL)</option>
                  <option value="AZN">Azerbaijani Manat (AZN)</option>
                  <option value="BOB">Bolivian Boliviano (BOB)</option>
                  <option value="TZS">Tanzanian Shilling (TZS)</option>
                  <option value="SDG">Sudanese Pound (SDG)</option>
                  <option value="AFN">Afghan Afghani (AFN)</option>
                  <option value="MNT">Mongolian Tugrik (MNT)</option>
                  <option value="MMK">Myanmar Kyat (MMK)</option>
                  <option value="DOP">Dominican Peso (DOP)</option>
                  <option value="NPR">Nepalese Rupee (NPR)</option>
                  <option value="UYU">Uruguayan Peso (UYU)</option>
                  <option value="BHD">Bahraini Dinar (BHD)</option>
                  <option value="YER">Yemeni Rial (YER)</option>
                  <option value="KHR">Cambodian Riel (KHR)</option>
                  <option value="ALL">Albanian Lek (ALL)</option>
                  <option value="ZMW">Zambian Kwacha (ZMW)</option>
                  <option value="AOA">Angolan Kwanza (AOA)</option>
                  <option value="XAF">Central African CFA Franc (XAF)</option>
                  <option value="XOF">West African CFA Franc (XOF)</option>
                  <option value="HTG">Haitian Gourde (HTG)</option>
                  <option value="GNF">Guinean Franc (GNF)</option>
                  <option value="NIO">Nicaraguan Córdoba (NIO)</option>
                  <option value="PGK">Papua New Guinean Kina (PGK)</option>
                  <option value="RWF">Rwandan Franc (RWF)</option>
                  <option value="SCR">Seychellois Rupee (SCR)</option>
                  <option value="SLL">Sierra Leonean Leone (SLL)</option>
                  <option value="SZL">Swazi Lilangeni (SZL)</option>
                  <option value="TOP">Tongan Pa'anga (TOP)</option>
                  <option value="VUV">Vanuatu Vatu (VUV)</option>
                  <option value="WST">Samoan Tala (WST)</option>
                  <option value="XCD">East Caribbean Dollar (XCD)</option>
                  <option value="YER">Yemeni Rial (YER)</option>
                  <option value="ZMW">Zambian Kwacha (ZMW)</option>
                  <option value="AFN">Afghan Afghani (AFN)</option>
                  <option value="BBD">Barbadian Dollar (BBD)</option>
                  <option value="BND">Brunei Dollar (BND)</option>
                  <option value="BSD">Bahamian Dollar (BSD)</option>
                </select>
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
                onClick={accountTransfer}
              >
                {/*  */}
                Transfer
              </button>
              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPay;