const main = document.querySelector('.page-main')
const startButton = document.querySelector('.start-btn');
const title = document.querySelector('.page-title');
const primaryTitle = title.textContent;

const resultField = createCustomElem('div', 'result-field');

let peopleFound;

function debounce(func, delay = 1000) {
    let timer;
    return (...arguments) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, arguments); }, delay);
    }
}

function createCustomElem(tag,className, textContent = '', ) {
    const element = document.createElement(tag);
    element.classList.add(className);
    element.textContent = textContent;
    return element;
}

function displaySelectedPerson(event) {
    resultField.remove();
    const searchVal = event.target.textContent;
    const personInfo = peopleFound.filter(person => person.name === searchVal)[0];

    const personCard = createCustomElem('div', 'person-card');
    const personName = createCustomElem('h2', 'person-name', personInfo.name);
    const personBirth = createCustomElem('div', 'person-birth',
                                        `birth year: ${personInfo.birth_year}`);
    const personHeight = createCustomElem('div', 'person-height',
                                        `height: ${personInfo.height}cm`);
    personCard.append(personName, personBirth, personHeight);

    const prevPerson = document.querySelector('.person-card');
    if (prevPerson) prevPerson.remove();
    main.append(personCard);
}

function renderPeople(people, enterPoint){
    enterPoint.appendChild(resultField);
    const prevPerson = document.querySelector('.person-card');
    if (prevPerson) prevPerson.remove();

    if (people.length === 0)
        resultField.replaceChildren(document.createTextNode('nothing found'));
    else {
        const peopleElems = people.map(person => {
            const pName = createCustomElem('div', 'person-link', person.name);
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

    const searchDiv = createCustomElem('div', 'search-container');
    const searchBar = createCustomElem('input', 'search-bar');
    searchBar.placeholder = 'Type character`s name...';
    searchBar.type = 'text';
    searchDiv.append(searchBar);
    searchBar.addEventListener('input', (e) => { debounce(searchForChar)(e, searchDiv); } ); // search for char is a callback!

    const restartButton = createCustomElem('input', 'restart-btn');
    restartButton.type = 'button';
    restartButton.value = 'Back';
    restartButton.addEventListener('click', () => {
        pageForm.replaceChildren(startButton);
        main.classList.add('search-stopped');
        main.replaceChildren(pageForm);
        title.textContent = primaryTitle;
    })

    pageForm.replaceChildren(restartButton, searchDiv);
}

startButton.addEventListener('click', renderSearch);
