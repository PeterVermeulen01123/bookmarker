const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = []; // make an array for bookmarks ... use for local storage. consider making an object instead of array to make searching more efficient

//show modal and focus on first input in modal
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}


// modal event listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', ()=> modal.classList.remove('show-modal'));
window.addEventListener('click', (e)=>{ 
        //console.log(e.target); 
        (e.target=== modal 
            ? modal.classList.remove('show-modal')
            : false
        )
    });

//validate the form data
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    //check if they put a name value and/or url
    if(!nameValue || !urlValue){
        alert('Please submit values for both fields.');
        return false;
    }//else{}
    // if (urlValue.match(regex)) {
    //     alert('good URL');
    //     }
    if(!urlValue.match(regex)) {
        alert('Please Provide a Valid URL');
        return false;
    }
//validated
return true;
}
//buildBookmarks DOM
function buildBookmarks() {
    //remove all bookmark elements makes sure no duplicates when re-generating
    bookmarksContainer.textContent = '';
    //build items
    bookmarks.forEach((bookmark)=>{
        const {name, url} = bookmark;
        //Item
        const item = document.createElement('div');
        item.classList.add('item');
        //close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-window-close');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        //favicon link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        //favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://www.google.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        //link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        //append all this to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);

        
    });
}


//fetch bookmarks from local storage
function fetchBookmarks() {
    //get bookmarks from local storage if avail
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else{
        // create bookmarks array in localStorage
        bookmarks = [
            {
                name: 'Bookmarker',
                url: 'https://petervermeulen01123.github.io/bookmarker/',
            },
            {
                name: 'ChuckleBot',
                url: 'https://petervermeulen01123.github.io/joke-teller-bot/',
            },


            
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
        // build book marks    console.log(bookmarks);
        buildBookmarks();
}

// delete a bookmark
function deleteBookmark(url) {
//    console.log('delete URL', url);
    bookmarks.forEach((bookmark, i)=>{
        if(bookmark.url === url) {
            bookmarks.splice(i, 1);
        }        
    });
    //update bookmarks array in local storage, repopulate the DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
};

//handle data from form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue =  `https://${urlValue}`;
    }
    if (!validate(nameValue, urlValue)) {
        return false;
    }
//create const called bokmark. make it an object
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
//    console.log(JSON.stringify(bookmarks));
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();//call the fetch bookmarks function
    bookmarkForm.reset();
    websiteNameEl.focus();
}    
//event listener
bookmarkForm.addEventListener('submit', storeBookmark);
fetchBookmarks();//call the fetch bookmarks function onload
