// Imposta automaticamente l'anno corrente nel footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Tracciamento base dei clic (puoi collegarlo più avanti ad Analytics)
document.querySelectorAll(".link-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const label = btn.textContent.trim().replace(/\s+/g, " ");
        console.log("Clic su:", label);

        // In futuro:
        // window.gtag && gtag("event", "click_link_bio", { label });
        // oppure invio a un endpoint personalizzato
    });
});
