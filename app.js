let genealogy = {};

fetch("./data/family.json")
.then(r => r.json())
.then(data => {

    genealogy = data;

    renderTree();

});

function findPerson(id){

    return genealogy.persons.find(
        p => p.id === id
    );

}

function showPerson(id){

    const p = findPerson(id);

    if(!p) return;

    let name = p.givenName;

    if(p.nickname){

        name += ' "' + p.nickname + '"';

    }

    if(p.surname){

        name += ' ' + p.surname;

    }

    document.getElementById("details").innerHTML = `

        <h2>${name}</h2>

        <p>
            <b>Nascita:</b>
            ${p.birthDate || p.birthYear || "?"}
        </p>

        <p>
            <b>Morte:</b>
            ${p.deathDate || p.deathYear || "?"}
        </p>

        <p>
            ${p.notes || ""}
        </p>

    `;
}

function renderTree(){

    const svg =
        document.getElementById("treeSvg");

    svg.innerHTML = "";

    const boxWidth = 140;
    const boxHeight = 55;

    genealogy.persons.forEach((person,index)=>{

        const x =
            50 + (index % 6) * 220;

        const y =
            50 + Math.floor(index/6)*120;

        const group =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
            );

        const rect =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "rect"
            );

        rect.setAttribute("x",x);
        rect.setAttribute("y",y);

        rect.setAttribute("width",boxWidth);
        rect.setAttribute("height",boxHeight);

        rect.setAttribute(
            "class",
            "person-box"
        );

        rect.addEventListener(
            "click",
            ()=>showPerson(person.id)
        );

        group.appendChild(rect);

        const text =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );

        text.setAttribute(
            "x",
            x + boxWidth/2
        );

        text.setAttribute(
            "y",
            y + 24
        );

        text.setAttribute(
            "class",
            "person-text"
        );

        let label =
            person.givenName;

        if(person.nickname){

            label +=
              ' "' +
              person.nickname +
              '"';

        }

        text.textContent =
            label;

        group.appendChild(text);

        svg.appendChild(group);

    });

}
