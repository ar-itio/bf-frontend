import React, { useState, useEffect } from "react";
import axios from "axios";

const EmailTemplate = () => {
  const [emailDetails, setEmailDetails] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedEmailSubject, setEditedEmailSubject] = useState("");
  const [editedEmailMessage, setEditedEmailMessage] = useState("");
  const [editedCode, setEditedCode] = useState("");

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const retrieveEmailDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/fee/detail/fetch/emailTemp/all`,
        {
          headers: {
            Authorization: "Bearer " + admin_jwtToken,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching email details:", error);
    }
  };

  useEffect(() => {
    const getAllEmailDetails = async () => {
      const emailResponse = await retrieveEmailDetails();
      if (emailResponse) {
        setEmailDetails(emailResponse.emailTempDetails);
      }
    };

    getAllEmailDetails();
  }, []);

  const handleEditClick = (index = null) => {
    console.log("Edit button clicked for index:", index);
    if (index !== null) {
      // Editing existing template
      setEditRowIndex(index);
      setShowModal(true);
      // Set initial values for editing
      setEditedEmailSubject(emailDetails[index].emailSubject);
      setEditedEmailMessage(emailDetails[index].emailMessage);
      setEditedCode(emailDetails[index].code);
    } else {
      // Adding new template
      setEditRowIndex(null);
      setShowModal(true);
      // Set initial values for adding (email code fixed)
      setEditedEmailSubject("");
      setEditedEmailMessage("");
      setEditedCode(""); // Set your fixed email code here
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditRowIndex(null);
  };

  const handleSaveChanges = async () => {
    try {
      // Create a new object with the updated values
      const updatedEmailDetail = {
        emailSubject: editedEmailSubject,
        emailMessage: editedEmailMessage,
        code: editedCode,
      };
  
      // POST request to save changes
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/fee/detail/update/emailTemp`,
        updatedEmailDetail, // Send only the updated detail object
        {
          headers: {
            Authorization: "Bearer " + admin_jwtToken,
          },
        }
      );
      if (response.status === 200) {
        const updatedEmailDetails = emailDetails.map((detail, index) => {
          if (index === editRowIndex) {
            return {
              ...detail,
              emailSubject: editedEmailSubject,
              emailMessage: editedEmailMessage,
              code: editedCode,
            };
          } else {
            return detail;
          }
        });
        setEmailDetails(updatedEmailDetails);
      }
      // Close the modal
      handleCloseModal();
    } catch (error) {
      console.error("Error updating email details:", error);
      // You can handle the error here, e.g., display an error message to the user
    }
  };

  return (
    <div>
      <div className="mt-2">
        <div
          className="card   "
          style={{
            height: '45rem',
          }}
        >
          <div className="card-header custom-bg-text text-center bg-color">
            <h2>Email Templates</h2>
          </div>
          <div
            className="card-body"
            style={{
              overflowY: 'auto',
            }}
          >
            <div className="table-responsive mt-3">
              <table className="table table-hover text-color text-center">
                <thead className="table-bordered border-color bg-color custom-bg-text">
                  <tr>
                    <th scope="col">Email Subject</th>
                    <th scope="col">Email Message</th>
                    <th scope="col">Code</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emailDetails.map((detail, index) => (
                    <tr key={index}>
                      <td>{detail.emailSubject}</td>
                      <td>{detail.emailMessage}</td>
                      <td>{detail.code}</td>
                      <td>
                        <button onClick={() => handleEditClick(index)}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="text-center mb-3">
        <button className="btn btn-primary" onClick={() => handleEditClick()}>Add Template</button>
      </div> */}
      {editRowIndex !== null && (
        <div className="modal" style={{ display: showModal ? "block" : "none" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editRowIndex !== null ? "Edit" : "Add"} Email Template</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="emailSubject" className="form-label">Email Subject</label>
                  <input type="text" className="form-control" id="emailSubject" value={editedEmailSubject} onChange={(e) => setEditedEmailSubject(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="emailMessage" className="form-label">Email Message</label>
                  <textarea className="form-control" id="emailMessage" value={editedEmailMessage} onChange={(e) => setEditedEmailMessage(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="code" className="form-label">Code</label>
                  <input type="text" className="form-control" id="code" value={editedCode} onChange={(e) => setEditedCode(e.target.value)} disabled={editRowIndex !== null} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplate;
