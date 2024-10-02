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
                    width: 6ch; /* Approximates the width of "10.00" */
                    height: 1.5em;
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
        
        // Set initial value
        this.value = parseFloat(initialValue);
    }

    updateValue() {
        this.value = parseFloat(this.slider.value);
        this.valueDisplay.textContent = this.value.toFixed(2);
        this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value } }));
    }

    get value() {
        return parseFloat(this.slider.value);
    }

    set value(newValue) {
        const min = parseFloat(this.slider.min);
        const max = parseFloat(this.slider.max);
        const v = Math.min(Math.max(parseFloat(newValue), min), max);
        if (this.valueDisplay) {
            this.valueDisplay.textContent = v.toFixed(2);
        }
        if (this.slider) {
            this.slider.value = v;
        }
    }
}

customElements.define('draggable-number', DraggableNumber);

// Helper function to get DraggableNumber instances
window.getDraggable = (id) => document.getElementById(id).querySelector('draggable-number');