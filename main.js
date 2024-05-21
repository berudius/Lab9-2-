
"use strict"


let allGeneratedUsers = [];

async function getRandomUsers() {
const apiURL = 'https://randomuser.me/api/?results=16';
try {
    let response = await fetch(apiURL);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    let data = await response.json();
    let users = data.results;
    allGeneratedUsers.push(...users);
    console.log(allGeneratedUsers);
    console.log(users);
    return users;
} catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
}
}

async function displayUsers(hasArrayAllUsers = false, filteredUsers = []) {
const userContent = document.querySelector('.content');

try {
    const users = hasArrayAllUsers ? filteredUsers : await getRandomUsers();
    users.forEach(user => {
        const userContainer = document.createElement('div');
        userContainer.classList.add('user-container');

        const userImage = document.createElement('img');
        userImage.classList.add('user-image');
        userImage.src = user.picture.large;
        userContainer.appendChild(userImage);

        const userInfo = document.createElement('div');
        userInfo.classList.add('user-info');

        const visibleInfo = document.createElement('div');
        visibleInfo.innerHTML = `
            <span>${user.name.first} ${user.name.last}</span>
            <span>Age: ${user.dob.age}</span>
            <span>City: ${user.location.city}</span>
        `;
        userInfo.appendChild(visibleInfo);

        userContainer.appendChild(userInfo);

        const hiddenInfo = document.createElement('div'); // Створення .hidden-info
        hiddenInfo.classList.add('hidden-info');
        hiddenInfo.innerHTML = `
            <span>Email: ${user.email}</span>
            <span>Mobile: ${user.cell}</span><br>
            <span>Gender: ${user.gender}</span> <br>
            <span>Registered: ${user.registered.date.substring(0, 10)}</span>
        `;


        userContainer.addEventListener("mouseover", function (event) {
            const hiddenInfo = event.currentTarget.nextElementSibling;
            const userContainerRect = event.currentTarget.getBoundingClientRect();
            // Отримання розмірів вікна
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            // Визначення положення hiddenInfo відносно вікна
            const leftPosition = userContainerRect.left + window.pageXOffset;
            const topPosition = userContainerRect.bottom + window.pageYOffset;
            // Встановлення стилів для відображення hiddenInfo
            hiddenInfo.style.top = `${topPosition }px`; // Додатковий відступ від userContainer
            hiddenInfo.style.left = `${leftPosition}px`;
            hiddenInfo.classList.add("show");
        });

        userContainer.addEventListener("mouseleave", function (event) {
            event.currentTarget.nextElementSibling.classList.remove("show");
        });

        hiddenInfo.addEventListener("mouseover", function (event) {
            event.currentTarget.classList.add("show");
        });
        hiddenInfo.addEventListener("mouseleave", function (event) {
            event.currentTarget.classList.remove("show");
        });

        userContent.appendChild(userContainer);
        userContent.appendChild(hiddenInfo);
    });
} catch (error) {
    console.error('There has been a problem with fetching and displaying users:', error);
}
}




function clearInnerHTML(blockElement){
    blockElement.innerHTML = ``;
  // document.querySelector(".content").innerHTML = "";
}




async function scrollEvent (event) {
    const container = event.currentTarget;
   if ((container.scrollHeight - container.scrollTop) -40 <= container.clientHeight) {
       setTimeout( ()=>{
           console.log("scrolled");
           getRandomUsers();// adding new users to global storage
           mainFilter();//filter all user
       }, 1000);
   }
}
function setScrollEventForUserContainer(){
    document.querySelector('.users-container').addEventListener('scroll', scrollEvent);
}

// function setEventForFilterButton(){
//     document.getElementById("filter-button").addEventListener("click", ()=>{
//         filterUsersByAge(allGeneratedUsers);
//     });
// }


function addAllCitiesList(allGeneratedUsers){
    const removeCityCheckbox = document.getElementById("removeCityCheckbox");
    const citySubblock = document.getElementById("citySubblock");
    citySubblock.classList.toggle("hide");
    clearInnerHTML(citySubblock);


    if(removeCityCheckbox.checked){
        const cities = allGeneratedUsers.map(user => user.location.city);
        const uniqueCities = cities.filter((city, index) => cities.indexOf(city) === index).sort((city1, city2) => city1.localeCompare(city2));
        console.log("uniqueCities");
        console.log(uniqueCities);
        uniqueCities.forEach(city => {
            let label = document.createElement("label");
            label.innerHTML = `<input type="checkbox" value="${city}" /> ${city} `;
            citySubblock.append(label);
        });
    }

}

//add black list
function addEmailToAvoid(){

    const emailSubblock = document.getElementById("emailSubblock");
    const enteredEmail = document.getElementById("removeEmailInput").value;
    const emailSpans = document.querySelectorAll(".email-span");
    let enteredEmailAlreadyExists = false;
    emailSpans.forEach(email => {
        if(email.textContent == enteredEmail){
            enteredEmailAlreadyExists = true;
        }
    });

    if( ! enteredEmailAlreadyExists){
        emailSubblock.innerHTML += `
        <li class="email-list-item">
          <span class="email-span">${enteredEmail}</span>
          <i class="fas fa-times remove-icon" onclick="removeEmailToAvoid(event)" ></i>
        </li>`;
    }        

}

function removeEmailToAvoid(event){
    event.target.closest(".email-list-item").remove();
}


function displayAllCitiesList(){
    addAllCitiesList(allGeneratedUsers);
}



function filterUsersByAge(allGeneratedUsers){
    let usersForFiltering = [...allGeneratedUsers];

    const fromInput = document.getElementById("from");
    const toInput = document.getElementById("to");

    if(fromInput.value < 13 || fromInput.value > 99){
        fromInput.value = 13;
    } 
    if(toInput.value < 14 || toInput.value > 100){
        toInput.value = 100;
    }

    usersForFiltering = usersForFiltering.filter(user => user.dob.age >= fromInput.value && user.dob.age <= toInput.value);

    return usersForFiltering;
}

function filterUsersByGender(users){
    let male = document.getElementById("male");
    let female = document.getElementById("female");

    if(male.checked){
        users = users.filter(user => user.gender == male.value);
    } else if(female.checked){
        users = users.filter(user => user.gender == female.value);
    }
    
    return users;
}

function filterUsersByCity(users){
    const citySubblock = document.getElementById("citySubblock");
    let cityInputs = Array.from(citySubblock.querySelectorAll("input"));

    cityInputs = cityInputs.filter(input => input.checked);
    const cityValues = cityInputs.map(input => input.value);
    users = users.filter(user => !cityValues.includes(user.location.city) );

    return users
}

function filterUsersByEmail(users){
    let emails = [...(document.querySelectorAll(".email-span"))];
    if(emails.length > 0){
        emails = emails.map(emailSpan => emailSpan.textContent);
        users = users.filter(user => !emails.includes(user.email) );
    }

    return users;
}


function sortByName(users){

    users.sort((user1, user2) => {
       let user1FullName = user1.name.first + " " + user1.name.last;
       let user2FullName = user2.name.first + " " + user2.name.last;
       
      return user1FullName.localeCompare(user2FullName);
    } );

    console.log(" Users");
    console.log(users);
}

function mainFilter(){
    const filteredUsers =  filterUsersByEmail(filterUsersByCity(filterUsersByGender(filterUsersByAge(allGeneratedUsers))));
    let userContainer = document.querySelector(".content");
    clearInnerHTML(userContainer);

    displayUsers(true, filteredUsers);
}




function toggleCheckbox(_this) {
   let male = document.getElementById("male");
   let female = document.getElementById("female");


   if(male.id == _this.id){
    female.checked = false;
   }
   else if(female.id == _this.id){
    male.checked = false;
   }

}



displayUsers();
setTimeout(()=>{
    sortByName(allGeneratedUsers);
}, 2000)

// setEventForFilterButton()
setScrollEventForUserContainer();



