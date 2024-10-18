// Holds all of the information (eg. display name, description, etc.) for a variable, 
// piece of formula, or entire formula
class FormulaElement {
    constructor(div_name,
                display_name, 
                description, 
                example, 
                dimension,
                color = 'rgba(255, 255, 0, 0.8)') {
        this.div_name = div_name; // eg. predict-step-state
        this.display_name = display_name; // What IS it? Name + matrix/vector/equation
        this.description = description;  // What does it variable DO?
        this.example = example;
        this.dimension = dimension;
        this.color = color;
    }
}