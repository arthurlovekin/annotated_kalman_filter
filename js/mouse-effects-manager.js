// Manages all of the mouse effects (eg. highlight and tooltip) for all of the formula elements.
// This class makes sure that only the smallest-width element is highlighted (when there is one 
// formulaElement inside of another), and that the only tooltips showing correspond to the 
// currently-highlighted element.
class MouseEffectsManager {
    constructor(formulaElements) {
        this.formulaElements = formulaElements; // Array of FormulaElement instances
        this.tooltips = {}; // Map div_name to all tooltips associated with it
        this.currentlyHovered = []; // sorted smallest-width first (first element is the only one highlighted)
        this.initialize();
    }

    initialize() {
        this.initializeTooltips();
        this.initializeEventListeners();
    }

    initializeTooltips() {
        this.formulaElements.forEach(element => {
            this.tooltips[element.div_name] = tippy(`[class="${element.div_name}"]`, {
                content: `${element.display_name}`,
                trigger: 'manual',
                placement: 'top',
                allowHTML: true,
                // interactive: true, // 
            });
        });
    }

    initializeEventListeners() {
        this.formulaElements.forEach(f_element => {
            const elements = document.querySelectorAll(`[class="${f_element.div_name}"]`);
            elements.forEach(el => {
                el.addEventListener('mouseenter', () => this.addHoveredElement(f_element, el));
                el.addEventListener('mouseleave', () => this.removeHoveredElement(f_element, el));
                el.addEventListener('click', (event) => this.showTooltip(f_element, el, event));
            });
        });
    }

    addHoveredElement(formulaElement, documentElement) {
        this.currentlyHovered.push({formulaElement: formulaElement, documentElement: documentElement});
        this.currentlyHovered.sort((a, b) => a.documentElement.offsetWidth - b.documentElement.offsetWidth);
        this.highlightSmallestElement();
    }

    removeHoveredElement(formulaElement, documentElement) {
        documentElement.style.backgroundColor = '';
        this.currentlyHovered = this.currentlyHovered.filter(el => el.documentElement !== documentElement);
        this.highlightSmallestElement();
    }

    highlightSmallestElement() {
        for (let i = 0; i < this.currentlyHovered.length; i++) {
            const { formulaElement, documentElement } = this.currentlyHovered[i];
            if (i === 0) { // list is sorted so first element has smallest width
                documentElement.style.backgroundColor = formulaElement.color;
                documentElement.style.paddingTop = '3px';
                documentElement.style.paddingBottom = '3px';
                documentElement.style.marginTop = '-3px';
                documentElement.style.marginBottom = '-3px';
                documentElement.style.borderRadius = '3px';
            }
            else {
                documentElement.style.backgroundColor = '';
            }
        }
    }

    showTooltip(formulaElement, documentElement, event) {
        if (event) {
            event.stopPropagation(); // prevent clicks from triggering the tooltips of other formula elements.
        }
        // of the tooltips associated with the formulaElement, find the one corresponding to the clicked element
        const tooltip = this.tooltips[formulaElement.div_name].find(tooltip => tooltip.reference === documentElement);
        if (tooltip) {
            tooltip.show();
        }
    }
}
