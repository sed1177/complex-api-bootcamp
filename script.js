/* citation google AI MODE gave me - new Promise(resolve => setTimeout(resolve, 1000))


calling a new Promise object, if resolved, which means we got the request back successfully, i will resolve and call each 
character by 1 second. i'll wait 1 second between calling each character! 

JIKAN has a 3 per second rate limit so i had to use a delay to maximize how many characters i can see

APIS - https://dragonball-api.com/api/characters?limit=10 and https://api.jikan.moe
*/

// Show character info on the page
    function showCharacterInformation(name, maxKi, about, image) {
      document.getElementById('output').innerHTML += `
      <div id="card">
        <img src=${image} >
        <h2>${name}</h2>
        <p>Max Ki: ${maxKi}</p>
        <p>About: ${about.slice(0, 100)}...</p>
        
        </div>
      `;
    }

// Wait for 1 second using new Promise function. if request is resolved, set the 
// timeout by 1 second for each request
function waitOneSecond() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}


// Get data from Dragon Ball API
fetch("https://dragonball-api.com/api/characters?limit=10")
  .then(res => res.json())
  .then(data => {
    let count = 0;
    
    function checkNext() {
      if (count >= data.items.length) return; // Stop when done
      let char = data.items[count];
      if (char.maxKi && char.name && char.image) { // Make sure we have name and maxKi
        console.log("Looking at:", char.name);
        
        
        // JIKAN API
        fetch("https://api.jikan.moe/v4/characters?q=" + char.name)
          .then(res => res.json())
          .then(jikanData => {
            let about = jikanData.data[0]?.about;
            if (about) { // Check if we have about info
              showCharacterInformation(char.name, char.maxKi, about, char.image);
            }
            count = count + 1;
            new Promise(resolve => setTimeout(resolve, 1000)).then(checkNext); // Wait 1 second
          })
          .catch(err => {
            console.log("Oops for " + char.name + ":", err);
            count = count + 1;
            new Promise(resolve => setTimeout(resolve, 1000)).then(checkNext); // Keep going
          });
      } else {
        count = count + 1;
        new Promise(resolve => setTimeout(resolve, 1000)).then(checkNext); // Skip bad ones
      }
    }
    checkNext(); // Start checking
  })
  .catch(err => console.log("Big oops:", err));