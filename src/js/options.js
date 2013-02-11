function save_options() {
  var select_interval = document.getElementById("interval"),
  select_appearance = document.getElementById("appearance");
  localStorage.interval_minute = select_interval.children[select_interval.selectedIndex].value;
  localStorage.appearance_sec = select_appearance.children[select_appearance.selectedIndex].value;
  window.close();
}

function restore_options() {
  var interval_minute = localStorage.interval_minute,
    select_interval = document.getElementById("interval"),
    appearance_sec = localStorage.appearance_sec,
    select_appearance = document.getElementById("appearance");

  if (!interval_minute || !appearance_sec) return;

  restoreSelected(select_interval, interval_minute);
  restoreSelected(select_appearance, appearance_sec);
}

function restoreSelected(select, minute) {
  var i, max, child;
  for (i = 0, max = select.children.length; i < max; i++) {
    child = select.children[i];
    if (child.value === minute) {
      child.selected = "true";
      break;
    }
  }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);