import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Step1 from "./components/step1/Step1";
import Step2UK from "./components/step2/Step2UK";
import Step2 from "./components/step2/Step2";
import Step3 from "./components/step3/Step3";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={ <Step1/> }/>
        <Route path="/step2UK" element={ <Step2UK/> }/>
        <Route path="/step2" element={ <Step2/> }/>
        <Route path="/step3" element={ <Step3/> }/>
      </Routes>
      <ToastContainer
        hideProgressBar={true}
        limit={1}
      />
    </Router>
  );
}

export default App;
