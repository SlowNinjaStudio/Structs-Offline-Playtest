import {EVENTS} from "../../modules/Constants.js";

export class UICancelAction {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
  }

  initListeners() {
    document.getElementById('cancelActionBtn').addEventListener('click', function() {
      this.state.action = null;
      window.dispatchEvent(new CustomEvent(EVENTS.RENDER.RENDER_GAME));
    }.bind(this));
  }

  render() {
    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(document.getElementById(this.state.offcanvasTopId));

    if (this.state.action) {
      document.getElementById(this.state.offcanvasTopId).innerHTML = `
        <div class="offcanvas-body small">
          <div class="container-fluid">
              <div class="row">
                  <div class="col text-center">
                    <div class="d-grid">
                      <a id="cancelActionBtn" href="javascript: void(0);" class="btn btn-danger">Cancel</a>
                    </div>
                  </div>
              </div>
          </div>
        </div>
      `;

      this.initListeners();

      bsOffcanvas.show();
    } else {
      document.getElementById(this.state.offcanvasTopId).innerHTML = '';
      bsOffcanvas.hide();
    }
  }
}
