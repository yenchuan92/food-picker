import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [addText, setAddText] = useState("");
  const [validationErr, setValidationErr] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [randomFoodPlace, setRandomFoodPlace] = useState("");

  // extra stuff
  const [randomOption, setRandomOption] = useState("");
  const [randomTimer, setRandomTimer] = useState(0);
  // const [options, setOptions] = useState([]);
  const sampleValues = ["kfc", "macs", "mos", "LJS", "a&w"];

  let inputTimer;

  // extra stuff
  useEffect(() => {
    if (randomTimer > 0) {
      setTimeout(() => {
        setRandomOption(sampleValues[getRandomInt(0, sampleValues.length - 1)]);
        setRandomTimer((prevState) => {
          return prevState - 200;
        });
      }, 50);
    }
  }, [randomTimer]);

  const handleAddOptionClick = (e) => {
    e.preventDefault();
    console.log(addText + " added");
    // call API and pass state value
  };

  // extra stuff
  const handleGetAllOptionsClick = (e) => {
    e.preventDefault();
    console.log("getAll clicked");
    // call API and store value into state
    // setOptions(value)
    // assume API is done
    // then u want to take all the options and create a loop
    getRandomFoodPlace(sampleValues, 2000);
  };

  const handleGetRandomOptionClick = (e) => {
    e.preventDefault();
    // call API and get random food place
    // then setRandomFoodPlace(response)
  };

  // extract this component and function out into a separate component since it will keep rerendering!
  const getRandomFoodPlace = () => {
    setRandomTimer(3000);
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

    // using debouncing here to prevent too many state updates and unnecessary rerendering
    clearTimeout(inputTimer);
    inputTimer = setTimeout(() => {
      // forms a closure with the value of val at the point the function was created
      // console.log("in settimeout", val);
      // validate text before setting
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
      </div>

      <div>
        <div>Extra (frontend randomization effect)</div>
        <div>{randomOption}</div>
        <button onClick={(e) => handleGetAllOptionsClick(e)}>
          Choose a Food Place
        </button>
      </div>
    </div>
  );
}

export default App;
