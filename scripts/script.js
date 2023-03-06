//Dropdown menu logic
const dropDown = e => {

    const description = e.target.nextElementSibling;
    if(description.hasAttribute('hidden')) {
        description.removeAttribute('hidden');
    }
    else {
        description.setAttribute('hidden', "");
    }

}

const projectOne = document.getElementById('project-one');
const porjectTwo = document.getElementById('project-two');
projectOne.onclick = dropDown;
porjectTwo.onclick = dropDown;