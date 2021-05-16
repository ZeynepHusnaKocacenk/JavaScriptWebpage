let review = "";

function addReview(){
    const score = document.getElementById('score').value
    const review = document.getElementById('review').value

    const requestBody = {
      rating: score,
      review: review,
    };
    console.log(requestBody)
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 201) {
          alert("added review!")
          //window.location = "/movies";
          render();
        }else if (this.readyState === 4 && this.status === 400){
         console.log("error, could not add review")
         alert("Please log in to add a review!");
        }
    }
  xhttp.open('POST', `/movies/:id`, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(requestBody))
}

function render(){
  review+= requestBody
  document.getElementById("reviews").innerHTML = review;

}
