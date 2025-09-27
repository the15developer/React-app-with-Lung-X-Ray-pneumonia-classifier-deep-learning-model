import React, { useEffect, useState,  useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuestionCircle, faUser, faArrowLeft, faLungsVirus, faVirusCovid } from "@fortawesome/free-solid-svg-icons";
import Chat from '../components/Chat';




const Dashboard = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const username = localStorage.getItem("username") || "User";
  const userrole = localStorage.getItem("userrole") || "guest"; // fallback role
  const userID=localStorage.getItem("user_id");
  const [patients, setPatients] = useState([]);
  const [doctor, setDoctor]=useState([]);
  const [loggedPatient, setloggedPatient]=useState([]);
  const [loggedDoctor, setloggedDoctor]=useState([]);

  const [historyC, setHistoryC] = useState([]);
  const [historyP, setHistoryP] = useState([]);


  const scrollRef = useRef(null);



  const scrollPatients = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 320; // width of 1 patient card + margin

    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (userrole === 'doctor') {
        fetch(`http://127.0.0.1:5000/api/doctor/${userID}/patients`)
            .then(res => res.json())
            .then(data => setPatients(data))
            .catch(err => console.error('Error fetching patients:', err));
    }
}, [userrole, userID]);


useEffect(() => {
  const fetchHistoryC = async () => {
    try {
      // const idToUse = userrole === "doctor" ? loggedDoctor.user_id : loggedPatient.id;
      const res = await fetch(`http://127.0.0.1:5000/covid_history/${userID}`);
      if (res.ok) {
        const data = await res.json();
        setHistoryC(data);
      } else {
        console.error("Failed to fetch history");
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  fetchHistoryC();
}, [loggedPatient.id]);



const formatDate = (dateString) => {
  if (!dateString) return "Yok";

  const date = new Date(dateString);

  date.setHours(date.getHours() - 3);

  const pad = (num) => num.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // months are 0-indexed
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};



useEffect(() => {
  const fetchHistoryP = async () => {
    try {

      console.log(loggedDoctor.id);
      // const idToUse = userrole === "doctor" ? loggedDoctor.id : loggedPatient.id;

      if(userrole===doctor){
      console.log("Burada doktorun kendi kayitlari getirilmeye calisiliyor");
      console.log(loggedDoctor.id);}

      const res = await fetch(`http://127.0.0.1:5000/pneumonia_history/${userID}`);
      if (res.ok) {
        const data = await res.json();
        setHistoryP(data);
      } else {
        console.error("Failed to fetch history");
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  fetchHistoryP();
}, [loggedPatient.id]);



useEffect(() => {
  if (userrole === 'patient') {
    fetch(`http://127.0.0.1:5000/api/patient/${userID}/doctor`)
      .then(res => res.json())
      .then(data => {
        // Ensure the profile_image field has the correct path for React's public folder
        if (data.profile_image) {
          data.profile_image = `/${data.profile_image}`;
        }
        setDoctor(data);
      })
      .catch(err => console.error('Error fetching doctor:', err));
  }
}, [userrole, userID]);


useEffect(() => {
  if (userrole === 'patient') {
    fetch(`http://127.0.0.1:5000/api/patient/${userID}`)
      .then(res => res.json())
      .then(data => {
        if (data.profile_image) {
          console.log("Profile image for patient found !");
          data.profile_image = `/${data.profile_image}`;
        }
        setloggedPatient(data);
      })
      .catch(err => console.error('Error fetching patient data:', err));
  }
}, [userrole, userID]);

useEffect(() => {
  if (userrole === 'doctor') {
    fetch(`http://127.0.0.1:5000/api/doctor/${userID}`)
      .then(res => res.json())
      .then(data => {
        if (data.profile_image) {
          console.log("Profile image for doctor found !");
          data.profile_image = `/${data.profile_image}`;
        }
        setloggedDoctor(data);
        console.log(loggedDoctor.id);
      })
      .catch(err => console.error('Error fetching doctor data:', err));
  }
}, [userrole, userID]);


const totalScans = historyC.length + historyP.length;

// Get last entries if they exist
const lastCovid = historyC[0];
const lastPneumonia = historyP[0];

// Determine which scan is newer
let lastScan = null;
if (lastCovid && lastPneumonia) {
  lastScan = new Date(lastCovid.created_at) > new Date(lastPneumonia.created_at)
    ? lastCovid
    : lastPneumonia;
} else {
  lastScan = lastCovid || lastPneumonia;
}

const lastResult = lastScan?.prediction_result || "Yok";
// const lastDate = lastScan ? new Date(lastScan.created_at).toLocaleString() : "Yok";
const lastDate = lastScan ? formatDate(lastScan.created_at) : "Yok";

// Determine health badge logic
let healthStatus = "Stable";
if (lastResult?.toLowerCase().includes("positive") || lastResult?.toLowerCase().includes("pneumonia")) {
  healthStatus = "Attention Needed";
} else if (lastResult === "Yok") {
  healthStatus = "No Data";
}


  return (
    <Container>
      
      <Sidebar>
        <SidebarButton onClick={() => navigate("/dashboard")}>
          <FontAwesomeIcon icon={faHome} />
          <h5>Home</h5>
        </SidebarButton>
        
        <SidebarButton onClick={() => navigate("/dashboard/pneumonia")}>
            <FontAwesomeIcon icon={faLungsVirus} />
            <h5>Pnömoni</h5>
        </SidebarButton>

        <SidebarButton onClick={() => navigate("/dashboard/covid")}>
            <FontAwesomeIcon icon={faVirusCovid} />
            <h5>Covid-19</h5>
        </SidebarButton>

        <SidebarButton onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <h5>Ana Sayfa</h5>
        </SidebarButton>
        
      </Sidebar>

      <Navbar>
  <h2>Akciğer X-Ray Sınıflandırıcı</h2>

  <RightSection>
    {userrole === 'patient' && (<PatientAvatar image={`http://127.0.0.1:3000${loggedPatient.profile_image}`} />)}
    {userrole === 'doctor' && (<DoctorAvatar image={`http://127.0.0.1:3000${loggedDoctor.profile_image}`} />)}
    
    <UserDropdown>
      <DropdownButton onClick={() => setDropdownOpen(!dropdownOpen)}>
        {username}
      </DropdownButton>

      {dropdownOpen && (
        <DropdownMenu>
          <DropdownItem onClick={() => navigate("/account")}>
            Ayarlar
          </DropdownItem>
          <DropdownItem onClick={() => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("username");
            navigate("/login");
          }}>
            Çıkış yap
          </DropdownItem>
        </DropdownMenu>
      )}
    </UserDropdown>
  </RightSection>
</Navbar>


      
      <MainContent>

            <SContainer>
                <SectionLeft>
                <div>
                  <h3 style={{ margin: 0 }}>Merhaba,</h3>
                  <h2 style={{ fontSize: "2.5rem", marginTop: "10px" }}>
                    {userrole === "patient" ? loggedPatient.name : `Dr. ${loggedDoctor.name}`}
                  </h2>
                  {/* <h5>Güncel durumunuz</h5> */}
                </div>
                                    
                </SectionLeft>
               
                <SectionRight>
                    <Title>Kişisel sağlık özeti</Title>
                        <SContent>
                          <SummaryCard>
                              <SummaryRow>
                                <Label>Son Tahmin:</Label>
                                <span>{lastResult}</span>
                              </SummaryRow>

                              <SummaryRow>
                                <Label>Son Taranma Tarihi:</Label>
                                <span>{lastDate}</span>
                              </SummaryRow>

                              <SummaryRow>
                                <Label>Toplam Tarama:</Label>
                                <span>{totalScans}</span>
                              </SummaryRow>

                              <SummaryRow>
                                <Label>Durum:</Label>
                                <Badge status={healthStatus}>
                                  {healthStatus === "No Data" ? "📭 Veri Yok" :
                                  healthStatus === "Stable" ? "✅ Stabil" :
                                  "⚠️ Dikkat Gerekli"}
                                </Badge>
                              </SummaryRow>
                            </SummaryCard>
                        </SContent>
                </SectionRight>

            </SContainer>

            <SContainer>
                <Section1>
                {userrole === 'doctor' && (<Title>Hastalarınız</Title> )}
                {userrole === 'doctor' && (
                
                <PatientSection>

                <SectionHeader>
                        <SectionTitle></SectionTitle>
                        <ScrollButtons>
                          <ScrollButton onClick={() => scrollPatients('left')}>&lt;</ScrollButton>
                          <ScrollButton onClick={() => scrollPatients('right')}>&gt;</ScrollButton>
                        </ScrollButtons>
                </SectionHeader>

                  <PatientListContainer ref={scrollRef}>
                          {patients.map((patient) => (
                            <PatientCard key={patient.id}>
                              <PatientAvatar image={`http://127.0.0.1:3000/${patient.profile_image}`} />
                              <PatientInfo>
                                <Patientname>{patient.name}</Patientname>
                                <PatientDescription>{patient.description}</PatientDescription>
                              </PatientInfo>
                            </PatientCard>
                          ))}
                  </PatientListContainer>

                {/* 
                  <PatientList>
                    {patients.map(patient => (
                      <PatientItem key={patient.id}>
                        <PatientAvatar image={`http://127.0.0.1:3000/${patient.profile_image}`} />
                        <PatientName>{patient.username}</PatientName>
                      </PatientItem>
                    ))}
                  </PatientList> */}


                </PatientSection>
              )}

                {userrole === 'patient' && (<Title>Doktorunuz</Title>) }
                {userrole === 'patient' && (
                
                <DoctorSection>
                  <DoctorAvatar2 image={`http://127.0.0.1:3000/${doctor.profile_image}`} />
                  <DoctorInfo>
                  <DoctorLevel>{doctor.level}</DoctorLevel>
                  <span><DoctorName>{doctor.name}</DoctorName></span>
                  <DoctorDescription>{doctor.description}</DoctorDescription>
                </DoctorInfo>
                </DoctorSection>
              )}



                </Section1>

                <Section2>
                <TipTitle>Akciğer Sağlığı Hakkında</TipTitle>
                <br>
            </br>

        <Text>
          Sigara kullanımı akciğer dokusuna ciddi zararlar verir. Akciğer kanseri ve KOAH riskini azaltmak için sigaradan uzak durun.
        </Text>
                </Section2>

                <Section3>
                <TipTitle>Günün Sağlık İpucu</TipTitle>

                <br>
            </br>
        <Text>
          Temiz havada derin nefes egzersizleri yapmak, akciğer kapasitesini artırır ve solunum yollarını güçlendirir.
        </Text>
                   
                </Section3>


            </SContainer>

            <br>
            </br>
            <br>
            </br>

            <br>
            </br>

            <br>
            </br>
            <br>
            </br>

            <br>
            </br>

      </MainContent>

      <Chat username={username} userRole={userrole} />

    </Container>
  );
};

export default Dashboard;


const TipTitle = styled.h3`
  font-size: 1.2rem;
  color: #33691e;
`;

const Text = styled.p`
  font-size: 18px;
  color: #333;
`;


const PatientListContainer = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 10px;
  padding: 10px;
  max-width: 100%;
  /* border: 1px solid black; */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PatientCard = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 10px;
  min-width: 170px;
  height: 130px;
  align-items: center;
  border: solid 1px #ccc;
  gap: 10px;
  /* text-align: left; */

  &:hover {
    background-color: #f9f9f9;
  }
`;

const PatientInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const Patientname = styled.div`
  font-weight: bold;
  color: #333;
  font-size: 16px;
  text-align: left;
`;

const PatientDescription = styled.div`
  font-size: 14px;
  color: #666;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScrollButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ScrollButton = styled.button`
  background: #007bff;
  border: none;
  color: #ccc;
  padding: 2px 10px;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const PatientSection = styled.section`
  /* margin: 2rem 0; */
  /* border: solid 1px blue; */
`;

const DoctorSection = styled.section`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background-color: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  margin-top: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  /* margin-bottom: 1rem; */
`;

const PatientList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const PatientItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
`;

const PatientAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: lightblue;
  background-image: ${(props) => `url(${props.image})`};
  background-size: cover;
  background-position: center;
  margin-bottom: 0.5rem;
`;

const DoctorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  /* background-color: #ccc; */
  background-image: ${(props) => `url(${props.image})`};
  background-size: cover;
  background-position: center;
  margin-bottom: 0.5rem;
`;

const DoctorAvatar2 = styled.div`
  width: 100px;
  height: 80px;
  border-radius: 50%;
  /* background-color: #ccc; */
  background-image: ${(props) => `url(${props.image})`};
  background-size: cover;
  background-position: center;
  margin-bottom: 0.5rem;
`;

const PatientName = styled.div`
  font-size: 0.9rem;
  text-align: center;
  word-break: break-word;
`;

const DoctorInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: #003366;
`;

const DoctorName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #003366;
`;

const DoctorLevel = styled.span`
  font-weight: bold;
  color: #555;
  color: #003366;
`;

const DoctorDescription = styled.p`
  margin-top: 8px;
  color: #666;
  font-size: 0.95rem;
  color: #003366;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 5px; /* spacing between avatar and dropdown */
`;

// Styled Components

const Container = styled.div`
  display: flex;
  background: radial-gradient(circle, #e0eaff, #ffffff);
  backdrop-filter: blur(20px);
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 170px;
  background: white;
  padding: 10px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: left;
  padding-top:140px;
  gap:20px;
  position:fixed;
  top: 0;
  left: 0;
  bottom:0;

`;

const SidebarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  font-size: 20px;
  padding: 15px 5px;
  cursor: pointer;
  color: #555;
  transition: 0.3s;
  border:none;

  &:hover {
    color: black;
  }

  h5 {
    margin: 0;
    padding: 0;
    font-size: 18px;
    font-weight: 500;
    line-height: 1; /* Helps vertical alignment */
  }

`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 160px; /* Offset by sidebar */
  margin-top: 60px;   /* Offset by navbar */
  height: calc(100vh - 60px);
  overflow-y: auto;
  padding: 20px;
`;


const Navbar = styled.nav`
  background: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  right:0;
  left:0;
`;

const UserDropdown = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  background: white;
  border: none;
  padding: 15px 10px;
  padding-top:10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  &:hover {
    background: #f9f9f9;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 5px;
  background: white;
  border-radius: 5px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  width: 150px;
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    background: #f1f1f1;
  }
`;

const SContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  background: transparent; /* Page background */
  min-height: 40vh;
`;

const SectionLeft = styled.div`
  flex: 2.5;
  background-image: url('/first_section.png'); /* image from public folder */
  background-size: cover;
  background-position: center;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white; /* Make text white */
  font-size: 1.2rem; /* Make text bigger */
  font-weight: 500;
  /* text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);  */
  text-align: left;
`;

const SectionRight = styled.div`
  flex: 1.5; /* Larger section */
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Section1=styled.div`
  flex:1.5;
  max-width:450px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Section2=styled.div`
  flex:1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Section3=styled.div`
  flex:1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  /* margin-bottom: 10px; */
  color: #333;
  text-align: left; /* Align left */
`;

const SContent = styled.div`
  font-size: 16px;
  color: #555;
`;

const SummaryCard = styled.div`
  background-color: white;
  /* border: 1px solid #cce0ff; */
  border-radius: 10px;
  padding: 20px;
  color: #003366;
  max-width: 500px;
  margin: 1rem auto;
  margin-top: 0px;
  box-shadow: 0 4px 6px rgba(0, 0, 50, 0.1);
`;

const SummaryTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 15px;
  color: #002b5c;
  text-align: center;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: 600;
`;

const Badge = styled.span`
  background-color: ${({ status }) =>
    status === "Stable" ? "#d4edda" :
    status === "Attention Needed" ? "#fff3cd" :
    "#f8d7da"};
  color: ${({ status }) =>
    status === "Stable" ? "#155724" :
    status === "Attention Needed" ? "#856404" :
    "#721c24"};
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
`;