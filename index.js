 

const domElements = (function(){
    const form = document.getElementById('freecourse');
    const customerNameInput = document.getElementById('customer-name');
    const courseNameInput = document.getElementById('course-type');
    const authorNameInput = document.getElementById('author-name');
    const courseLinkInput = document.getElementById('course-link');
    const customerName = document.querySelector('.customer-name');
    const courseType = document.querySelector('.course');
    const linkOfCourse = document.querySelector('.link');
    const authorName = document.querySelector('.author_name');
    const errorMessage = document.querySelector('.error_message');
    const cardsContainer = document.querySelector('.cards_container');
    return {
        form,
        customerNameInput,
        courseNameInput,
        authorNameInput,
        courseLinkInput,
        customerName,
        courseType,
        linkOfCourse,
        authorName,
        errorMessage,
        cardsContainer
    }
})()

const store = (function(){
    
    const getCourseFromStore = ()=>{
        let course;
        if(JSON.parse(localStorage.getItem('courses'))){
            course = JSON.parse(localStorage.getItem('courses'));
        } else {
            course = []
        }
        return course;
    }
    const storeCourseToStore = (currentCourse)=>{
        let courses = getCourseFromStore()
        courses.push(currentCourse);
        localStorage.setItem('courses', JSON.stringify(courses));

    }
    const deleteCourseFromStore = (id)=>{
        let courses = getCourseFromStore();
        courses = courses.filter(course => course.id != parseInt(id));
        localStorage.setItem('courses', JSON.stringify(courses))
    }
    return {
        storeCourseToStore,
        getCourseFromStore,
        deleteCourseFromStore
    }
})()

const ui = (function(){
    const alert = (message)=>{
        domElements.errorMessage.textContent = message;
        domElements.errorMessage.style.display = 'block';
        setTimeout(() => {
            domElements.errorMessage.style.display = 'none';
        }, 5000);
    }
    const generateDomNodes =(currentCourse) =>{
        const images = ['img1','img2','img3','img4','img5'];
        const randomImages = images[Math.floor(Math.random() * images.length)];

        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = 
        `
            <img src ="images/${randomImages}.jpg" alt="">
            <div class="course_description">
                    <div>
                        <span class="course_customer">Name:</span>
                        <span class="customer-name">${currentCourse.customer}</span>
                    </div>
                    <div>
                        <span class="course_type">Course:</span>
                        <span class="course">${currentCourse.course}</span>
                    </div>
                    <div>
                        <span class="course_author">Author:</span>
                        <span class="author_name">${currentCourse.author}</span>
                    </div>
                    <div>
                        <span class="course_link">Link:</span>
                        <a href="${currentCourse.link}"  class="link" target="_blank">Visit Here</a>
                    </div>
                    <a href="#" class="course_delete delete" data-id="${currentCourse.id}" >Delete</a>
                </div>
            </div>  
        `
        domElements.cardsContainer.appendChild(card);
        
        document.querySelectorAll('.card').forEach(card => card.addEventListener('click', removeCard));

    }
     
    const displayInLoad = ()=>{
        store.getCourseFromStore().forEach(course => displayCourse(course));
    }
    const displayCourse = (currentCourse)=>{
        generateDomNodes(currentCourse);
    }
    
    return {
        alert,
        displayCourse,
        displayInLoad
    }
})()
const removeCard = (e)=>{
     if(e.target.classList.contains('delete')){
         e.target.parentElement.parentElement.remove()
         store.deleteCourseFromStore(e.target.getAttribute('data-id'))
     }
}

const courses = (customer,course,link,author,id)=>{
    return {
        customer,
        course,
        link,
        author,
        id,
    }
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }
    

function addCourse(e){
    e.preventDefault();

    if((domElements.customerNameInput.value.trim() == '' ||
       domElements.courseNameInput.value.trim() == '' ||
       domElements.authorNameInput.value.trim() == '' ||
       domElements.courseLinkInput.value.trim() == '')) {
        ui.alert('Please fill all inputs');
        return;
    } else if((!validURL(domElements.courseLinkInput.value))){
        console.log('dsd')
        ui.alert('Please provide correct url');
        return;
    }
       const currentCourse = courses(domElements.customerNameInput.value,
                                     domElements.courseNameInput.value,
                                     domElements.courseLinkInput.value,
                                     domElements.authorNameInput.value,
                                     new Date().getMilliseconds())
       ui.displayCourse(currentCourse);
       store.storeCourseToStore(currentCourse);

    domElements.customerNameInput.value = '';
    domElements.courseNameInput.value = '';
    domElements.authorNameInput.value = '';
    domElements.courseLinkInput.value = '';
}

function load(){
    ui.displayInLoad();
 
}
domElements.form.addEventListener('submit',addCourse);
document.addEventListener('DOMContentLoaded', load());