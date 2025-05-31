const CONTACT_HTML = document.getElementById("topInfo");

function appendTopInfoHTML(info){
    for(const infoVal of info) {
        const headerTop = document.createElement("i");
        headerTop.setAttribute('class', 'h3 m-3 fw-bold');
        headerTop.innerHTML = `${infoVal.header}:`;

        CONTACT_HTML.append(headerTop);

        const containerDiv = document.createElement("div");
        containerDiv.setAttribute("class", "container-fluid")
        CONTACT_HTML.append(containerDiv);

        for(const infoChild of infoVal.info) {
            const rowDiv = document.createElement("div");
            rowDiv.setAttribute("class", "row");
            containerDiv.append(rowDiv);

            const IFKey = document.createElement("span");
            IFKey.setAttribute('style', 'max-width: 10em;');
            IFKey.setAttribute('class', `${infoChild.iconType != undefined ? infoChild.iconType : ''} fw-bold col`);
            IFKey.innerText = ` ${infoChild.headerKey}:`;
            rowDiv.append(IFKey);

            let IFValue;
            if (infoChild.headerLink != undefined) {
                IFValue = document.createElement("a");
                IFValue.setAttribute('href', infoChild.headerLink);
            } else {
                IFValue = document.createElement("span");
            }
            IFValue.setAttribute("class", "col");
            IFValue.innerText = infoChild.headerValue;
            rowDiv.append(IFValue);
        }

        CONTACT_HTML.append(document.createElement('hr'));
    }
}

async function loadResumeJSON() {
    const resumeJSON = await(await fetch("/static/custom_resume.json")).json();
    appendTopInfoHTML(resumeJSON["categoryInfo"])
}

loadResumeJSON();