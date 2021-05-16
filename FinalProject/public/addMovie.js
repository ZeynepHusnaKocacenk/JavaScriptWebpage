function submit(){
    const title = document.getElementById('title').value
    const year = document.getElementById('year').value
    const runtime = document.getElementById('runtime').value
    const actors = document.getElementById('actors').value
    const director = document.getElementById('director').value
    const writer = document.getElementById('writer').value

    const requestBody = {
      Title: title,
      Year: year,
      Runtime: runtime,
      Actors: actors,
      Director: director,
      Writer: writer,
    };

    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 201) {
          alert("added movie!")
          window.location = "/movies";
        }else if (this.readyState === 4 && this.status === 400){
         console.log("error, could not add movie")
         alert("You are not logged in. Please Log in!");
        }
    }
  xhttp.open('POST', "/movies", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(requestBody))
}
