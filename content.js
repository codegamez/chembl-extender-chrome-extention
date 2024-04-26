const styleURL = chrome.runtime.getURL("style.css")
const iframeId = "ProteoSAFe"
let iframeHeight = 0
let currentSearchText = null

setInterval(() => {
	const container = document.querySelector(".BCK-ESResults-lists")
	if (!container) return

	const inputEl = document.querySelector("#chembl-header-search-bar-container input.chembl-search-bar")
	if (!inputEl) return

	const searchText =
		[...document.querySelectorAll("#BCK-breadcrumbs a.ebi-breadcrumb")].map((v) => v.innerText).slice(-1)?.[0] || ""

	if (currentSearchText !== null && currentSearchText == searchText) return

	currentSearchText = searchText

	// add style
	if (!document.querySelector(`head link[href="${styleURL}"]`)) {
		const cssLink = document.createElement("link")
		cssLink.href = styleURL
		cssLink.rel = "stylesheet"
		cssLink.type = "text/css"
		document.head.appendChild(cssLink)

		window.addEventListener("message", function (event) {
			if (event.origin !== "https://gnps.ucsd.edu") return
			if (!event.data || !event.data.height) return
			iframeHeight = Math.min(event.data.height + 24, 400)
			const iframe = document.querySelector("#" + iframeId)
			if (iframe) {
				iframe.setAttribute("height", iframeHeight + "px")
			}
		})
	}

	// add iframe
	let iframe = document.querySelector("#" + iframeId)
	if (iframe) {
		iframeHeight = 0
		iframe.remove()
	}

	let iframeLoading = document.querySelector("#" + iframeId + "Loading")
	if (!iframeLoading) {
		iframeLoading = document.createElement("div")
		iframeLoading.setAttribute("id", iframeId + "Loading")
		iframeLoading.classList.add("loading")
		container.insertBefore(iframeLoading, container.firstChild)
	}

	const iframeUrl =
		`https://gnps.ucsd.edu/ProteoSAFe/datasets.jsp?iframe=true#` +
		JSON.stringify({
			full_search_input: searchText,
			table_sort_history: "createdMillis_dsc",
			query: {}
		})
	iframe = document.createElement("iframe")
	iframe.setAttribute("id", iframeId)
	iframe.setAttribute("src", iframeUrl)
	iframe.setAttribute("width", "100%")
	iframe.setAttribute("height", iframeHeight + "px")
	iframe.classList.add("loading")
	iframeLoading.classList.add("loading")
	iframe.onload = () => {
		iframe.classList.remove("loading")
		iframeLoading.classList.remove("loading")
	}
	container.insertBefore(iframe, container.firstChild)
}, 100)
