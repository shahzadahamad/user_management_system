const hide = document.getElementById("hide");

setTimeout(() => {
  hide.style.transform = "translate(1rem,1rem)";
  hide.style.opacity = 0;
}, 3000);

$(document).ready(function () {
  $("#userTable").DataTable({});
});
