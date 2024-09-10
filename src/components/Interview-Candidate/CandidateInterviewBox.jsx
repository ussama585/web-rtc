import React from "react";
import { Card, CardBody, CardHeader, CardText, Button } from "reactstrap";
import styles from "../../utils/styles";
import { Link } from "react-router-dom";

export default function CandidateInterviewBox(props) {
  const { interview } = props;
  return (
    <Card
      className="d-flex flex-row align-items-center my-2 p-3"
      style={{
        ...styles.HorizontalCardStyles,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <div className="flex-grow-1">
        <CardHeader
          className="d-flex flex-column justify-content-center"
          style={{
            width: "200px",
            height: "auto",
            borderBottom: "none",
            padding: "0",
            marginBottom: "10px",
          }}
        >
          <h5
            style={{
              margin: "0",
              fontSize: "18px",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {interview.room_name}
          </h5>
          <h6
            style={{
              fontSize: "14px",
              color: "#6c757d",
              textAlign: "center",
              fontWeight: "500",
              marginTop: "5px",
            }}
          >
            Interview ID: {interview.id}
          </h6>
        </CardHeader>
        <CardBody className="d-flex flex-column align-items-center">
          <CardText
            style={{
              fontSize: "14px",
              color: "#6c757d",
              height: "30px",
              width: "300px",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            Date: {interview.interview_date}
          </CardText>
          <CardText
            style={{
              fontSize: "14px",
              color: "#6c757d",
              height: "30px",
              width: "300px",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            Start Time: {interview.start_time}
          </CardText>
          <CardText
            style={{
              fontSize: "14px",
              color: "#6c757d",
              height: "30px",
              width: "300px",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            End Time: {interview.end_time}
          </CardText>
          <CardText
            className="fw-bold text-center"
            style={{ ...styles.descriptionColor, fontSize: "16px" }}
          >
            By Company: {interview.company}
          </CardText>
        </CardBody>
      </div>
      <div className="text-center ms-3">
        <Link to={`/room/interview/${interview.id}`}>
          <Button
            style={{
              ...styles.primaryButton,
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "5px",
            }}
          >
            Start Interview
          </Button>
        </Link>
      </div>
    </Card>
  );
}
