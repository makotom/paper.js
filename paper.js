(function(){
	"use strict";

	addEventListener("DOMContentLoaded", function(){
		var refHash = {},
		f = document.createElement("style");

		f.appendChild(document.createTextNode("\n"));

		(function(){
			var e = document.getElementsByTagName("section"),
			secnum = [], secLabel = "", c, i = 0;

			for(i = 0; i < e.length; i += 1){
				secnum = [0];

				c = e[i];
				while(c){
					if(c.tagName.toLowerCase() === "section"){
						secnum[0] += 1;
					}

					if(c.previousElementSibling === null){
						while(c = c.parentElement){
							if(c.tagName.toLowerCase() === "section"){
								secnum.unshift(0);
								break;
							}
						}
					}else{
						c = c.previousElementSibling;
					}
				}

				secLabel = secnum.join(".");

				if(e[i].id === ""){
					e[i].id = "sec-" + secLabel.replace(/\./g, "_");
				}

				refHash["#" + e[i].id] = secLabel;
				f.appendChild(document.createTextNode("#" + e[i].id + " > *:first-child:before{ content: \"" + secLabel + " \"; }\n"));
			}
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
				f.appendChild(document.createTextNode("#" + e[i].id + " > figcaption:before{ content: \"Figure " + figLabel + ": \"; }\n"));
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
				e[i].insertBefore(document.createTextNode(closure[display].open), e[i].firstChild);
				e[i].appendChild(document.createTextNode(closure[display].close));
			}

			script.src = "https://c328740.ssl.cf1.rackcdn.com/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
			document.documentElement.appendChild(script);
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
				f.appendChild(document.createTextNode("#" + e[i].id + ":after{ float: right; line-height: " + getComputedStyle(e[i].parentNode, null).height + "; content: \" (" + eqLabel + ")\"; }\n"));
			}
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
				f.appendChild(document.createTextNode("#" + e[i].id + " > caption:before{ content: \"Table " + tblLabel + ": \"; }\n"));
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
			"body { width: 800px; margin-left: auto; margin-right: auto; }\n" +
			"body * { line-height: 1.5em; }\n" +
			"h1, #author { text-align: center; }\n" +
			"h1, h2, h3, h4, h5, h6, #author { font-weight: bold; }\n" +
			"section p { text-indent: 1em; }\n" +
			"ol, ul { margin: 0; }\n" +
			"figure { text-align: center; }\n" +
			"table { margin: auto; border: solid black; border-collapse: collapse; }\n" +
			"th, td { border: solid black; }\n" +
			"a.sref { color: inherit; text-decoration: inherit; }\n"
		));

		document.documentElement.appendChild(f);
	}, false);
})();
