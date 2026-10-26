let people = [];

fetch("./data/family.json")
    .then(response => response.json())
    .then(data => {
        people = data.persons;
        console.log("Dati genealogici caricati");
    });

document.addEventListener("click", function(event) {

    const card = event.target.closest(".person");

    if (!card) return;

    const id = card.getAttribute("data-id");

    const person = people.find(p => p.id === id);

    if (!person) return;

    let fullName = person.givenName;

    if (person.nickname) {
        fullName += ' "' + person.nickname + '"';
    }

    fullName += ' ' + person.surname;

    document.getElementById("details").innerHTML = `
        <h2>${fullName}</h2>

        <p><strong>ID:</strong> ${person.id}</p>

        <p>
            <strong>Nascita:</strong>
            ${person.birthDate || person.birthYear || "Sconosciuta"}
            ${person.birthApproximate ? " ?" : ""}
        </p>

        <p>
            <strong>Morte:</strong>
            ${person.deathDate || person.deathYear || "Sconosciuta"}
        </p>

        ${
            person.nickname
                ? `<p><strong>Soprannome:</strong> ${person.nickname}</p>`
                : ""
        }

        ${
            person.notes
                ? `<p><strong>Note:</strong> ${person.notes}</p>`
                : ""
        }
    `;
});
