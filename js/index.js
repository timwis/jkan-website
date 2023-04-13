const burgerEl = document.querySelector('[data-hook~="navbar-burger"]')
const navbarMenuEl = document.querySelector('[data-hook~="navbar-menu"]')
if (burgerEl && navbarMenuEl) {
  burgerEl.addEventListener('click', (event) => {
    navbarMenuEl.classList.toggle('is-active')
    event.preventDefault()
  })
}
