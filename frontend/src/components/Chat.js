import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { io } from "socket.io-client";

// Connect to backend
const socket = io("http://localhost:5000"); // or your server URL

// Button to open the chat window
const ChatButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 20px;
  font-size: 18px;
  cursor: pointer;
  z-index: 1000;
  &:hover {
    background-color: #0056b3;
  }
`;

// Chat window that appears when the button is clicked
// Chat window container
const ChatWindow = styled.div`
  position: fixed;
  bottom: 70px;
  right: 20px;
  width: 350px;
  height: 450px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: ${(props) => (props.open ? "block" : "none")};
  z-index: 1000;

  h4 {
    margin-top: 0;
    font-size: 22px;
    font-weight: 600;
    color: #007bff; /* a nice blue */
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

`;

// Sections styling
const Section = styled.div`
  margin-bottom: 10px;
  /* border: solid 1px blue; */
  padding: 5px;
`;

const DoctorsContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* wrap to next line if needed */
  gap: 10px; /* space between doctor icons */
`;

const DoctorButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #007bff;
  background-color: ${({ $selected }) => ($selected ? "#007bff" : "white")};
  color: ${({ $selected }) => ($selected ? "white" : "#007bff")};
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

const PatientButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #007bff;
  background-color: ${({ $selected }) => ($selected ? "#007bff" : "white")};
  color: ${({ $selected }) => ($selected ? "white" : "#007bff")};
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;


const Section3 = styled.div`
  height: 300px;  // Bigger height for chat history section
  /* overflow-y: scroll; */
  /* border: solid 1px blue; */
  border-top: 1px solid #e0e0e0;
`;

const ChatMessages = styled.div`
  max-height: 250px;
  overflow-y: auto;
  padding: 10px;
`;

const MessageBubble = styled.div`
  background-color: ${({ $isOwnMessage }) => ($isOwnMessage ? "#e0f2fe" : "#F1F0F0")};
  padding: 8px;
  margin: 5px 0;
  border-radius: 10px;
  text-align: ${({ $isOwnMessage }) => ($isOwnMessage ? "right" : "left")};
`;

const MessageInputContainer = styled.div`
  display: flex;
  margin-top: 10px;
  input {
    flex: 1;
    padding: 8px 10px;
    border: solid 1px #ccc;
    border-radius: 20px;
    font-size: 14px;
    outline: none;
    background-color: rgba(255, 255, 255, 0.85);
    font-family: 'Segoe UI', sans-serif;
  }

  button {
    margin-left: 8px;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: 600;
    font-family: 'Segoe UI', sans-serif;

    &:hover {
      background-color: #0056b3;
    }
  }
`;


const NotificationIcon = styled.div`
  position: fixed;
  bottom: 60px;
  right: 70px;
  font-size: 18px;
  background: yellow;
  border-radius: 50%;
  z-index: 1001;
`;

const Chat = ({ username, userRole }) => {

const [isChatOpen, setIsChatOpen] = useState(false);
const [doctors, setDoctors] = useState([]);
const [patients, setPatients]= useState([]);
const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
const [selectedDoctor, setSelectedDoctor] = useState(null);
const [selectedPatient, setSelectedPatient] = useState(null);
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState("");
const [room, setRoom] = useState("");


useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/doctors");
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      } else {
        console.error("Failed to fetch doctors");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  fetchDoctors();

  const fetchPatients = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/patients");
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      } else {
        console.error("Failed to fetch patients");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  fetchPatients();


}, []);

useEffect(() => {
  if (username) {
    socket.emit("join_room", { room: `user_${username}`, username: localStorage.getItem('username') });
  }
}, [username]);



  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setHasUnreadMessages(false);
  };

  // useEffect(() => {
  //   // Logic to fetch doctors from the database can go here
  //   // For now, we're using the static list above.
  // }, []);

  const generateRoomName = (user1, user2) => {
    return [user1, user2].sort().join("_and_");
  };

  const handleDoctorSelection = async (doctorId) => {

    console.log("Doctor selection tetiklendi");
    
    const selected = doctors.find((doc) => doc.id === doctorId);
    setSelectedDoctor(selected);

    // Generate a unique room name for the patient + doctor
    const generatedRoom = generateRoomName(username, selected.username);
    setRoom(generatedRoom);

    await fetchOldMessages(generatedRoom, username, selected.username);

    // Join the room
    socket.emit("join_room", { room: generatedRoom , username: localStorage.getItem('username')});
  };

  const handlePatientSelection = async (patientId) => {
    console.log("Patient selection tetiklendi");
    setHasUnreadMessages(false);
    const selected = patients.find((pat) => pat.id === patientId);
    setSelectedPatient(selected);

    // Generate a unique room name for the patient + doctor
    const generatedRoom = generateRoomName(username, selected.username);
    setRoom(generatedRoom);

    await fetchOldMessages(generatedRoom, username, selected.username);

    // Join the room
    socket.emit("join_room", { room: generatedRoom, username: localStorage.getItem('username') });
  };

  const fetchOldMessages = async (room, author, receiver) => {
    try {
      console.log("Fetch messages tetiklendi");
      console.log(room, author, receiver);

      const response = await fetch(
        `http://127.0.0.1:5000/get_messages?room=${room}&author=${author}&receiver=${receiver}`
      );

      const data = await response.json();
      console.log(data);
      setMessages(data);  // ⬅️ Set old messages before real-time messages come
    } catch (error) {
      console.error("Failed to fetch old messages:", error);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() !== "" && room !== "") {
      const messageData = {
        room: room,
        author: username,
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        doctor_username: userRole === "doctor" ? username : selectedDoctor.username,
        patient_username: userRole === "patient" ? username : selectedPatient.username,
      };
  
      socket.emit("send_message", messageData);
      // setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    }
  };

  const showDesktopOrInAppNotification = (data) => {
    if (Notification.permission === "granted") {
      new Notification(`New message from ${data.author}`, {
        body: data.message,
      });
    }
  };
  
  // Request permission on page load
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);
  

  const playNotificationSound = () => {
    // const audio = new Audio('frontend/public/notification.mp3'); // Put your mp3 file in `public/`
    // audio.play();
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("User that just received a message : ", localStorage.getItem("username"));
      console.log("🔔 Received message data:", data);
      setMessages((prev) => [...prev, data]);
  
      if (!isChatOpen) {
        setHasUnreadMessages(true); // Show bell icon
        console.log("💬 Chat window is closed, so notification is needed.");
        try {
          const sound = new Audio("/notification.mp3");
          sound.play().catch((err) => console.error("Audio play error:", err));
        } catch (err) {
          console.error("Failed to play notification sound:", err);
        }
      } else {
        console.log("💬 Chat window is already open, no notification needed.");
      }
    };
  
    socket.on("receive_message", handleReceiveMessage);
  
    // Cleanup
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [isChatOpen]);

  useEffect(() => {
    if (!username) return;
  
    const handleNotify = (data) => {
      // Optional: Only alert if you're not in the current room
      if (room !== data.room) {
        playNotificationSound();
        showDesktopOrInAppNotification(data);
      }
    };
  
    if (userRole === "doctor") {
      socket.on("notify_doctor", handleNotify);
    } else {
      socket.on("notify_patient", handleNotify);
    }
  
    return () => {
      socket.off("notify_doctor", handleNotify);
      socket.off("notify_patient", handleNotify);
    };
  }, [username, room, userRole]);
  

  return (
    <>

    {hasUnreadMessages && (
      <NotificationIcon>
        🔔
      </NotificationIcon>
    )}

      {/* Chat Button */}
      <ChatButton onClick={toggleChat}>
        {isChatOpen ? "Close" : "Chat"}
      </ChatButton>

      {/* Chat Window */}
      <ChatWindow open={isChatOpen}>

        {/* Section 1: Display role-based content */}
        {/* <Section>
          {userRole === "patient" ? (
            <h3>Talk with a Doctor</h3>
          ) : (
            <h3>Your Patients</h3> // This could be modified for doctors to view patients.
          )}
        </Section> */}

        {/* Section 2: List of doctors (only for patients) */}
        {userRole === "patient" && (
          <Section>
          <h4>Bir doktor seçin:</h4>
          <DoctorsContainer>
            {doctors.map((doctor) => (
              <DoctorButton
                key={doctor.id}
                onClick={() => handleDoctorSelection(doctor.id)}
                $selected={selectedDoctor?.id === doctor.id}
              >
                {doctor.username}
              </DoctorButton>
            ))}
          </DoctorsContainer>
        </Section>
        )}

        {userRole === "doctor" && (
          <Section>
          <h4>Bir hasta seçin:</h4>
          <DoctorsContainer>
            {patients.map((patient) => (
              <PatientButton
                key={patient.id}
                onClick={() => handlePatientSelection(patient.id)}
                $selected={selectedPatient?.id === patient.id}
              >
                {patient.username}
              </PatientButton>
            ))}
          </DoctorsContainer>
        </Section>
        )}



        {/* Section 3: Chat history (dynamic based on the selected doctor) */}
        <Section3>
  {/* <h4>Chat History</h4> */}

  {(userRole === "patient" && selectedDoctor) || (userRole === "doctor" && selectedPatient) ? (
    <div>
      {/* <p>
        Chat with{" "}
        {userRole === "patient"
          ? selectedDoctor.username
          : selectedPatient.username}
      </p> */}

      {/* Chat Messages */}
      <ChatMessages>
        {messages.map((msg, index) => (
          <MessageBubble key={index} $isOwnMessage={msg.author === username}>
            <h6>{msg.message}</h6> 
            <small>{msg.time}</small>
          </MessageBubble>
        ))}
      </ChatMessages>

      {/* <ChatMessages>
        {messages.map((msg, index) => {
          const msgDate = new Date(msg.time);
          const now = new Date();

          const isToday = msgDate.toDateString() === now.toDateString();

          const formattedTime = isToday
          ? msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // "14:35"
          : `${msgDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`; // "May 12, 14:35"


          return (
          <MessageBubble key={index} $isOwnMessage={msg.author === username}>
            <strong>{msg.author}:</strong> {msg.message} <small>{formattedTime}</small>
          </MessageBubble>
          );
})}
      </ChatMessages> */}
      

      {/* Input Field */}
      <MessageInputContainer>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </MessageInputContainer>
    </div>
  ) : (
    
    <p>
      <br></br> <br></br> <br></br> <br></br> <br></br>
      Sohbete başlamak için bir {userRole === "patient" ? "doktor" : "hasta"} seçin
      
    </p>
  )}
</Section3>

        
      </ChatWindow>
    </>
  );

};

export default Chat;
