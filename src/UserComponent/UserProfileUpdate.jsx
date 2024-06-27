import React, { useState,useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { useNavigate } from "react-router-dom";
const UserProfileForm = () => {
  const [step, setStep] = useState(1);
  let navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const [customer, setCustomer] = useState({});
  const retrieveAllBankUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/user/fetch/id?id=` + user.id
      );
      return response.data;
    } catch (error) {
      // Handle any errors here
      console.error("Error fetching bank managers:", error);
      throw error;
    }
  };
  useEffect(() => {
    const getCustomer = async () => {
      const customerRes = await retrieveAllBankUsers();
      if (customerRes) {
        setCustomer(customerRes.users[0]);
      }
      if (customerRes) {
        const customerData = customerRes.users[0];
        setCustomer(customerData);
        setPersonalInfo({
          firstName: customerData.firstName || "",
          lastName: customerData.lastName || "",
          email: customerData.email || "",
          contact: customerData.contact || "",
          gender: customerData.gender || "",
          dateOfBirth: customerData.dateOfBirth || ""
        });
        setAddressInfo({
          address: customerData.address || "",
          address2: customerData.address2 || "",
          city: customerData.city || "",
          state: customerData.state || "",
          country: customerData.country || "",
          pincode: customerData.pincode || ""
        });
        setOwnerDetail({
          individualOrCorporate: customerData.individualOrCorporate || "",
          employmentStatus: customerData.employmentStatus || "",
          roleInCompany: customerData.roleInCompany || "",
          businessActivity: customerData.businessActivity || "",
          enterActivity: customerData.enterActivity || "",
          companyName: customerData.companyName || "",
          companyRegistrationNumber: customerData.companyRegistrationNumber || "",
          dateOfIncorporation: customerData.dateOfIncorporation || "",
          countryOfIncorporation: customerData.countryOfIncorporation || "",
          companyAddress: customerData.companyAddress || ""
        });
        setCustomerDetail({
          nationality: customerData.nationality || "",
          placeOfBirth: customerData.placeOfBirth || "",
          idType: customerData.idType || "",
          idNumber: customerData.idNumber || "",
          idExpiryDate: customerData.idExpiryDate || ""
        });
      }
    };

    getCustomer();
  }, []);
  // States to track completion status of each section
  const [sectionsCompleted, setSectionsCompleted] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
      firstName: customer.firstName||"",
      lastName: customer.lastName || "",
      email: customer.email || "",
      contact: customer.contact || "",
      gender: customer.gender || "",
      dateOfBirth: customer.dateOfBirth || "",
  });

  // Address State
  const [addressInfo, setAddressInfo] = useState({
    address: customer.address || "",
    address2: customer.address2 || "",
    city: customer.city || "",
    state: customer.state || "",
    country: customer.country || "",
    pincode: customer.pincode || "",
  });

  // Owner Detail State
  const [ownerDetail, setOwnerDetail] = useState({
    individualOrCorporate: customer.individualOrCorporate || "",
    employmentStatus: customer.employmentStatus || "",
    roleInCompany: customer.roleInCompany || "",
    businessActivity: customer.businessActivity || "",
    enterActivity: customer.enterActivity || "",
    companyName: customer.companyName || "",
    companyRegistrationNumber: customer.companyRegistrationNumber || "",
    dateOfIncorporation: customer.dateOfIncorporation || "",
    countryOfIncorporation: customer.countryOfIncorporation || "",
    companyAddress: customer.companyAddress || "",
  });

  // Customer Detail State
  const [customerDetail, setCustomerDetail] = useState({
    nationality: customer.nationality || "",
    placeOfBirth: customer.placeOfBirth || "",
    idType: customer.idType || "",
    idNumber: customer.idNumber || "",
    idExpiryDate: customer.idExpiryDate || "",
  });

  // Account Number State
  const [accountNumber, setAccountNumber] = useState("");
  

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all form fields before submitting
    const isValid = validateStep();
    if (!isValid) {
      // If form is not valid, display an error message and return
      toast.error("Please fill in all required fields.");
      return;
    }
      console.log(customer)
    try {
      // Make a POST request to the API endpoint with the user data
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/update-profile`, customer);
      console.log(response.status); // Log response data
      if (response.status === 200) {
        // Display success message to the user
        toast.success("Profile updated successfully.", {
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
        }, 1000); 
        sessionStorage.setItem(
          "active-customer",
          JSON.stringify(customer)
        );
        return;
      } else {
        // Handle other status codes if needed
        console.error("Unexpected status code:", response.status);
        toast.error("Failed to update profile. Unexpected status code.");
      }

    } catch (error) {
      // If there was an error with the request, display an error message
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again later.");
    }
  };

  // Function to handle next step
  const nextStep = () => {
    let isValid = validateStep();
    if (isValid) {
      setSectionsCompleted(prev => ({ ...prev, [step]: true }));
      setStep(step + 1);

    } else {
      // Update completion status of the current section to false
      setSectionsCompleted(prev => ({ ...prev, [step]: false }));
      setStep(step + 1);
    }
  };
  
  // Function to handle previous step without validation
  const prevStep = () => {
    setStep(step - 1);
  };
  
  // Function to validate current step
  const validateStep = () => {
    switch (step) {
      case 1:
        return validatePersonalInfo();
      case 2:
        return validateAddressInfo();
      case 3:
        return validateOwnerDetail();
      case 4:
        return validateCustomerDetail();
      // case 5:
      //   return validateAccountNumber();
      default:
        return true;
    }
  };
  
  // Function to validate personal info fields
  const validatePersonalInfo = () => {
    const { firstName, lastName, email, contact, gender, dateOfBirth } = personalInfo;
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      contact.trim() !== "" &&
      gender.trim() !== "" &&
      dateOfBirth.trim() !== ""
    );
  };
  
  // Function to validate address info fields
  const validateAddressInfo = () => {
    const { address, city, state, country, pincode } = addressInfo;
    return (
      address.trim() !== "" &&
      city.trim() !== "" &&
      state.trim() !== "" &&
      country.trim() !== "" &&
      pincode.trim() !== ""
    );
  };
  
 // Function to validate owner detail fields
 const validateOwnerDetail = () => {
  const { individualOrCorporate, employmentStatus, roleInCompany, businessActivity, enterActivity, companyName, companyRegistrationNumber, dateOfIncorporation, countryOfIncorporation, companyAddress } = ownerDetail;
  if (individualOrCorporate === 'individual') {
    return employmentStatus.trim() !== "";
  } else if (individualOrCorporate === 'corporate') {
    return (
      roleInCompany.trim() !== "" &&
      businessActivity.trim() !== "" &&
      enterActivity.trim() !== "" &&
      companyName.trim() !== "" &&
      companyRegistrationNumber.trim() !== "" &&
      dateOfIncorporation.trim() !== "" &&
      countryOfIncorporation.trim() !== "" &&
      companyAddress.trim() !== ""
    );
  }
  return false; // Return false for other cases
};

  
  // Function to validate customer detail fields
  const validateCustomerDetail = () => {
    const { nationality, placeOfBirth, idType, idNumber, idExpiryDate } = customerDetail;
    return (
      nationality.trim() !== "" &&
      placeOfBirth.trim() !== "" &&
      idType.trim() !== "" &&
      idNumber.trim() !== "" &&
      idExpiryDate.trim() !== ""
    );
  };
  
  // Function to validate account number
  const validateAccountNumber = () => {
    return accountNumber.trim() !== "";
  };

  // Function to handle input change for each section
  const handleChange = (e, category) => {
    const { name, value } = e.target;
    let isSectionCompleted = false;
  
    switch (category) {
      case "personalInfo":
        console.log("Updating personalInfo");
        setPersonalInfo({ ...personalInfo, [name]: value });
        setCustomer({ ...personalInfo, [name]: value });
        isSectionCompleted = checkSectionCompletion(personalInfo);
        break;
      case "addressInfo":
        console.log("Updating addressInfo");
        setAddressInfo({ ...addressInfo, [name]: value });
        setCustomer({ ...addressInfo, [name]: value });
        isSectionCompleted = checkSectionCompletion(addressInfo);
        break;
      case "ownerDetail":
        console.log("Updating ownerDetail");
        setOwnerDetail({ ...ownerDetail, [name]: value });
        setCustomer({ ...ownerDetail, [name]: value });
        isSectionCompleted = Object.values(ownerDetail).every(field => field !== "");
        break;
      case "customerDetail":
        console.log("Updating customerDetail");
        setCustomer({ ...customerDetail, [name]: value });
        setCustomerDetail({ ...customerDetail, [name]: value });
        isSectionCompleted = checkSectionCompletion(customerDetail);
        break;
      default:
        break;
    }
    setCustomer( { ...customer, [name]: value });  
    console.log(customer);
    // Update completion status of the current section
    setSectionsCompleted(prev => ({ ...prev, [step]: isSectionCompleted }));
  };
  
  // Function to check if all fields in a section are filled
  const checkSectionCompletion = (section) => {
    return Object.values(section).every(field => field !== "");
  };
  // Function to render form content based on the current step
  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3>Personal Information</h3>
            <form onSubmit={nextStep}>
              <div className="row">
                <div className="col">
                  <label htmlFor="firstName">First Name:</label>
                </div>
                <div className="col">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => handleChange(e, "personalInfo")}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label htmlFor="lastName">Last Name:</label>
                </div>
                <div className="col">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => handleChange(e, "personalInfo")}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label htmlFor="email">Email Address:</label>
                </div>
                <div className="col">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={(e) => handleChange(e, "personalInfo")}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label htmlFor="contact">Contact Number:</label>
                </div>
                <div className="col">
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={personalInfo.contact}
                    onChange={(e) => handleChange(e, "personalInfo")}
                    pattern="[0-9]{10}"  
                    title="Please enter a 10-digit number"
                    required                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label htmlFor="gender">Gender:</label>
                </div>
                <div className="col">
                  <input
                    type="text"
                    id="gender"
                    name="gender"
                    value={personalInfo.gender}
                    onChange={(e) => handleChange(e, "personalInfo")}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label htmlFor="dateOfBirth">Date of Birth:</label>
                </div>
                <div className="col">
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => handleChange(e, "personalInfo")}
                    required
                  />
                </div>
              </div>
            </form>
          </>
        );
      case 2:
          return (
            <>
              <h3>Address</h3>
              <form onSubmit={nextStep}>
                <div className="row">
                  <div className="col">
                    <label htmlFor="address">Address Line 1:</label>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={addressInfo.address}
                      onChange={(e) => handleChange(e, "addressInfo")}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label htmlFor="address2">Address Line 2:</label>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      id="address2"
                      name="address2"
                      value={addressInfo.address2}
                      onChange={(e) => handleChange(e, "addressInfo")}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label htmlFor="city">City:</label>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={addressInfo.city}
                      onChange={(e) => handleChange(e, "addressInfo")}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label htmlFor="state">State:</label>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={addressInfo.state}
                      onChange={(e) => handleChange(e, "addressInfo")}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label htmlFor="country">Country:</label>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={addressInfo.country}
                      onChange={(e) => handleChange(e, "addressInfo")}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label htmlFor="pincode">Postal Code:</label>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={addressInfo.pincode}
                      onChange={(e) => handleChange(e, "addressInfo")}
                      required
                    />
                  </div>
                </div>
              </form>
            </>
          );
      case 3:
            return (
              <>
                <h3>Owner Detail</h3>
                <form onSubmit={nextStep}>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="individualOrCorporate">Individual or Corporate:</label>
                    </div>
                    <div className="col">
                      <select
                        id="individualOrCorporate"
                        name="individualOrCorporate"
                        value={ownerDetail.individualOrCorporate}
                        onChange={(e) => handleChange(e, "ownerDetail")}
                        required
                      >
                        <option value="">Select</option>
                        <option value="individual">Individual</option>
                        <option value="corporate">Corporate</option>
                      </select>
                    </div>
                  </div>
                  {ownerDetail.individualOrCorporate === 'individual' && (
                  <div className="row">
                    <div className="col">
                      <label htmlFor="employmentStatus">Employment Status:</label>
                    </div>
                    <div className="col">
                     <select
                      id="employmentStatus"
                      name="employmentStatus"
                      value={ownerDetail.employmentStatus}
                      onChange={(e) => handleChange(e, "ownerDetail")}
                      required
                      >
                     <option value="">Select Employment Status</option>
                     <option value="Employed">Employed</option>
                     <option value="Unemployed">Unemployed</option>
                     <option value="Self-employed">Self-employed</option>
                     </select>
                    </div>
                  </div>
                  )}
                   {ownerDetail.individualOrCorporate === 'corporate' && (
                  <div>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="roleInCompany">Role in Company:</label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        id="roleInCompany"
                        name="roleInCompany"
                        value={ownerDetail.roleInCompany}
                        onChange={(e) => handleChange(e, "ownerDetail")}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="businessActivity">Business Activity:</label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        id="businessActivity"
                        name="businessActivity"
                        value={ownerDetail.businessActivity}
                        onChange={(e) => handleChange(e, "ownerDetail")}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="enterActivity">Enter Activity:</label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        id="enterActivity"
                        name="enterActivity"
                        value={ownerDetail.enterActivity}
                        onChange={(e) => handleChange(e, "ownerDetail")}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="companyName">Company Name:</label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={ownerDetail.companyName}
                        onChange={(e) => handleChange(e, "ownerDetail")}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="companyRegistrationNumber">Company Registration Number:</label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        id="companyRegistrationNumber"
                        name="companyRegistrationNumber"
                        value={ownerDetail.companyRegistrationNumber}
                        onChange={(e) => handleChange(e, "ownerDetail")}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="dateOfIncorporation">Date of Incorporation:</label>
                    </div>
                    <div className="col">
                      <input
                        type="date"
                        id="dateOfIncorporation"
                        name="dateOfIncorporation"
                        value={ownerDetail.dateOfIncorporation}
                        onChange={(e) => handleChange(e, "ownerDetail")}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="countryOfIncorporation">Country of Incorporation:</label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        id="countryOfIncorporation"
                        name="countryOfIncorporation"
                        value={ownerDetail.countryOfIncorporation}
                        onChange={(e) => handleChange(e, "ownerDetail")}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="companyAddress">Company Address:</label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        id="companyAddress"
                        name="companyAddress"
                        value={ownerDetail.companyAddress}
                        onChange={(e) => handleChange(e, "ownerDetail")}
                        required
                      />
                    </div>
                    </div>
                  </div>)}
                </form>
              </>
            );      
      case 4:
              return (
                <>
                  <h3>Customer Detail</h3>
                  <form onSubmit={nextStep}>
                    <div className="row">
                      <div className="col">
                        <label htmlFor="nationality">Nationality:</label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          id="nationality"
                          name="nationality"
                          value={customerDetail.nationality}
                          onChange={(e) => handleChange(e, "customerDetail")}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <label htmlFor="placeOfBirth">Place of Birth:</label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          id="placeOfBirth"
                          name="placeOfBirth"
                          value={customerDetail.placeOfBirth}
                          onChange={(e) => handleChange(e, "customerDetail")}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <label htmlFor="idType">ID Type:</label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          id="idType"
                          name="idType"
                          value={customerDetail.idType}
                          onChange={(e) => handleChange(e, "customerDetail")}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <label htmlFor="idNumber">ID Number:</label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          id="idNumber"
                          name="idNumber"
                          value={customerDetail.idNumber}
                          onChange={(e) => handleChange(e, "customerDetail")}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <label htmlFor="idExpiryDate">ID Expiry Date:</label>
                      </div>
                      <div className="col">
                        <input
                          type="date"
                          id="idExpiryDate"
                          name="idExpiryDate"
                          value={customerDetail.idExpiryDate}
                          onChange={(e) => handleChange(e, "customerDetail")}
                          required
                        />
                      </div>
                    </div>
                  </form>
                </>
              );
      case 5:
              return (
                <>
                  <h3>Account Number</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col">
                        <label htmlFor="accountNumber">Account Number:</label>
                        <input
                          type="text"
                          id="accountNumber"
                          name="accountNumber"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </form>
                </>
              );
      default:
        return null;
    }
  };

  // Sidebar Component
  const InnerSidebar = ({ sectionsCompleted }) => (
    <div className="InnerSidebar">
      <ul>
        <li className={sectionsCompleted[1] ? "completed" : ""}>
          <div className="icon-container">
            <div className={sectionsCompleted[1] ? "circle completed" : "circle"}>
              {sectionsCompleted[1] ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />}
            </div>
            <span>Personal Detail</span>
          </div>
        </li>
        <li className={sectionsCompleted[2] ? "completed" : ""}>
          <div className="icon-container">
            <div className={sectionsCompleted[2] ? "circle completed" : "circle"}>
              {sectionsCompleted[2] ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />}
            </div>
            <span>Address Detail</span>
          </div>
        </li>
        <li className={sectionsCompleted[3] ? "completed" : ""}>
          <div className="icon-container">
            <div className={sectionsCompleted[3] ? "circle completed" : "circle"}>
              {sectionsCompleted[3] ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />}
            </div>
            <span>Owner  Detail</span>
          </div>
        </li>
        <li className={sectionsCompleted[4] ? "completed" : ""}>
          <div className="icon-container">
            <div className={sectionsCompleted[4] ? "circle completed" : "circle"}>
              {sectionsCompleted[4] ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />}
            </div>
            <span>Customer  Detail</span>
          </div>
        </li>
        {/* <li className={sectionsCompleted[5] ? "completed" : ""} onClick={() => setStep(5)}>
          <div className="icon-container">
            <div className={sectionsCompleted[5] ? "circle completed" : "circle"}>
              {sectionsCompleted[5] ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />}
            </div>
            <span>Additional Info</span>
          </div>
        </li> */}
      </ul>
    </div>
  );

  return (
    <div className="mt-2 ">
      <div className="card">
        <div className="card-header  text-white text-center">
          <h4 className=" text-color " >User Profile</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
            <InnerSidebar sectionsCompleted={sectionsCompleted} />
            </div>
            <div className="col-md-8">
              <div className="form-content">{renderForm()}</div>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between">
          {step !== 1 && (
            <button className="btn btn-secondary" onClick={prevStep}>
              Previous
            </button>
          )}
          {step !== 4 && (
            <button className="btn btn-primary" onClick={nextStep}>
              Next
            </button>
          )}
          {step === 4 && (
            <button className="btn btn-success" type="submit" onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </div>
      <ToastContainer /> {/* Toast notifications container */}
    </div>
  );
};

export default UserProfileForm;


