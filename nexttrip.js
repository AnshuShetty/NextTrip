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


$(document).ready(function() {
  $('.nav-link').click(function(e) {
    e.preventDefault();
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
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