import { useContext, useState, useEffect } from "react";
import UserContext from "../../contexts/UserContext";
import { convertUTCDateToLocalDate } from "../../utils/methods";
// bootstrap
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Table from "react-bootstrap/Table";
import { Modal, Form } from "react-bootstrap";
// bootstrap
import { ExpenseChart } from "./ExpenseChart";
import "./Dashboard.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [accountBalance, setAccountBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);

  // States for the modal and transaction type
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState("deposit");
  const [transactionAmount, setTransactionAmount] = useState("");

  // handle modal visibility
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // filter expenses by time period
  const [startDate, setStartDate] = useState(new Date());

  // handle transaction type change
  const toggleTransactionType = () => {
    setTransactionType((prevType) =>
      prevType === "deposit" ? "withdrawal" : "deposit"
    );
  };

  // handle submission of transaction
  const handleTransactionSubmit = async () => {
    try {
      // API endpoint for creating a transaction
      const transactionEndpoint = `${BASE_URL}/transactions/${user.account_number}/${transactionType}/${transactionAmount}`;

      // POST request to create the transaction
      const response = await fetch(transactionEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // If the transaction is successful, update the account balance
        if (transactionType === "deposit") {
          // For deposit, add the transactionAmount to the current account balance
          setAccountBalance(
            (prevBalance) => prevBalance + parseInt(transactionAmount)
          );
        } else {
          // For withdrawal, subtract the transactionAmount from the current account balance
          setAccountBalance(
            (prevBalance) => prevBalance - parseInt(transactionAmount)
          );
        }

        // Close the modal

        // Fetch the updated transactions data from the server
        const transactionsResponse = await fetch(
          `${BASE_URL}transactions/account/${user.account_number}`
        );
        const transactionsData = await transactionsResponse.json();

        // Update the transactions state with the updated data
        setTransactions(transactionsData);

        // Close the modal
        handleCloseModal();
      } else {
        // Handle errors here if the transaction fails
        console.error("Error:", data);
      }
    } catch (error) {
      // Handle network errors here
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // Calculate total spending from the transactions
    const spending = transactions
      .filter((transaction) => transaction.amount < 0)
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

    // Set the total spending state
    setTotalSpending(spending);
  }, [transactions]);

  useEffect(() => {
    const fetchAccountBalance = async () => {
      if (user && user.account_number) {
        try {
          const response = await fetch(
            `${BASE_URL}/accounts/${user.account_number}`
          );
          const data = await response.json();
          if (response.ok) {
            setAccountBalance(data.balance);
          } else {
            console.error("Failed to fetch account balance:", data);
          }
        } catch (error) {
          console.error(
            "There was an error fetching the account balance:",
            error
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAccountBalance();
  }, [user]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user && user.account_number) {
        try {
          const response = await fetch(
            `${BASE_URL}transactions/account/${user.account_number}`
          );
          const data = await response.json();
          if (response.ok) {
            setTransactions(data);
          } else {
            console.error("Failed to fetch transactions:", data);
          }
        } catch (error) {
          console.error("There was an error fetching the transactions:", error);
        }
      }
    };

    fetchTransactions();
  }, [user]);

  const [radioValue, setRadioValue] = useState("1");
  const radios = [
    { name: "Active", value: "1" },
    { name: "Locked", value: "2" },
  ];

  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Today");

  const handleTimePeriodChange = (period) => {
    setSelectedTimePeriod(period);
    let start = new Date();

    if (period === "Week to date") {
      start.setDate(start.getDate() - start.getDay());
    } else if (period === "Month to date") {
      start.setDate(1);
    }

    start.setHours(0, 0, 0, 0);
    setStartDate(start);
  };

  const handleLogout = () => setUser(null);

  return (
    <div className="dashboard">
      <div className="header">
        <h4>
          <strong>Welcome</strong>, {user.username}
        </h4>
        <Button variant="primary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className="body">
        <div className="body-left">
          <Card>
            <Card.Header>{user.username}</Card.Header>
            <Card.Body>
              <div className="card-number-container">
                <img src="" className="card-icon" />
                <Card.Title className="card-number mb-4">
                  1234 1234 1234 1234
                </Card.Title>
              </div>
              <Row className="mb-4">
                <Col>
                  <Card.Text>08/24</Card.Text>
                </Col>
                <Col>
                  <Card.Text>900</Card.Text>
                </Col>
              </Row>
              <ButtonGroup>
                {radios.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`radio-${idx}`}
                    type="radio"
                    variant={idx % 2 ? "outline-danger" : "outline-success"}
                    name="radio"
                    value={radio.value}
                    checked={radioValue === radio.value}
                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </Card.Body>
          </Card>
          <div className="balance">
            <div className="balance-left">
              <h6>Current balance</h6>
              <h2>${accountBalance}</h2>
              <h6 className="mt-4">Total spending</h6>
              <h2>${totalSpending}</h2>
            </div>
          </div>
        </div>
        <div className="body-right">
          <div className="expenses-chart">
            {transactions.length > 0 && startDate && (
              <ExpenseChart transactions={transactions} startDate={startDate} />
            )}
          </div>
          <div className="expenses">
            <div className="expenses-left">
              <h4>Transactions</h4>
              <h6>See the details of your expenses</h6>
            </div>
            <div className="expenses-right">
              <DropdownButton
                id="dropdown-basic-button"
                title={selectedTimePeriod}
              >
                <Dropdown.Item onClick={() => handleTimePeriodChange("Today")}>
                  Today
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleTimePeriodChange("Week to date")}
                >
                  Week to date
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleTimePeriodChange("Month to date")}
                >
                  Month to date
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
          <div className="transactions">
            <Card>
              <Card.Header>
                <Button
                  onClick={handleShowModal}
                  disabled={radioValue === "2"}
                  variant={radioValue === "2" ? "danger" : "primary"}
                >
                  Make Transaction
                </Button>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .filter((transaction) => {
                        const transactionDate = new Date(
                          transaction.date_posted
                        );
                        // Only show transactions on or after the start date
                        return transactionDate >= startDate;
                      })
                      .map((transaction) => (
                        <tr key={transaction.transaction_id}>
                          <td>
                            {convertUTCDateToLocalDate(transaction.date_posted)}
                          </td>
                          <td>{transaction.description}</td>
                          <td>${transaction.amount}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      {/* Modal for transaction */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {transactionType === "deposit" ? "Deposit" : "Withdrawal"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="Deposit"
                checked={transactionType === "deposit"}
                onChange={toggleTransactionType}
              />
            </Form.Group>
            <Form.Group controlId="transactionAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleTransactionSubmit}>
            Submit Transaction
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
