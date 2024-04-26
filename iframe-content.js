const iframeStyleURL = chrome.runtime.getURL("iframe-style.css")
let currentScrollHeight = 0

setInterval(() => {
	if (!document.querySelector(`head link[href="${iframeStyleURL}"]`)) {
		const cssLink = document.createElement("link")
		cssLink.href = iframeStyleURL
		cssLink.rel = "stylesheet"
		cssLink.type = "text/css"
		document.head.appendChild(cssLink)
	}

	const scrollHeight = document.querySelector(`head link[href="${iframeStyleURL}"]`) ? document.body.scrollHeight : 0
	if (currentScrollHeight != scrollHeight) {
		currentScrollHeight = scrollHeight
		window.parent.postMessage({ height: scrollHeight }, "*")
	}
}, 100)

setInterval(() => {
	document.querySelectorAll("a").forEach((el) => {
		if (el.getAttribute("target") != "_blank") {
			el.setAttribute("target", "_blank")
		}
	})
}, 500)
