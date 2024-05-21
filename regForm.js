"use strict"


window.onload = function() {
  if (localStorage.getItem('isEntered')) {
      window.location.href = `lab9-2/index.html`; // Redirect to main page if registered
  }
};


    function DefineElementsEvents(){
      const form = document.getElementById("form");
      const inputs = document.querySelectorAll("input[type=\"text\"], input[type=\"email\"], input[type=\"password\"], textarea");
      const signUpTab = document.querySelector(".sign-up-tab");
      const signInTab = document.querySelector(".sign-in-tab");
      const signInContainer = document.getElementById("sign-in-container");
      const signUpContainer = document.getElementById("sign-up-container");
      const passwordEyes = document.querySelectorAll(".toggle-icon");
      
      

      document.getElementById('signUpBtn').addEventListener('click', function(event) {
        event.preventDefault();
    
        if (IsAllInputsFilled() && IsAllInputsValid()) {
            const errorTable = document.querySelector(".table-error");
            const succesTable = document.querySelector(".table-success");
            const loader = document.querySelector(".loader");
            const delay = 1500; // ms
    
            let userName = document.querySelector('[name="user_name"]').value;
            let email = document.querySelector('[name="email"]').value;
            let password = document.querySelector('[name="user_pass"]').value;
    
            disableFormElements(form);
            loader.classList.remove("hidden");
    
            GetPromiseObject(delay).then(() => {
                ResetInputs(form);
    
                loader.classList.add("hidden");
                succesTable.classList.toggle("hidden");
                setTimeout(() => {
                    succesTable.classList.toggle("hidden");
                    enableFormElements(form);
    
                   
                    localStorage.setItem('userName', userName);
                    localStorage.setItem('email', email);
                    localStorage.setItem('password', password);
                   
                }, 1500);
            }).catch(() => {
                loader.classList.add("hidden");
                errorTable.classList.toggle("hidden");
                setTimeout(() => {
                    errorTable.classList.toggle("hidden");
                    enableFormElements(form);
                }, 1500);
            });
        } else {
            triggerValidation();
        }
    });
    
    document.getElementById('signInBtn').addEventListener('click', function(event) {
        event.preventDefault();
    
        if (IsAllInputsFilled() && IsAllInputsValid()) {
            let email = document.getElementById('email-in').value;
            let password = document.getElementById('password-in').value;
    
            let storedEmail = localStorage.getItem('email');
            let storedPassword = localStorage.getItem('password');

            const errorTable = document.querySelector(".table-error");
            const succesTable = document.querySelector(".table-success");

            if (email === storedEmail && password === storedPassword) {
              succesTable.classList.remove("hidden");
              setTimeout(() => {
                succesTable.classList.add("hidden");
                 localStorage.setItem('isEntered', 'true');
                 window.location.href = `lab9-2/index.html`;
              }, 1500);
            } else {
              errorTable.classList.remove("hidden");
                setTimeout(() => {
                  errorTable.classList.add("hidden")
                }, 1500);
            }
        } else {
            triggerValidation();
        }
    });
    
    function GetPromiseObject(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let randomState = 1; //Math.round(Math.random() + 1);
                console.log("random state = " + randomState);
                if (randomState == 1) {
                    resolve();
                } else if (randomState == 2) {
                    reject();
                }
            }, ms)
        });
    }
    
    function disableFormElements(form) {
        const formElements = form.elements;
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].disabled = true;
        }
    }
    
    function enableFormElements(form) {
        const formElements = form.elements;
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].disabled = false;
        }
    }
    
    function ResetInputs(form) {
        const formInputs = form.querySelectorAll("input");
        formInputs.forEach(input => {
            input.value = "";
        });
    }
    
    function IsAllInputsFilled() {
        let visibleInputs;
        if (!signInContainer.classList.contains("hidden")) {
            visibleInputs = signInContainer.querySelectorAll('input');
        } else if (!signUpContainer.classList.contains("hidden")) {
            visibleInputs = signUpContainer.querySelectorAll('input');
        }
        for (let i = 0; i < visibleInputs.length; i++) {
            if (visibleInputs[i].value.length === 0) {
                return false;
            }
        }
        return true;
    }
    
    function IsAllInputsValid() {
        let errorMessages;
        if (!signInContainer.classList.contains("hidden")) {
            errorMessages = signInContainer.querySelectorAll('.error-msg');
        } else if (!signUpContainer.classList.contains("hidden")) {
            errorMessages = signUpContainer.querySelectorAll('.error-msg');
        }
        for (let i = 0; i < errorMessages.length; i++) {
            if (errorMessages[i].textContent.length !== 0) {
                return false;
            }
        }
        return true;
    }
    
    function triggerValidation() {
        let visibleInputs;
        if (!signInContainer.classList.contains("hidden")) {
            visibleInputs = signInContainer.querySelectorAll('input');
        } else if (!signUpContainer.classList.contains("hidden")) {
            visibleInputs = signUpContainer.querySelectorAll('input');
        }
        const event = new Event('input');
        visibleInputs.forEach(input => {
            input.dispatchEvent(event);
        });
    }

      inputs.forEach(input =>{
        input.addEventListener("input", function(event){
          GetMessageValidityAllInputs(event);
        });

        input.addEventListener("blur", ()=>{
          let errorMsg = input.closest(".input-container").lastElementChild;

          if(input.validity.valueMissing){
              errorMsg.textContent = "Поле є обов'язковим";
            }
        });
      });

      passwordEyes.forEach(img=>{
        img.addEventListener("click",()=>{
          img.classList.toggle("eye-watch");

          let passwordInput = img.previousElementSibling;
          if(passwordInput.type == "password"){
            passwordInput.type = "text";
          } else if(passwordInput.type == "text"){
            passwordInput.type = "password";
          }

        });
      });

      
      signUpTab.addEventListener("click", ()=>{
        let  buttons = document.querySelectorAll("button");
        buttons[1].classList.add("hidden");
        buttons[0].classList.remove("hidden");
        signUpContainer.classList.remove("hidden");
        signInContainer.classList.add("hidden");
      });
      signInTab.addEventListener("click", ()=>{
        let  buttons = document.querySelectorAll("button");
        buttons[1].classList.remove("hidden");
        buttons[0].classList.add("hidden");
        signInContainer.classList.remove("hidden");
        signUpContainer.classList.add("hidden");
      });

      function GetMessageValidityAllInputs(){
          let errorMsg = event.target.closest(".input-container").lastElementChild;
          
          if (event.target.validity.valid) {


           let passUp = document.getElementById("password-up");
           let confirmPassword = document.getElementById("pass_confirm");
           let errorMsgUp = passUp.closest(".input-container").lastElementChild;
           let errorMsgConfirm = confirmPassword.closest(".input-container").lastElementChild;

            if((event.target.id == "pass_confirm" || event.target.id == "password-up") && !IsPasswordsEqual(confirmPassword.value, passUp.value) ){

              errorMsgUp.textContent = "";
              errorMsgConfirm.textContent = "";
              errorMsg.textContent = "Паролі повинні збігатися";
            }
             else{
              event.target.classList.remove("invalid-input");
              event.target.classList.add("valid-input");
              
              errorMsgUp.textContent = "";
              errorMsgConfirm.textContent = "";
              errorMsg.textContent = "";
            }
           }
          
          else {
            event.target.classList.remove("valid-input");
            event.target.classList.add("invalid-input");
            
            if(event.target.validity.valueMissing){
              errorMsg.textContent = "Поле є обов'язковим";
            }
            else if(event.target.type == "email" && event.target.validity.patternMismatch){
              errorMsg.textContent = `Невірний email-формат. \nEmail повинен відповідати шаблону: ___@__.__ `;
            }
            else if(event.target.type == "password" && event.target.validity.tooShort){
              errorMsg.textContent = "Пароль повинен містити щонайменше 8 символів"
            }
          }
        }

      function IsPasswordsEqual(password, passwordConfirm){

          return password ==  passwordConfirm ? true : false;
        }

    }
  
    





    DefineElementsEvents();
