const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

document.querySelectorAll(".link-btn").forEach((btn, index) => {
    btn.style.animationDelay = `${0.08 * index + 0.12}s`;

    btn.addEventListener("click", () => {
        btn.classList.remove("clicked");
        void btn.offsetWidth;
        btn.classList.add("clicked");

        setTimeout(() => {
            btn.classList.remove("clicked");
        }, 260);

        const label = btn.textContent.trim().replace(/\s+/g, " ");
        console.log("Clic su link:", label);
    });
});