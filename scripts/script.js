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
const projectTwo = document.getElementById('project-two');
const projectThree = document.getElementById('project-three');
projectOne.onclick = dropDown;
projectTwo.onclick = dropDown;
projectThree.onclick = dropDown;