import React from "react";
import CreateRoom from "../../components/Interview-Company/CreateRoom";
import styles from "../../utils/styles";
import { Container } from "reactstrap";
import CompanyInterviewBox from "../../components/Interview-Company/CompanyInterviewBox";
import url from "../../utils/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function AllInterviewsCompany() {
  const queryClient = useQueryClient();

  const fetchInterviewsCompany = async () => {
    try {
      const protocol = window.location.protocol;
      // const response = await axios.get(`${protocol}//${url}/room/create-room`, {
      const response = await axios.get(`${url}/room/create-room`, {
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

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["interviews"],
    queryFn: fetchInterviewsCompany,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <CreateRoom
        onSuccess={() => queryClient.invalidateQueries(["interviews"])}
      />
      <h1 className="text-center fw-bold my-2" style={styles.descriptionColor}>
        Interviews Scheduled By You
      </h1>
      <Container className="d-flex justify-content-around flex-wrap my-2">
        {data.length > 0 ? (
          data.map((interview) => (
            <div className="mx-2 my-2" key={interview.id}>
              {console.log(interview)}
              <CompanyInterviewBox interview={interview} />
            </div>
          ))
        ) : (
          <h1 style={styles.descriptionColor}>
            No Interview under your company
          </h1>
        )}
      </Container>
    </div>
  );
}
