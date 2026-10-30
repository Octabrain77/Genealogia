let genealogy = {
    persons: [],
    families: [],
    sources: []
};

fetch("./data/family.json")
.then(response => response.json())
.then(data => {

    genealogy = data;

    renderTree();

})
.catch(error => {

    console.error("Errore caricamento JSON", error);

    document.getElementById("content").innerHTML =
        "<h2>Errore caricamento dati genealogici</h2>";
});

function findPerson(id){

    return genealogy.persons.find(
        p => p.id === id
    );
}

function buildPersonName(p){

    let name = p.givenName || "";

    if(p.nickname){

        name += ' "' + p.nickname + '"';

    }

    if(p.surname){

        name += " " + p.surname;

    }

    return name;
}

function showView(view){

    switch(view){

        case "tree":
            renderTree();
            break;

        case "people":
            showPeople();
            break;

        case "families":
            showFamilies();
            break;

        case "descendants":
            showDescendants();
            break;

        case "timeline":
            showTimeline();
            break;
    }
}

function showPerson(id){

    const p = findPerson(id);

    if(!p) return;

    document.getElementById("details").innerHTML = `

        <h2>${buildPersonName(p)}</h2>

        <p><strong>ID:</strong> ${p.id}</p>

        <p>
            <strong>Nascita:</strong>
            ${p.birthDate || p.birthYear || "Sconosciuta"}
            ${p.birthApproximate ? " ?" : ""}
        </p>

        <p>
            <strong>Morte:</strong>
            ${p.deathDate || p.deathYear || "Sconosciuta"}
        </p>

        ${
            p.alternateSurname
            ? `
                <p>
                    <strong>Variante cognome:</strong>
                    ${p.alternateSurname}
                </p>
              `
            : ""
        }

        ${
            p.notes
            ? `
                <p>
                    <strong>Note:</strong><br>
                    ${p.notes}
                </p>
              `
            : ""
        }

    `;
}

function showPeople(){

    const html =
        genealogy.persons.map(p => `

            <div class="person"
                 onclick="showPerson('${p.id}')">

                ${buildPersonName(p)}

            </div>

        `).join("");

    document.getElementById("content").innerHTML = html;
}

function showFamilies(){

    let html = "<h2>Famiglie</h2>";

    genealogy.families.forEach(f => {

        const father = findPerson(f.father);
        const mother = findPerson(f.mother);

        html += `

            <div class="family">

                <h3>${f.id}</h3>

                <p>
                    <strong>Padre:</strong>
                    ${father ? buildPersonName(father) : "-"}
                </p>

                <p>
                    <strong>Madre:</strong>
                    ${mother ? buildPersonName(mother) : "-"}
                </p>

                <strong>Figli:</strong>

                <ul>

        `;

        f.children.forEach(childId => {

            const child = findPerson(childId);

            if(child){

                html += `
                    <li>

                        <a href="#"
                           onclick="showPerson('${child.id}')">

                            ${buildPersonName(child)}

                        </a>

                    </li>
                `;
            }
        });

        html += `
                </ul>
            </div>
        `;
    });

    document.getElementById("content").innerHTML = html;
}

function showTimeline(){

    const people =
        [...genealogy.persons];

    people.sort((a,b)=>{

        const yearA =
            a.birthYear ||
            (a.birthDate
            ? parseInt(a.birthDate.substring(0,4))
            : 9999);

        const yearB =
            b.birthYear ||
            (b.birthDate
            ? parseInt(b.birthDate.substring(0,4))
            : 9999);

        return yearA - yearB;

    });

    const html =
        people.map(p => {

            const year =
                p.birthYear ||
                p.birthDate ||
                "?";

            return `

                <div class="person"
                     onclick="showPerson('${p.id}')">

                    <strong>${year}</strong>

                    <br>

                    ${buildPersonName(p)}

                </div>

            `;
        }).join("");

    document.getElementById("content").innerHTML =
        "<h2>Cronologia</h2>" + html;
}

function showDescendants(){

    const rootId = "P100";

    const root = findPerson(rootId);

    if(!root){

        document.getElementById("content").innerHTML =
            "<h2>Capostipite non trovato</h2>";

        return;
    }

    function getLifeSpan(person){

        const birth =
            person.birthYear ||
            (person.birthDate
                ? person.birthDate.substring(0,4)
                : "?");

        const death =
            person.deathYear ||
            (person.deathDate
                ? person.deathDate.substring(0,4)
                : "");

        return death
            ? `(${birth}-${death})`
            : `(${birth})`;
    }

    function renderBranch(personId){

        const person = findPerson(personId);

        if(!person) return "";

        let html = `
            <li>

                <span
                    class="tree-person"
                    onclick="showPerson('${person.id}')">

                    ${buildPersonName(person)}

                </span>

                <span class="tree-dates">
                    ${getLifeSpan(person)}
                </span>
        `;

        const family =
            genealogy.families.find(
                f => f.father === personId
            );

        if(family && family.children.length > 0){

            html += `<ul>`;

            family.children.forEach(childId => {

                html += renderBranch(childId);

            });

            html += `</ul>`;
        }

        html += `</li>`;

        return html;
    }

    document.getElementById("content").innerHTML = `

        <div id="treeViewport">

            <div id="treeContent">

                <h2>
                    Discendenza di
                    ${buildPersonName(root)}
                </h2>

                <ul class="tree-list">

                    ${renderBranch(rootId)}

                </ul>

            </div>

        </div>

    `;
}

    function renderBranch(personId){

        const person = findPerson(personId);

        if(!person) return "";

        let html = `
            <li>

                <a href="#"
                   onclick="showPerson('${person.id}')">

                   ${buildPersonName(person)}

                </a>
        `;

        const family =
            genealogy.families.find(
                f => f.father === personId
            );

        if(family && family.children.length > 0){

            html += "<ul>";

            family.children.forEach(childId => {

                html += renderBranch(childId);

            });

            html += "</ul>";
        }

        html += "</li>";

        return html;
    }

    const html = `

        <h2>

            Discendenza di
            ${buildPersonName(root)}

        </h2>

        <ul class="tree-list">

            ${renderBranch(rootId)}

        </ul>

    `;

    document.getElementById("content").innerHTML = html;
}

function searchPeople(){

    const query =
        document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    if(query.trim() === ""){

        showPeople();

        return;
    }

    const results =
        genealogy.persons.filter(p => {

            const text =
                (
                    (p.givenName || "") +
                    " " +
                    (p.surname || "") +
                    " " +
                    (p.nickname || "") +
                    " " +
                    (p.alternateSurname || "")
                ).toLowerCase();

            return text.includes(query);
        });

    document.getElementById("content").innerHTML =
        results.map(p => `

            <div class="person"
                 onclick="showPerson('${p.id}')">

                ${buildPersonName(p)}

            </div>

        `).join("");
}

function renderTree(){

    let html = `
        <h2>Vista Albero (beta)</h2>

        <p>
            Dataset genealogico caricato:
            ${genealogy.persons.length} persone
        </p>
    `;

    html += genealogy.persons.map(p => `

        <div class="person"
             onclick="showPerson('${p.id}')">

            ${buildPersonName(p)}

        </div>

    `).join("");

    document.getElementById("content").innerHTML = html;
}
