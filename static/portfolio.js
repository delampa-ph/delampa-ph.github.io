const PORTFOLIO_FILTER_HTML = document.getElementById("portfolio-filter-checkbox")
const PORTFOLIO_CONTENT_PARENT_HTML = document.getElementById("portfolio-container")

function appendPortfolioContent(repo) {
    const languageDict = {
        "html"  : "devicon-html5-plain",
        "css"   : "devicon-css3-plain",
        "js"    : "devicon-javascript-plain",
    }
    
    let setTool = new Set();
    repo.tools.sort()
    for (const i of repo.tools) {
        switch(i) {
        case "html":
        case "css":
        case "js":
            setTool.add(i);
            break;
        }
    }
    
    let toolUsed = '';
    for (const it of setTool) {
        toolUsed += `<i class="fs-5 ${languageDict[it]}"></i>`
    }

    PORTFOLIO_CONTENT_PARENT_HTML.innerHTML += `
<div class="portfolioContent">
    <div class="d-flex justify-content-between">
        <a class="p-2 fw-bold fst-italic" href="${repo.link}"><i class="bi bi-github"></i> ${repo.name}</a>
        <div class="d-flex gap-1">
            <span class="p-2"><i class="bi bi-star-fill"> ${repo.likeCount}</i></span>
            <span class="p-2"><i class="bi bi-eye-fill"> ${repo.watchCount}</i></span>
        </div>
    </div>
    <span class="p-2">${repo.desc}</span>
    <div class="d-flex justify-content-between">
        <div class="d-flex gap-1 p-2">${toolUsed}</div>
        <i class="bi bi-stopwatch-fill p-2 fw-bold"> Last updated on ${repo.date}</i>
    </div>
</div>    
`;
}

appendPortfolioContent({
    name: "Web Portfolio",
    desc: "My portfolio website.",
    link: "https://youtube.com",
    likeCount: 4213,
    watchCount: 598,
    date: "05-25-2025",
    tools: ["html", "js", "css"]
})

appendPortfolioContent({
    name: "Space Invader",
    desc: "Recreation of space invader, playable in the web!",
    link: "/",
    likeCount: 102,
    watchCount: 24,
    date: "05-22-2025",
    tools: ["js"]
})