function ajaxSubmitForm() {
    var usernameElement = document.getElementById("email");
    var passwordElement = document.getElementById("password");

    if (usernameElement && passwordElement) {
        var username = usernameElement.value;
        var password = passwordElement.value;
        console.log("Username: " + username + " Password: " + password);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                var msgElement = document.getElementById("msg");
                if (msgElement) {
                    msgElement.innerHTML = this.responseText;
                    if (this.status === 200) {
                        msgElement.innerHTML = msgElement.innerHTML + " Registration Success! " +
                            "You will be redirected to the Login Page in 5 seconds " +
                            "or <a href='http://localhost:8080/Login'>click here</a>";
                        setTimeout(function() {
                            try{
                                window.location.replace("http://localhost:8080/Login");
                            }
                            catch (e) {
                                window.location ="http://localhost:8080/Login"
                            }
                        }, 5000);
                    }
                }
            }
        };
        xhr.open("POST", window.location.href, true);
        xhr.setRequestHeader("Content-type",
            "application/x-www-form-urlencoded");
        xhr.send("username="+username+"&password="+password);
    }
}
