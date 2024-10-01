class DraggableNumber extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const min = this.getAttribute('min') || 0;
        const max = this.getAttribute('max') || 10;
        const step = this.getAttribute('step') || 0.01;
        const initialValue = this.getAttribute('value') || 1;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                .draggable-container {
                    position: relative;
                    width: 60px;
                    height: 30px;
                    text-align: center;
                }
                .draggable-txt {
                    font-size: 16px;
                    font-weight: bold;
                    color: #007bff;
                }
                .draggable-slider {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: ew-resize;
                }
            </style>
            <div class="draggable-container">
                <span class="draggable-txt">${initialValue}</span>
                <input type="range" class="draggable-slider" min="${min}" max="${max}" value="${initialValue}" step="${step}">
            </div>
        `;

        this.valueDisplay = this.shadowRoot.querySelector('.draggable-txt');
        this.slider = this.shadowRoot.querySelector('.draggable-slider');

        this.slider.addEventListener('input', this.updateValue.bind(this));
    }

    updateValue() {
        const value = parseFloat(this.slider.value).toFixed(2);
        this.valueDisplay.textContent = value;
        this.dispatchEvent(new CustomEvent('change', { detail: { value: parseFloat(value) } }));
    }

    getValue() {
        return parseFloat(this.valueDisplay.textContent);
    }

    setValue(value) {
        this.slider.value = value;
        this.updateValue();
    }
}

customElements.define('draggable-number', DraggableNumber);