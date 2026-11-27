const gamemode = document.getElementById("gamemode");
const difficulty = document.getElementById("difficulty");
gamemode.addEventListener("change", function() {
    if (gamemode.value === "person-vs-computer") {
        difficulty.style.display = "block";
    } else {
        difficulty.style.display = "none";
    }
});
