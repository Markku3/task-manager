document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const menuDropdown = document.getElementById('menuDropdown');
    if (!hamburgerBtn || !menuDropdown) return;

    hamburgerBtn.onclick = function(e) {
        menuDropdown.classList.toggle('show');
        e.stopPropagation();
    };
    document.addEventListener('click', function(e) {
        if (!menuDropdown.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            menuDropdown.classList.remove('show');
        }
    });
});