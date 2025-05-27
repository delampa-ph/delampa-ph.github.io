const PORTFOLIO_FILTER_HTML = document.getElementById("portfolio-filter-checkbox")
const PORTFOLIO_CONTENT_PARENT_HTML = document.getElementById("portfolio-container")

let PORTFOLIO_CONTENT_LIST = [];
let PORTFOLIO_ACTIVE_FILTER = new Set();

let PORTFOLIO_CUSTOM_TAGS = {}

function appendPortfolioContent(repo) {
    let setTool = new Set();
    repo.tools.sort()
    for (const i of repo.tools) {
        setTool.add(i);
    }
    
    let toolUsed = '';
    for (const it of setTool) {
        let tmpIcon = "bi bi-question-square-fill"
        try {
            if (PORTFOLIO_CUSTOM_TAGS[it].icon != undefined)
                tmpIcon = PORTFOLIO_CUSTOM_TAGS[it].icon;
        } catch {}
        toolUsed += `<i class="fs-5 ${tmpIcon}"></i>`
    }
    const likeDisplay   = (repo.likeCount != undefined)     ? `<span class="p-2"><i class="bi bi-star-fill"> ${repo.likeCount}</i></span>` : ""
    const watchDisplay  = (repo.watchCount != undefined)    ? `<span class="p-2"><i class="bi bi-eye-fill"> ${repo.watchCount}</i></span>` : "" 
    const dateDisplay   = (repo.date != undefined)          ? `<i class="bi bi-stopwatch-fill p-2 fw-bold"> Last updated on ${repo.date}</i>` : ""

    let additionalTag = "";
    let iconType = "bi bi-github"
    if (repo["bg-image"] != undefined) {
        additionalTag = `
        style="background-image: linear-gradient(rgba(255,255,255,0.0), rgba(50,50,50,0.5)), url(${repo["bg-image"]});
        background-repeat: no-repeat;
        background-size: cover;
        text-shadow: light-dark(#EAEFEF, #333446) 0px 0px 8px,
                    light-dark(#EAEFEF, #333446) 0px 0px 8px,
                    light-dark(#EAEFEF, #333446) 0px 0px 8px,
                    light-dark(#EAEFEF, #333446) 0px 0px 8px;
        -webkit-font-smoothing: antialiased;
        "`
    }

    if (repo["icon-type"] != undefined) {
        iconType = repo["icon-type"]
    }

    PORTFOLIO_CONTENT_PARENT_HTML.innerHTML += `
<div class="portfolioContent" ${additionalTag}>
    <div class="d-flex justify-content-between">
        <a class="p-2 fw-bold fst-italic" href="${repo.link}"><i class="${iconType}"></i> ${repo.name}</a>
        <div class="d-flex gap-1">
            ${likeDisplay}
            ${watchDisplay}
        </div>
    </div>
    <span class="p-2">${repo.desc}</span>
    <div class="d-flex justify-content-between">
        <div class="d-flex gap-1 p-2">${toolUsed}</div>
        ${dateDisplay}
    </div>
</div>    
`;
}

function appendPortfolioFilter(filter) {
    let iconOutput = "bi bi-question-square-fill";
    try {
        if (PORTFOLIO_CUSTOM_TAGS[filter.type].icon != undefined)
            iconOutput = PORTFOLIO_CUSTOM_TAGS[filter.type].icon;
    } catch {}

    const formCheck = document.createElement("div");
    formCheck.setAttribute("class", "form-check");

    const formCheckInput = document.createElement("input");
    formCheckInput.setAttribute("class", "form-check-input");
    formCheckInput.setAttribute("type", "checkbox");
    formCheckInput.addEventListener('change', (ev) => {
        if (formCheckInput.checked) {
            PORTFOLIO_ACTIVE_FILTER.add(filter.type);
        } else {
            PORTFOLIO_ACTIVE_FILTER.delete(filter.type);
        }
        updatePortfolioContent();
    });

    const formCheckLabel = document.createElement("label")
    formCheckLabel.innerHTML = `<i class="fs-5 ${iconOutput}"></i> ${filter.formalName}`

    formCheck.append(formCheckInput);
    formCheck.append(formCheckLabel);

    PORTFOLIO_FILTER_HTML.append(formCheck);
}

async function fetchGHRepos() {
    const isLocal = document.location.host.match("^127\\.0\\.0\\.1");
    const jsonObj = await (await fetch(
        isLocal ? "/static/test_repo.json" : "https://api.github.com/users/delampa-ph/repos"
    )).json();
    const contentList = [];

    for(const it of jsonObj) {
        let outputDate = "UNKNOWN";
        let rawDate = 0;

        if (it.updated_at != undefined) {
            const curDate = Date.parse(it.updated_at);
            let year = new Intl.DateTimeFormat('en', {year: "numeric"}).format(curDate);
            let month = new Intl.DateTimeFormat('en', {month: "2-digit"}).format(curDate);
            let day = new Intl.DateTimeFormat('en', {day: "2-digit"}).format(curDate);
            outputDate = `${year}/${month}/${day}`

            rawDate = curDate;
        }

        const curContent = {
            "name":         it.name,
            "desc":         (it.description != undefined) ? it.description : "",
            "link":         it.html_url,
            "likeCount":    it.stargazers_count,
            "watchCount":   it.watchers_count,
            "date":         outputDate,
            "rawDate":      rawDate,
            "tools":        (it.language != undefined) ? [(it.language).toLowerCase()] : []
        }

        contentList.push(curContent);
    }
    return contentList;
}

async function initializePortfolioList() {
    if (PORTFOLIO_CONTENT_LIST.length > 0)
        return;

    const customPortfolio = await(await fetch("/static/custom_portfolio.json")).json();
    PORTFOLIO_CUSTOM_TAGS = customPortfolio["list-tag"];
    const repoList  = await fetchGHRepos();

    const filterSet = new Set();

    for(const it of repoList) {
        if (customPortfolio["ignore-content"].includes(it.name))
            continue;
        
        if (customPortfolio["modify-content"][it.name] != undefined) {
            const target = customPortfolio["modify-content"][it.name];
            for(const cpKey in target) {
                it[cpKey] = target[cpKey];
            }
        }

        for(const j of it["tools"]) {
            filterSet.add(j);
        }

        PORTFOLIO_CONTENT_LIST.push(it);
    }

    for (const it of customPortfolio["custom-content"]) {
        if (customPortfolio["ignore-content"].includes(it.name))
            continue;
        
        if (it.rawDate == undefined && it.date != undefined) {
            it.rawDate = Date.parse(it.date);
        }

        for(const j of it["tools"]) {
            filterSet.add(j);
        }

        PORTFOLIO_CONTENT_LIST.push(it);
    }

    let finalizedFilterList = [];
    for (const it of filterSet) {
        finalizedFilterList.push(it);
    }
    finalizedFilterList.sort((a, b) => {
        const targetA = customPortfolio["list-tag"][a]
        const targetB = customPortfolio["list-tag"][b]
        if (targetA == undefined || targetB == undefined)
            return 1;
        return targetA.formalName > targetB.formalName;
    })

    for (const it of finalizedFilterList) {
        const targetItem = customPortfolio["list-tag"][it];
        appendPortfolioFilter({
            type: it,
            formalName: (targetItem == undefined) ? it : targetItem.formalName 
        });
    }

    PORTFOLIO_CONTENT_LIST.sort((a, b) => {
        return a.rawDate < b.rawDate;
    });
}

function updatePortfolioContent() {
    PORTFOLIO_CONTENT_PARENT_HTML.innerHTML = ""
    initializePortfolioList().then(() => {
        for(const it of document.getElementsByClassName("loaderSpace")) {
            it.setAttribute("style", "display: none;")
        }

        for(const it of PORTFOLIO_CONTENT_LIST) {
            const occupiedContent = new Set();
            if (PORTFOLIO_ACTIVE_FILTER.size == 0) {
                appendPortfolioContent(it);
            } else {
                let maxFilter = 0;
                for (const targetFilter of it.tools) {
                    if (PORTFOLIO_ACTIVE_FILTER.has(targetFilter))
                        maxFilter++;
                }

                if (maxFilter == PORTFOLIO_ACTIVE_FILTER.size && !occupiedContent.has(it)) {
                    occupiedContent.add(it);
                    appendPortfolioContent(it);
                }
            }
        }
    });
}

updatePortfolioContent();