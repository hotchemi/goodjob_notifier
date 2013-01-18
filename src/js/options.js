function save_options() {
  var select = document.getElementById("interval");
  localStorage.interval_minute = select.children[select.selectedIndex].value;
  window.close();
}

function restore_options() {
  var minute = localStorage.interval_minute,
    select = document.getElementById("interval"),
    i, max, child;

  if (!minute) {
    return;
  }
  for (i = 0, max = select.children.length; i < max; i+=1) {
    child = select.children[i];
    if (child.value === minute) {
      child.selected = "true";
      break;
    }
  }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);