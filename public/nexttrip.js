// sending the input sata from home page to search page
function search() {
  const fromPlace = document.getElementById('from_place').value;
  const toPlace = document.getElementById('to_place').value;

  // Redirect to search.html with the values as parameters
  const queryParams = `?from_place=${encodeURIComponent(fromPlace)}&to_place=${encodeURIComponent(toPlace)}`;
  window.location.href = 'search.html' + queryParams;

}
//typing animation
const text = ", Travel Enthusiast";
const typingText = document.getElementById("typing-text");

let i = 0;

function type() {
  if (i < text.length) {
    typingText.textContent += text.charAt(i);
    i++;
    setTimeout(type, 100);
  }
}

type();


//jquery navbar
$(document).ready(function() {
  $('.nav-link').click(function(e) {
    e.preventDefault();
    $(this).next().toggleClass('show');
  });
});



function setActive(clickedElement) {
  // Remove 'active' class from all nav items
  const navItems = document.querySelectorAll('.nav-link');
  navItems.forEach(item => item.classList.remove('active'));

  // Add 'active' class to the clicked nav item
  clickedElement.classList.add('active');

  // Set the color of the active nav item to white
  clickedElement.style.color = 'white';
}


//query added
function openQueryForm() {
  var modal = document.getElementById("queryModal");
  modal.style.display = "block";
}
function showThankYouBadge() {
  alert('Thank you for your submission!');
}
function closeQueryForm() {
  var modal = document.getElementById("queryModal");
  modal.style.display = "none";
}



// const intro = document.querySelector(".intro");

// let j = 0;

// function type() {
//   if (j < text.length) {
//     intro.textContent += text.charAt(j);
//     j++;
//     setTimeout(type, 100);
//   }
// }

// type();

document.getElementById('query-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const phone = document.getElementById('phone').value;
            if (!name.value || !email.value || !message.value ||  !phone.value) {
                alert('Please fill in all the fields.');
                return;
            }

            // If all fields are filled, you can submit the form data to the server here.
            console.log('Form submitted:', {
                name: name.value,
                email: email.value,
                message: password.value,
                
                contact: phone.value
            });

            // Clear the form fields
            name.value = '';
            email.value = '';
            message.value = '';
           
            phone.value = '';
        });

        function logOut() {
          // Make a request to the server to log out the user
          fetch('http://localhost:4000/logout', {
              method: 'POST', // or 'GET', depending on your backend implementation
              credentials: 'include' // include cookies if using sessions
          })
          .then(response => {
              if (response.ok) {
                  // Clear client-side session storage or cookies if needed
                  sessionStorage.clear(); // If you are using session storage
                  localStorage.clear();   // If you are using local storage
  
                  // Redirect to the login page
                  window.location.href = '/nextrip_login.html'; // Update with the correct login page URL
              } else {
                  alert('Logout failed. Please try again.');
              }
          })
          .catch(error => console.error('Error:', error));
        }