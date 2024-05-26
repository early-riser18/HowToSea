import logo from './logo.svg';
import './App.css';


async function fetchData() {
  // try {
  //   const response = await fetch('http://localhost:8080/microservice1', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   if (!response.ok) {
  //     throw new Error('Network response was not ok' + response.statusText);
  //   }

  //   const data = await response.json();
  //   console.log(data);
  //   return data
  // } catch (error) {
  //   console.error('There was a problem with the fetch operation:', error);
  // }


  fetch('https://www.google.com')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}
function App() {

  fetchData()
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
