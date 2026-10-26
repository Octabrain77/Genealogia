let people = [];

fetch("./data/family.json")
  .then(response => response.json())
  .then(data => {
      people = data.persons;
  });

document.addEventListener("click", function(event){

    const card = event.target.closest(".person");

    if(!card) return;

    const id = card.dataset.id;

    const person = people.find(p => p.id === id);

    if(!person) return;

    let name = person.givenName;

    if(person.nickname){
        name += ' "' + person.nickname + '"';
    }

    if(person.surname){
        name += ' ' + person.surname;
    }

    document.getElementById("details").innerHTML = `
        <h2>${name}</h2>

        <p><b>ID:</b> ${person.id}</p>

        <p>
            <b>Nascita:</b>
            ${person.birthDate || person.birthYear || "Sconosciuta"}
            ${person.birthApproximate ? " ?" : ""}
        </p>

        <p>
            <b>Morte:</b>
            ${person.deathDate || person.deathYear || "Sconosciuta"}
        </p>

        ${
            person.notes
            ? `<p><b>Note:</b> ${person.notes}</p>`
            : ""
        }
    `;
});
