const loadLessons = () => {
    const url = 'https://openapi.programming-hero.com/api/levels/all';
    fetch(url)
    .then((res) => res.json())
    .then((json) => displayLessons(json.data));
};

// Lessons object
// {id: 101, level_no: 1, lessonName: 'Basic Vocabulary'}

const displayLessons = (lessons) => {
    
    // 1. get container and make empty
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = "";

    // get into every lessons
    for(let lesson of lessons){
        console.log(lesson);
        // 3. create element
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
        `;
        // 4. appent the child
        levelContainer.appendChild(btnDiv);
    }
}
loadLessons();