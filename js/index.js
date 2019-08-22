

const randUserUrl = 'https://randomuser.me/api/';
const groupNum = "12"
const randGroupUrl = randUserUrl+`/?nat=au,us,dk,fr,gb&lego&results=${groupNum}`;
const searchContainer = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
  /*Get data from Random User API
  @params {string} url - url for API
    */
async function fetchData(url) {
  try {
    let response = await fetch(url);
    let data = await response.json();
    return data.results;
  } catch (error) {
    console.log('Looks like there was a problem getting data!',error);
  }
}

/*Create user data profile from user data request
  @params {string} url - url for API
    */
async function getRandUsers(url) {
  try {
  let userData = await fetchData(url);
  let profiles = await Promise.all(userData.map( 
    async(person) => {
      let image = person.picture.large;
      let name = `${person.name.first} ${person.name.last}`;
      let email = person.email;
      let location = `${person.location.city}, ${person.location.state}`;
      let phone = person.cell;
      let address = `${person.location.street}, ${person.location.state}, ${person.location.postcode}`;
      let dob = person.dob.date;
      dob = dob.toString().slice(0,10);
      return {
        image,
        name,
        email,
        location,
        phone,
        address,
        dob
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

 /*Match profile names to input
  @params {string} input - input from user
    */
function filterCardNames(input) {
  let names = document.querySelectorAll( '.card-name');
  names.forEach(name => {
    genName = name.innerText.toLowerCase();
    genName.match(input) ? name.parentNode.parentNode.style.display= "block" : name.parentNode.parentNode.style.display="none";
  });
}

/*Filter searches
    */
function searchFilter() {
  let searchInput = document.getElementById('search-input');
  let searchBtn = document.getElementById('search-submit');
  searchInput.addEventListener('keyup', (e) => {
    let nameInput =searchInput.value.toLowerCase();
    filterCardNames(nameInput);
  });
  searchBtn.addEventListener('click', (e)=> {
    let nameInput =searchInput.value.toLowerCase();
    filterNames(nameInput, '.card-name');
  });
}

/*Generate the markup for each profile
  @params {array} data - user data profiles array
    */
function generateHTML(data) {
  searchContainer.innerHTML = `
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
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
      const modalDiv = document.createElement('div');
      modalDiv.className +="modal-container"
      gallery.appendChild(modalDiv);
      modalDiv.innerHTML = `
          <div class="modal" id=${person.dob}>
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
             <div class="modal-info-container">
                              <img class="modal-img" src=${person.image} alt=${person.name}>
                              <h3 id="name" class="modal-name cap">${person.name}</h3>
                              <p class="modal-text">${person.email}</p>
                              <p class="modal-text cap">${person.location}</p>
                              <hr>
                              <p class="modal-text">${person.phone}</p>
                              <p class="modal-text cap">${person.address}</p>
                              <p class="modal-text">Birthday: ${person.dob}</p>
              </div>
             </div>
                      <div class="modal-btn-container">
                          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                          <button type="button" id="modal-next" class="modal-next btn">Next</button>
                      </div>
        `;
        modalDiv.style.display="none";
      });
}

/*Handle modal interaction
    */
function modalHandler() {
  const modals = document.querySelectorAll('.modal-container');
  /*Create an array of names from modal profiles 
    */
  function createModalNameArr() {
    let nameArr = [];
    modals.forEach(modal => {
      const modalName= modal.querySelector('#name').innerText.toLowerCase();
      nameArr.push(modalName);
    });
    return nameArr;
  };
  const modalNameArr = createModalNameArr();

  /*Match to modal profiles to names
  @params {var} findName - name variable to match with modal
    */
   function modalMatch(findName) {
    modals.forEach(modal => {
      const modalName = modal.querySelector('#name').innerText
      findName===modalName ? modal.style.display='block'  : modal.style.display = 'none';
    });
   }

  //add click events to cards and match modal profile
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', e => {
      const currCard = e.currentTarget;
      const currName = currCard.querySelector('.card-name').innerText.toLowerCase();
      modalMatch(currName);
    });
  });
  //add click event to modal close button
  document.querySelectorAll('#modal-close-btn').forEach(closeModalBtn => {
    closeModalBtn.addEventListener('click', e => {
      let modal = e.currentTarget.parentNode.parentNode;
      modal.style.display = 'none';
    })
  })
  //add click event to back button and match previous modal profile
  document.querySelectorAll('#modal-prev').forEach(prevModalBtn => {
    prevModalBtn.addEventListener('click', e => {
      const currCard = e.currentTarget.parentNode.parentNode;
      let currName = currCard.querySelector('#name').innerText.toLowerCase();
      //find the previous name
      let prevName = "";
      for(i =0; i < modalNameArr.length; i++) {
        if(currName===modalNameArr[i]&&i!=0) {
          prevName = modalNameArr[i-1]
        } else if(currName===modalNameArr[i]&&i===0){ 
          prevName = modalNameArr[modalNameArr.length-1];
        }
      }
      //find modal that matches previous name and display
      modalMatch( prevName);
    })
  })
  //add click event to forward button and match next modal profile
  document.querySelectorAll('#modal-next').forEach(nxtModalBtn => {
   nxtModalBtn.addEventListener('click', e => {
      const currCard = e.currentTarget.parentNode.parentNode;
      let currName = currCard.querySelector('#name').innerText.toLowerCase();
      //create an array of names from modal profiles and find the current name
      //find the next name
      let nextName = "";
      for(i =0; i < modalNameArr.length; i++) {
        if(currName===modalNameArr[i]&&i!=0) {
          nextName = modalNameArr[i+1]
        } else if(currName===modalNameArr[i]&&i!=modalNameArr[modalNameArr.length-1]){ 
          nextName = modalNameArr[0];
        }
      }
      //find modal that matches next name and display
      modalMatch(nextName);
    })
  })
}

// ------------------------------------------

getRandUsers(randGroupUrl)
  .then(generateHTML)
  .then(modalHandler)
  .then(searchFilter)
  .catch(err => {
    gallery.innerHTML = '<h3>Something went wrong...</h3>';
    console.error(err);
  });
