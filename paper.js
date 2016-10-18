(function(){
	"use strict";

	var Section = function (id, label, name, parentSection) {
		this.label = label;
		this.name = name;
		this.parentSection = parentSection;
		this.childSections = [];
	};

	addEventListener("DOMContentLoaded", function(){
		var refHash = {},
		f = document.createElement("style");

		f.appendChild(document.createTextNode("\n"));

		(function(){
			var e = document.getElementsByTagName("section"),
			secDict = new Section("0", "0", "root", null),
			dict = null,
			secnum = [], secLabel = "", c, i = 0, iter2 = 0;

			// Walk through all the section elements
			for(i = 0; i < e.length; i += 1){
				// Initialize
				secnum = [0];

				// Set the start point to the section element in interest
				c = e[i];
				while(c){
					if(c.tagName.toLowerCase() === "section"){	// If the element is actually a section element, increment the section number counter.
						secnum[0] += 1;
					}

					if(c.previousElementSibling === null){ // If there is no previous section element, the section element should be the first child section of its parent
						while(c = c.parentElement){
							if(c.tagName.toLowerCase() === "section"){
								secnum.unshift(0);
								break;
							}
						}
					}else{	// If not, recurse to the previous section
						c = c.previousElementSibling;
					}
				}

				// As the section count shoud have been finished, make a text label.
				secLabel = secnum.join(".");

				// Add the section to the section dictionary
				dict = secDict;
				for (iter2 = 0; iter2 < secnum.length; iter2 += 1) {	// Pick up a correct dictionary position
					if (typeof dict.childSections[secnum[iter2] - 1] === typeof undefined) {
						dict.childSections[secnum[iter2] - 1] = new Section("No ID", "No label", "No name", dict);
					}
					dict = dict.childSections[secnum[iter2] - 1];
				}
				dict.label = secLabel;
				dict.name = e[i].getElementsByTagName("h" + (secnum.length + 1).toString()).length > 0 ? e[i].getElementsByTagName("h" + (secnum.length + 1).toString())[0].innerText : "No title";	// Assume that the section title is correctly written in a coresponding header element

				// Add a unique id
				if(e[i].id === ""){
					e[i].id = "sec-" + secLabel.replace(/\./g, "_");
				}

				dict.id = e[i].id;

				// Manage the section label for internal references
				refHash["#" + e[i].id] = secLabel;

				// Add section label using CSS
				f.appendChild(document.createTextNode("#" + e[i].id + " > *:first-child:before { content: \"" + secLabel + " \"; }\n"));
			}

			// Create and append table of contents
			(function () {
				var toc = document.getElementById("toc");

				var curOl = document.createElement("ol");
				var curSec = secDict.childSections[0];

				var newOl = null;
				var newLi = null;
				var newA = null;

				toc.appendChild(curOl);

				while (curSec !== null) {
					newLi = document.createElement("li");
					newLi.id = "toc-li-" + curSec.label.replace(/\./g, "_");

					newA = document.createElement("a");
					newA.href = "#" + curSec.id;
					newA.appendChild(document.createTextNode(curSec.name));
					newLi.appendChild(newA);

					curOl.appendChild(newLi);
					f.appendChild(document.createTextNode("#toc-li-" + curSec.label.replace(/\./g, "_") + ":before { content: \"" + curSec.label + " \"; margin-right: 1em; }\n"));

					if (curSec.childSections.length > 0) {
						newOl = document.createElement("ol");
						curOl.appendChild(newOl);
						curOl = newOl;
						curSec = curSec.childSections[0];
					} else {
						if (curSec.parentSection.childSections.indexOf(curSec) === curSec.parentSection.childSections.length - 1) {

							while (curSec.parentSection !== null) {
								curOl = curOl.parentElement;
								curSec = curSec.parentSection;

								if (curSec.parentSection !== null && curSec.parentSection.childSections.indexOf(curSec) < curSec.parentSection.childSections.length - 1) {
									break;
								}
							}
						}

						if (curSec.parentSection === null) {
							break;
						}
						curSec = curSec.parentSection.childSections[curSec.parentSection.childSections.indexOf(curSec) + 1];
					}
				}
			})();
		})();

		(function(){
			var e = document.getElementsByTagName("figure"),
			figLabel = "", i = 0;

			for(i = 0; i < e.length; i += 1){
				figLabel = (i + 1).toString();

				if(e[i].id === ""){
					e[i].id = "fig-" + figLabel;
				}

				refHash["#" + e[i].id] = figLabel;

				f.appendChild(document.createTextNode("#" + e[i].id + " > figcaption:before { content: \"Figure " + figLabel + ": \"; }\n"));
			}
		})();

		(function(){
			var e = document.getElementsByClassName("eq-mark"),
			eqLabel = "", i = 0;

			for(i = 0; i < e.length; i += 1){
				eqLabel = (i + 1).toString();

				if(e[i].id === ""){
					e[i].id = "eq-" + eqLabel;
				}

				refHash["#" + e[i].id] = "(" + eqLabel + ")";

				if(/(^| )latex( |$)/.test(e[i].className)){
					e[i].appendChild(document.createTextNode(" \\tag{" + eqLabel + "}"));
				}else{
					f.appendChild(document.createTextNode("#" + e[i].id + ":after { float: right; line-height: " + getComputedStyle(e[i], null).height + "; content: \" (" + eqLabel + ")\"; }\n"));
				}
			}
		})();

		(function(){
			var e = document.getElementsByClassName("latex"),

			closure = {
				inline : {
					open : "\\(",
					close : "\\)"
				},
				block : {
					open : "\\[",
					close : "\\]"
				}
			},
			display = "",

			script = document.createElement("script"),

			i = 0;

			for(i = 0; i < e.length; i += 1){
				display = getComputedStyle(e[i], null).display;
				if(closure[display] !== undefined){
					e[i].insertBefore(document.createTextNode(closure[display].open), e[i].firstChild);
					e[i].appendChild(document.createTextNode(closure[display].close));
				}
			}

			script.src = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
			document.documentElement.appendChild(script);
		})();

		(function(){
			var e = document.getElementsByTagName("table"),
			tblLabel = "", i = 0;

			for(i = 0; i < e.length; i += 1){
				tblLabel = (i + 1).toString();

				if(e[i].id === ""){
					e[i].id = "tbl-" + tblLabel;
				}

				refHash["#" + e[i].id] = tblLabel;

				f.appendChild(document.createTextNode("#" + e[i].id + " > caption:before { content: \"Table " + tblLabel + ": \"; }\n"));
			}
		})();

		(function(){
			var l = document.getElementById("refs"),
			li, i = 0;

			if(l !== null){
				li = l.getElementsByTagName("li");

				for(i = 0; i < li.length; i += 1){
					refHash["#" + li[i].id] = "[" + (i + 1).toString() + "]";
				}
			}
		})();

		(function(){
			var r = document.getElementsByClassName("sref"),
			href = "", i = 0;

			for(i = 0; i < r.length; i += 1){
				href = r[i].getAttribute("href");

				if(typeof refHash[href] === typeof ""){
					while(r[i].firstChild){
						r[i].removeChild(r[i].firstChild);
					}

					r[i].innerHTML = refHash[href];
				}
			}
		})();

		document.documentElement.appendChild(f);
	}, false);

	addEventListener("DOMContentLoaded", function(){
		var f = document.createElement("style");

		f.appendChild(document.createTextNode("\n" +
			"body { width: 800px; margin-left: auto; margin-right: auto; text-align: justify; }\n" +
			"body * { line-height: 1.5em; }\n" +
			"#toc ol { list-style-type: none; }\n" +
			"h1, #author { text-align: center; }\n" +
			"h1, h2, h3, h4, h5, h6, #author { font-weight: 900; }\n" +
			"p:not(.p-continuing):not(#author) { text-indent: 1em; }\n" +
			"ol, ul { margin: 0; }\n" +
			"figure { text-align: center; }\n" +
			"figure * { max-width: 90%; }\n" +
			"figcaption { display: block; margin: auto; }\n" +
			"table { margin: auto; border: solid black; border-collapse: collapse; }\n" +
			"th, td { border: solid black; }\n" +
			"th { text-align: center; }\n" +
			"@media print { figure, table { page-break-inside: avoid; } }\n" +
			"a.sref { color: inherit; text-decoration: inherit; }\n"
		));

		document.documentElement.appendChild(f);
	}, false);
})();
