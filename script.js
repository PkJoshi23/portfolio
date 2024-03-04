

const resumeHeading = document.querySelector(".resume-heading");
const resumeTabs = document.querySelectorAll(".resume-tab");

resumeHeading.onclick = (event) => {
  event.preventDefault();
  const clickedItemId = event.target.dataset.id;
  if (clickedItemId) {
    resumeHeading.querySelector(".active").classList.remove("active");
    event.target.classList.add("active");

    resumeTabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    const correspondingTab = document.getElementById(clickedItemId);
    correspondingTab.classList.add("active");
  }
};

const allFilterItems = document.querySelectorAll(".projects__card");
const allFilterBtns = document.querySelectorAll(".project-filter-buttons .btn");

window.addEventListener('DOMContentLoaded', () => {
  // Add 'active' class to the first filter button by default
  allFilterBtns[0].classList.add('active');
});

allFilterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    resetActiveBtn(); // Remove 'active' class from all filter buttons
    btn.classList.add('active'); // Add 'active' class to the clicked button
    
    const filterCategory = btn.dataset.category; // Get the category from the button's data-category attribute

    // Show or hide project cards based on the category
    allFilterItems.forEach((item) => {
      if (filterCategory === "all" || item.classList.contains(filterCategory)) {
        item.style.display = "block"; // Show the item
      } else {
        item.style.display = "none"; // Hide the item
      }
    });
  });
});

function resetActiveBtn() {
  allFilterBtns.forEach((btn) => {
    btn.classList.remove('active');
  });
}


const sr = ScrollReveal({
  origin:'top',
  distance:'60px',
  duration:2500,
  delay:400,
  // reset:true,
})

// sr.reveal(`.section__title-1`,{origin:'left'});
// sr.reveal(`.projects__card`,{interval:100});