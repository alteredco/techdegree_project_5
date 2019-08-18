const randUserUrl = 'https://randomuser.me/api/';
const groupNum = "12"
const randGroupUrl = randUserUrl+`/?results=${groupNum}`;

const searchContainer = document.getElementById('search-container');
const gallery = document.getElementById('gallery');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
async function fetchData(url) {
  try {
    let response = await fetch(url);
    let data = await response.json();
    console.log(data.results)
    return data.results;
  } catch (error) {
    console.log('Looks like there was a problem getting data!',error);
  }
}

async function getRandUsers(url) {
  try {
  let userData = await fetchData(url);
  let profiles = await Promise.all(userData.map( 
    async(person) => {
      let image = person.picture.large;
      let name = `${person.name.first} ${person.name.last}`;
      let email = person.email;
      let location = `${person.location.city}, ${person.location.state}`
      return {
        image,
        name,
        email,
        location
      };
    }));
 return profiles;
} catch(error) {
  console.log('Looks like there was a problem getting user profiles!',error);
}
}

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
function checkStatus(response) {
  if(response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}


// Generate the markup for each profile

function generateHTML(data) {
  data.map(person => {
    const section = document.createElement('section');
    gallery.appendChild(section);
    section.innerHTML = `
      <div class="card">
        <div class="card-img-container">
          <img class="card-img" src=${person.image} alt=${person.name}>
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${person.name} </h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text">${person.location}</p>
        </div>
      </div>
      `;
      console.log(person);})
}

getRandUsers(randGroupUrl)
  .then(generateHTML)
  .catch(err => {
    gallery.innerHTML = '<h3>Something went wrong...</h3>';
    console.error(err);
  });