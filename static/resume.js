const CONTACT_HTML      = document.getElementById("topInfo");
const WORK_HTML         = document.getElementById("workInfo");
const EDUCATION_HTML    = document.getElementById("educationInfo");

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

function appendInfoHTML(info, targetDiv) {
    let siding = 0;
    for (const infoVal of info) {
        siding++;

        const containerDiv = document.createElement("div");
        let textSide = `${siding % 2 == 1 ? "text-left" : "text-end"}`
        containerDiv.setAttribute("class", `row gap-1 ${textSide}`);
        targetDiv.append(containerDiv);

        // Logo Side
        const logoDiv = document.createElement("div");
        logoDiv.setAttribute("class", "col-sm-3");
        const logoLink = document.createElement("a");
        logoLink.setAttribute("href", infoVal.image.link);
        logoDiv.append(logoLink);
        const logoImg = document.createElement("img");
        logoImg.setAttribute("src", infoVal.image.src);
        logoImg.setAttribute("style", "width: 18vw;");
        logoLink.append(logoImg);

        // Description Side
        const infoDiv = document.createElement("div");
        infoDiv.setAttribute("class", "col");

        const infoName = document.createElement("span");
        infoName.setAttribute("class", "h4 fw-bold");
        infoName.innerHTML = infoVal.name;
        infoDiv.append(infoName);

        const infoDate = document.createElement("p");
        const dateIcon = document.createElement("i");
        const dateSpan = document.createElement("span");
        dateIcon.setAttribute("class", "bi bi-calendar-fill");
        infoDate.setAttribute("class", "fs-6");
        infoDate.setAttribute("style", "margin-bottom: 0px;");
        if (siding % 2 == 1) {
            dateSpan.innerText = ` ${infoVal.date}`;
            infoDate.append(dateIcon);
            infoDate.append(dateSpan);
        } else {
            dateSpan.innerText = `${infoVal.date} `;
            infoDate.append(dateSpan);
            infoDate.append(dateIcon);
        }
        infoDiv.append(infoDate);
        
        const infoPosition = document.createElement("p")
        let positionIcon = document.createElement("i");
        let positionSpan = document.createElement("span");
        positionIcon.setAttribute("class", "bi bi-person-vcard-fill");
        if (infoVal.positionIcon != undefined)
            positionIcon.setAttribute("class", infoVal.positionIcon);
        infoPosition.setAttribute("class", `fw-bold`);
        infoPosition.setAttribute("style", "margin-bottom: 1em;")
        if (siding % 2 == 1) {
            positionSpan.innerText = ` ${infoVal.position}`;
            infoPosition.append(positionIcon);
            infoPosition.append(positionSpan);
        } else {
            positionSpan.innerText = `${infoVal.position} `;
            infoPosition.append(positionSpan);
            infoPosition.append(positionIcon);
        }
        infoDiv.append(infoPosition);

        if (infoVal.description != undefined) {
            const infoDescHeader = document.createElement("i");
            infoDescHeader.setAttribute("class", "fw-bold fs-4");
            infoDescHeader.setAttribute("style", "margin-bottom: 0px;");
            infoDescHeader.innerText = " Description:";
            infoDiv.append(infoDescHeader);

            const infoDescValue = document.createElement("p");
            infoDescValue.innerHTML = infoVal.description;
            infoDiv.append(infoDescValue);
        }

        if (infoVal.awards != undefined) {
            const infoAwardHeader = document.createElement("i");
            infoAwardHeader.setAttribute("class", "fw-bold fs-4");
            infoAwardHeader.innerText = "Awards:"
            infoDiv.append(infoAwardHeader);

            const infoAwardContainer = document.createElement("div");
            infoAwardContainer.setAttribute("class", "container");
            infoDiv.append(infoAwardContainer);

            const infoAwardCRow = document.createElement("div");
            let contentAlign = siding % 2 == 1 ? "justify-content-start" : "justify-content-end";
            infoAwardCRow.setAttribute("class", `row gap-1 row-cols-auto ${contentAlign}`);
            infoAwardContainer.append(infoAwardCRow);

            const infoAwardTitle = document.createElement("div");
            infoAwardTitle.setAttribute("class", "col fw-bold");
            const infoAwardValue = document.createElement("div");
            infoAwardValue.setAttribute("class", "col");
            infoAwardValue.setAttribute("style", "width: 32vw; text-shadow: light-dark(#EAEFEF, #333446) 0px 0px 8px;");
            
            for (const i of infoVal.awards) {
                const awardTitle = document.createElement("div");
                awardTitle.setAttribute("class", "bi bi-award-fill");
                awardTitle.innerText = i.name;

                const awardValue = document.createElement("div");
                awardValue.innerText = siding % 2 == 1 ? `— ${i.value}` : `${i.value} —`;

                infoAwardTitle.append(awardTitle);
                infoAwardValue.append(awardValue);
            }

            if (siding % 2 == 1) {
                infoAwardCRow.append(infoAwardTitle);
                infoAwardCRow.append(infoAwardValue);
            } else {
                infoAwardCRow.append(infoAwardValue);
                infoAwardCRow.append(infoAwardTitle);
            }
        }

        if (siding % 2 == 1) {
            containerDiv.append(logoDiv);
            containerDiv.append(infoDiv);
        } else {
            containerDiv.append(infoDiv);
            containerDiv.append(logoDiv);
        }
    }
}

async function loadResumeJSON() {
    const resumeJSON = await(await fetch("/static/custom_resume.json")).json();
    appendTopInfoHTML(resumeJSON["categoryInfo"])
    appendInfoHTML(resumeJSON["workInfo"], WORK_HTML);
    appendInfoHTML(resumeJSON["educationInfo"], EDUCATION_HTML);
}

loadResumeJSON();