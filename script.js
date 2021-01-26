document.getElementById("plus").addEventListener("click", plusCalc);
function plusCalc() {
  let plusCounter = document.getElementById("numberItem");
  let currentTotal = document.getElementById("total");
  plusCounter.value++;
  currentTotal.innerHTML = parseInt(currentTotal.innerHTML * plusCounter.value);
}
