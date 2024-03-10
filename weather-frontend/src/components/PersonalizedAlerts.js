import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faTint, faWind, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Alert, Container, Card, Form, Button, ListGroup } from 'react-bootstrap';

const PersonalizedAlerts = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [temperatureAlert, setTemperatureAlert] = useState(false);
  const [humidityAlert, setHumidityAlert] = useState(false);
  const [windSpeedAlert, setWindSpeedAlert] = useState(false);
  const [savedAlerts, setSavedAlerts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    console.log('Saved Alerts:', savedAlerts);
  }, [savedAlerts]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleTemperatureAlertChange = () => {
    setTemperatureAlert(!temperatureAlert);
  };

  const handleHumidityAlertChange = () => {
    setHumidityAlert(!humidityAlert);
  };

  const handleWindSpeedAlertChange = () => {
    setWindSpeedAlert(!windSpeedAlert);
  };

  const saveAlertPreferences = () => {
    // Save the current alert preferences
    const newAlert = {
      city: selectedCity,
      temperature: temperatureAlert,
      humidity: humidityAlert,
      windSpeed: windSpeedAlert
    };
    setSavedAlerts([...savedAlerts, newAlert]);

    // Display the alert message on the screen
    setAlertMessage(`You will be alerted in the future for conditions set in ${selectedCity}`);
    setShowAlert(true);

    
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage('');
    }, 10000);
  };

  const removeAlert = (index) => {
    const updatedAlerts = [...savedAlerts];
    updatedAlerts.splice(index, 1);
    setSavedAlerts(updatedAlerts);
  };

  return (
    <Container className="mt-5">
      <Alert show={showAlert} variant="success" onClose={() => setShowAlert(false)} dismissible>
        {alertMessage}
      </Alert>
      <Container>
        <Card className="mt-5 p-4 border border-light" style={{ backgroundColor: '#343a40', color: '#fff' }}>
          <Card.Body>
            <Card.Title className="mb-4">Personalized Alerts</Card.Title>
            <Form>
              <Form.Group controlId="city">
                <Form.Label>Select City:</Form.Label>
                <Form.Control type="text" value={selectedCity} onChange={handleCityChange} />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  id="temperature"
                  label={<span><FontAwesomeIcon icon={faThermometerHalf} className="mr-2" />Temperature below 25°C</span>}
                  checked={temperatureAlert}
                  onChange={handleTemperatureAlertChange}
                />
                <Form.Check
                  type="checkbox"
                  id="humidity"
                  label={<span><FontAwesomeIcon icon={faTint} className="mr-2" />Humidity above 80%</span>}
                  checked={humidityAlert}
                  onChange={handleHumidityAlertChange}
                />
                <Form.Check
                  type="checkbox"
                  id="windSpeed"
                  label={<span><FontAwesomeIcon icon={faWind} className="mr-2" />Wind speed above 20 km/h</span>}
                  checked={windSpeedAlert}
                  onChange={handleWindSpeedAlertChange}
                />
              </Form.Group>
              <Button variant="primary" onClick={saveAlertPreferences}>
                Save <FontAwesomeIcon icon={faCheck} className="ml-2" />
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <ListGroup className="mt-4" >
          {savedAlerts.map((alert, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center border border-light">
              <div>
                <FontAwesomeIcon icon={faThermometerHalf} className={alert.temperature ? 'text-success mr-2' : 'text-danger mr-2'} />
                <FontAwesomeIcon icon={faTint} className={alert.humidity ? 'text-success mr-2' : 'text-danger mr-2'} />
                <FontAwesomeIcon icon={faWind} className={alert.windSpeed ? 'text-success mr-2' : 'text-danger mr-2'} />
                {alert.city}
              </div>
              <Button variant="danger" onClick={() => removeAlert(index)}><FontAwesomeIcon icon={faTimes} /></Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    </Container>
  );
};

export default PersonalizedAlerts;
