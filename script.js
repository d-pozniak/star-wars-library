const main = document.querySelector('.page-main')
const startButton = document.querySelector('.start-btn');
const title = document.querySelector('.page-title');
const primaryTitle = title.textContent;

const resultField = document.createElement('div');
resultField.classList.add('result-field');
// resultField.addEventListener('click', (e) => displaySelectedPerson(e));

let peopleFound;

function debounce(func, delay = 1000) {
    let timer;
    return (...arguments) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, arguments); }, delay);
    }
}

function displaySelectedPerson(event) {
    resultField.remove();
    const searchVal = event.target.textContent;
    const personInfo = peopleFound.filter(person => person.name === searchVal)[0];

    const personCard = document.createElement('div');
    personCard.classList.add('person-card');

    const personName = document.createElement('h2');
    personName.textContent = personInfo.name;
    const personBirth = document.createElement('div');
    personBirth.textContent = `birth year: ${personInfo.birth_year}`;
    const personHeight = document.createElement('div');
    personHeight.textContent = `height: ${personInfo.height}cm`;

    personCard.append(personName, personBirth, personHeight);
    const prevPerson = document.querySelector('.person-card');
    if (prevPerson) prevPerson.remove();
    main.append(personCard);
}

function renderPeople(people, enterPoint){
    enterPoint.appendChild(resultField);
    const prevPerson = document.querySelector('.person-card');
    if (prevPerson) prevPerson.remove();

    if (people.length === 0) resultField.replaceChildren(document.createTextNode('nothing found'));
    else {
        const peopleElems = people.map(person => {
            const pName = document.createElement('div');
            pName.textContent = person.name;
            pName.classList.add('person-link');
            pName.addEventListener('click', (e) => displaySelectedPerson(e, enterPoint));
            return pName;
        });
        resultField.replaceChildren(...peopleElems);
    }
}

function searchForChar(e, enterPoint) {
    const searchVal = e.target.value;
    if (!searchVal) {
        resultField.remove();
        return;
    }
    fetch(`https://swapi.dev/api/people?search=${searchVal}`)
        .then(response => response.json())
            .then(json => {
                peopleFound = json.results;
                renderPeople(peopleFound, enterPoint);
            })
        .catch( (error) => {
            console.error(`Download error ${error}`);
        });
}

function renderSearch() {

    title.textContent = 'Learn more about any of the characters';

    const pageForm = document.querySelector('.page-form');
    main.classList.remove('search-stopped')

    const searchDiv = document.createElement('div');
    searchDiv.classList.add('search-section')

    const searchBar = document.createElement('input');
    searchBar.placeholder = 'Type character`s name...';
    searchBar.type = 'text';
    searchBar.classList.add('search-bar');
    searchDiv.append(searchBar);
    searchBar.addEventListener('input', (e) => { debounce(searchForChar)(e, searchDiv); } ); // search for char is a callback!

    const restartButton = document.createElement('input');
    restartButton.type = 'button';
    restartButton.value = 'Back';
    restartButton.classList.add('restart-btn');
    restartButton.addEventListener('click', () => {
        pageForm.replaceChildren(startButton);
        main.classList.add('search-stopped');
        main.replaceChildren(pageForm);
        title.textContent = primaryTitle;
    })

    pageForm.replaceChildren(restartButton, searchDiv);
}

startButton.addEventListener('click', renderSearch);
