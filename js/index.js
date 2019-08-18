

const randUserUrl = 'https://randomuser.me/api/';
const groupNum = "12"
const randGroupUrl = randUserUrl+`/?nat=au,us,dk,fr,gb&results=${groupNum}`;

const searchContainer = document.querySelector('.search-container');
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
      let location = `${person.location.city}, ${person.location.state}`;
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

function searchFilter() {
  let searchInput = document.getElementById('search-input');
  searchInput.addEventListener('keyup', (e) => {
    let nameInput =searchInput.value.toLowerCase();
    filterNames(nameInput);
  });
  function filterNames(input) {
    let names = document.querySelectorAll('.card-name');
    names.forEach(name => {
      genName = name.innerText.toLowerCase();
      if(genName.match(input)) {
        name.parentNode.parentNode.style.display= "block";
      } else {
        name.parentNode.parentNode.style.display="none";
      }
    });
  }
}

// Generate the markup for each profile
function generateHTML(data) {
  searchContainer.innerHTML = `
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
  </form>`;
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
            <p class="card-text cap">${person.location}</p>
        </div>
      </div>
      `;
      });
}

function modalHandler() {
  const cards = document.getElementsByClassName('cards');
  cards.forEach(card => card.addEventListener('click', (e)=> {
    console.log('working');
  }));
}

// ------------------------------------------

getRandUsers(randGroupUrl)
  .then(generateHTML)
  .then(searchFilter)
  .catch(err => {
    gallery.innerHTML = '<h3>Something went wrong...</h3>';
    console.error(err);
  });
