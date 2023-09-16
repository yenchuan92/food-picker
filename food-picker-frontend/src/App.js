import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [addText, setAddText] = useState("");
  const [validationErr, setValidationErr] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [addedFailure, setAddedFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [randomFailure, setRandomFailure] = useState(false);
  const [randomFoodPlace, setRandomFoodPlace] = useState("");

  // extra stuff
  const [randomOption, setRandomOption] = useState("");
  const [randomTimer, setRandomTimer] = useState(0);
  const [options, setOptions] = useState([]);

  let inputTimer;

  // extra stuff
  useEffect(() => {
    if (randomTimer > 0 && options.length > 0) {
      setTimeout(() => {
        setRandomOption(options[getRandomInt(0, options.length - 1)]);
        setRandomTimer((prevState) => {
          return prevState - 200;
        });
      }, 50);
    }
  }, [randomTimer, options]);

  const handleAddOptionClick = (e) => {
    e.preventDefault();
    // if success message showing, hide it
    if (addedSuccess) {
      setAddedSuccess(false);
    }
    // if error message from add failure is showing, hide it
    if (addedFailure) {
      setAddedFailure(false);
      setErrorMessage("");
    }
    // call API and pass state value
    axios
      .post("http://localhost:8000/addFoodPlace", { name: addText })
      .then((res) => {
        // console.log(res.data);
        if (res.status === 201) {
          // then set the success message to show
          setAddedSuccess(true);
        }
      })
      .catch((err) => {
        setAddedFailure(true);
        setErrorMessage(err.response.data.message);
      });
  };

  // extra stuff
  const handleGetAllOptionsClick = (e) => {
    e.preventDefault();
    // if error message is showing, hide it
    if (randomFailure) {
      setRandomFailure(false);
      setErrorMessage("");
    }
    // call API
    axios
      .get("http://localhost:8000/foodPlaces")
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data, "GET called");
          // set data into state
          setOptions(res.data);
          // start the loop for randomizing effect
          setRandomTimer(3000);
        }
      })
      .catch((err) => {
        setRandomFailure(true);
        setErrorMessage(err.response.data.message);
      });
  };

  const handleGetRandomOptionClick = (e) => {
    e.preventDefault();
    // if error message is showing, hide it
    if (randomFailure) {
      setRandomFailure(false);
      setErrorMessage("");
    }
    // call API and get random food place
    axios
      .get("http://localhost:8000/randomFoodPlace")
      .then((res) => {
        if (res.status === 200) {
          // set response data into state
          setRandomFoodPlace(res.data);
        }
      })
      .catch((err) => {
        setRandomFailure(true);
        setErrorMessage(err.response.data.message);
      });
  };

  // extract this component and function out into a separate component since it will keep rerendering!

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const addTextInputChange = (e) => {
    const val = e.target.value;
    // if there is a current validation error, reset it
    if (validationErr) {
      setValidationErr(false);
    }
    // if success message showing, hide it
    if (addedSuccess) {
      setAddedSuccess(false);
    }
    // when user changes input in text input, reset all error states
    if (addedFailure || randomFailure) {
      setAddedFailure(false);
      setRandomFailure(false);
      setErrorMessage("");
    }

    // using debouncing here to prevent too many state updates and unnecessary rerendering
    clearTimeout(inputTimer);
    inputTimer = setTimeout(() => {
      // forms a closure with the value of val at the point the function was created
      // validate text before setting, only allows a few special symbols and letters/numbers
      const hasDisallowedChars = /[^0-9A-Za-z\-@!&]/.test(val);
      if (hasDisallowedChars) {
        setValidationErr(true);
      } else {
        setAddText(val);
      }
    }, 300);
  };

  // TODO: convert input with its state into its own component
  // alternatively, use React.memo on those components which don't rely on state updates

  return (
    <div className="App">
      <div>Food Picker</div>
      <div display="flex">
        <div>
          <input
            placeholder="Add a Food Option..."
            onChange={(e) => addTextInputChange(e)}
          />
          {validationErr && (
            <div color="red">Please key in a proper food option.</div>
          )}
          {addedSuccess && <div color="green">Option added successfully!</div>}
          {addedFailure && <div color="red">{errorMessage}</div>}
        </div>

        <button
          onClick={(e) => handleAddOptionClick(e)}
          disabled={validationErr}
        >
          Add Food Option
        </button>
      </div>

      <div>
        <div>Actual requirement</div>
        <div>{randomFoodPlace}</div>
        <button onClick={(e) => handleGetRandomOptionClick(e)}>
          Choose a Food Place
        </button>
        {randomFailure && <div color="red">{errorMessage}</div>}
      </div>

      <div>
        <div>Extra (frontend randomization effect)</div>
        <div>{randomOption}</div>
        <button onClick={(e) => handleGetAllOptionsClick(e)}>
          Choose a Food Place
        </button>
        {randomFailure && <div color="red">{errorMessage}</div>}
      </div>
    </div>
  );
}

export default App;
