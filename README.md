This article was written using HTML, CSS, and Javascript, with the MathJax
library to render mathematical text, Plotly.js for plots and tippy.js for
interactive tooltips. I can't say I'd recommend writing articles in raw HTML
like this, but I started writing with the intention of learning web
development and I was determined to finish without delving too far into the
jungle of Webdev libraries and frameworks (in the future I might look into
Static Site Generators (SSGs) like Next.js, a Server-side language like Php, 
or other Javascript frameworks, such as React).

The entirety of the article - text and figures - is contained in index.html.
During development I would make all the figures separately in the "figures"
folder, then copy-paste them into the article. The "js" folder contains some
javascript related to interactive elements (like "draggable-number" and
"mathjax-dynamic-initialization"), while other files (like
"kalman-filter-functions") contain the meat of the code driving the Kalman
Filter. I also made proof-of-concepts for the different interactive elements I
wanted to make, and I have left these in "interaction_examples". Finally, the
"css" folder has most of the styling and "assets" contains images and svg
files.

