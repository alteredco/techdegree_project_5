const randUserUrl = 'https://randomuser.me/api/';
const groupNum = "12"
const randGroupUrl = randUserUrl+`/?results=${groupNum}`;

const searchContainer = document.getElementById('search-container');
const gallery = document.getElementById('gallery');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .catch(error => console.log('Looks like there was a problem!',error))
}

async function getRandUser(url) {
  const userJSON = await fetchData(url);

  const profiles = userJSON.results.map( async(person) => {
    const image = person.picture.thumbnail;
    const name = `${person.name.first} ${person.name.last}`;
    const email = person.email;
    const location = `${person.location.city} ${person.location.state}`

    return {
      image,
      name,
      email,
      location
    };
  })

  return profiles;
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
        <img class="card-img" src="https://placehold.it/90x90" alt="profile picture">
      </div>
      <div class="card-info-container">
        <h3 id="name" class="card-name cap">${person.name} </h3>
          <p class="card-text">${person.email}</p>
      </div>
    </div>
    `;
    console.log(person);})
}

getRandUser(randGroupUrl)
  .then(generateHTML)
  .catch(err => {
    gallery.innerHTML = '<h3>Something went wrong...</h3>';
    console.error(err);
  });