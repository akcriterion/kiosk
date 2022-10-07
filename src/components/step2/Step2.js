import React, {
  useState,
  useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Modal } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import "./step2.css";
import { useNavigate } from "react-router-dom";
import SignaturePad from "react-signature-canvas";
import Signature from "./Signature";
import { updateCustomer } from "../../service/customer/CustomerService";
import { getCountries } from "../../service/country/CountryService";
import BlockUI from "../../util/block-ui/block-ui";
import { notifySuccess, notifyError } from "../../util/notify";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import Message from "../../util/message";
import TermsAndConditions from "../terms-and-conditions/TermsAndConditions";

const Step2 = () => {

  const [customerData, setCustomerData] = useState({
    firstNames: "",
    lastNames: "",
    nationality: {
      value: "",
      label: ""
    },
    document: {
      type: {
        value: "",
        label: ""
      },
      number: "",
      issuingCountry: {
        value: "",
        label: ""
      },
      expirationDate: new Date(),
    },
    signature: "",
    agreeToMewsTC: false,
    receiveMarketingUpdates: false
  });

  const [imageURL, setImageURL] = useState(null);

  // const [errors, setErrors] = useState({});

  const [blocking, setBlocking] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const [showTCModal, setShowTCModal] = useState(false);


  const [nationalities, setNationalities] = useState([]);

  // const [nationalities, setNationalities] = useState([
  //   { value: "GB", label: "UK"},
  //   { value: "ES", label: "Spain"},
  //   { value: "FR", label: "France"},
  // ]);

  useEffect(() => {
    if (nationalities.length === 0) {
      loadCountries()
    }
  }, []);

  // useEffect(() => {
  //   console.log("Step2. imageURL: ", imageURL);
  //   console.log("type of imageURL: ", typeof imageURL);
  // }, [imageURL])

  const [documentTypes, setDocumentTypes] = useState([
    { value: "passport", label: "Passport" },
    { value: "id_card", label: "ID Card" }
  ]);

  const navigate = useNavigate();
  const { t } = useTranslation();


  const loadCountries = async () => {
    setBlocking(true);
    try {
      const response = await getCountries();
      console.log("COUNTRIES RESPONSE: ", response.data);
      const countries = response.data; 

      let result = [];

      countries.forEach(country => {
        const c = {
          value: country.code,
          label: country.englishName
        }
        result.push(c);
      });

      setNationalities(result);
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

  const findFormErrors = () => {
    return {}
    // const { lastname, confirmationNumber } = reservationData;
    // const newErrors = {};

    // if ( !lastname || lastname === '' ) newErrors.lastname = t('fieldRequired');
    // else if ( lastname.length > 64 ) newErrors.lastname = t('tooLong');

    // if ( !confirmationNumber || confirmationNumber === '' ) newErrors.confirmationNumber = t('fieldRequired');


    // console.log("NEW ERRORS:", newErrors);
    // return newErrors;
  }


  const getTermsAndCondtions = () => {
    return (
      <span>
        I agree to <Button className="link btn-link" onClick={handleTCModalOpen}><Trans>termsAndConditions</Trans></Button>
      </span>
    )
  }

  const setField = (field, value) => {
    console.log("setField called"); 
    console.log("field:", field);
    console.log("value:", value);
    setCustomerData({
      ...customerData,
      [field]: value
    })
    // // Check and see if errors exist, and remove them from the error object:
    // if ( !!errors[field] ) setErrors({
    //   ...errors,
    //   [field]: null
    // })
  }
  
  const setDocumentField = (parentField, field, value) => {
    console.log("setDocumentField called"); 
    console.log("field:", field);
    console.log("value:", value);
    setCustomerData({
      ...customerData,
      [parentField]: {
        ...customerData[parentField],
        [field]: value
      }
    })
    // // Check and see if errors exist, and remove them from the error object:
    // if ( !!errors[parentField][field] ) setErrors({
    //   ...errors,
    //   [parentField]: {
    //     ...errors[parentField],
    //     [field]: null
    //   } 
    // })
  }

  const handleHomeClick = () => {
    navigate("/");
  }

  const handleTCModalOpen = () => {
    setShowTCModal(true);
  }

  const handleTCModalClose = () => {
    setShowTCModal(false);
  }

  const handleModalClose = () => {
    setShowModal(false);
  }

  const handleSubmit = async (e) =>  {
    console.log("customerData:", customerData);

    e.preventDefault();
    // get our new errors
    const newErrors = findFormErrors();
    // Conditional logic:
    if ( Object.keys(newErrors).length > 0 ) {
      // We got errors!
      // setErrors(newErrors);
    } else {
      let response = {};

      setBlocking(true);
      try {

        let payload = {...customerData};
        console.log("PAYLOAD: ", payload);

        let nationality = {...payload.nationality};
        nationality = {
          code: nationality.value,
          englishName: nationality.label
        }
        payload.nationality = nationality;

        let issuingCountry = {...payload.document.issuingCountry};
        issuingCountry = {
          code: issuingCountry.value,
          englishName: issuingCountry.label
        }
        payload.document.issuingCountry = issuingCountry;

        let documentType = payload.document.type;
        documentType = documentType.value;

        payload.document.type = documentType;
        payload.signature = imageURL;

        response = await updateCustomer(payload);

        console.log('RESPONSE:', response);

        if (response && response.data.msg === Message.INVALID_REGISTRATION_DATA) {
          setModalHeader(t("registrationData"));
          setModalMessage(t("invalidRegistrationData"));
          setShowModal(true);
          return;
        } 
        notifySuccess('registrationOk')
        navigate("/step3");
      }
      catch (error) {
        if (error.response.status === 422) {
          notifyError(t("wrongInput"));
        } else if (error.response.status === 404) {
          // notifyError(t("notFound"));
          setModalHeader(t("registrationData"));
          setModalMessage(t("invalidRegistrationData"));
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
      <div className="container-md">
        <div className="row step2-header-row">
          <div className="col-md-12">
            <h2 className="step2-header align-items-center justify-content-center text-center text-light">
              <p>ZEDWELL</p>
              <p>piccadilly circus</p>
            </h2>
          </div>
        </div>
        <div className="row step2-row align-items-center justify-content-center">
          <div className="col-md-12">
            <Card className="step2-card mw-75">
              <Form>
                <Card.Header className="step2-card-header">
                  Personal Information
                </Card.Header>
                <Card.Body>
                  <div className="row step2-row1 align-items-center justify-content-center">
                    <div className="col-md-4">
                      <Form.Group>
                        <Form.Control
                          id="firstNames"
                          name="firstNames"
                          placeholder="First names"
                          value={customerData.firstNames}
                          onChange={e => setField("firstNames", e.target.value)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group>
                        <Form.Control
                          id="lastNames"
                          name="lastNames"
                          placeholder="Last names"
                          value={customerData.lastNames}
                          onChange={e => setField("lastNames", e.target.value)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group>
                        <Select
                          id="nationality"
                          name="nationality"
                          options={nationalities}
                          placeholder="Nationality"
                          onChange={e => setField("nationality", e)}
                          isSearchable={true}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-center step2-row2">
                    <div className="col-md-6">
                      <Form.Group>
                        <Select
                          id="documentType"
                          name="documentType"
                          options={documentTypes}
                          className="my-1"
                          // value={customerData.document.type.value}
                          onChange={e => setDocumentField("document","type", e)}
                        />
                        <Form.Control
                          id="documentNumber"
                          name="documentNumber"
                          placeholder="Document Number"
                          value={customerData.document.number}
                          onChange={e => setDocumentField("document","number", e.target.value)}
                        />
                        <Select
                          id="issuingCountry"
                          name="issuingCountry"
                          options={nationalities}
                          className="my-1"
                          isSearchable={true}
                          // value={customerData.document.issuingCountry.value}
                          onChange={e => setDocumentField("document","issuingCountry", e)}
                        />
                        <DatePicker
                          id="expirationDate"
                          name="expirationDate"
                          selected={customerData.document.expirationDate}
                          onChange={date => setDocumentField("document","expirationDate", date)}
                          dateFormat={"dd/MM/yyyy"}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <Signature
                          setImageURL={setImageURL}
                        />
                        <Form.Check
                          id="agreeTermsAndConditions"
                          name="agreeTermsAndConditions"
                          label={getTermsAndCondtions()}
                          type="checkbox"
                          checked={customerData.agreeToMewsTC}
                          onChange={e => setField("agreeToMewsTC", e.target.checked)}
                        />
                        <Form.Check
                          id="receiveOffers"
                          name="receiveOffers"
                          label="Please keep me updated with any offers"
                          type="checkbox"
                          checked={customerData.receiveMarketingUpdates}
                          onChange={e => setField("receiveMarketingUpdates", e.target.checked)}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row step2-row3 justify-content-center align-items-center text-center">
                    <div className="col-md-6">
                      <Button onClick={handleHomeClick}>Home</Button>
                    </div>
                    <div className="col-md-6">
                      <Button onClick={handleSubmit}>Confirm</Button>
                    </div>
                  </div>
                </Card.Body>
              </Form>
            </Card>
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
        {/* TC Modal */}
        <Modal
          id="modal"
          name="modal"
          show={showTCModal}
          onHide={handleTCModalClose}>
          <Modal.Header>
            <Modal.Title>
              <Trans>termsAndConditions</Trans>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TermsAndConditions/>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-primary" onClick={handleTCModalClose}>
              <Trans>ok</Trans>
            </Button>
          </Modal.Footer>
        </Modal>
        <BlockUI tag="div" blocking={blocking}/>
      </div>
  )
}

export default Step2;
