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
    const searchVal = event.target.textContent;
    const personInfo = peopleFound.filter(person => person.name === searchVal)[0];

    const personCard = document.createElement('div');
    personCard.classList.add('person-card');
    const closeBtn = document.createElement('button')
    closeBtn.textContent = 'hide';
    closeBtn.addEventListener('click', () => { renderPeople(peopleFound)})

    const personName = document.createElement('h2');
    personName.textContent = personInfo.name;
    const personBirth = document.createElement('div');
    personBirth.textContent = `birth year: ${personInfo.birth_year}`;
    const personHeight = document.createElement('div');
    personHeight.textContent = `height: ${personInfo.height}cm`;

    personCard.append(closeBtn, personName, personBirth, personHeight);
    resultField.replaceChildren(personCard);
}

function renderPeople(people){
    main.appendChild(resultField);
    if (people.length === 0) resultField.replaceChildren(document.createTextNode('nothing found'));
    else {
        const peopleElems = people.map(person => {
            const pName = document.createElement('div');
            pName.textContent = person.name;
            pName.classList.add('person-link');
            pName.addEventListener('click', (e) => displaySelectedPerson(e));
            return pName;
        });
        resultField.replaceChildren(...peopleElems);
    }
}

function searchForChar(e) {
    const searchVal = e.target.value;
    if (!searchVal) {
        resultField.remove();
        return;
    }
    fetch(`https://swapi.dev/api/people?search=${searchVal}`)
        .then(response => response.json())
            .then(json => {
                peopleFound = json.results;
                renderPeople(peopleFound);
            })
        .catch( (error) => {
            console.error(`Download error ${error}`);
        });
}

function renderSearch() {

    title.textContent = 'Learn more about any of the characters';

    const pageForm = document.querySelector('.page-form');

    const searchBar = document.createElement('input');
    searchBar.placeholder = 'Type character`s name...';
    searchBar.type = 'text';
    searchBar.classList.add('search-bar');
    searchBar.addEventListener('input', (e) => { debounce(searchForChar)(e); } ); // search for char is a callback!

    const restartButton = document.createElement('input');
    restartButton.type = 'button';
    restartButton.value = 'Back';
    restartButton.classList.add('restart-btn');
    restartButton.addEventListener('click', () => {
        pageForm.replaceChildren(startButton);
        title.textContent = primaryTitle;
        resultField.remove();
    })

    pageForm.replaceChildren(restartButton, searchBar);
}

startButton.addEventListener('click', renderSearch);
