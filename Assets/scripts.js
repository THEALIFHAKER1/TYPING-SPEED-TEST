function countdown() {
    let time = 60;
    let timer = setInterval(function() {
      if (time <= 0) {
        clearInterval(timer);
        document.getElementById("counter").innerHTML = "Time's Up!";
      } else {
        document.getElementById("counter").innerHTML = time;
      }
      time -= 1;
    }, 1000);
  }