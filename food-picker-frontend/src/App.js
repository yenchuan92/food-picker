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

  // performance optimizations that can be done:
  // extract the randomization picker into a component of its own, along with the required states, so that state updates will not cause other components to keep rerendering!
  // can also do the same for other components
  // alternatively, use React.memo for components and specify which states they should only depend on when deciding whether to rerender!

  return (
    <div className="App">
      <div className="title">Food Picker App</div>
      <div className="addFoodContainer">
        <div className="addFood">
          <input
            placeholder="Add a Food Option..."
            onChange={(e) => addTextInputChange(e)}
            className="addFoodInput"
          />
          <button
            onClick={(e) => handleAddOptionClick(e)}
            disabled={validationErr}
            className="addFoodButton"
          >
            Add Food Option
          </button>
        </div>

        {validationErr && (
          <div className="errorText">Please key in a proper food option.</div>
        )}
        {addedSuccess && (
          <div className="successText">Option added successfully!</div>
        )}
        {addedFailure && <div className="errorText">{errorMessage}</div>}
      </div>

      <div className="randomFood">
        <div className="randomFoodHeader">Actual requirement</div>
        <button
          onClick={(e) => handleGetRandomOptionClick(e)}
          className="randomFoodButton"
        >
          Choose a Food Place
        </button>
        {randomFailure && <div className="errorText">{errorMessage}</div>}
        <div className="randomFoodText">{randomFoodPlace}</div>
      </div>

      <div className="randomFood">
        <div className="randomFoodHeader">
          Extra (frontend randomization effect)
        </div>

        <button
          onClick={(e) => handleGetAllOptionsClick(e)}
          className="randomFoodButton"
        >
          Choose a Food Place
        </button>
        {randomFailure && <div className="errorText">{errorMessage}</div>}
        <div>{randomOption}</div>
      </div>
    </div>
  );
}

export default App;
