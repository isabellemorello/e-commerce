$(document).ready(function () {
  $("#navbarDropdown").hover(
    function () {
      $("ul.dropdown-menu", this).addClass("show");
    },
    function () {
      $("ul.dropdown-menu", this).removeClass("show");
    }
  );
});

document.getElementById("minus").addEventListener("click", minus);

function minus() {
  // const minus = document.querySelector("minus");
  alert("Minus");
  // for (let i = 20; i > 1; --i) {
  //   console.log("Clicked");
  // }
}
