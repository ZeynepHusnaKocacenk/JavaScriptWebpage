function search(){
    const title = document.getElementById('title').value
    const genre = document.getElementById('genre').value
    const actorName = document.getElementById('actorName').value

    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          window.location =`movies?title=${title}&genre=${genre}&actorName=${actorName}`;
        }else if (this.readyState === 4 && this.status === 400){
          alert("Invalid query!")
        }else if (this.readyState === 4 && this.status === 404){
          alert("No movie found.")
        }
    }
  xhttp.open('GET', `/movies?title=${title}&genre=${genre}&actorName=${actorName}`, true)
  xhttp.setRequestHeader('Content-Type', 'application/json')
  xhttp.send()
}


