let people = [];

fetch("./data/family.json")
    .then(response => response.json())
    .then(data => {
        people = data.persons;
        console.log("Dati caricati:", people);
    })
    .catch(error => {
        console.error("Errore caricamento JSON:", error);
    });

document.addEventListener("click", function(event) {

    const card = event.target.closest(".person");

    if (!card) return;

    const id = card.getAttribute("data-id");

    const person = people.find(p => p.id === id);

    if (!person) {
        console.log("Persona non trovata:", id);
        return;
    }

    let nomeCompleto = person.givenName;

    if (person.nickname) {
        nomeCompleto += ' "' + person.nickname + '"';
    }

    nomeCompleto += ' ' + person.surname;

    document.getElementById("details").innerHTML = `
        <h2>${nomeCompleto}</h2>

        <p><strong>ID:</strong> ${person.id}</p>

        <p>
            <strong>Nascita:</strong>
            ${person.birthDate || person.birthYear || "N/D"}
            ${person.birthApproximate ? " ?" : ""}
        </p>

        <p>
            <strong>Morte:</strong>
            ${person.deathDate || person.deathYear || "N/D"}
        </p>

        ${person.notes
            ? `<p><strong>Note:</strong> ${person.notes}</p>`
            : ""}
    `;
});
