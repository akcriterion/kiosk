import React, {
  useState,
  useEffect
} from "react";

import { 
  Container,
  Row,
  Col } from "react-bootstrap";

import "./step3.css";
import Resource from "./Resource";
import { getResources } from "../../service/resource/ResourceService";
import BlockUI from "../../util/block-ui/block-ui";
import { notifySuccess, notifyError } from "../../util/notify";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Step3 = () => {

  const [rooms, setRooms] = useState([]);
  const [blocking, setBlocking] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(100);
  const [pageNumber, setPageNumber] = useState(1);
  const [roomDivs, setRoomDivs] = useState([]);

  const navigate = useNavigate();
  const { t } = useTranslation();


  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      prepareRoomDivs();
    }

  }, [rooms.length])

  const loadRooms = async () => {
    setBlocking(true);
    try {
      const payload = {pageNumber: pageNumber} 
      const response = await getResources(payload);
      console.log("RESOURCES RESPONSE: ", response.data);
      const resources = response.data; 
      setRooms(resources);
    }
    
    catch (error) {
      const response = error.response;
      if (response) {
        console.log("error message: ", response);
      }
      if (error.response.status === 500) {
        notifyError(t("somethingWentWrong"));
      } 
    }
    finally {
      setBlocking(false);
    }
  }

  const prepareRoomDivs = () => {
    let roomDivs = rooms.map((room, index) => {
      return (
        <Row key={index}>
          <Col>
            <Resource/>
          </Col>
        </Row>
      )
    });
    setRoomDivs(roomDivs);
  }


  return (
    <Container className="step3-container">
      { roomDivs }
      <BlockUI tag="div" blocking={blocking}/>
    </Container>

  )
}

export default Step3;
