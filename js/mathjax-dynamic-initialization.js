MathJax = {
    //Enable macros \class, \cssId, \href, \style
    loader: {load: ['[tex]/html']}, 
    tex: {packages: {'[+]': ['html']}},
    // save custom TexMacros in the MathJax configuration object 
    // (becomes MathJax.config.TexMacros after MathJax is loaded)
    TexMacros: {
        // Note: use two '\'s because this is first intepreted as a javascript strings, where '\' needs to be escaped
        wikipedia: `
        \\def\\state{\\class{state}{\\mathbf{\\bar{x}}}}
        \\def\\stateEstimate{\\class{state-estimate}{\\mathbf{\\hat{x}}}}
        \\def\\trueState{\\class{true-state}{\\mathbf{x}}}
        \\def\\stateTransition{\\class{state-transition}{\\mathbf{F}}}
        \\def\\controlInput{\\class{control-input}{\\mathbf{u}}}
        \\def\\measurement{\\class{measurement}{\\mathbf{z}}}
        \\def\\measurementNoiseCovariance{\\class{measurement-noise-covariance}{\\mathbf{R}}}
        \\def\\measurementMatrix{\\class{measurement-matrix}{\\mathbf{H}}}
        \\def\\stateCovariance{\\class{state-covariance}{\\mathbf{P}}}
        \\def\\processNoiseCovariance{\\class{process-noise-covariance}{\\mathbf{Q}}}
        \\def\\controlMatrix{\\class{control-matrix}{\\mathbf{B}}}
        \\def\\kalmanGain{\\class{kalman-gain}{\\mathbf{K}}}
        \\def\\varianceRatio{\\class{variance-ratio}{\\widetilde{\\mathbf{K}}_{z}}}
        \\def\\varianceRatioState{\\class{variance-ratio-state}{\\widetilde{\\mathbf{K}}_{x}}}
        \\def\\discreteTime{\\class{discrete-time}{n}}
        \\def\\identityMatrix{\\class{identity-matrix}{\\mathbf{I}}}
        \\def\\gaussian{\\class{gaussian-distribution}{\\mathcal{N}}}
        `,
        kalmanfilterdotnet: `
        \\def\\state{\\class{state}{\\mathbf{\\bar{s}}}}
        \\def\\stateEstimate{\\class{state-estimate}{\\mathbf{\\hat{s}}}}
        \\def\\trueState{\\class{true-state}{\\mathbf{s}}}
        \\def\\stateTransition{\\class{state-transition}{\\mathbf{A}}}
        \\def\\controlInput{\\class{control-input}{\\mathbf{u}}}
        \\def\\measurement{\\class{measurement}{\\mathbf{z}}}
        \\def\\measurementNoiseCovariance{\\class{measurement-noise-covariance}{\\mathbf{R}}}
        \\def\\measurementMatrix{\\class{measurement-matrix}{\\mathbf{C}}}
        \\def\\stateCovariance{\\class{state-covariance}{\\mathbf{P}}}
        \\def\\processNoiseCovariance{\\class{process-noise-covariance}{\\mathbf{Q}}}
        \\def\\controlMatrix{\\class{control-matrix}{\\mathbf{B}}}
        \\def\\kalmanGain{\\class{kalman-gain}{\\mathbf{K}}}
        \\def\\varianceRatio{\\class{variance-ratio}{\\widetilde{\\mathbf{K}}_{z}}}
        \\def\\varianceRatioState{\\class{variance-ratio-state}{\\widetilde{\\mathbf{K}}_{x}}}
        \\def\\discreteTime{\\class{discrete-time}{t}}
        \\def\\identityMatrix{\\class{identity-matrix}{\\mathbf{I}}}
        \\def\\gaussian{\\class{gaussian-distribution}{\\mathcal{N}}}
        `
    },
  // Custom function to get the desired set of macros,
  // then have the renderer to go back to the compile step so the new macros get used.
  setMacros(name) {
    if (!MathJax.config.TexMacros.hasOwnProperty(name)) {
      console.warn(`TexMacros for "${name}" not found.`);
      return Promise.resolve();
    }
    
    return MathJax.startup.promise = MathJax.startup.promise.then(() => {
      const {mathjax} = MathJax._.mathjax;
      const {STATE} = MathJax._.core.MathItem;
      MathJax.tex2mml(MathJax.config.TexMacros[name]);
      mathjax.handleRetriesFor(() => MathJax.startup.document.rerender(STATE.COMPILED));
      // Check if mouseEffectsManager exists before initializing
      if (typeof mouseEffectsManager !== 'undefined' && mouseEffectsManager.initialize) {
        mouseEffectsManager.initialize();
      } else {
        console.warn('MathJax setMacros():mouseEffectsManager not found or does not have an initialize method.');
      }
    });
  },
  startup: {
    typeset: false, //disable the initial typesetting pass since setMacros() will do typesetting
    ready() {
      MathJax.startup.defaultReady();
      MathJax.config.setMacros('wikipedia');
      const dropdown = document.getElementById('naming-convention-dropdown');
      if (!dropdown) {
        console.warn('MathJax ready(): No dropdown element found. Not changing from the default.');
        return;
      }
      dropdown.addEventListener('input', (event) => MathJax.config.setMacros(event.target.value));
    }
  }
}