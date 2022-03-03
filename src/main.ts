import "./style.css";

class Blackboard {
  constructor(
    public el = document.querySelector<HTMLCanvasElement>("#canvas")!,
    private app = el.getContext("2d")!,
    private width = el.width,
    private height = el.height,
    private btns: HTMLDivElement = document.createElement("div"),
    private bgColor = "#000000",
    private lineColor = "#ffffff"
  ) {
    this.initCanvas();
    this.bindEvents();
    this.draw();
  }

  public clear() {
    const button = document.createElement("button");
    button.innerText = "清屏";
    this.btns.insertAdjacentElement("afterbegin", button);

    button.addEventListener("click", () => {
      this.app.fillStyle = this.bgColor;
      this.app.fillRect(0, 0, this.width, this.height);
    });

    return this;
  }

  public erase() {
    const button = document.createElement("button");
    button.innerText = "橡皮";
    this.btns.insertAdjacentElement("afterbegin", button);

    button.addEventListener("click", () => {
      this.lineColor = this.bgColor;
      this.app.lineWidth = 10;
    });

    return this;
  }
  public draw() {
    const button = document.createElement("button");
    button.innerText = "画笔";
    this.btns.insertAdjacentElement("afterbegin", button);

    button.addEventListener("click", () => {
      this.lineColor = "white";
      this.app.lineWidth = 1;
    });

    return this;
  }

  public short() {
    const button = document.createElement("button");
    button.innerText = "截图";
    this.btns.insertAdjacentElement("afterbegin", button);
    const img = document.createElement("img")
    button.addEventListener("click", () => {
      img.src = this.el.toDataURL('image/jpeg');
      img.classList.add('img-short');
    });
    this.btns.insertAdjacentElement('afterend', img)
    return this;
  }

  public setBgColor(color: string) {
    this.bgColor = color;
    this.app.fillStyle = color;
    this.app.fillRect(0, 0, this.width, this.height);
    return this;
  }

  public setLineColor() {
    const colors = ["#48dbfb", "#f1c40f", "#2ecc71", "#8e44ad", "#ecf0f1"];
    const container = document.createElement("div");
    container.classList.add("color-container");
    colors.forEach((color) => {
      const div = document.createElement("div");
      div.style.cssText = `width: 32px; height: 20px; background: ${color}`;
      container.insertAdjacentElement("beforeend", div);

      div.addEventListener("click", () => {
        this.lineColor = color;
      });
    });
    this.btns.insertAdjacentElement("beforeend", container);
    return this;
  }

  private initCanvas() {
    this.app.fillStyle = this.bgColor;
    this.app.fillRect(0, 0, this.width, this.height);

    this.btns.classList.add("btns");
    this.el.insertAdjacentElement("afterend", this.btns);
  }

  private bindEvents() {
    this.el.addEventListener("mousedown", () => {
      const callback = this.drawLine.bind(this);

      this.app.beginPath();
      this.app.strokeStyle = this.lineColor;
      this.el.addEventListener("mousemove", callback);
      // mouseup的事件移除监听应该放在document上，鼠标移出黑板放开也能生效
      document.addEventListener("mouseup", () => {
        this.el.removeEventListener("mousemove", callback);
      });
    });
  }

  private drawLine(event: MouseEvent) {
    this.app.lineTo(event.offsetX, event.offsetY);
    this.app.stroke();
  }
}

const instance = new Blackboard();

instance.setLineColor().clear().erase().short();
