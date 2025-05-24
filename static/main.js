const TOP_HEADER_CODE = `
<div class="box boxCentered d-flex justify-content-between">
    <div class="d-flex gap-1">
        <a class="p-2" href="/"><i class="bi bi-house-fill"> Home</i></a>
        <a class="p-2" href="/resume.html"><i class="bi bi-suitcase-lg-fill"> Resume</i></a>
        <a class="p-2" href="/portfolio.html"><i class="bi bi-tools"> Portfolio</i></a>
    </div>
    <a class="p-2"><i class="bi bi-brightness-high-fill" onclick="toggleLight()"></i></a>
</div>
`

const CREDIT_HEADER_CODE = `
<div class="box boxCentered text-end">
    <a href="https://github.com/delampa-ph/delampa-ph.github.io"><i class="bi bi-c-circle"></i> 2025 Derek E. Lampa</a>
</div>
`

document.getElementById("topHeader").innerHTML      += TOP_HEADER_CODE;
document.getElementById("creditHeader").innerHTML   += CREDIT_HEADER_CODE;

function toggleLight() {
    document.body.classList.toggle("light")
}