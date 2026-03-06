const createElements = (arr) =>{
    const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
    return htmlElements.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
    if(status === true){
        document.getElementById('spinner').classList.remove("hidden");
        document.getElementById('word-container').classList.add("hidden");
    }
    else{
        document.getElementById('spinner').classList.add("hidden");
        document.getElementById('word-container').classList.remove("hidden");
    }
}

const loadLessons = () => {
    const url = 'https://openapi.programming-hero.com/api/levels/all';
    fetch(url)
    .then((res) => res.json())
    .then((json) => displayLessons(json.data));
};

// Lessons object
// {id: 101, level_no: 1, lessonName: 'Basic Vocabulary'}

// word object
// {id: 76, level: 1, word: 'Fast', meaning: 'দ্রুত', pronunciation: 'ফাস্ট'}

const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach(btn => btn.classList.remove("active"));
}

const loadLevelWord = (id) => {
    manageSpinner(true);
    // console.log(id);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        removeActive(); // remove all active class
        const clickBtn = document.getElementById(`lesson-btn-${id}`);
        
        clickBtn.classList.add("active");
        displayLevelWord(data.data);
    });
};

const loadWordDetails = async(id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
};


// word details for modal

// {word: 'Eager', meaning: 'আগ্রহী', pronunciation: 'ইগার', level: 1, sentence: 'The kids were eager to open their gifts.', …}
// id
// : 
// 5
// level
// : 
// 1
// meaning
// : 
// "আগ্রহী"
// partsOfSpeech
// : 
// "adjective"
// points
// : 
// 1
// pronunciation
// : 
// "ইগার"
// sentence
// : 
// "The kids were eager to open their gifts."
// synonyms
// : 
// Array(3)
// 0
// : 
// "enthusiastic"
// 1
// : 
// "excited"
// 2
// : 
// "keen"

const displayWordDetails = (word) =>{
    console.log(word);
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
        <div>
            <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
            </div>
            <div>
                <h2 class="font-bold">Meaning</h2>
                <p>${word.meaning}</p>
            </div>
            <div>
                <h2 class="font-bold">Example</h2>
                <p>${word.sentence}</p>
            </div>
            <div>
                <h2 class="font-bold">Synonym</h2>
                <div>
                    ${createElements(word.synonyms)}
                </div>
                
            </div>
    `;
    document.getElementById("word_modal").showModal();
};

const displayLevelWord = (words) =>{
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = "";

    if(words.length === 0){
        wordContainer.innerHTML = `
            <div class="text-center col-span-full py-10 space-y-6 font-bangla">
                <img class="mx-auto" src="./assets/alert-error.png" alt="">
                <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="text-4xl font-bold">নেক্সট Lesson এ যান</h2>
            </div>
        `;
        manageSpinner(false);
        return;
    }

    words.forEach(word => {
        // console.log(word);
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="bg-white shadow-sm text-center rounded-xl py-10 px-5 space-y-4">
                <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
                <p class="font-semibold">Meaning /Pronounciation</p>
                <div class="font-bangla text-2xl font-medium">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}</div>
                <div class="flex justify-between items-center">
                    <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1A91FF20] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF20] hover:bg-[#1A91FF80]"><i class="fa-solid fa-play"></i></button>
                </div>
            </div>
        `;

        wordContainer.appendChild(card);
    });
    manageSpinner(false);
}

const displayLessons = (lessons) => {
    
    // 1. get container and make empty
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = "";

    // get into every lessons
    for(let lesson of lessons){
        // console.log(lesson);
        // 3. create element
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
        `;
        // 4. appent the child
        levelContainer.appendChild(btnDiv);
    }
}

loadLessons();

document.getElementById('btn-search').addEventListener('click',
    () =>{
        removeActive();
        const input = document.getElementById('input-search');
        const searchValue = input.value.trim().toLowerCase();
        // console.log(searchValue);

        fetch('https://openapi.programming-hero.com/api/words/all')
        .then((res) => res.json())
        .then((data) => {
            const allWords = data.data;
            // console.log(allWords);
            const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
            // console.log(filterWords);
            displayLevelWord(filterWords);
        });
    }
);

const cardContainer = document.querySelector("#card-container");

cardContainer.addEventListener('click',
    (event) => {
        const card = event.target.closest(".question-card");

        if(event.target.closest(".minus")){
            const paragraph = card.querySelector(".answer");
            const add = card.querySelector(".add");
            const minus = card.querySelector(".minus");

            paragraph.classList.add("hidden");
            minus.classList.add("hidden")
            add.classList.remove("hidden");

        }
        else if(event.target.closest(".add")){
            const paragraph = card.querySelector(".answer");
            const add = card.querySelector(".add");
            const minus = card.querySelector(".minus");

            console.log("Add clicked");
            paragraph.classList.remove("hidden");
            minus.classList.remove("hidden")
            add.classList.add("hidden");
        }
    }
)