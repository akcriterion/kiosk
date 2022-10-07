import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card,
  Button,
  Form,
  Modal } from "react-bootstrap"; 
import "./step1.css";
import { getReservation } from "../../service/reservation/ReservationService";
import BlockUI from "../../util/block-ui/block-ui";
import { notifySuccess, notifyError } from "../../util/notify";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import Message from "../../util/message";

const Step1 = () => {

  const [reservationData, setReservationData] = useState({
    lastname: "",
    confirmationNumber: "",
    over18: false
  });

  const [errors, setErrors] = useState({});
  const [blocking, setBlocking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const setField = (field, value) => {


   // console.log("field:", field);
   // console.log("value:", value);
   setReservationData({
     ...reservationData,
     [field]: value
   })
   // Check and see if errors exist, and remove them from the error object:
   if ( !!errors[field] ) setErrors({
     ...errors,
     [field]: null
   })
  }

  const findFormErrors = () => {
    const { lastname, confirmationNumber } = reservationData;
    const newErrors = {};

    if ( !lastname || lastname === '' ) newErrors.lastname = t('fieldRequired');
    else if ( lastname.length > 64 ) newErrors.lastname = t('tooLong');

    if ( !confirmationNumber || confirmationNumber === '' ) newErrors.confirmationNumber = t('fieldRequired');


    console.log("NEW ERRORS:", newErrors);
    return newErrors;
  }

  const handleModalClose = () => {
    setShowModal(false);
  }

  const handleSubmit = async (e) =>  {
    console.log("reservationData:", reservationData);
    if (!reservationData.over18) {
      setModalHeader(t("over18"));
      setModalMessage(t("mustBeOver18"));
      setShowModal(true);
      return;
    }
    e.preventDefault();
    // get our new errors
    const newErrors = findFormErrors();
    // Conditional logic:
    if ( Object.keys(newErrors).length > 0 ) {
      // We got errors!
      setErrors(newErrors);
    } else {
      let response = {};

      setBlocking(true);
      try {
        response = await getReservation(reservationData);
        console.log('RESPONSE:', response);

        if (response && response.data.msg === Message.MUST_BE_OVER_18) {
          setModalHeader(t("over18"));
          setModalMessage(t("mustBeOver18"));
          setShowModal(true);
          return;
        } else if (response && response.data.msg === Message.BOOKING_NOT_PAID) {
          setModalHeader(t("booking"));
          setModalMessage(t("bookingNotPaid"));
          setShowModal(true);
          return;
        } else if (response && response.data.msg === Message.ROOM_NOT_READY) {
          setModalHeader(t("room"));
          setModalMessage(t("roomNotReady"));
          setShowModal(true);
          return;
        } else if (response && response.data.nationalityCode === "GB") {
          notifySuccess('reservationFound')
          navigate("/step2UK");
        } else {
          navigate("/step2");
        }

      }
      catch (error) {
        if (error.response.status === 422) {
          notifyError(t("wrongInput"));
        } else if (error.response.status === 404) {
          // notifyError(t("notFound"));
          setModalHeader(t("booking"));
          setModalMessage(t("bookingNotFound"));
          setShowModal(true);
        } else if (error.response.status === 500) {
          notifyError(t("somethingWentWrong"));
        } 
        const response = error.response;
        if (response) {
          console.log("error message: ", response);
        }
      }
      finally {
        setBlocking(false);
      }
    }
  }

  return (
    <div>
      <div className="container-lg">
        <div className="row align-items-center justify-content-center text-center text-light step1-header">
          <div>
            <p>ZEDWELL</p>
            <p>
              picadilly circus 
              <br/>
              welcomes you
            </p>
          </div>
        </div>
        <div className="row align-items-center justify-content-center step1-row">
          <div className="col-md-5">
            <Card className="step1-card step1-check-in-card">
              <Card.Header>
                Check in
              </Card.Header>
              <Card.Body>
                <Form>
                  <div className="my-1">
                    <Form.Group>
                      <Form.Control
                        id="lastname"
                        name="lastname"
                        type="text"
                        value={reservationData.lastname}
                        onChange= {e => setField("lastname", e.target.value)}
                        placeholder="Lastname"
                      />
                    </Form.Group>
                  </div>
                  <div className="my-1">
                    <Form.Group>
                      <Form.Control
                        id="confirmationNumber"
                        name="confirmationNumber"
                        value={reservationData.confirmationNumber}
                        onChange= {e => setField("confirmationNumber", e.target.value)}
                        type="text"
                        placeholder="Confirmation Number"
                      />
                    </Form.Group>
                  </div>
                  <div className="my-2">
                    <Form.Group>
                      <Form.Check
                        id="over18"
                        name="over18"
                        checked={reservationData.over18}
                        onChange= {e => setField("over18", e.target.checked)}
                        type="switch"
                        label="Confirm over 18"
                      />
                    </Form.Group>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer>
                <Button type="submit" onClick={handleSubmit} className="w-100">
                  Confirm
                </Button>
              </Card.Footer>
            </Card>
          </div>
          <div className="col-md-5">
            <Card className="step1-card step1-check-out-card">
              <Card.Header>
                Check out
              </Card.Header>
              <Card.Body>
                <Form>
                  <div className="my-1">
                    <Form.Group>
                      <Form.Control
                        id="lastname"
                        name="lastname"
                        type="text"
                        placeholder="Lastname"
                      />
                    </Form.Group>
                  </div>
                  <div className="my-1">
                    <Form.Group>
                      <Form.Control
                        id="roomNumber"
                        name="roomNumber"
                        type="text"
                        placeholder="Room Number"
                      />
                    </Form.Group>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer>
                <Button className="w-100">
                  Confirm
                </Button>
              </Card.Footer>
            </Card>
          </div>
        </div>
      </div>
      {/* Modal */}
      <Modal
        id="modal"
        name="modal"
        show={showModal}
        onHide={handleModalClose}>
        <Modal.Header>
          <Modal.Title>
            <Trans>{modalHeader}</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-primary" onClick={handleModalClose}>
            <Trans>ok</Trans>
          </Button>
        </Modal.Footer>
      </Modal>
      <BlockUI tag="div" blocking={blocking}/>
    </div>
  )
}


export default Step1;
