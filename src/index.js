// Your code here

document.addEventListener("DOMContentLoaded", () => {
// runs when theserver is fully loaded.

  // Define the base URL for API requests.
const baseUrl = "http://localhost:3000";

  // Get references to HTML elements using their IDs.
  const characterBar = document.getElementById("character-bar");
  const detailedInfo = document.getElementById("detailed-info");
  const nameElement = document.getElementById("name");
  const imageElement = document.getElementById("image");
  const voteCountElement = document.getElementById("vote-count");
  const votesForm = document.getElementById("votes-form");
  const resetButton = document.getElementById("reset-btn");
  const characterForm = document.getElementById("character-form");

  // Initialize a variable to keep track of the currently selected character.
  let currentCharacter = null;

  // Function to fetch characters from the server and display them in the character bar.
  function fetchCharacters() {
  fetch(`${baseUrl}/characters`)
      .then((response) => response.json())
      .then((characters) => {
      // Clear the existing content of the character bar.
      characterBar.innerHTML = "";

      // Loop through the retrieved characters and create clickable spans for each character's name.
      characters.forEach((character) => {
          const span = document.createElement("span");
          span.textContent = character.name;
          span.addEventListener("click", () => showCharacterDetails(character));
          characterBar.appendChild(span);
      });
      })
      .catch((error) => console.error("Error fetching characters:", error));
  }

  // Function to display detailed information about a character.
  function showCharacterDetails(character) {
      // Set the currently selected character.
      currentCharacter = character;

      // Update the name, image, and vote count elements in the detailed-info section.
      nameElement.textContent = character.name;
      imageElement.src = character.image;
      voteCountElement.textContent = character.votes;

      // Remove previous event listeners before attaching new ones to prevent memory leaks.
      if (votesForm._listener) {
          votesForm.removeEventListener("submit", votesForm._listener);
      }
      if (resetButton._listener) {
          resetButton.removeEventListener("click", resetButton._listener);
      }
  
      // Add an event listener for the votes form submission.
      votesForm._listener = (e) => {
          e.preventDefault();
          const votesInput = document.getElementById("votes");
          const votesToAdd = parseInt(votesInput.value, 10);
          if (!isNaN(votesToAdd)) {
          // Update the character's votes and display the new vote count.
          character.votes += votesToAdd;
          voteCountElement.textContent = character.votes;
        
          //update characters votes and display them in the server.
          updateCharacterVotes(character);
          }
          votesInput.value = "";
      };

      // Add an event listener for the reset button to reset the character's votes.
      resetButton._listener = () => {
          character.votes = 0;
          voteCountElement.textContent = character.votes;
          // Send an API request to reset the character's votes on the server.
          updateCharacterVotes(character);
      };
  
      // Attach event listeners to the votes form and reset button.
      votesForm.addEventListener("submit", votesForm._listener);
      resetButton.addEventListener("click", resetButton._listener);
      
  }
  
  // Function to update a character's vote and display it in the server.
  function updateCharacterVotes(character) {
      fetch(`${baseUrl}/characters/${character.id}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ votes: character.votes }),
      })
      .then((response) => response.json())
      .catch((error) => console.error("Error updating votes:", error));
  }

  // Funcction to add a new character and display it in the server.
  function addNewCharacter(character) {
      const span = document.createElement("span");
      span.textContent = character.name;
      span.addEventListener("click", () => showCharacterDetails(character));
      characterBar.appendChild(span);
      showCharacterDetails(character);
  }

  //add event listener and displays it in the server.
  characterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = characterForm.querySelector("#name");
      const imageUrlInput = document.getElementById("image-url");
      const newCharacter = {
          name: nameInput.value,
          image: imageUrlInput.value,
          votes: 0,
      };

      // Send an API request to add the new character to the server.
      fetch(`${baseUrl}/characters`, {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify(newCharacter),
      })
          .then((response) => response.json())
          .then((character) => addNewCharacter(character))
          .catch((error) => console.error("Error adding character:", error));
  
          // Clear the input fields after adding the character.
      nameInput.value = "";
      imageUrlInput.value = "";
  });

  // Initiate fetch and display of characters when the page loads.
  fetchCharacters();
});