function addPeople(){
    const name = document.getElementById('name').value

    const requestBody = {
      Name: name,
    };

    console.log(requestBody);

    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 201) {
          alert("added person!")
          window.location = "/contribute";
        }else if (this.readyState === 4 && this.status === 400){
         console.log("error, could not add the person")
         alert("You are not logged in. Please Log in!");
        }else if (this.readyState === 4 && this.status === 401){
          alert("Sorry, you are not a contrubuting user!");

        }
    }
  xhttp.open('POST', "/people", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(requestBody))
}
