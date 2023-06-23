/*------*/
// Get the modal element
let modal = document.getElementById("welcomeModal");
// Get the <span> element that closes the modal
let closeBtn = document.querySelector(".close");

// Array of image file paths
let imageFilePaths = [
  "images/tips1.jpg",
  "images/tips2.jpg",
  "images/tip7.png",
  "images/tips4.jpg",
  "images/tips5.png",
 

  // Add more image file paths as needed
];

// Open the modal when the page loads
window.addEventListener("load", function () {
  modal.style.display = "block";
  displayRandomImage();
});

// Close the modal when the close button is clicked
closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

// Close the modal when the user clicks outside of it
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Display a random image in the modal
function displayRandomImage() {
  let randomIndex = Math.floor(Math.random() * imageFilePaths.length);
  let randomImagePath = imageFilePaths[randomIndex];
  let imageElement = document.getElementById("subscription-image");
  imageElement.src = randomImagePath;
}

/*------------------------------email subs------------------*/

let existingEmails = ["example1@example.com", "example2@example.com"];
let existingEmailsString = JSON.stringify(existingEmails);

function sendMail() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const validationMessage = document.getElementById("validation-message");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  // Validate name and email
  if (name === "") {
    validationMessage.textContent = "Please enter your name.";
    nameInput.focus();
    return;
  }

  if (email === "") {
    validationMessage.textContent = "Please enter your email.";
    emailInput.focus();
    return;
  }

  // Check for duplicate email
  if (existingEmails.includes(email)) {
    validationMessage.textContent = "Email already exists.";
    validationMessage.classList.add("error-message");

    
    emailInput.focus();
    return;
  }

  // Add the email to the existingEmails array
  existingEmails.push(email);
  existingEmailsString = JSON.stringify(existingEmails);

  // Clear any previous error messages
  validationMessage.textContent = "";

  const params = {
    name: name,
    email: email,
  };

  const serviceID = "service_atxfigc";
  const templateID = "template_qaadqmd";

  emailjs
    .send(serviceID, templateID, params)
    .then(res => {
      nameInput.value = "";
      emailInput.value = "";

      console.log(res);
      // Show success message
      validationMessage.textContent = "Thank you for Subscribing!!";
      validationMessage.classList.add("success-message");
    })
    .catch(err => console.log(err));
}


/*---end---*/

/*---------------------------Randomizer Modal-------------------------*/
let autocomplete;
let interval;
let spinCount = 0;
let showCategoryButton = false;
$(function() {
  window.addEventListener("load", initialize);
  // Add an event listener to the close button or any other element that triggers the modal closing action
  const closeButton = document.getElementById("closeButton");
  if(closeButton!=undefined){
    closeButton.addEventListener("click", closeCategoryRestaurantsModal);
  }
});

function initialize() {
  let input = document.getElementById("autocomplete_search");
  autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["geocode"],
  });

  let searchButton = document.getElementById("search_button");
  searchButton.addEventListener("click", openModal, validateSearch);

  let closeButton = document.getElementById("close_button");
  if(closeButton!=undefined){
    closeButton.addEventListener("click", closeModal);
  }
}
function validateSearch() {
  let place = autocomplete.getPlace();
  let inputElement = document.getElementById("autocomplete_search");

  if (!place || !place.geometry) {
    inputElement.classList.add("invalid");
    inputElement.value = "Please select a valid location*";
  } else {
    inputElement.classList.remove("invalid");
    openModal(); // Call the openModal function only if the input is valid
  }
}

function openModal() {
  let place = autocomplete.getPlace();
  let inputElement = document.getElementById("autocomplete_search");

  

  if (!place || !place.geometry) {
    inputElement.classList.add("invalid"); // Add a CSS class to highlight the input as invalid
    inputElement.value = "Please select a valid location*";
    return;
  } else {
    inputElement.classList.remove("invalid");
  }

  let lat = place.geometry.location.lat();
  let lng = place.geometry.location.lng();

  let modal = document.getElementById("restaurantModal");
  modal.style.display = "block";

  let restaurantList = document.getElementById("restaurantList");
  restaurantList.innerHTML = ""; // Clear the existing restaurant list

  fetchRestaurants(lat, lng)
    .then((restaurants) => displayRestaurantList(restaurants, restaurantList))
    .catch((error) => console.error(error));

  // Reset the spinCount when a new search is performed
  spinCount = 0;

  // Clear any existing interval
  clearInterval(interval);

  let startButton = document.getElementById("start");
  let categoryButton = document.getElementById("categoryButton");
  let messageCard = document.querySelector("#messageCard");

  // Enable the start button and hide the spinner
  startButton.disabled = false;
  $(".spinner").css("display","none");

  if (spinCount === 4) {
    showCategoryButton = true;
  }

  if (spinCount === 5) {
    showLastSpinMessage();
  } else {
    // Hide the message card if it's not the 5th click
    messageCard.style.display = "none";
  }

  if (showCategoryButton) {
    categoryButton.style.display = "block"; // Show the category button
  } else {
    categoryButton.style.display = "none"; // Hide the category button
  }
}


function closeModal() {
  let modal = document.getElementById("restaurantModal");
  modal.style.display = "none";

  let inputElement = document.getElementById("autocomplete_search");
  inputElement.value = ""; // Reset the input value to empty
  inputElement.classList.remove("invalid"); // Clear the validation error

  let searchButton = document.getElementById("search_button");
  searchButton.addEventListener("click", validateSearch);
}

function fetchRestaurants(lat, lng) {
  return new Promise((resolve, reject) => {
    let request = {
      location: new google.maps.LatLng(lat, lng),
      radius: "500",
      type: "restaurant",
    };

    let service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        resolve(results);
      } else {
        reject(
          new Error("Restaurant search request failed with status " + status)
        );
      }
    });
  });
}

function displayRestaurantList(restaurants) {
  let slotMachine = document.getElementById("slotmachine");
  let restaurantList = slotMachine.querySelector("ul");
  restaurantList.innerHTML = "";

  for (let i = 0; i < restaurants.length; i++) {
    let restaurant = restaurants[i];

    let listItem = document.createElement("li");
    listItem.classList.add("randomizer-card", "restaurant-item");
    
    let divWarp = document.createElement("div",{class:"spinner"},'<div class="lds-ripple"><div></div><div></div></div>');
    $(divWarp).addClass("spinner").css("display","none");
    $(divWarp).html('<div class="lds-ripple"><div></div><div></div></div>');
    //divWarp.classList.add("test","test2");
    
    let image = document.createElement("img");
    image.src =
      restaurants[i].photos && restaurants[i].photos.length > 0
        ? restaurants[i].photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })
        : "images/not.png";
    image.alt = "Restaurant Image";
    image.classList.add("randomizer-image", "restaurant-image");

    let detailsDiv = document.createElement("div");
    detailsDiv.classList.add("details", "restaurant-info");

    let name = document.createElement("h3");
    name.textContent = restaurant.name;

    let rating = document.createElement("div");
    rating.classList.add("ratings");
    let starRating = document.createElement("div");
    starRating.classList.add("star-rating");
    let ratingValue = restaurants[i].rating || "N/A";
    for (let j = 0; j < 5; j++) {
      let star = document.createElement("span");
      star.classList.add("star", j < ratingValue ? "filled" : "empty");
      star.innerHTML = "&#9733;";
      starRating.appendChild(star);
    }
    rating.appendChild(starRating);

    let address = document.createElement("p");
    address.textContent = `Address: ${restaurant.vicinity || "N/A"}`;

    let openingHours = document.createElement("p");
    openingHours.textContent = `Opening Hours: ${
      getOpeningHours(restaurant) || "Not Available"
    }`;

    let website = document.createElement("a");
    website.textContent = "Website";
    website.target = "_blank";

    if (restaurant.website) {
      website.href = restaurant.website;
    } else {
      website.href = "#";
      website.style.color = "gray";
      website.textContent = "Website : Not Available";
    }

    detailsDiv.appendChild(name);
    detailsDiv.appendChild(rating);
    detailsDiv.appendChild(address);
    detailsDiv.appendChild(openingHours);
    detailsDiv.appendChild(website);

    listItem.appendChild(image);
    listItem.appendChild(divWarp);
    listItem.appendChild(detailsDiv);
    restaurantList.appendChild(listItem);
  }
}

function getOpeningHours(restaurant) {
  if (restaurant.opening_hours && restaurant.opening_hours.weekday_text) {
    return restaurant.opening_hours.weekday_text.join("\n");
  }
  return null;
}

function startSpinner() {
  let restaurantList = document.querySelectorAll(".randomizer-card");
  let startButton = document.getElementById("start");

  // Filter out the already displayed restaurants
  let availableRestaurants = Array.from(restaurantList).filter(
    (restaurant) => restaurant.style.display !== "block"
  );

  // Check if there are available restaurants and spin count is less than 5
  if (availableRestaurants.length > 0 && spinCount < 5) {
    // Clear any existing interval
    clearInterval(interval);

    let totalSpinCount = 5; // Number of complete spins before stopping
    let currentSpinCount = 0; // Counter for spin count

    interval = setInterval(() => {
      // Hide all restaurant details
      restaurantList.forEach((restaurant) => {
        restaurant.style.display = "none";
      });

      // Generate a random index
      let randomIndex = Math.floor(Math.random() * restaurantList.length);

      // Display the randomly selected restaurant detail
      restaurantList[randomIndex].style.display = "block";

      currentSpinCount++;

      if (currentSpinCount >= totalSpinCount) {
        clearInterval(interval);
        spinCount++;

        // Check if it is the last spin
        if (spinCount === 5) {
          showLastSpinMessage();
        } else {
          startButton.disabled = false;
        }
      }
    }, 200); // Adjust the duration as needed

    startButton.disabled = true;
    $(".spinner").css("display","block");
  }
}

function showLastSpinMessage() {
  let messageCard = document.querySelector("#messageCard");
  let messageText = document.querySelector("#messageText");
  let categoryButton = document.querySelector("#categoryButton");
  let startButton = document.querySelector("#start");
  $(".spinner").css("display","none");

  messageText.textContent = "You have reached the maximum number of spins.";
  categoryButton.style.display = "block"; // Show the category button
  messageCard.style.display = "block";
  startButton.disabled = true;

  // Show the message card only on the 5th click
  if (spinCount === 5) {
    let restaurantList = document.getElementById("restaurantList");
    restaurantList.style.display = "none";
    messageCard.style.display = "block";
  }
}

// Add event listener to the categoryButton
document
  .getElementById("categoryButton")
  .addEventListener("click", function () {
    document.getElementById("category").scrollIntoView({ behavior: "smooth" });

    // Close the modal
    document.querySelector(".modal").style.display = "none";
  });

/* -------------------------------Category-Modal-------------------------*/


let currentPage = 1;
let currentCategory = "";
const pageSize = 10; // Define the page size here

function showCategoryRestaurantsModal(category) {
  const modal = document.getElementById("categoryModal");
  const title = document.getElementById("categoryTitle");
  const restaurantList = document.getElementById("categoryRestaurantList");
  const paginationContainer = document.getElementById("paginationContainer");

  // Update current category
  currentCategory = category;

  // Display the modal
  modal.style.display = "block";

  // Set the category title
  title.textContent = category;
  // Clear previous restaurant list
  restaurantList.innerHTML = "";

  // Create the swiper container element
  const swiperContainer = document.createElement("div");
  swiperContainer.classList.add("swiper-container", "restaurant-swiper");

  // Create the swiper wrapper element
  const swiperWrapper = document.createElement("div");
  swiperWrapper.classList.add("swiper-wrapper");

  // Get user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Create a new Places service object
        const placesService = new google.maps.places.PlacesService(
          document.createElement("div")
        );

        // Define the request parameters for nearby search
        const request = {
          location: new google.maps.LatLng(latitude, longitude),
          radius: 500, // Define the radius for nearby search (in meters)
          type: "restaurant",
          keyword: category,
        };

        // Perform the nearby search
        placesService.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const restaurants = results.map((result) => ({
              name: result.name,
              rating: result.rating,
              address: result.vicinity,
              openingHours: result.opening_hours?.weekday_text || [],
              photo: result.photos?.[0]?.getUrl() || "",
            }));

            const totalResults = results.length;

            // Clear previous restaurant list
            restaurantList.innerHTML = "";

            // Populate the swiper slides
            restaurants.forEach((restaurant) => {
              const swiperSlide = document.createElement("div");
              swiperSlide.classList.add("swiper-slide", "restaurant-slide");

              // Check if the restaurant photo is available
              const restaurantImage =
                restaurant.photo || getDefaultImage(restaurant.category);

              // Create the restaurant details HTML
              const restaurantDetails = `
              <div class="card">
                <img src="${restaurantImage}" alt="${restaurant.name}" class="restaurant-image">
                <div class="restaurant-info">
                  <h3>${restaurant.name}</h3>
                  <div class="star-rating">
                    ${getStarRating(restaurant.rating)}
                  </div>
                  <p>Address: ${restaurant.address}</p>
                  ${restaurant.openingHours.length > 0 ? `<p>Opening Hours:</p>
                  <ul>
                    ${restaurant.openingHours.map((hour) => `<li>${hour}</li>`).join("")}
                  </ul>` : `<p>Opening hours: Not available</p>`}
                </div>
              </div>
            `;

              swiperSlide.innerHTML = restaurantDetails;
              swiperWrapper.appendChild(swiperSlide);
            });


            function getStarRating(rating) {
              const filledStars = Math.floor(rating);
              const remainingStars = 5 - filledStars;
              let starRatingHTML = '';

              // Add filled stars
              for (let i = 0; i < filledStars; i++) {
                starRatingHTML += '<span class="star filled">&#9733;</span>';
              }

              // Add empty stars
              for (let i = 0; i < remainingStars; i++) {
                starRatingHTML += '<span class="star empty">&#9734;</span>';
              }

              return starRatingHTML;
            }

            // Function to get the default image based on category
            function getDefaultImage() {
              return "images/not.png";
            }

            // Append the swiper wrapper to the swiper container
            swiperContainer.appendChild(swiperWrapper);
            // Append the swiper container to the restaurant list element
            restaurantList.appendChild(swiperContainer);

            // Initialize Swiper.js
            new Swiper(".restaurant-swiper", {
              slidesPerView: "auto",
              spaceBetween: 10,
              scrollbar: {
                el: ".swiper-scrollbar",
                hide: true,
              },
            });
            // Generate pagination buttons
            generatePagination(totalResults, pageSize);
          } else {
            console.error("Error fetching nearby restaurants:", status);
          }
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}
function generatePagination(a,b)
{
}
function closeCategoryModal() {
  const modal = document.getElementById("categoryModal");
  modal.style.display = "none";
}

