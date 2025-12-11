// Imposta automaticamente l'anno corrente nel footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Effetto "illumina al click"
document.querySelectorAll(".link-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        // Rimuove eventuale classe precedente per riavviare l'animazione
        btn.classList.remove("clicked");

        // Forza reflow per riattivare l'animazione anche su click ripetuti
        void btn.offsetWidth;

        btn.classList.add("clicked");

        // Rimuove la classe dopo l'animazione
        setTimeout(() => {
            btn.classList.remove("clicked");
        }, 260);

        // Log base – in futuro puoi collegarlo a Analytics
        const label = btn.textContent.trim().replace(/\s+/g, " ");
        console.log("Clic su link:", label);
    });
});
