const pollForm = document.getElementById("radioForm");
const resultsDiv = document.getElementById('results');
const resetButton = document.getElementById('reset');

import { poll_backend } from "../../declarations/poll_backend";


//1. LOCAL DATA
const pollResults = {
  "Rust": 0,
  "Motoko": 0,
  "TypeScript": 0,
  "Python": 0
};

//2. EVENT LISTENERS
//Load the Simple Poll's question from the backend when the app loads
document.addEventListener('DOMContentLoaded', async (e) => {
  e.preventDefault();

  // Query the question from the backend
  const question = await poll_backend.getQuestion();
  document.getElementById("question").innerText = question;

  const voteCounts = await poll_backend.getVotes();
  updateLocalVoteCounts(voteCounts);
  displayResults();
  return false;
}, false);

pollForm.addEventListener('submit', async (e) => {
  //note that this is at beginning of the submit callback, this is deliberate
  //This is so the default behavior is set BEFORE the awaits are called below
  e.preventDefault(); 

  const formData = new FormData(pollForm);
  const checkedValue = formData.get("option");

  const updatedVoteCounts = await poll_backend.vote(checkedValue);
  console.log("Returning from await...")
  console.log(updatedVoteCounts);
  updateLocalVoteCounts(updatedVoteCounts);
  displayResults();
  return false;
}, false);

resetButton.addEventListener('click', async (e) => {
  e.preventDefault();
  
  //Reset the options in the backend
  await poll_backend.resetVotes();
  const voteCounts = await poll_backend.getVotes();
  updateLocalVoteCounts(voteCounts);

  //re-render the results once the votes are reset in the backend
  displayResults();
  return false;
}, false);

//3. HELPER FUNCTIONS
function displayResults() {
  let resultHTML = '<ul>';
  for (let key in pollResults) {
      resultHTML += '<li><strong>' + key + '</strong>: ' + pollResults[key] + '</li>';
  }
  resultHTML += '</ul>';
  resultsDiv.innerHTML = resultHTML;
};

function updateLocalVoteCounts(arrayOfVoteArrays){
  for (let voteArray of arrayOfVoteArrays) {
    //Example voteArray -> ["Motoko","0"]
    let voteOption = voteArray[0];
    let voteCount = voteArray[1];
    pollResults[voteOption] = voteCount;
  }
};