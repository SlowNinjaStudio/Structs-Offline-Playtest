export class UINavbar {
  render() {
    return `
      <nav class="navbar navbar-dark bg-dark mb-2">
        <div class="container">
          <img class="logo" src="img/logo-horizontal.png" alt="Structs">
        </div>
      </nav>
    `;
  }
  init(id) {
    const navWrapper = document.getElementById(id);
    navWrapper.innerHTML = this.render();
  }
}
