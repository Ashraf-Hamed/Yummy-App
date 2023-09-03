$("#openNavBar").click(() => {
  animateUpNavLinks();
  $("#CloseNavBar").removeClass("d-none");
  $("#openNavBar").addClass("d-none");
  $("nav").animate({ left: "-13px" });
});

$("#CloseNavBar").click(() => {
  animateDownNavLinks();
  $("#CloseNavBar").addClass("d-none");
  $("#openNavBar").removeClass("d-none");
  $("nav").animate({ left: "-230px" });
});

function animateUpNavLinks() {
  for (let i = 0; i < 5; i++) {
    $("nav .container .nav-content .nav-item ul li a")
      .eq(i)
      .animate({ top: 0 }, (i + 5) * 100);
  }
}

function animateDownNavLinks() {
  $("nav .container .nav-content .nav-item ul li a").animate({ top: 300 }, 500);
}

let mainMeals = document.getElementById("mainMeals");
let RowBody = document.getElementById("rowBody");
let detailsMeals = document.getElementById("detailsMeals");
let btnClose = document.getElementById("btnClose");

let searchContainer = document.getElementById("searchContainer");
let ContactSection = document.getElementById("contactSection");

// getMain Meals ==>  Home

async function getdataMeals() {
  $(".loading").removeClass("d-none");
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  const data = await response.json();
  $(".loading").addClass("d-none");
  console.log(data.meals);
  displayDataMainMeals(data.meals);
}

getdataMeals();

function displayDataMainMeals(data) {
  content = "";
  for (let i = 0; i < data.length; i++) {
    content += `
    <div class="meals col-md-3 col-sm-6 mb-3"  data-bs-target="${data[i].idMeal}">
                    
    <div class="meals position-relative overflow-hidden rounded-2 cursor-pointer text-center ">
        <img src="${data[i].strMealThumb}" class="w-100" alt="">
        <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
            <h3>${data[i].strMeal}</h3>
        </div>
    </div>

</div>

    `;
  }

  RowBody.innerHTML = content;

  showDetailsPage();

  CloseDetailsPage();

  getItemID();
}

function showDetailsPage() {
  document.querySelectorAll(".meals").forEach((meal) => {
    meal.addEventListener("click", () => {
      detailsMeals.classList.remove("d-none");
      mainMeals.classList.add("d-none" );
    });
  });
}

function CloseDetailsPage() {
  btnClose.addEventListener("click", () => {
    detailsMeals.classList.add("d-none");
    mainMeals.classList.remove("d-none");
  });
}

function getItemID() {
  document.querySelectorAll(".meals").forEach((mealID) => {
    mealID.addEventListener("click", () => {
      let itemID = mealID.getAttribute("data-bs-target");
      getDetailsMeals(itemID);
    });
  });
}

async function getDetailsMeals(id) {
  $(".loading").removeClass("d-none");
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await response.json();
  $(".loading").addClass("d-none");

  dispalyDetailsMeals(data.meals);
}

function dispalyDetailsMeals(data) {
  let ingred = ``;
  for (let i = 1; i < 7; i++) {
    if (data[`strIngredient${i}`] != "") {
      ingred += `
             <span class = "recipe-style"> ${data[0][`strMeasure${i}`]} ${
        data[0][`strIngredient${i}`]
      }</span>
            `;
    }
  }

  let tagsArr = data[0].strTags?.split(",");
  if (!tagsArr) tagsArr = [];
  let tags = ``;
  for (let i = 0; i < tagsArr.length; i++) {
    tags += `
      <span class="tagsDet">${tagsArr[i]}</span>
      `;
  }

  let details = `
    <div class="col-md-4">
    <img
        src="${data[0].strMealThumb}"
        width="100%"
        class="mb-2 rounded-3"
        alt=""
    />
    <h2 class="text-white">${data[0].strMeal}</h2>
    </div>
    <div class="col-md-8">
    <div class="des-detaialis text-white text-start">
        <h1>Instructions</h1>
        <p>
        ${data[0].strInstructions}
        </p>
        <h2 >Area : ${data[0].strArea}</h2>
        <h3 >Category : ${data[0].strCategory}</h3>
    </div>
    
     <div class="Recipes">
        <h3 class="text-info mb-4">Recipes :</h3>
        ${ingred}
    </div>
    <div class="Tags mb-3">
        <h3 class="text-info mt-3 mb-4">Tags :</h3>
        ${tags}
    </div>


    <div class="buttonsLinks mb-5 ms-2">
        <a href="${data[0].strSource}" class="btn btn-success me-2" target='_blankl'>Source</a>
        <a href="${data[0].strYoutube}" class="btn btn-danger" target='_blankl'>Youtube</a>
    </div>
    </div>

    `;
  document.getElementById("rowBodyDetails").innerHTML = details;
}

// Show InputSearch

function searchInput() {
  searchContainer.classList.remove("d-none");

  searchContainer.innerHTML = `
    <div class="row py-4 ">

         <div class="col-md-6 ">
              <input type="text" placeholder="Search By Name" class="form-control   my-5" id="searchName"  onkeyup="searchByName(this.value)" />
          </div>
        <div class="col-md-6">
          <input type="text" placeholder="Search By First Letter" maxlength="1" class="form-control my-5 "onkeyup="searchByFirstLetter(this.value)"  id="searchFirstLetter" />
        </div>
    
    </div>
      
    `;

  RowBody.innerHTML = "";

  $("nav").animate({ left: "-230px" });
  $("#CloseNavBar").addClass("d-none");
  $("#openNavBar").removeClass("d-none");
}

async function searchByName(name) {
  $(".loading").removeClass("d-none");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  let data = await response.json();
  $(".loading").addClass("d-none");
  data.meals ? displayDataMainMeals(data.meals) : displayDataMainMeals([]);
}

async function searchByFirstLetter(term) {
  $(".loading").removeClass("d-none");

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  const data = await response.json();
  $(".loading").addClass("d-none");

  data.meals ? displayDataMainMeals(data.meals) : displayDataMainMeals([]);
}

// Show Categories

async function getCategories() {
  RowBody.innerHTML = "";
  searchContainer.innerHTML = "";
  $(".loading").removeClass("d-none");
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  const data = await response.json();
  $(".loading").addClass("d-none");

  displayCategory(data.categories);

  $("nav").animate({ left: "-230px" });
  $("#CloseNavBar").addClass("d-none");
  $("#openNavBar").removeClass("d-none");
}

async function getCategoriesMeals(category) {
  RowBody.innerHTML = "";
  $(".loading").removeClass("d-none");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  data = await response.json();
  $(".loading").addClass("d-none");

  displayDataMainMeals(data.meals);
}

function displayCategory(data) {
  let category = "";
  for (let i = 0; i < data.length; i++) {
    category += `
  <div class="meals col-md-3 col-sm-6 mb-3"   data-bs-target="${
    data[i].idMidCategoryeal
  }">
                    
  <div class="meals position-relative cursor-pointer overflow-hidden rounded-2 cursor-pointer text-center " onclick="getCategoriesMeals('${
    data[i].strCategory
  }')" >
      <img src="${data[i].strCategoryThumb}" class="w-100" alt="">
      <div class="meal-layer position-absolute d-flex flex-column align-items-center text-black p-2">
         
          <h3>${data[i].strCategory}</h3>
          <p>${data[i].strCategoryDescription
            .split(" ")
            .slice(0, 20)
            .join(" ")}</p>
      </div>
  </div>

</div>
  `;
  }

  RowBody.innerHTML = category;
}

// show Area

async function getArea() {
  RowBody.innerHTML = "";
  searchContainer.innerHTML = "";
  $(".loading").removeClass("d-none");
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  const data = await response.json();
  $(".loading").addClass("d-none");
  console.log(data.meals);
  displayArea(data.meals);

  $("nav").animate({ left: "-230px" });
  $("#CloseNavBar").addClass("d-none");
  $("#openNavBar").removeClass("d-none");
}

async function getAreaMeals(areaMeals) {
  $(".loading").removeClass("d-none");
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaMeals}`
  );
  const data = await response.json();
  $(".loading").addClass("d-none");
  displayDataMainMeals(data.meals);
}

function displayArea(dataArea) {
  let Area = "";
  for (let i = 0; i < dataArea.length; i++) {
    Area += `
  <div class="col-md-3">
  <div onclick="getAreaMeals('${dataArea[i].strArea}')" class="rounded-2 text-white  text-center cursor-pointer">
          <i class="fa-solid fa-house-laptop fa-4x my-3 "></i>
          <h3>${dataArea[i].strArea}</h3>
  </div>
</div>
  `;
  }

  RowBody.innerHTML = Area;
}

// show ingredients

async function getIngredients() {
  RowBody.innerHTML = "";
  searchContainer.innerHTML = "";
  $(".loading").removeClass("d-none");
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  const data = await response.json();
  $(".loading").addClass("d-none");
  console.log(data.meals);
  displayIngredients(data.meals.slice(0, 20));

  $("nav").animate({ left: "-230px" });
  $("#CloseNavBar").addClass("d-none");
  $("#openNavBar").removeClass("d-none");
}



function displayIngredients(data) {
  let ingredients = "";

  for (let i = 0; i < data.length; i++) {
    ingredients += `
    <div class="col-md-3">
                <div onclick="getIngredientsMeals('${data[i].strIngredient}')"  class="rounded-2 text-center cursor-pointer text-white">
                        <i class="fa-solid fa-drumstick-bite fa-3x my-3"></i>
                        <h3 class = "fs-4">${data[i].strIngredient}</h3>
                        <p >${data[i].strDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                       
                </div>
        </div>
    `;
  }

  RowBody.innerHTML = ingredients;
}



async function getIngredientsMeals(ingredient) {
  
  RowBody.innerHTML = ""
  $(".loading").removeClass("d-none");
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
  const data = await response.json() ;
  $(".loading").addClass("d-none");
 
  displayDataMainMeals(data.meals);
}



// Contact 


let usernameInput = document.getElementById('nameInput')
let useremailInput = document.getElementById('emailInput')
let userPhoneInput = document.getElementById('phoneInput')
let userAgeInput = document.getElementById('ageInput')
let userPasswordInput = document.getElementById('passwordInput')
let userRePasswordInput = document.getElementById('repasswordInput')
let submitBtn = document.getElementById('submitBtn') 


submitBtn.addEventListener('click',()=> {

  document.location.reload()
})

function ShowContact() {

  $('#mainMeals').addClass('d-none');
  $('#contactSection').removeClass('d-none');

  $("nav").animate({ left: "-230px" });
  $("#CloseNavBar").addClass("d-none");
  $("#openNavBar").removeClass("d-none");
}






function vaildName() {
  let reg=/^[A-Z][a-z]{2,7}( )?([A-za-z]{3,7})?$/
  if (reg.test(usernameInput.value)==true) {
      document.getElementById("nameAlert").classList.replace("d-block","d-none")
     return true
  }
  else{
      document.getElementById("nameAlert").classList.replace("d-none","d-block")
      return false
  }
 
}
function vaildEmail() {

 let regx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

 if (regx.test(useremailInput.value)==true) {
  document.getElementById("emailAlert").classList.replace("d-block","d-none")
 return true
}
else{
  document.getElementById("emailAlert").classList.replace("d-none","d-block")
  return false
}
 
}
function vaildPhone() {
  let regx = /^(010|011|012|015)[0-9]{8}$/
  if (regx.test(userPhoneInput.value)==true) {
    document.getElementById("phoneAlert").classList.replace("d-block","d-none")
   return true
}
else{
    document.getElementById("phoneAlert").classList.replace("d-none","d-block")
    return false
}
}
function vaildAge() {
  let regx = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/
  if (regx.test(userAgeInput.value)==true) {
    document.getElementById("ageAlert").classList.replace("d-block","d-none")
   return true
}
else{
    document.getElementById("ageAlert").classList.replace("d-none","d-block")
    return false
}
  
}
function vaildPassword() {
  let regx =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/
  if (regx.test(userPasswordInput.value)==true) {
    document.getElementById("passwordAlert").classList.replace("d-block","d-none")
   return true
}
else{
    document.getElementById("passwordAlert").classList.replace("d-none","d-block")
    return false
}
  
}
function vaildRePassword() {
  let regx =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/
  if (regx.test(userRePasswordInput.value)==true &&(document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value)==true) {
    document.getElementById("repasswordAlert").classList.replace("d-block","d-none")
   return true
}
else{
    document.getElementById("repasswordAlert").classList.replace("d-none","d-block")
    return false
}
  
}


userRePasswordInput.addEventListener('keyup' , inputVaild)
// check input Validation

function inputVaild() {
  if(vaildName() == true && vaildEmail() == true && vaildAge() == true  && vaildPhone() == true && vaildPassword() == true && vaildRePassword() == true) {
    submitBtn.removeAttribute("disabled");
  }
  else {
    submitBtn.setAttribute("disabled" , true);
  }
}

