import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // Import useHistory
import axios from "axios";
import img from "../images/logo.png";
import { ToastContainer, toast } from "react-toastify";
import { FaSave, FaCamera } from "react-icons/fa";

const EditHostDetailsPage = () => {
  // const history = useHistory(); // Retrieve history object
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [hostDetails, setHostDetails] = useState({
    logo: "",
    shortName: "",
    longName: "",
    contact: "",
    email: "",
    address: "",
    headerColor: "",
    sidebarColor: "",
    smtpHost: "",
    smtpPort: "",
    smtpUsername: "",
    smtpPassword: "",
  });

  useEffect(() => {
    fetchHostDetails();
    const getImg = async () => {
          try {
            const img = await import(`../customerPhotos/${hostDetails.logo}`);
            setProfileImg(img.default);
            setSelectedImage(img.default)
            
          } catch (error) {
            console.error('Error loading image:', error);
            setProfileImg(img);
          }
    };
    getImg();
  }, []);

  const fetchHostDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/currencies/fatchHostDetail`
      );
      setHostDetails(response.data.hostingDetail);
      const img = await import(`../images/${response.data.hostingDetail.logo}`);
      setProfileImg(img.default);
      console.log(response);
      // history.push(history.location.pathname);
    } catch (error) {
      setProfileImg(img);
      console.error("Error fetching host details:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHostDetails({
      ...hostDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(); // Create a new FormData object

      // Append the image to the FormData object
      if(selectedImage===null){
      formData.append('image', img);
      }else{
        formData.append('image', selectedImage);
      }
      // Append other values from hostDetails
      formData.append('logo', hostDetails.logo);
      formData.append('shortName', hostDetails.shortName);
      formData.append('longName', hostDetails.longName);
      formData.append('contact', hostDetails.contact);
      formData.append('email', hostDetails.email);
      formData.append('address', hostDetails.address);
      formData.append('headerColor', hostDetails.headerColor+"");
      formData.append('sidebarColor', hostDetails.sidebarColor+"");
      formData.append('smtpHost', hostDetails.smtpHost);
      formData.append('smtpPort', hostDetails.smtpPort);
      formData.append('smtpUsername', hostDetails.smtpUsername);
      formData.append('smtpPassword', hostDetails.smtpPassword);  
      
      console.log(formData)
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/currencies/updateHostDetail`,
        formData
      );
      // Optionally, show success message or redirect to another page
      toast.success("update Hosting Detail successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting update Hosting Detail:", error);
      // Handle error
    }
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(event);
    setSelectedImage(file);
  };

  return (
    <div>
      <div className="mt-2">
        <div
          className="card form-card ms-5 me-5 mb-5 custom-bg border-color"
          style={{
            height: "50rem",
          }}
        >
          <div className="card-header custom-bg-text text-center bg-color">
            <h2>Edit Host Details</h2>
          </div>
          <div
            className="card-body d-flex flex-column"
            style={{
              overflowY: "auto",
            }}
          >
            <div className="mb-2">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <div className="d-flex align-items-center">
                      <span className="logo-label">Logo</span>
                       
                        <div className="img-container ms-3">
                          {selectedImage ? (
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              alt="Profile"
                              className="img-fluid logo-image"
                            />
                          ) : hostDetails && hostDetails.logo ? (
                            <img
                              src={profileImg}
                              alt="Profile"
                              className="img-fluid logo-image"
                            />
                          ) : (
                            <img
                              src={img}
                              alt="Profile"
                              className="img-fluid logo-image"
                            />
                          )}
                        </div> 
                        <label className="camera-input">
                          
                          {/* Added label for the image */}
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control mt-3 d-none" // Hide the file input
                            onChange={handleImageChange}
                          />
                          <FaCamera className="camera-icon" />
                        </label>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Host Short Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            id="shortName"
                            name="shortName"
                            value={hostDetails.shortName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Host Full Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            id="longName"
                            name="longName"
                            value={hostDetails.longName}
                            onChange={handleInputChange}
                          />
                        </div>{" "}
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Contact Number:</label>
                          <input
                            type="text"
                            className="form-control"
                            id="contact"
                            name="contact"
                            value={hostDetails.contact}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email ID</label>
                          <input
                            type="text"
                            className="form-control"
                            id="email"
                            name="email"
                            value={hostDetails.email}
                            onChange={handleInputChange}
                          />
                        </div>{" "}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="address">Address:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          name="address"
                          value={hostDetails.address}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">SideBar Color:</label>
                          <input
                            type="text"
                            className="form-control"
                            id="sidebarColor"
                            name="sidebarColor"
                            value={hostDetails.sidebarColor}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Header Color</label>
                          <input
                            type="text"
                            className="form-control"
                            id="headerColor"
                            name="headerColor"
                            value={hostDetails.headerColor}
                            onChange={handleInputChange}
                          />
                        </div>{" "}
                      </div>
                      <div className="accordion" id="smtpAccordion">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="smtpHeader">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#smtpCollapse"
                              aria-expanded="true"
                              aria-controls="smtpCollapse"
                            >
                              SMTP Satting
                            </button>
                          </h2>
                          <div
                            id="smtpCollapse"
                            className="accordion-collapse collapse show"
                            aria-labelledby="smtpHeader"
                            data-bs-parent="#smtpAccordion"
                          >
                            <div className="accordion-body">
                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label
                                    htmlFor="smtpHost"
                                    className="form-label"
                                  >
                                    Host:
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="smtpHost"
                                    name="smtpHost"
                                    value={hostDetails.smtpHost}
                                    onChange={handleInputChange}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label
                                    htmlFor="smtpPort"
                                    className="form-label"
                                  >
                                    Port:
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="smtpPort"
                                    name="smtpPort"
                                    value={hostDetails.smtpPort}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label
                                    htmlFor="smtpUsername"
                                    className="form-label"
                                  >
                                    Username:
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="smtpUsername"
                                    name="smtpUsername"
                                    value={hostDetails.smtpUsername}
                                    onChange={handleInputChange}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label
                                    htmlFor="smtpPassword"
                                    className="form-label"
                                  >
                                    Password:
                                  </label>
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="smtpPassword"
                                    name="smtpPassword"
                                    value={hostDetails.smtpPassword}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHostDetailsPage;
