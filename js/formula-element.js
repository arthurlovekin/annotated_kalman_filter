// Holds all of the information (eg. display name, description, etc.) for a variable, 
// piece of formula, or entire formula
class FormulaElement {
    constructor(div_name,
                display_name, 
                description, 
                example, 
                convention_to_latex,
                dimension,
                color = 'rgba(255, 255, 0, 0.8)',
                child_elements = {}) {
        this.div_name = div_name; // eg. predict-step-state
        this.display_name = display_name; // What IS it? Name + matrix/vector/equation
        this.description = description;  // What does it variable DO?
        this.example = example;
        this.convention_to_latex = convention_to_latex; // eg. alt0 (affects how string is rendered)
        this.convention = Object.keys(convention_to_latex)[0];
        this.dimension = dimension;
        this.color = color;
        this.child_elements = child_elements;
    }

    update_naming_convention(convention) {
        if (this.convention !== 'all') {
            if (this.convention_to_latex.hasOwnProperty(convention)) {
                this.convention = convention;
            }
            else {
                console.log(`Naming convention ${convention} not found for ${this.div_name}`);
            }
        }
        for (const child of Object.values(this.child_elements)) {
            child.update_naming_convention(convention);
        }
    }

    str(delimiter="") {
        const string_fn = this.convention_to_latex[this.convention];
        if (delimiter === "inline") {
            return `\\(\\class{${this.div_name}}{${string_fn(this.child_elements)}}\\)`;
        }
        else {
            return `${delimiter}\\class{${this.div_name}}{${string_fn(this.child_elements)}}${delimiter}`;
        }
    }
}