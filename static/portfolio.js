const PORTFOLIO_FILTER_HTML = document.getElementById("portfolio-filter-checkbox")
const PORTFOLIO_CONTENT_PARENT_HTML = document.getElementById("portfolio-container")

function appendPortfolioContent(repo) {
    const languageDict = {
        "html"  : "devicon-html5-plain",
        "css"   : "devicon-css3-plain",
        "js"    : "devicon-javascript-plain",
        "mkdwn" : "devicon-markdown-original"
    }
    
    let setTool = new Set();
    repo.tools.sort()
    for (const i of repo.tools) {
        if (languageDict[i] != undefined)
            setTool.add(i);
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

async function fetchCustomPortfolio() {
    const jsonObj = await (await fetch("/static/custom_portfolio.json")).json();
    return jsonObj;
}

async function fetchGHRepos() {
    const jsonObj = await (await fetch("/static/test_repo.json")).json(); 
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
            "desc":         it.description,
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

function updatePortfolioContent() {
    const finalList = []
    fetchCustomPortfolio()
    .then((customPortfolio) => {
        fetchGHRepos()
        .then((repoList) => {
            for (const i of repoList) {
                if (customPortfolio["ignore-content"].includes(i.name))
                    continue;

                if (customPortfolio["list-content"][i.name] != undefined) {
                    const target = customPortfolio["list-content"][i.name];
                    for(const cpKey in target) {
                        i[cpKey] = target[cpKey];
                    }
                }
                finalList.push(i);
            }
        })
        .finally(() => {
            finalList.sort((a, b) => {
                return a.rawDate < b.rawDate;
            });
            console.log(finalList);

            for (const i of finalList) {
                appendPortfolioContent(i);
            }
        });
    })
}

updatePortfolioContent();