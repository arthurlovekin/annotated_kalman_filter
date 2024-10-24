function trueStateModel(prev_x, dt, throttle, wheelRadius=50, maxVelocity=400, maxAngularAcceleration=10) {
    // x = nonlinear_F(x) + nonlinear_B(u) + non-gaussian noise
    function nonlinear_F(x, dt) {
        const F = [[1, dt], [0, 1]];
        const Fx = matMul(F, x);
        return Fx;
    }
    function nonlinear_B(u, dt) {
        const a = [[u]];
        const B = [[wheelRadius*maxAngularAcceleration*dt*dt*0.5], 
                    [wheelRadius*maxAngularAcceleration*dt]];
        const Bu = matMul(B, a);
        return Bu;
    }

    const noise = [[0], [(Math.random()-0.5) * 0.1]];

    const new_x = matSum(nonlinear_F(prev_x, dt), nonlinear_B(throttle, dt), noise);
    if(new_x[1][0] > maxVelocity) {
        new_x[1][0] = maxVelocity;
    }
    if(new_x[1][0] < -maxVelocity) {
        new_x[1][0] = -maxVelocity;
    }
    return new_x;
}

function trueMeasurementModel(x) {
    // z = nonlinear_H(x) + non-gaussian noise
    const noise = (Math.random()-0.5) * 0.1;
    const z = [[x[0][0] + noise]];
    return z;
}

function KalmanPredictStep(prev_x, prev_P, F, B, u, Q) {
    // x = Fx + Bu
    // P = FPF^T + Q
    const new_x = matSum(matMul(F, prev_x), matMul(B, u));
    const new_P = matSum(matMul(matMul(F, prev_P), matTranspose(F)), Q);

    return [new_x, new_P];
}

function KalmanUpdateStep(prev_x, prev_P, H, z, R) {
    // K = PH^T(HPH^T + R)^-1
    // x = x + K(z - Hx)
    // P = (I - KH)P(I - KH)^T + KRK^T
    const K_numerator = matMul(prev_P, matTranspose(H));
    const K_denominator = matSum(matMul(matMul(H, prev_P), matTranspose(H)), R);
    // since the denominator is a scalar in this example, we do scalar division instead of inverse
    let K = K_numerator;
    for (let i = 0; i < K.length; i++) {
        for (let j = 0; j < K[0].length; j++) {
            K[i][j] /= K_denominator[0][0];
        }
    }
    const new_x = matSum(prev_x, matMul(K, matSubtract(z, matMul(H, prev_x))));
    
    // Joseph form
    const ImKH = matSubtract([[1, 0], [0, 1]], matMul(K, H));
    const new_P1 = matMul(matMul(ImKH, prev_P), matTranspose(ImKH));
    const new_P2 = matMul(matMul(K, R), matTranspose(K));
    const new_P = matSum(new_P1, new_P2);

    return [new_x, new_P];
}

//// Matrix Functions ////

function matMul(A, B) {
    // Multiply two vectors/matrices, where A is m x n and B is n x p
    // Check if dimensions match for matrix multiplication, and make sure they're 2D
    if (!Array.isArray(A[0]) || !Array.isArray(B[0])) {
        throw new Error("Input must be a 2D array");
    }
    if (A[0].length !== B.length) {
        throw new Error("Matrix dimensions do not match for multiplication. A has " + A[0].length + " columns and B has " + B.length + " rows.");
    }
    const result = Array.from({length: A.length}, () => Array(B[0].length).fill(0));
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B[0].length; j++) {
            for (let k = 0; k < B.length; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

function matSum(...vectors) {
    // Perform element-wise addition of multiple 2D arrays
    // Check if the input is a 2D array
    if (!Array.isArray(vectors[0]) || !Array.isArray(vectors[0][0])) {
        throw new Error("Input must be a 2D array");
    }
    const rows = vectors[0].length;
    const cols = vectors[0][0].length;
    const result = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (const vector of vectors) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[i][j] += Number(vector[i][j]);
            }
        }
    }
    return result;
}

function matSubtract(A, B) {
    // Perform element-wise subtraction of two 2D arrays: A - B
    if (!Array.isArray(A[0]) || !Array.isArray(B[0])
        || A[0].length !== B[0].length || A.length !== B.length) {
        throw new Error("Inputs must be 2D arrays with matching dimensions");
    }
    const result = Array.from(A, (row, i) => row.map((val, j) => val - B[i][j]));
    return result;
}

function matTranspose(A) {
    // Transpose a 2D array
    const result = Array.from(A[0], (_, j) => A.map(row => row[j]));
    return result;
}

