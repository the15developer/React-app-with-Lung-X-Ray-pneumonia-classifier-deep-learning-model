import './Covid.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from "styled-components";
import { faHome, faQuestionCircle, faUser, faArrowLeft, faLungsVirus, faVirusCovid } from "@fortawesome/free-solid-svg-icons";
import CovidDetectionGauge from "./components/CovidDetectionGauge"; 
import CovidPredictionChart from './components/CovidPredictionChart';
import Chat from './components/Chat';


const Covid_sec = () => {

  
  const [fileCovid, setFileCovid] = useState(null);
  const [imageURLCovid, setImageURLCovid] = useState(null);
  const [predictionCovid, setPredictionCovid] = useState('');
  const [predictionPneumonia, setPredictionPneumonia] = useState('');
  const [Cconfidence, setCConfidence] = useState(null);
  const [Pconfidence, setPConfidence] = useState(null);

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const username = localStorage.getItem("username") || "User";
  const user_id=localStorage.getItem("user_id") || 1;
  const userrole = localStorage.getItem("userrole") || "guest"; // fallback role



  const [loggedPatient, setloggedPatient]=useState([]);
  const [loggedDoctor, setloggedDoctor]=useState([]);

  const [history, setHistory] = useState([]);

  const [patients, setPatients] = useState([]);

  const [selectedPatientId, setSelectedPatientId] = useState('');

  const [patientHistoryC, setPatientHistoryC] = useState([]);

  useEffect(() => {
    if (selectedPatientId) {
      fetch(`http://127.0.0.1:5000/api/patient-predictionsC?doctor_id=${loggedDoctor.id}&user_id=${selectedPatientId}`)
        .then((res) => res.json())
        .then((data) => setPatientHistoryC(data))
        .catch((err) => console.error("Failed to fetch patient history:", err));
    }
  }, [selectedPatientId, loggedDoctor.id]);



  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/covid_history/${user_id}`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        } else {
          console.error("Failed to fetch history");
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
  
    fetchHistory();
  }, [user_id]);

  useEffect(() => {
    if (userrole === 'doctor') {
        fetch(`http://127.0.0.1:5000/api/doctor/${user_id}/patients`)
            .then(res => res.json())
            .then(data => setPatients(data))
            .catch(err => console.error('Error fetching patients:', err));
    }
}, [userrole, user_id]);

  const handleFileChangeCovid = (e) => {
    const selectedFile = e.target.files[0];
    setFileCovid(selectedFile);
  
    if (selectedFile) {
      const objectURL = URL.createObjectURL(selectedFile);
      setImageURLCovid(objectURL);
    }
  };


  
  const handleSubmitCovid = async (e) => {
    e.preventDefault();

    if (!fileCovid) {
      setPredictionCovid('No file selected');
      console.log('Submite basildi ama resim secilmedi !')
      return;
    }

    const formData = new FormData();
    formData.append('file', fileCovid);

    // If a patient is selected, save under their ID and include doctor ID
    if (selectedPatientId) {
    formData.append('user_id', selectedPatientId);
    formData.append('doctor_id', loggedDoctor.id);  // Assuming you have this
  } else {
    formData.append('user_id', user_id); // Own ID if doctor predicts for self
  }

    try {
      const response = await fetch('http://127.0.0.1:5000/predictC', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPredictionCovid(`${data.prediction}`);
        setCConfidence(data.confidence);
        // const objectURL = URL.createObjectURL(file);
        // setImageURL(objectURL);
      } else {
        setPredictionCovid('Error: ' + response.statusText);
      }
    } catch (error) {
      setPredictionCovid('Error: Failed to connect to the server');
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/predictP', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPredictionPneumonia(`${data.prediction}`);
        const adjustedConfidence = data.prediction === "NORMAL" ? Math.round((1 - data.confidence / 100) * 100) : data.confidence;
        setPConfidence(adjustedConfidence);
        // const objectURL = URL.createObjectURL(file);
        // setImageURL(objectURL);
      } else {
        setPredictionPneumonia('Error: ' + response.statusText);
      }
    } catch (error) {
      setPredictionPneumonia('Error: Failed to connect to the server');
    }
  };

  useEffect(() => {
    if (userrole === 'patient') {
      fetch(`http://127.0.0.1:5000/api/patient/${user_id}`)
        .then(res => res.json())
        .then(data => {
          
          setloggedPatient(data);
        })
        .catch(err => console.error('Error fetching patient data:', err));
    }
  }, [userrole, user_id]);


  useEffect(() => {
    if (userrole === 'doctor') {
      fetch(`http://127.0.0.1:5000/api/doctor/${user_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.profile_image) {
            console.log("Profile image for doctor found !");
            data.profile_image = `/${data.profile_image}`;
          }
          setloggedDoctor(data);
        })
        .catch(err => console.error('Error fetching doctor data:', err));
    }
  }, [userrole, user_id]);
  

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
            <h5>Main Page</h5>
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

                <SectionCovid1>
                    

                        <SContent1>
                            
                            {/* <p>Burada Covid-19'u tahmin edebilirsiniz...</p> */}

                            {userrole === 'doctor' && (
                              <FormGroup>
                                <Label htmlFor="selected_patient">Hasta Seçimi:</Label>
                                <StyledSelect
                                  id="selected_patient"
                                  value={selectedPatientId}
                                  onChange={(e) => setSelectedPatientId(e.target.value)}
                                  required
                                >
                                  <option value="">Bir hasta seçin</option>
                                  {patients.map((patient) => (
                                    <option key={patient.id} value={patient.id}>
                                      {patient.name}
                                    </option>
                                  ))}
                                </StyledSelect>
                              </FormGroup>   
                          )}

                            <form onSubmit={handleSubmitCovid} encType="multipart/form-data">
                                <FormGroup>
                                    <Label htmlFor="image_file">Resim dosyası :</Label>
                                    <StyledInput
                                      id="image_file"
                                      type="file"
                                      name="image_file"
                                      accept="image/*"
                                      onChange={handleFileChangeCovid}
                                      required
                                    />
                                </FormGroup>

                                <Button type="submit">GÖNDER</Button>
                            </form>


                        </SContent1>

                        <SContent2>
  
                        <ImageContainer>
                            {imageURLCovid && (
                                
                                <Image src={imageURLCovid} alt="Uploaded X-ray" />
                                
                            )}
                        </ImageContainer>

                        <PredictionRow>
                            <span>Covid Model:</span>
                            {/* const adjustedConfidence = label === "COVID-19" ? Math.round((1 - confidence / 100) * 100) : confidence; */}
                            {predictionCovid && <PredictionText>{predictionCovid} : {predictionCovid === "COVID-19" ? Math.round((1 - Cconfidence / 100) * 100) : Cconfidence}%</PredictionText>}
                        </PredictionRow>

                        <PredictionRow>
                            <span>Pneumonia Model:</span>
                            {predictionPneumonia && 
                            <PredictionText>{predictionPneumonia} : {Pconfidence}%
                              {((predictionCovid === "NORMAL" && predictionPneumonia !== "NORMAL") ||
                                (predictionCovid !== "NORMAL" && predictionPneumonia === "NORMAL")) && (
                                <span style={{ color: 'red', marginLeft: '8px' }}>❗</span>
                              )}
                            </PredictionText>}
                        </PredictionRow>
                       
                        </SContent2>

                </SectionCovid1>

                <SectionCovid2>

                {/* <h2 style={headerStyle}> Tahmin Sonucu</h2> */}
                <Title>Tahmin Sonucu</Title>

                  
                  <CovidDetectionGauge confidence={Cconfidence} label={predictionCovid} />

                </SectionCovid2>

            </SContainer>

            <SContainer>
            <SectionCovid3>

            {!selectedPatientId && (
  <>
              <Title>Tahmin Geçmişi</Title>
              

              <div className="table-wrapper">

              <table className="custom-table min-w-full border text-sm">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Image</th>
                    <th className="p-2 border">Result</th>
                    <th className="p-2 border">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((entry) => (
                    <tr key={entry.id} className="text-center">
                      <td className="p-2 border">{entry.id}</td>

                      <td className="p-2 border">
                        <img
                          src={`http://127.0.0.1:5000/static/uploads_covid/${entry.image_path}`}
                          alt="Prediction"
                          className="max-w-[150px] max-h-[150px] object-contain mx-auto"
                          style={{ maxWidth: '50px', maxHeight: '50px', objectFit: 'contain', margin: '0 auto' }}
                        />
                      </td>

                      <td className="p-2 border capitalize">{entry.prediction_result}</td>
                      <td className="p-2 border">
                        {new Date(entry.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

              </div>

              </>
                  )}


            
                  {selectedPatientId && (
                    <>
                     <Title> 
                        {`Tahmin Geçmişi (Hasta ID: ${selectedPatientId})`}
                      </Title>

                      <div className="table-wrapper">
                        <table className="custom-table min-w-full border text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="p-2 border">ID</th>
                              <th className="p-2 border">Image</th>
                              <th className="p-2 border">Result</th>
                              <th className="p-2 border">Date</th>
                            </tr>
                          </thead>

                          <tbody>
                            {patientHistoryC.map((entry) => (
                              <tr key={entry.id} className="text-center">
                                <td className="p-2 border">{entry.id}</td>
                                <td className="p-2 border">
                                  <img
                                    src={`http://127.0.0.1:5000/static/uploads_covid/${entry.image_path}`}
                                    alt="Prediction"
                                    className="max-w-[150px] max-h-[150px] object-contain mx-auto"
                                    style={{ maxWidth: '50px', maxHeight: '50px', objectFit: 'contain', margin: '0 auto' }}
                                  />
                                </td>
                                <td className="p-2 border capitalize">{entry.prediction_result}</td>
                                <td className="p-2 border">
                                  {new Date(entry.created_at).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}



            </SectionCovid3>

            <SectionCovid4>
              <CovidPredictionChart userId={user_id} />
            </SectionCovid4>

                
            </SContainer>

      </MainContent>

      <Chat username={username} userRole={userrole} />

    </Container>

   );
};

export default Covid_sec;

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


const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 5px; /* spacing between avatar and dropdown */
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


// Styled Components

const Container = styled.div`
  display: flex;
  background: radial-gradient(circle, #e0eaff, #ffffff);
  /* background-color:#e0eaff; */
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
    line-height: 1; 
  }

`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 160px;
  margin-top: 60px;   
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


const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 14px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #b3cce6;
  border-radius: 6px;
  background-color: #f5faff;
  color: #003366;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.2s ease;

  &::file-selector-button {
    background-color: darkblue;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-right: 10px;
  }

  &::file-selector-button:hover {
    background-color: #1a75ff;
  }
`;


const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: darkblue;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 20px;
  margin-top:20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  align-items: flex-start;
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  color: #004080; /* Dark blue for label */
  margin-bottom: 6px;
  font-weight: 500;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #b3cce6;  /* Light blue border */
  border-radius: 6px;
  background-color: #f5faff;  /* Very light blue background */
  color: #003366;             /* Deep blue text */
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: #66a3ff;
  }

  &:focus {
    border-color: #3399ff;
    box-shadow: 0 0 0 2px rgba(51, 153, 255, 0.3);
  }
`;


const SContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  background: transparent; 
  height:auto;
`;

const SectionCovid1 = styled.div`
  flex: 2;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  align-items:left;
  min-height:50vh;
  display:flex;
`;

const SectionCovid2 = styled.div`
  flex: 1; 
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height:50vh;
  display:flex;
  gap:40px;
`;

const SectionCovid3 = styled.div`
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem; 
  height:auto;

    
  .table-wrapper {
    max-height: 350px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  th {
    background-color: #f3f3f3;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  img {
    max-width: 50px;
    max-height: 50px;
    object-fit: contain;
    margin: 0 auto;
  }

`;

const SectionCovid4 = styled.div`
  flex: 1; 
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem; 
  display:flex;
  height:auto;
`;

// const Title = styled.h2`
//   font-size: 20px;
//   font-weight: bold;
//   margin-bottom: 10px;
//   color: #333;
//   text-align: left; /* Align left */
// `;

const SContent1 = styled.div`
  font-size: 16px;
  padding:20px;
  color: #555;
  max-height: 100%;
  overflow-y: auto; 
  flex:1;
  align-items:left;
`;

const SContent2 = styled.div`
  font-size: 16px;
  padding:20px;
  color: #555;
  max-height: 100%;
  overflow-y: auto; 
  flex:1;
  display: flex;
  flex-direction: column;
  align-items: center; 
  gap: 10px; 
`;


const ImageContainer = styled.div`
  width: 300px;
  height: 300px;
  border: 1px solid black; 
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #f1f1f1; 
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; 
`;

const PredictionText = styled.p`
  font-size: 16px;
  color: #555;
  margin: 0; 
  text-align: left;
`;

const PredictionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
  color: #333;
`;

const headerStyle = {
  textAlign: "center",
  // marginBottom: "1.5rem",
  color: "#1e3a8a",
  backgroundColor: "#e0f2fe",
  padding: "12px 24px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 50, 0.1)",
  fontSize: "30px",
  fontWeight: "600",
  letterSpacing: "0.5px",
};

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  /* margin-bottom: 10px; */
  color: #333;
  text-align: left; /* Align left */
`;