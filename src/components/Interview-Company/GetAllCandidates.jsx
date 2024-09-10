import React from "react";
import { FormGroup, Label, Input } from "reactstrap";
import styles from "../../utils/styles";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import url from "../../utils/api";

const GetAllCandidates = ({
  value,
  onChange,
  onBlur,
  error,
  touched,
  jobId,
}) => {
  const fetchAllCandidates = async () => {
    try {
      const protocol = window.location.protocol;
      const response = await axios.get(
        `${url}/job/job-applicant/${jobId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["allCandidates"],
    enabled: !!jobId,
    queryFn: fetchAllCandidates,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching candidates</div>;

  return (
    <FormGroup>
      <Label style={styles.descriptionColor}>Candidate</Label>
      <Input
        type="select"
        name="candidate_id"
        disabled={!jobId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={error && touched ? styles.error : styles.input}
      >
        <option value="">Select a candidate</option>
        {data &&
          data.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.name}
            </option>
          ))}
      </Input>
      {error && touched && <div style={styles.errorMessage}>{error}</div>}
    </FormGroup>
  );
};

export default GetAllCandidates;
