//Dropdown menu logic
const dropDown = e => {

    const descriptionStyle = e.target.nextElementSibling.style;
    if(descriptionStyle.visibility === 'collapse') {
        descriptionStyle.visibility = 'visible';
    }
    else {
        descriptionStyle.visibility = 'collapse';
    }
}

const projectOne = document.getElementById('project-one');
const porjectTwo = document.getElementById('project-two');
projectOne.onclick = dropDown;
porjectTwo.onclick = dropDown;