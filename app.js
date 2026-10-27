let data = {};

fetch("./data/family.json")
.then(r => r.json())
.then(json => {

    data = json;

    showPeople();

});

function showView(name){

    if(name === "people")
        showPeople();

    if(name === "tree")
        showTree();

    if(name === "timeline")
        showTimeline();
}

function showPeople(){

    const html =
        data.persons
        .map(p => {

            return `
                <div class="person"
                     onclick="showPerson('${p.id}')">

                    ${p.givenName}
                    ${p.surname}

                </div>
            `;
        })
        .join("");

    document.getElementById("content")
        .innerHTML = html;
}

function showTree(){

    const html =
        data.families
        .map(f => {

            return `

                <div class="family">

                    <h3>${f.id}</h3>

                    Padre: ${f.father}<br>
                    Madre: ${f.mother}<br>

                    Figli:
                    ${f.children.join(", ")}

                </div>

            `;
        })
        .join("");

    document.getElementById("content")
        .innerHTML = html;
}

function showTimeline(){

    const people = [...data.persons];

    people.sort((a,b)=>
        (a.birthYear || 9999)
        -
        (b.birthYear || 9999)
    );

    const html =
        people
        .map(p => {

            return `
                <div class="person">

                    ${(p.birthYear || "")}
                    ${p.givenName}
                    ${p.surname}

                </div>
            `;
        })
        .join("");

    document.getElementById("content")
        .innerHTML = html;
}

function showPerson(id){

    const p =
        data.persons.find(x => x.id === id);

    if(!p) return;

    document
      .getElementById("details")
      .innerHTML = `

        <h2>
            ${p.givenName}
            ${p.surname}
        </h2>

        <p>
            Nascita:
            ${p.birthDate || p.birthYear || "?"}
        </p>

        <p>
            Morte:
            ${p.deathDate || p.deathYear || "?"}
        </p>

      `;
}
