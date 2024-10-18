function linspace(start, end, num=100) {
    const step = (end - start) / (num - 1);
    return Array.from({length: num}, (_, i) => start + i * step);
}

// Get the x and y points for a univariate Gaussian (handles the case where variance is 0)
function univariateGaussianXYpts(mean, variance, xAbsMin=-4, xAbsMax=4, yAbsMax=1.5, numPts=80) {
    const stddev = Math.sqrt(variance);
    const xmin = Math.max(xAbsMin, mean - 3 * stddev);
    const xmax = Math.min(xAbsMax, mean + 3 * stddev);
    let xPts;
    let yPts;
    if (variance <= 0) {
        xPts = [mean, mean];
        yPts = [0, yAbsMax];
    }
    else {
        xPts = linspace(xmin, xmax, numPts);
        yPts = Array.from(xPts, (x) => Math.exp(-0.5 * ((x - mean) / stddev)**2) / (stddev * Math.sqrt(2 * Math.PI)));;
    }
    return [xPts, yPts];
}

//// Multivariate Gaussian Functions ////

function matMul(A, B) {
    // Multiply two vectors/matrices, where A is m x n and B is n x p
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

function eigenvalues2x2(matrix) {
    // Fun fact: if you derive the eigenvalues of a general 2x2 matrix,
    // you can write it in terms of the trace and determinant
    const trace = matrix[0][0] + matrix[1][1];
    const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    if (trace**2 - 4*det < 0) {
        throw new Error("Matrix is not positive semi-definite");
    }
    const val1 = (trace + Math.sqrt(trace**2 - 4*det)) / 2;
    const val2 = (trace - Math.sqrt(trace**2 - 4*det)) / 2;

    return [val1, val2]; // not sorted
}

function isPositiveSemiDefinite(matrix) {
    const eig = eigenvalues2x2(matrix);
    return eig[0] >= 0 && eig[1] >= 0;
}

function bivariateGaussianEllipseParams(matrix) {
    const eigs = eigenvalues2x2(matrix);
    const a = Math.sqrt(eigs[0]);
    const b = Math.sqrt(eigs[1]);

    // theta is the angle between [1,0] and the eigenvector that is furthest from [1,0] 
    // Can't simply use the eigenvector with the greatest eigenvalue because that would
    // cause the ellipse to jump 90 degrees as you move sigma_xx from being 
    // more than sigma_yy to less than sigma_yy
    let theta;
    if (Math.abs(matrix[0][1]) < Number.EPSILON) {
        // Don't pass a denominator of 0 to atan2
        if (matrix[0][0] >= matrix[1][1]) {
            theta = 0;
        }
        else {
            theta = Math.PI/2;
        }
    }
    else {
        theta = Math.max(Math.atan2(eigs[0] - matrix[0][0], matrix[1][0]),
                            Math.atan2(eigs[1] - matrix[0][0], matrix[1][0]));
    }

    return [a, b, theta];
}

function bivariateGaussianEllipseXYpts(mu, sigma, scale=1, numPts = 100) {
    if (!isPositiveSemiDefinite(sigma)) {
        throw new Error("Invalid covariance matrix: eigenvalues must be non-negative to be positive semi-definite");
    }
    const [a, b, theta] = bivariateGaussianEllipseParams(sigma);
    const t = linspace(0, 2 * Math.PI, numPts);
    
    const ellipseX = t.map(angle => 
        mu[0] + scale * a * Math.cos(angle) * Math.cos(theta) - scale * b * Math.sin(angle) * Math.sin(theta)
    );
    const ellipseY = t.map(angle => 
        mu[1] + scale * a * Math.cos(angle) * Math.sin(theta) + scale * b * Math.sin(angle) * Math.cos(theta)
    );

    return [ellipseX, ellipseY];
}

function getContourColors(color_str) {
    if (color_str === 'blue') {
        return [
            'rgb(0, 0, 255)',      // Darkest blue
            'rgb(51, 102, 255)',
            'rgb(102, 153, 255)',
            'rgb(153, 204, 255)',
            'rgb(204, 229, 255)'   // Lightest blue
        ];
    }
    else if (color_str === 'red') {
        return [
            'rgb(255, 0, 0)',
            'rgb(255, 51, 51)',
            'rgb(255, 102, 102)',
            'rgb(255, 153, 153)',
            'rgb(255, 204, 204)'
        ];
    }
    else {
        return [
            'rgb(0, 255, 0)',
            'rgb(51, 255, 51)',
            'rgb(102, 255, 102)',
            'rgb(153, 255, 153)',
            'rgb(204, 255, 204)'
        ];
    }
}

function generateGaussianEllipticalContours(mu, sigma, color='blue', name='') {
    const scales = [1,1.514987,2,2.48509,3];
    const shades = getContourColors(color);

    // Convert mu from 2D to 1D array if necessary
    if (Array.isArray(mu[0])) {
        mu = mu.map(item => item[0]);
    }

    let traces = [];
    for (let i = scales.length - 1; i >= 0; i--) { // go backward so dark will be on top when the distribution is a line
        const scale = scales[i];
        const [ellipseX, ellipseY] = bivariateGaussianEllipseXYpts(mu, sigma, scale, numPts=80);
        const confidence_interval = 1-Math.exp(-1/2*scale**2);
        const description = `${scale.toFixed(2)}σ: ${(confidence_interval*100).toFixed(2)}%`;
        let trace = {
            x: ellipseX,
            y: ellipseY,
            type: 'scatter',
            mode: 'lines',
            line: { color: shades[i] },
            hovertemplate: description,
            showlegend: false
        }
        if (i == 0) { // darkest color
            trace.name = name;
            trace.showlegend = true;
        }
        traces.push(trace);
    }
    return traces;
}

function generateGaussianLinearContours(mu_0, sigma_00, color='blue', name='') {
    // For the scenario of H^(-1)z, the matrix is not fully defined since H is not invertible
    // However we can draw straight lines representing the dimension that we can speak to
    const scales = [0,0.5,1,1.5,2];
    const shades = getContourColors(color);

    // Assume the lines are vertical (measurement gives you position, not velocity)
    // Generate one dashed vertical line at mu_0 and each of mu_0 +/- scale*sigma_00
    let traces = [
        {
            x: [mu_0, mu_0],
            y: [-10, 10],
            type: 'scatter',
            mode: 'lines',
            line: { color: shades[0] },
            showlegend: true,
            name: name
        }
    ];

    for (let i = 1; i < scales.length; i++) {
        const scale = scales[i];
        const confidence_interval = 1-Math.exp(-1/2*scale**2);
        const description = `${scale.toFixed(2)}σ: ${(confidence_interval*100).toFixed(2)}%`;
        const stddev = Math.sqrt(sigma_00);
        const Xpts = [mu_0 - scale * stddev, 
                       mu_0 + scale * stddev];
        const lineY = [-10, 10];
        for( const pt of Xpts ) {
            traces.push({
                x: [pt, pt],
                y: lineY,
                type: 'scatter',
                mode: 'lines',
                line: { color: shades[i] },
                hovertemplate: description,
                showlegend: false,
            });
        }
    }
    return traces;
}