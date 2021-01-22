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
