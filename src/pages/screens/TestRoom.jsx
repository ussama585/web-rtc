import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { Button, Container, Row, Col, Card, CardBody } from "reactstrap";
import url from "../../utils/api";
import join from "../../utils/sounds/join.mp3";
import { toast } from "react-toastify";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import CallEndIcon from "@mui/icons-material/CallEnd";
import CallIcon from "@mui/icons-material/Call";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import "./Meeting.css";

export default function TestRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [iceCandidates, setIceCandidates] = useState([]);
  const [requestedCall, setRequestedCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [onGoingCall, setOnGoingCall] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);
  const [isScreenShared, setIsScreenShared] = useState(false);
  const [peers, setPeers] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    sendJsonMessage({ type: "get_participants" });
  }, []);

  const [myDetails, setMyDetails] = useState({
    name: "",
    id: "",
    is_host: false,
  });

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: "turn:global.turn.twilio.com:443?transport=tcp",
        username:
          "bac6abcb92bd30db89d2419c3243d0538202dfa8ae297f07fc299f5b43ec1a42",
        credential: "ceH0laO6u8JL8R/aGIp8EN99HqTfu3XCXnrOV9UJbPk=",
      },
    ],
  };

  const createPeerConnection = () => {
    const newPeer = new RTCPeerConnection(configuration);

    newPeer.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    newPeer.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        sendJsonMessage({
          type: "ice_candidate",
          candidate: event.candidate,
          sender_id: myDetails.id,
        });
      }
    });

    return newPeer;
  };

  const peerRef = useRef(createPeerConnection());
  const peer = peerRef.current;

  useEffect(() => {
    if (peer.remoteDescription) {
      addIceCandidates();
    }
  }, [peer.remoteDescription]);

  const addIceCandidates = () => {
    iceCandidates.forEach(async (candidate) => {
      try {
        await peer.addIceCandidate(candidate);
        console.log("ice candidates added");
      } catch (error) {
        console.error("Error adding received ICE candidate", error);
      }
    });
  };

  const handleWebSocketMessage = async (parsedMessage) => {
    if (parsedMessage.error) {
      toast.error("Not Found");
      if (localStorage.getItem("user") === "JobSeeker") {
        navigate("/candidate/all-interviews");
      } else {
        navigate("/company/all-interviews");
      }
    }

    if (
      parsedMessage.type === "incoming_offer" &&
      parsedMessage.sender_id !== myDetails.id
    ) {
      setSenderId(parsedMessage.sender_id);
      setIncomingCall(parsedMessage.offer);
    } else if (parsedMessage.type === "participant_left") {
      sendJsonMessage({ type: "get_participants" });
    } else if (parsedMessage.type === "incoming_offer") {
      setSenderId(parsedMessage.sender_id);
    } else if (parsedMessage.type === "connection_msg") {
      setMyDetails({
        name: parsedMessage.user_name,
        id: parsedMessage.user_id,
        is_host: parsedMessage.is_host,
      });
    } else if (
      parsedMessage.type === "incoming_answer" &&
      senderId === myDetails.id
    ) {
      await handleAcceptAnswer(parsedMessage.answer);
    } else if (
      parsedMessage.type === "incoming_ice_candidate" &&
      parsedMessage.sender_id !== myDetails.id
    ) {
      console.log("ice candidates received from", parsedMessage.sender_id);
      setIceCandidates([...iceCandidates, parsedMessage.candidate]);
    } else if (
      parsedMessage.type === "auto_end_call" &&
      parsedMessage.sender_id !== myDetails.id
    ) {
      peer.close();
      setLocalStream(null);
      setRemoteStream(null);
      setIncomingCall(null);
      setCallAccepted(false);
      setOnGoingCall(false);

      peerRef.current = createPeerConnection();

      toast.error(` ${parsedMessage.sender_name} has ended the call`);
    }

    if (
      parsedMessage.type === "peer_left" &&
      parsedMessage.sender_id !== myDetails.id
    ) {
      peer.close();
      setLocalStream(null);
      setRemoteStream(null);
      setIncomingCall(null);
      setCallAccepted(false);
      setOnGoingCall(false);

      peerRef.current = createPeerConnection();

      toast.error(` ${parsedMessage.sender_name} has ended the call`);
    }

    if (parsedMessage.type === "get_participants") {
      console.log("hello world");
      setPeers(parsedMessage.participants);
    }
  };

  const { sendJsonMessage } = useWebSocket(
    `wss://${url}/ws/video/${id}/?token=${localStorage.getItem("access")}`,
    {
      onOpen: () => console.log("Connected to the WebSocket Room"),
      onClose: () => console.log("Disconnected from WebSocket Room"),
      onMessage: async (message) => {
        const parsedMessage = JSON.parse(message.data);
        console.log(parsedMessage);
        handleWebSocketMessage(parsedMessage);
      },
    }
  );

  const handleAcceptAnswer = async (answer) => {
    try {
      if (peer.signalingState === "have-local-offer") {
        const remoteDesc = new RTCSessionDescription(answer);
        await peer.setRemoteDescription(remoteDesc);
        setRequestedCall(false);
        setOnGoingCall(true);
      } else {
        console.log(
          "Peer connection is not in the correct state to accept an answer."
        );
      }
    } catch (error) {
      console.error("Error setting remote description on answer", error);
    }
  };

  const handleCallUser = async () => {
    try {
      if (peer.signalingState === "closed") {
        peerRef.current = createPeerConnection();
      }

      const localMediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localMediaStream.getTracks().forEach((track) => {
        peer.addTrack(track, localMediaStream);
      });
      console.log("Local Tracks of Sender: ", peer.getSenders());

      setLocalStream(localMediaStream);
      setRequestedCall(true);

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      sendJsonMessage({ type: "offer", offer, sender_id: myDetails.id });

      console.log("Successful HandleCallUser");
    } catch (error) {
      console.error("Error creating or sending offer", error);
    }
  };

  const handleAcceptCall = async () => {
    try {
      const localMediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localMediaStream.getTracks().forEach((track) => {
        peer.addTrack(track, localMediaStream);
      });
      console.log("Local Tracks of Receiver: ", peer.getSenders());
      playRingingSound();

      setLocalStream(localMediaStream);

      setCallAccepted(true);
      setOnGoingCall(true);

      peer.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        console.log("remote Track reveived :", event.streams[0]);
      };

      if (
        peer.signalingState === "stable" ||
        peer.signalingState === "have-remote-offer"
      ) {
        await peer.setRemoteDescription(
          new RTCSessionDescription(incomingCall)
        );
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        sendJsonMessage({ type: "answer", answer, sender_id: myDetails.id });

        peer.addEventListener("icecandidate", (event) => {
          if (event.candidate) {
            sendJsonMessage({
              type: "ice_candidate",
              candidate: event.candidate,
              sender_id: myDetails.id,
            });
          }
        });

        console.log("Successful HandleCallUser");
      } else {
        console.error(
          "Peer connection is not in the correct state to accept a call."
        );
      }
    } catch (error) {
      console.log("Error accepting call", error);
    }
  };

  const handleEndCall = () => {
    peer.close();

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIncomingCall(null);
    setCallAccepted(false);
    setOnGoingCall(false);

    sendJsonMessage({
      type: "auto_end_call",
      sender_name: myDetails.name,
      sender_id: myDetails.id,
    });

    // Reinitialize peer connection
    peerRef.current = createPeerConnection();

    console.log("I have closed connections");
    toast.error("You have ended the call");
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraEnabled(!isCameraEnabled);
    }
  };

  const toggleMicrophone = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicrophoneEnabled(!isMicrophoneEnabled);
    }
  };

  const playRingingSound = () => {
    const beat = new Audio(join);
    beat.play().catch((error) => {
      console.error("Failed to play ringing sound:", error);
    });
  };

  const handleScreenShare = async () => {
    if (isScreenShared) {
      // Stop screen sharing and revert to camera
      const videoTrack = localStream.getVideoTracks()[0];
      const senders = peer.getSenders().find((s) => s.track.kind === "video");
      senders.replaceTrack(videoTrack);

      // Update the state to reflect that screen sharing has stopped
      setIsScreenShared(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: "always",
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        const senders = peer.getSenders().find((s) => s.track.kind === "video");

        senders.replaceTrack(stream.getTracks()[0]);
        // senders.addTrack(stream.getTracks()[0], localStream);

        stream.getTracks()[0].onended = () => {
          const videoTrack = localStream.getVideoTracks()[0];
          senders.replaceTrack(videoTrack);
          setIsScreenShared(false);
        };
        setIsScreenShared(true);
      } catch (error) {
        console.error("Error sharing screen:", error);
      }
    }
  };

  const handleDisplayMessaege = () => {
    if (myDetails.is_host) {
      if (
        peers.every((peer) => peer.is_present === true) &&
        !onGoingCall &&
        !incomingCall &&
        !requestedCall
      ) {
        return "Click to start the call";
      } else if (!onGoingCall && !incomingCall && !requestedCall) {
        return "Waiting for the candidate to join";
      } else if (requestedCall) {
        return "Ringing...";
      } else if (onGoingCall) {
        return "On Going Call";
      }
    } else {
      if (!peers.every((peer) => peer.is_present === true)) {
        return "Waiting for the host to start the call";
      } else if (incomingCall && !callAccepted) {
        return "Incoming Call...";
      } else if (onGoingCall & callAccepted) {
        return "On Going Call";
      } else {
        return "Waiting for the host to join the meeting";
      }
    }
  };
  const toggleFullscreen = (elementId) => {
    const elem = document.getElementById(elementId);

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        // Chrome, Safari, Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        // IE/Edge
        elem.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <Container fluid className="video-call-container">
      <Card className="video-card">
        <CardBody className="video-card-body">
          <>
            {!requestedCall &&
              !incomingCall &&
              !onGoingCall &&
              peers.every((peer) => peer.is_present === true) &&
              myDetails.is_host && (
                <Button
                  color="primary"
                  onClick={handleCallUser}
                  className="call-button "
                >
                  <CallIcon />
                </Button>
              )}
            {incomingCall && !callAccepted && (
              <div className="text-center mb-4 incoming-call">
                <Button
                  color="success"
                  onClick={handleAcceptCall}
                  className="call-button"
                >
                  <PhoneEnabledIcon />
                </Button>
              </div>
            )}
          </>
          <h4 className="text-center">{handleDisplayMessaege()}</h4>
          <Row className="video-row mt-4">
            <Col md={6} className="video-column">
              {localStream && (
                <div
                  className="video-container local-video"
                  id="localVideoContainer"
                >
                  <video
                    className="local-video"
                    autoPlay
                    muted
                    playsInline
                    ref={(ref) => {
                      if (ref && localStream) {
                        ref.srcObject = localStream;
                      }
                    }}
                  />
                  {onGoingCall && (
                    <div className="video-name">{myDetails.name}</div>
                  )}
                  <Button
                    color="secondary"
                    className="fullscreen-button"
                    onClick={() => toggleFullscreen("localVideoContainer")}
                  >
                    {!isFullScreen ? (
                      <FullscreenIcon />
                    ) : (
                      <FullscreenExitIcon />
                    )}
                  </Button>
                </div>
              )}
            </Col>

            {remoteStream && (
              <Col md={6} className="video-column">
                <div
                  className="video-container remote-video"
                  id="remoteVideoContainer"
                >
                  <video
                    autoPlay
                    playsInline
                    className="remote-video"
                    ref={(ref) => {
                      if (ref && remoteStream) {
                        ref.srcObject = remoteStream;
                      }
                    }}
                  />
                  {peers.map((participant) => (
                    <div className="video-name" key={participant.id}>
                      {participant.participant_id !== myDetails.id
                        ? participant.participant__name
                        : ""}
                    </div>
                  ))}
                  <Button
                    color="secondary"
                    className="fullscreen-button"
                    onClick={() => toggleFullscreen("remoteVideoContainer")}
                  >
                    <FullscreenIcon />
                  </Button>
                </div>
              </Col>
            )}
          </Row>
          <div className="button-group">
            {onGoingCall && (
              <div className="button-controls">
                <Button
                  color="danger"
                  onClick={handleEndCall}
                  className="call-button"
                >
                  <CallEndIcon />
                </Button>
                <Button
                  color="warning"
                  onClick={toggleCamera}
                  className="call-button"
                >
                  {isCameraEnabled ? <NoPhotographyIcon /> : <CameraAltIcon />}
                </Button>
                <Button
                  color="secondary"
                  onClick={toggleMicrophone}
                  className="call-button"
                >
                  {isMicrophoneEnabled ? <MicOffIcon /> : <KeyboardVoiceIcon />}
                </Button>
                <Button
                  color="secondary"
                  onClick={handleScreenShare}
                  className="call-button"
                >
                  {isScreenShared ? (
                    <StopScreenShareIcon />
                  ) : (
                    <ScreenShareIcon />
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}
