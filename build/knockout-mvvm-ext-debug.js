// This script adds <script> tags referencing each of the knockout-mvvm-extensions.js source files in the correct order
(function () {
	var debugFile = "build/knockout-mvvm-ext-debug.js";
	var sourcesReferenceFile = "build/knockout-mvvm-ext-source-references.js";

	function getPathToScriptTagSrc(scriptTagSrc) {
		scriptTagSrc = "/" + scriptTagSrc.toLowerCase();
		var scriptTags = document.getElementsByTagName("SCRIPT");
		for (var i = 0; i < scriptTags.length; i++) {
			var src = scriptTags[i].src;
			var index = src.toLowerCase().indexOf(scriptTagSrc);
			if ((index >= 0) && index == (src.length - scriptTagSrc.length))
				return src.substring(0, index + 1);
		}
		throw "Cannot find script tag referencing " + scriptTagSrc;
	};

	function referenceScript(url) {
		document.write("<script src='" + url + "' type='text/javascript'></script>");
	};

	var buildFolderPath = getPathToScriptTagSrc(debugFile);

	window.knockoutMvvmExtensionsDebugCallback = function (scriptUrls) {
		for (var i = 0; i < scriptUrls.length; i++)
			referenceScript(buildFolderPath + scriptUrls[i]);
	};
	referenceScript(buildFolderPath + sourcesReferenceFile);
})();
