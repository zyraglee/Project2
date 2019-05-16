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
                        msgElement.innerHTML = msgElement.innerHTML + " Login Success! " +
                            "You will be redirected to the Profile Page in 5 seconds " +
                            "or <a href='http://localhost:8080/Profile'>click here</a>";
                        setTimeout(function() {
                            try{
                                window.location.replace("http://localhost:8080/Profile");
                            }
                            catch (e) {
                                window.location ="http://localhost:8080/Profile"
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
