let people = [];

fetch("./data/family.json")
    .then(response => response.json())
    .then(data => {
        people = data.persons;
        console.log("Dati genealogici caricati", people);
    })
    .catch(error => {
        console.error("Errore caricamento family.json", error);
    });

document.addEventListener("click", (event) => {

    const card = event.target.closest(".person");

    if (!card) {
        return;
    }

    const id = card.getAttribute("data-id");

    const person = people.find(p => p.id === id);

    if (!person) {
        return;
    }

    const nomeCompleto =
        `${person.givenName} ${
            person.nickname ? '"' + person.nickname + '" ' : ''
        }${person.surname}`;

    document.getElementById("details").innerHTML = `
        <h2>${nomeCompleto}</h2>

        <p><strong>ID:</strong> ${person.id}</p>

        <p>
            <strong>Nascita:</strong>
            ${person.birthDate || person.birthYear
