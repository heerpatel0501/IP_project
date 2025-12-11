window.onload = function(){

    let fullName = prompt("Enter your Full Name without space :");

    let usernameCorrect = fullName + '@' + fullName.length ; 

    document.getElementById("username").value = usernameCorrect;

    alert("Set Password = HR0507");

    window.usernameCorrect =usernameCorrect; 

}


function login(){
    let userInput = document.getElementById("username").value;
    let passInput = document.getElementById("password").value;

    let passwordCorrect = "HR0507" ; 

    if (userInput === window.usernameCorrect && passInput === passwordCorrect ){
        alert("👍 Login Succesful!");
        window.location.href= "endpage.html";
    }
    else{
        alert("❌ Something went wrong. Try again! ");
    }

}