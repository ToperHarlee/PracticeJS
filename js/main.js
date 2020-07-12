'use strict';

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];
let   counter = dataBase.length;
const modalAdd = document.querySelector('.modal__add'),
      addAd = document.querySelector('.add__ad'),
      modalBtnSubmit = document.querySelector('.modal__btn-submit'),
      modalSubmit = document.querySelector('.modal__submit'),
      catalog = document.querySelector('.catalog'),
      modalItem = document.querySelector('.modal__item'),
      modalBtnWarning = document.querySelector('.modal__btn-warning'),
      modalFileInput = document.querySelector('.modal__file-input'),
      modalFileBtn = document.querySelector('.modal__file-btn'),
      modalImageAdd = document.querySelector('.modal__image-add');

const modalImageItem = document.querySelector('.modal__image-item'),
      modalHeaderItem = document.querySelector('.modal__header-item'),
      modalStatusItem = document.querySelector('.modal__status-item'),
      modalDescriptionItem = document.querySelector('.modal__description-item'),
      modalCostItem = document.querySelector('.modal__cost-item');


const searchInput = document.querySelector('.search__input'),
      menuContainer = document.querySelector('.menu__container');

const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

const elementsModalSubmit = [...modalSubmit.elements].filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');

const infoPhoto = {};

const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));



/*const closeModal = event => {
    const target = event.target;
    /!*if(target.classList.contains('modal__close') || target === modalAdd) {
          modalAdd.classList.add('hide');
    }*!/ // или так -->
    if (target.closest('.modal__close') || target === modalItem || target === modalAdd) {
        modalItem.classList.add('hide');
        modalAdd.classList.add('hide');
        modalSubmit.reset(); // --> перезагрузка формы
    }
    document.addEventListener('keydown', function(event) {
        if (event.code == 'Escape') {
            modalAdd.classList.add('hide');
            modalItem.classList.add('hide');
        }
    });
};*/


const checkForm = () => {
    const validForm = elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : '';
}


/*const closeModal = function(event)  {
    const target = event.target;
    if (target.closest('.modal__close') || target === this) {
    this.classList.add('hide');
    if (this === modalAdd) {
        modalSubmit.reset(); // --> перезагрузка формы
    }
  }
    if (event.code === 'Escape') {
    modalAdd.classList.add('hide');
    modalItem.classList.add('hide');
    document.removeEventListener('keydown', closeModal);
    modalSubmit.reset();
    checkForm();
    }
};*/

//-->другой вариант
const closeModal = event => {
    const target = event.target;

    if (target.closest('.modal__close') || target.classList.contains('modal') || event.code === 'Escape') {
        modalAdd.classList.add('hide');
        modalItem.classList.add('hide');
        document.removeEventListener('keydown', closeModal);
        modalSubmit.reset();
        modalImageAdd.src = srcModalImage;
        modalFileBtn.textContent = textFileBtn;
        checkForm();
    }
};

const renderCard = (DB = dataBase) => {
    catalog.textContent = '';

    DB.forEach((item) => {
         catalog.insertAdjacentHTML('beforeend', `
             <li class="card" data-id-item="${item.id}">
\t\t\t\t\t<img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
\t\t\t\t\t<div class="card__description">
\t\t\t\t\t\t<h3 class="card__header">${item.nameItem}</h3>
\t\t\t\t\t\t<div class="card__price">${item.costItem} ₽</div>
\t\t\t\t\t</div>
\t\t\t\t</li>
         `);
    });
};

const openModal = event => {
    const target = event.target;
    const card = target.closest('.card');
    const item = dataBase.find(obj => obj.id === parseInt(card.dataset.id));

    if(card) {
        //если что то не получил посмотреть по логу
        console.log(card.dataset.idItem);
        console.log(dataBase);
        modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
        modalHeaderItem.textContent = item.nameItem;
        modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
        modalDescriptionItem.textContent = item.descriptionItem;
        modalCostItem.textContent = item.costItem;
        modalItem.classList.remove('hide');
    }
    if(target.closest('.add__ad')) {
        modalAdd.classList.remove('hide');
        modalBtnSubmit.disabled = true;
    }
    document.addEventListener('keydown', closeModal);
};

/*modalSubmit.addEventListener('input', () => {
    const validForm = elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : '';
    //тоже самое через if -->
    /!*if (validForm) {
        modalBtnWarning.style.display = 'none'
    } else {
        modalBtnWarning.style.display = '';
    }*!/
});*/

//поиск
searchInput.addEventListener('input', () => {
    const valueSearch = searchInput.value.trim().toLowerCase();
    if(valueSearch.length > 2){
       const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(valueSearch) ||
                                              item.descriptionItem.toLowerCase().includes(valueSearch));
       renderCard(result);
    }
});

modalFileInput.addEventListener('change', event => {
    const target = event.target;
    const reader = new FileReader();
    const file = target.files[0];

    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;

    reader.readAsBinaryString(file);//метод отслеживает когда появилсяфайл и сразу считывает его содержимое

    reader.addEventListener('load', event => {
        if (infoPhoto.size < 200000) {
            //load обрабатывает файл когда он будет загружен
            modalFileBtn.textContent = infoPhoto.filename;
            infoPhoto.base64 = btoa(event.target.result);//base64 это формат
            modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
        } else {
            modalFileBtn.textContent = 'Размер файла не должен превышать 200кб';
            modalFileInput.value = '';
            checkForm();
        }
    });
});

modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event => {
    event.preventDefault();
    const itemObj = {};
    for (const elem of elementsModalSubmit) {
        itemObj[elem.name] = elem.value;
    }
    itemObj.id = counter++;
    itemObj.image = infoPhoto.base64;
    dataBase.push(itemObj);
    closeModal({target: modalAdd});
    saveDB();
    renderCard();
});

menuContainer.addEventListener('click', event => {
    const target = event.target;

    if(target.tagName === 'A'){
        const result = dataBase.filter(item => item.category === target.dataset.category);
        renderCard(result);
    }
});


addAd.addEventListener('click', openModal);
catalog.addEventListener('click', openModal);
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);
renderCard();

