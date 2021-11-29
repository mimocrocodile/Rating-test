let apiPopular = "https://api.themoviedb.org/3/movie/popular?api_key=788d8d340536c97e76b580d97ee6c8cc&language=en-US&page=3"
let container = document.querySelector('.container')
let storageHelper = [], titleArray = []

fetchHandler(apiPopular)

//Асинхронная функция для получения информации с сервера и декодирования в Json формате 
async function fetchHandler(api) {
  const response = await fetch(api)
  const data = await response.json()
  getData(data.results)
}


function getData(data) {
    // Далле два одинаковых цикла, которые отличаются только расположением json файлов. 
    //localJson - из локального файла, data - берется через api с сервера.
    //Если будете пробовать оба способа, то надо будет очистить localStorage, иначе он будет пихать значения, которые получил раньше.
    // Для очистки localStorage в верстке есть закомментированная кнопка, нажатие по которой вызывает функцию, которая чистит localStorage 
  if (localStorage.length == 0) {

    // for (let i = 0; i < 6; i++) {
    //   titleArray.push(localJson.members[i].name)
    // }
    for (let i = 0; i < 6; i++) {
      
      titleArray.push(data[i].title) // Здесь вытаскиваем из json только названия, которые потом запишем в инпуты. Цикл ограничен из соображение экономии места
    }

    localStorage.setItem("Data", JSON.stringify(titleArray)) // заносим информацию в localStorage
    storageHelper = JSON.parse(localStorage.getItem("Data")) // Основная идея storageHelper'a в том, что перенимать на себя все изменения, которые будут потом передаваться и хранится в localStorage
  }
  else { storageHelper = JSON.parse(localStorage.getItem("Data")) } // так как массивы не живут дольше одной сессии, то при обновление/повторном открытие заполняем его заново

  fillForm()

}

function fillForm() {
  //Так как нам, обычно, заведомо неизвестно, какое количество записей поступает на вход, то создадим универсальную функцию, которая будет
  //генерировать необходимое количество инпутов/кнопок/блоков и тд. Создаем инпуты и кнопки. Раздаем классы, исполняемые функции по нажатию на кнопки и тд.
  //А после закидываем это все в основной контейнер
  container.innerHTML = "";
  for (let i = 0; i < storageHelper.length; i++) {

    let mainInput = document.createElement("input");
    mainInput.value = storageHelper[i];
    mainInput.type = "text";
    mainInput.className = "main__input";
    mainInput.readOnly = true;

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.className = "delete__button"
    deleteButton.onclick = function () {
      storageHelper.splice(i, 1) // Удаляем выбранный инпут и обновляем информацию в localStorage
      localStorage.setItem("Data", JSON.stringify(storageHelper))
      fillForm();

    };

    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";

   
    editButton.className = "edit__button";
    editButton.onclick = function () {
      editButton.style.display = "none"; // По нажатию жонглируем кнопками edit и save
      saveButton.style.display = "block";
      let changedInput = document.querySelectorAll(".main__input")
      let editArray = document.querySelectorAll(".edit__button")
      //После нажатия на конкретную кнопку редактирования, блокируем все остальные кнопки редактирования
      //Этот функционал необходим для корректной работы программы, когда у нас реализован вариант (разные кнопки редактирования могут разблокировать все инпуты. В другом варианте реализации (одна кнопка - один инпут) этот функционал не нужен, потому что кнопка редактирования может разблокировать только свой инпут)
      for(let i = 0; i<editArray.length; i++){
        if(saveButton.id != i){
          editArray[i].disabled = true
        }
      }
      
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // Здесь мы разблокируем все инпуты. Закомментированная строка нужна для варианта реализации (каждая кнопка редактирования отвечает за свой инпут)
       changedInput.forEach(el => el.readOnly = false) 
      //changedInput[saveButton.id].readOnly = false
      // !!!!!!!!!!!!!!!!!!!!!!!!!!
    };

    let saveButton = document.createElement("button");
    saveButton.innerHTML = "Save";
    saveButton.className = "save__button"
    saveButton.id = i;
    saveButton.style.display = "none"; //Изначально мы должны видить только кнопку редактирования, а кнопку сохрания - только после нажатия на edit
    saveButton.onclick = function () {
      saveButton.style.display = "none";
      editButton.style.display = "block";
      let changedInput = document.querySelectorAll(".main__input")
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      
      for (let i = 0; i < changedInput.length; i++) {
      // После редактирования записей в инпутах, перезаписываем всю информацию в массив, а потом и в localStorage
        storageHelper[i] = changedInput[i].value 
      }
      //После нажатия на кнопку сохранить, разблоруем доступ к остальным кнопкам
       let editArray = document.querySelectorAll(".edit__button")
      for(let i = 0; i<editArray.length; i++){
        if(saveButton.id != i){
          editArray[i].disabled = false
        }
      }
      //Следующая строка отвечает за реализацию концепции (одна кнопка редактирования отвечает за свой инпут)
     // storageHelper[saveButton.id] = changedInput[saveButton.id].value
      
      localStorage.setItem("Data", JSON.stringify(storageHelper))
      changedInput.forEach(el => el.readOnly = true)
    };
  
    container.append(mainInput);
    container.append(deleteButton);
    container.append(editButton);
    container.append(saveButton);
  }

}


function add() { 
  //Простая функция записи новых инпутов. Работает так же как и остальные, за исключением проверки на заполнение
  let text = document.querySelector(".add__input")
  if (text.value) {
    storageHelper.push(text.value)
    localStorage.setItem("Data", JSON.stringify(storageHelper))
    text.value = ""
    fillForm()
  }
}

function clearStorage() {
  localStorage.clear()
}



