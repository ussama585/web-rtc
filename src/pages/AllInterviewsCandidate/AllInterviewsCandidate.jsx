import React from "react";
import styles from "../../utils/styles";
import { Container } from "reactstrap";
import CandidateInterviewBox from "../../components/Interview-Candidate/CandidateInterviewBox";
import url from "../../utils/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function AllInterviewsCandidate() {
  const fetchInterviewsCandidate = async () => {
    try {
      const protocol = window.location.protocol;
      const response = await axios.get(`${url}/room/get-room`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      if (!response.data) {
        throw new Error("No data received");
      }

      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch interviews");
    }
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["interviews"],
    queryFn: fetchInterviewsCandidate,
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error in {error.message}</div>;

  return (
    <div>
      <h1 className="text-center fw-bold my-2" style={styles.descriptionColor}>
        Interviews Scheduled For You
      </h1>

      <Container className="d-flex  justify-content-around flex-wrap my-2">
        {data.length > 0 ? (
          data.map((interview) => (
            <div className="mx-2 my-2">
              <CandidateInterviewBox key={interview.id} interview={interview} />
            </div>
          ))
        ) : (
          <h1 style={styles.descriptionColor}>No interviews for you yet...</h1>
        )}
      </Container>
    </div>
  );
}
