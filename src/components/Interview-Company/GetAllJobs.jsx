import React from "react";
import { FormGroup, Label, Input } from "reactstrap";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styles from "../../utils/styles";
import url from "../../utils/api";

const GetAllJobs = ({
  value,
  onChange,
  onBlur,
  error,
  touched,
  handleRoom,
}) => {
  const fetchAllJobs = async () => {
    try {
      const protocol = window.location.protocol;
      const response = await axios.get(`${url}/job/create-job`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["alljobs"],
    queryFn: fetchAllJobs,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching jobs</div>;

  const handleJobChange = (e) => {
    const selectedJobId = e.target.value;
    const selectedJob = data.find((job) => job.id === parseInt(selectedJobId));

    if (selectedJob) {
      handleRoom(selectedJob.title);
    }

    onChange(e); // Call the original onChange handler
  };

  return (
    <FormGroup>
      <Label style={styles.descriptionColor}>Select Job</Label>
      <Input
        type="select"
        name="job_id"
        value={value}
        onChange={handleJobChange}
        onBlur={onBlur}
        style={error && touched ? styles.error : styles.input}
      >
        <option value="">Select a job</option>
        {data.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title}
          </option>
        ))}
      </Input>
      {error && touched && <div style={styles.errorMessage}>{error}</div>}
    </FormGroup>
  );
};

export default GetAllJobs;
