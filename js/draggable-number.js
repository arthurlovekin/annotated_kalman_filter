class DraggableNumber extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isValidChange = () => true; // Default to always valid
        this._value = 0;
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
                    font-size: 1.1em;
                    font-weight: bold;
                    color: #4a4a4f;
                    text-decoration: underline;
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

        this.slider.addEventListener('input', (event) => {
            this.value = parseFloat(event.target.value); // This will trigger the setter
        });

        // Set initial value
        this.value = parseFloat(initialValue);
    }

    setValidityCondition(isValidChangeFunction) {
        if (typeof isValidChangeFunction === 'function') {
            this.isValidChange = isValidChangeFunction;
        }
    }

    get value() {
        return this._value;
    }

    set value(newValue) {
        const clampedValue = Math.max(this.slider.min, Math.min(newValue, this.slider.max));
        if(this.isValidChange(clampedValue)) {
            this._value = clampedValue;
            this.slider.value = clampedValue;
            this.valueDisplay.textContent = clampedValue.toFixed(2);
            this.dispatchEvent(new CustomEvent('change', { detail: { value: clampedValue } }));
        }
    }
}

customElements.define('draggable-number', DraggableNumber);

// TODO: Remove all references to getDraggable
// // Helper function to get DraggableNumber instances
// //First document.getElementById(id) finds the element with the specified id. 
// // Then, .querySelector() finds the first <draggable-number> custom element within that element.
// window.getDraggable = (id) => document.getElementById(id).querySelector('draggable-number');