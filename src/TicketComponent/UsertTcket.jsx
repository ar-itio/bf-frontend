import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const UserForm = () => {
  const [emailDetails, setEmailDetails] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [editedEmailSubject, setEditedEmailSubject] = useState("");
  const [editedEmailBody, setEditedEmailBody] = useState("");
  const [editedAssignee, setEditedAssignee] = useState("");
  const [editedStatus, setEditedStatus] = useState("Open");
  const [editedUser, setEditedUser] = useState("");
  const [editedPriority, setEditedPriority] = useState("Low");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const customer = JSON.parse(sessionStorage.getItem("active-customer"));

  // Function to retrieve email details from the server
  const retrieveEmailDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/ticket/fetch/id?id=` +
          customer.id,
        {
          headers: {
            Authorization:
              "Bearer " + sessionStorage.getItem("customer-jwtToken"),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching email details:", error);
    }
  };

  const filterEmailsByDateRange = () => {
    switch (dateRange) {
      case "today":
        return emailDetails.filter(
          (detail) =>
            new Date(detail.date).toDateString() === new Date().toDateString()
        );
      case "last7days":
        const last7days = new Date();
        last7days.setDate(last7days.getDate() - 7);
        return emailDetails.filter(
          (detail) => new Date(detail.date) >= last7days
        );
      case "last30days":
        const last30days = new Date();
        last30days.setDate(last30days.getDate() - 30);
        return emailDetails.filter(
          (detail) => new Date(detail.date) >= last30days
        );
      case "custom":
        const customDateValue = new Date(customDate);
        return emailDetails.filter(
          (detail) =>
            new Date(detail.date).toDateString() ===
            customDateValue.toDateString()
        );
      default:
        return emailDetails;
    }
  };
  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setDateRange(value);
    if (value !== "custom") {
      setCustomDate(""); // Reset custom date when another option is selected
    }
  };

  const handleCustomDateChange = (e) => {
    setCustomDate(e.target.value);
  };
  // Effect hook to retrieve email details when component mounts
  useEffect(() => {
    const getAllEmailDetails = async () => {
      const emailResponse = await retrieveEmailDetails();
      if (emailResponse) {
        console.log(emailResponse);
        setEmailDetails(emailResponse.ticketDetails);
      }
    };

    getAllEmailDetails();
  }, []);

  // Function to handle edit button click
  const handleEditClick = (index = null) => {
    if (index !== null) {
      setEditRowIndex(index);
      setShowModal(true);
      setEditedEmailSubject(emailDetails[index].emailSubject);
      setEditedEmailBody(emailDetails[index].emailBody);
      setEditedAssignee(emailDetails[index].assignee);
      setEditedStatus(emailDetails[index].status);
      setEditedUser(emailDetails[index].user);
      setEditedPriority(emailDetails[index].priority);
    } else {
      setEditRowIndex(null);
      setShowModal(true);
      setEditedEmailSubject("");
      setEditedEmailBody("");
      setEditedAssignee("");
      setEditedStatus("Open");
      setEditedUser("");
      setEditedPriority("Low");
    }
  };

  // Function to close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditRowIndex(null);
  };

  // Function to save changes
  const handleSaveChanges = async () => {
    try {
      const updatedEmailDetail = {
        userId: customer.id,
        userName: customer.name,
        subject: editedEmailSubject,
        body: editedEmailBody,
        assignee: editedAssignee,
        status: editedStatus,
        user: editedUser,
        priority: editedPriority,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/ticket/add`,
        updatedEmailDetail,
        {
          headers: {
            Authorization:
              "Bearer " + sessionStorage.getItem("customer-jwtToken"),
          },
        }
      );

      if (response.status === 200) {
        const currentDate = new Date();
        const options = { timeZone: "Asia/Kolkata" }; // Specify the Indian time zone

        // Get the individual date components
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
        const day = String(currentDate.getDate()).padStart(2, "0");
        const hour = String(currentDate.getHours()).padStart(2, "0");
        const minute = String(currentDate.getMinutes()).padStart(2, "0");
        const second = String(currentDate.getSeconds()).padStart(2, "0");

        // Construct the formatted date string
        const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

        const newTicket = {
          ...updatedEmailDetail,
          date: formattedDate,
          updateDate: formattedDate, // Assuming updateDate is also needed
        };
        toast.success("Add Ticket sucsessfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {}, 1000);
        // Append the new ticket to the list of tickets
        setEmailDetails((prevEmailDetails) => [...prevEmailDetails, newTicket]);

        handleCloseModal();
      } else {
        toast.error("Add Ticket Faild", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error updating email details:", error);
      toast.error("Add Ticket Faild", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // Function to filter emails based on status and priority
  const filteredEmails = filterEmailsByDateRange().filter((detail) => {
    const statusMatches = statusFilter === "" || detail.status === statusFilter;
    const priorityMatches =
      priorityFilter === "" || detail.priority === priorityFilter;
    return statusMatches && priorityMatches;
  });
  return (
    <div>
      <div className="mt-2">
        <div
          className="card form-card ms-5 me-5 mb-5 custom-bg border-color "
          style={{ height: "45rem" }}
        >
          <div className="card-header custom-bg-text text-center bg-color">
            <h2>User Tickets</h2>
          </div>
          <div className="card-body" style={{ overflowY: "auto" }}>
            <div className="row">
              <div className="col">
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select mb-3"
                >
                  <option value="">All Status</option>
                  <option value="Open">Open</option>
                  <option value="Hold">Hold</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Close">Close</option>
                </select>
              </div>
              <div className="col">
                <select
                  id="priorityFilter"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="form-select mb-3"
                >
                  <option value="">All</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="col">
                <select
                  className="form-select mb-3"
                  value={dateRange}
                  onChange={handleDateRangeChange}
                >
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              {dateRange === "custom" && (
                <div className="col">
                  <input
                    type="date"
                    className="form-control mb-3"
                    value={customDate}
                    onChange={handleCustomDateChange}
                  />
                </div>
              )}
              <div className="col">
                <button
                  className="btn btn-primary"
                  onClick={() => handleEditClick()}
                >
                  Add new Ticket
                </button>
              </div>
            </div>

            <div className="table-responsive mt-3">
              <table className="table table-hover text-color text-center">
                <thead className="table-bordered border-color bg-color custom-bg-text">
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">User Name</th>
                    <th scope="col">Subject</th>
                    <th scope="col">Status</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Last Replay</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmails.map((detail, index) => (
                    <tr key={index}>
                      <td>
                        <b>{detail.date}</b>
                      </td>
                      <td>
                        <b>{detail.userName}</b>
                      </td>
                      <td>
                        <b>{detail.subject}</b>
                      </td>
                      <td>
                        <b
                          style={{
                            color:
                              detail.status === "Close"
                                ? "green"
                                : detail.status === "Open"
                                ? "red"
                                : "orange",
                          }}
                        >
                          {detail.status}
                        </b>
                      </td>{" "}
                      <td>
                        <b>{detail.priority}</b>
                      </td>
                      <td>
                        <b>{detail.updateDate}</b>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
      <div className="modal" style={{ display: showModal ? "block" : "none" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editRowIndex !== null ? "Edit" : "Add"} Ticket
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="emailSubject" className="form-label">
                  Subject
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="emailSubject"
                  value={editedEmailSubject}
                  onChange={(e) => setEditedEmailSubject(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="emailBody" className="form-label">
                  Body
                </label>
                <textarea
                  className="form-control"
                  id="emailBody"
                  value={editedEmailBody}
                  onChange={(e) => setEditedEmailBody(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="assignee" className="form-label">
                  Assignee
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="assignee"
                  value={editedAssignee}
                  onChange={(e) => setEditedAssignee(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  className="form-control"
                  id="status"
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="Hold">Hold</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Close">Close</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="user" className="form-label">
                  User
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="user"
                  value={editedUser}
                  onChange={(e) => setEditedUser(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="priority" className="form-label">
                  Priority
                </label>
                <select
                  className="form-control"
                  id="priority"
                  value={editedPriority}
                  onChange={(e) => setEditedPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Normal</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveChanges}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
