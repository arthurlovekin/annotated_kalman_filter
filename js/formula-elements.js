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

const variables = {
    state: new FormulaElement("state", 
        "State Vector",
        "Represents the estimated state of the system", 
        "The position and velocity of a robot", 
        '(state_dim,)',
        'rgba(0, 255, 0, 0.8)'
    ),
    state_transition: new FormulaElement("state-transition", 
        "State Transition Matrix", 
        "Transforms the current state estimate to the next state estimate", 
        "The dynamics of the robot system, expressed in matrix form. Each state depends on the pwhere each ",
        '(state_dim, state_dim)',
        'rgba(255, 0, 0, 0.8)'
    ),
    control_input: new FormulaElement("control-input", 
        "Control Input Vector",
        "Contains the user-supplied input to the system", 
        "A throttle input from [0,1] for the robot",
        '(control_dim,)',
        'rgba(0, 0, 255, 0.8)'
    ),
    control_matrix: new FormulaElement("control-matrix", 
        "Control Matrix", 
        "Transforms the control input to the space of the state", 
        "Describes how the robot's velocity changes in response to a throttle command",
        '(state_dim, control_dim)',
        'rgba(0, 0, 255, 0.8)'
    ),
    process_noise_covariance: new FormulaElement("process-noise-covariance", 
        "Process Noise Covariance Matrix", 
        "Describes the amount of uncertainty in the dynamical model of the system", 
        "Uncertainty in the robot's dynamics as a result of things like friction, uneven terrain, etc.",
        '(state_dim, state_dim)',
        'rgba(0, 0, 255, 0.8)'
    ),
    state_covariance: new FormulaElement("state-covariance", 
        "State Covariance Matrix", 
        "Describes the amount of uncertainty in the state estimate", 
        "The uncertainty in the state estimate",
        '(state_dim, state_dim)',
        'rgba(0, 0, 255, 0.8)'
    ),
    measurement: new FormulaElement("measurement",
        "Measurement Vector",
        "The observed sensor measurement",
        "The position of a robot as measured by an ultrasonic sensor",
        '(measurement_dim,)',
        'rgba(0, 255, 255, 0.8)'
    ),
    measurement_noise_covariance: new FormulaElement("measurement-noise-covariance",
        "Measurement Noise Covariance Matrix",
        "Describes the amount of uncertainty in the measurement", // TODO: make this more precise
        "The uncertainty in the measurement",
        '(measurement_dim, measurement_dim)',
        'rgba(0, 255, 255, 0.8)'
    ),
    measurement_matrix: new FormulaElement("measurement-matrix", 
        "Measurement Matrix", 
        "Converts vectors from the space of states to the space of measurements", 
        "The matrix that converts the state to the measurement",
        '(measurement_dim, state_dim)',
        'rgba(0, 0, 255, 0.8)'
    ),
    discrete_time: new FormulaElement("discrete-time", 
        "Discrete Time",
        "Indicates a discrete moment in time", 
        "The time step of the system",
        '(1,)',
        'rgba(255, 255, 0, 0.8)'
    ),
    kalman_gain: new FormulaElement("kalman-gain",
        "Kalman Gain",
        "The gain that transforms the measurement space to the state space",
        "The gain that transforms the measurement space to the state space",
        '(state_dim, measurement_dim)',
        'rgba(0, 100, 100, 0.8)'
    ),
    variance_ratio: new FormulaElement("variance-ratio",
        "Variance Ratio",
        "The ratio of the variance of the state to the total variance in the measurement space",
        "The ratio of the variance of the measurement to the variance of the state",
        '(measurement_dim, measurement_dim)',
        'rgba(0, 100, 100, 0.8)'
    ),
}
