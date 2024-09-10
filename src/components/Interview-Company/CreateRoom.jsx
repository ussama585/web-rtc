import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Row,
  Label,
  Button,
} from "reactstrap";
import { ScheduleInterviewSchema } from "../../utils/Schemas";
import axios from "axios";
import url from "../../utils/api";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import styles from "../../utils/styles";
import { toast } from "react-toastify";
import GetAllCandidates from "./GetAllCandidates";
import GetAllJobs from "./GetAllJobs";

export default function CreateRoom({ onSuccess }) {
  const [roomLink, setRoomLink] = useState("");
  const [roomName, setroomName] = useState("");

  useEffect(() => {
    console.log("roomName", roomName);
  }, [roomName]);

  const handleRoom = (roomName) => {
    setroomName(roomName);
  };
  const createRoom = useMutation({
    mutationFn: (values) => {
      const protocol = window.location.protocol;
      return axios.post(
        `${url}/room/create-room`,
        {
          room_data: {
            room_name: roomName,
            candidates: values.candidates,
            interview_date: values.interview_date,
            start_time: values.start_time,
            end_time: values.end_time,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
    },
    onSuccess: (data) => {
      toast.success(data.data.message);
      setRoomLink(data.data.room_link);
      onSuccess();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error creating room");
    },
  });

  const handleCreateRoom = async (values) => {
    await createRoom.mutate({
      room_name: roomName,
      candidates: values.candidate_id,
      interview_date: values.interview_date,
      start_time: values.start_time,
      end_time: values.end_time,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomLink);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Container className="mt-5">
      <Card style={styles.assessmentModuleBackground}>
        <CardBody>
          <Formik
            initialValues={{
              job_id: "",
              candidate_id: "",
              start_time: "",
              end_time: "",
              interview_date: "",
              message: "",
            }}
            validationSchema={ScheduleInterviewSchema}
            onSubmit={(values, { resetForm }) => {
              console.log(values);
              handleCreateRoom(values);
              resetForm();
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form>
                <FormGroup>
                  <Row>
                    <Col>
                      <h1
                        className="text-center mb-4 fw-bold"
                        style={styles.descriptionColor}
                      >
                        Schedule New Interview
                      </h1>
                    </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col md={6} sm={12}>
                      <GetAllJobs
                        value={values.job_id}
                        onChange={handleChange}
                        handleRoom={handleRoom}
                        onBlur={handleBlur}
                        error={errors.job_id}
                        touched={touched.job_id}
                      />
                    </Col>
                    {console.log(values,'valuesvaluesvalues')}
                    <Col md={6} sm={12}>
                      {/* Use the CandidateSelect component */}
                      <GetAllCandidates
                        jobId={values.job_id}
                        value={values.candidate_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.candidate_id}
                        touched={touched.candidate_id}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      <div>
                        <Label style={styles.descriptionColor}>
                          Date of Interview
                        </Label>
                        <Input
                          name="interview_date"
                          placeholder="Enter Duration of meeting in minutes"
                          type="date"
                          value={values.interview_date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={
                            errors.interview_date && touched.interview_date
                              ? styles.error
                              : styles.input
                          }
                        />
                        {errors.interview_date && touched.interview_date && (
                          <div style={styles.errorMessage}>
                            {errors.interview_date}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={6} sm={12}>
                      <div>
                        <Label style={styles.descriptionColor}>
                          Start Time
                        </Label>
                        <Input
                          name="start_time"
                          placeholder="Enter Threshold Percentage"
                          type="time"
                          value={values.start_time}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={
                            errors.start_time && touched.start_time
                              ? styles.error
                              : styles.input
                          }
                        />
                        {errors.start_time && touched.start_time && (
                          <div style={styles.errorMessage}>
                            {errors.start_time}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      <div>
                        <Label style={styles.descriptionColor}>End Time</Label>
                        <Input
                          name="end_time"
                          placeholder="Enter Threshold Percentage"
                          type="time"
                          value={values.end_time}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={
                            errors.end_time && touched.end_time
                              ? styles.error
                              : styles.input
                          }
                        />
                        {errors.end_time && touched.end_time && (
                          <div style={styles.errorMessage}>
                            {errors.end_time}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Button
                    className="mx-1 mt-2"
                    onClick={handleSubmit}
                    style={styles.primaryButton}
                  >
                    Create Room
                  </Button>
                </FormGroup>
              </Form>
            )}
          </Formik>
          {roomLink && (
            <Container className="mt-4">
              <Card>
                <CardBody>
                  <h5>Room Link</h5>
                  <Input
                    type="text"
                    value={roomLink}
                    readOnly
                    style={styles.input}
                  />
                  <Button
                    className="mt-2"
                    onClick={copyToClipboard}
                    style={styles.primaryButton}
                  >
                    Copy Link to Clipboard
                  </Button>
                </CardBody>
              </Card>
            </Container>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}
