
import {inicialState, state, db} from '../app.js';
import { initializeApp } from "firebase/app";
import {
	getDatabase,
	ref,
	get,
	set,
	child,
	update,
	remove
} from "firebase/database";

//--------add active clear func--------

function toggleClassActive(arr, target){
	arr.forEach(e => e.classList.remove('active'));
	target.classList.add('active');
}

//универсальная фенкция, чтобы повесить событие на массив элементов, например найти все кнопки и разом повесить одно событие
export function addListenerToArrOfElements(className, func){
	document.querySelectorAll(className).forEach(elem => elem.onclick = func);
}

//функция получает все поля из новой карточки  в переменные
export function getAllFieldFromNewCard(){
	return {
		workplace: document.querySelector('#workplace'),
		surname: document.querySelector('#surname'),
		name: document.querySelector('#name'),
		patronymic: document.querySelector('#patronymic'),
		structuralSubdivision: document.querySelector('#structuralSubdivision'),
		workNumber: document.querySelector('#workNumber'),
		profession: document.querySelector('#profession'),
		dateOfStartInCompany: document.querySelector('#dateOfStartInCompany'),
		dateOfChangeProfession: document.querySelector('#dateOfChangeProfession'),
		newProfessionInfo: document.querySelector('#newProfessionInfo'),
		gender: document.querySelector('#gender'),
		height: document.querySelector('#height'),
		clothingSize: document.querySelector('#clothingSize'),
		shoeSize: document.querySelector('#shoeSize'),
		headgearSize: document.querySelector('#headgearSize'),
		gasMaskSize: document.querySelector('#gasMaskSize'),
		respiratorSize: document.querySelector('#respiratorSize'),
		sizeOfMittens: document.querySelector('#sizeOfMittens'),
		gloveSize: document.querySelector('#gloveSize'),
		deliveryOfThings: document.querySelector('#deliveryOfThings'),
		normData: getDataFromTableOfnorms('#normsTable'),//получим массив объектов таблицы норм выдачи
		receivedData: getDataFromTableOffReceived('#receivedTable'),
	}
}

//функция получает все поля из карточки,в разделе редактирование, в переменные
export function getAllFieldFromEditCard(){
	return {
		workplace: document.querySelector('#getWorkplace'),
		surname: document.querySelector('#getSurname'),
		name: document.querySelector('#getName'),
		patronymic: document.querySelector('#getPatronymic'),
		structuralSubdivision: document.querySelector('#getStructuralSubdivision'),
		workNumber: document.querySelector('#getWorkNumber'),
		profession: document.querySelector('#getPofession'),
		dateOfStartInCompany: document.querySelector('#getDateOfStartInCompany'),
		dateOfChangeProfession: document.querySelector('#getDateOfChangeProfession'),
		newProfessionInfo: document.querySelector('#getNewProfessionInfo'),
		gender: document.querySelector('#getGender'),
		height: document.querySelector('#getHeight'),
		clothingSize: document.querySelector('#getClothingSize'),
		shoeSize: document.querySelector('#getShoeSize'),
		headgearSize: document.querySelector('#getHeadgearSize'),
		gasMaskSize: document.querySelector('#getGasMaskSize'),
		respiratorSize: document.querySelector('#getRespiratorSize'),
		sizeOfMittens: document.querySelector('#getSizeOfMittens'),
		gloveSize: document.querySelector('#getGloveSize'),
		deliveryOfThings: document.querySelector('#getDeliveryOfThings'),
		normData: getDataFromTableOfnorms('#getNormsTable'),
		receivedData:  getDataFromTableOffReceived('#getReceivedTable'),
	}
}
///////////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//Показывает карточку сотрудника со всеми полями
export function showCompliteCard(e) {
	//e.stopPropagation()
	//перед тем как показать новую карточку - сносим полностью всех детей у родителя таблицы, иначи они будут наслаиваться друг на друга и всё смешается
	deleteTable('.created-norm-grid-container');
	deleteTable('.self-card__received-grid-container-created');
	let target = e.target;
	
	if(e.target.classList.contains('list__item')) {
		target = target.closest('.list__items');
	}

	if (target.classList.contains('list__items')) {
		const collectionOfListItem = document.querySelectorAll('.list__item');
		toggleClassActive(collectionOfListItem, target);
		const parents = document.querySelectorAll('.list__items')
		const targetParent = target.closest('.list__items')
		//добавляем класс активности для бокового списка 
		toggleClassActive(parents, targetParent);

		//ищем id в атрибуте
		const parentId = targetParent.getAttribute('id');

		//устанавливаем карте атрибут для возможности последующего удаления или редактирования карты и отправки в базу. По этому атрибуту будем искать совпадение в state
		document.querySelector('#getEmployeeInfo').setAttribute('employee-id', parentId);

		//ищем ту самую карту по атрибуту id
		const wishCard = state.company.staff.find(e => e.id == parentId);
		
		const normsForEmployee = wishCard.normsForEmployee;
		const receivedByEmployee = wishCard.receivedOfEmployee;

		const allFields = getAllFieldFromEditCard();
		allFields.workplace.textContent = wishCard.workplace;
		allFields.surname.value = wishCard.surname;
		allFields.name.value = wishCard.name;
		allFields.patronymic.value = wishCard.patronymic;
		allFields.structuralSubdivision.value = wishCard.structuralSubdivision;
		allFields.workNumber.value = wishCard.workNumber;
		allFields.profession.value = wishCard.profession;
		allFields.dateOfStartInCompany.value = wishCard.dateOfStartInCompany;
		allFields.dateOfChangeProfession.value = wishCard.dateOfChangeProfession;
		allFields.newProfessionInfo.value = wishCard.newProfessionInfo;
		allFields.gender.textContent = wishCard.gender;
		allFields.height.value = wishCard.height;
		allFields.clothingSize.textContent = wishCard.clothingSize;
		allFields.shoeSize.textContent = wishCard.shoeSize;
		allFields.headgearSize.textContent = wishCard.headgearSize;
		allFields.gasMaskSize.textContent = wishCard.gasMaskSize;
		allFields.respiratorSize.textContent = wishCard.respiratorSize;
		allFields.sizeOfMittens.textContent = wishCard.sizeOfMittens;
		allFields.gloveSize.textContent = wishCard.gloveSize;
		allFields.deliveryOfThings.value = wishCard.deliveryOfThings;

		//отрисовка таблиц норм выдачи
		renderOfNormsTable(normsForEmployee);
		renderOfReceivedTable(receivedByEmployee);
		//переключаем на показ найденной карточки при клике на сотрудника слева
		document.querySelector('#makeNewCard').classList.remove('active');
		document.querySelector('#selfCard').classList.remove('active');
		document.querySelector('#showReadyCard').classList.add('active');
		document.querySelector('#getEmployeeInfo').classList.add('active');
	}
}

//Функция добавления новой карточки в базу данных
export async function addNewPersonCardToFirebase() {
	//получаем последние изменения в базе перед отправкой новой карточки. Это нужно если параллельно кто-то уже внёс изменения в код и мы его теперь не перезатрём.
	await getAllDataFromBase();
	const allFields = getAllFieldFromNewCard();

	const newWorker = {
		id: Date.now(),//присваиваем id для возможности дальнейших манёвров
		workplace: allFields.workplace.textContent,
		surname: allFields.surname.value,
		name: allFields.name.value,
		patronymic: allFields.patronymic.value,
		structuralSubdivision: allFields.structuralSubdivision.value,
		workNumber: allFields.workNumber.value,
		profession: allFields.profession.value,
		dateOfStartInCompany: allFields.dateOfStartInCompany.value,
		dateOfChangeProfession: allFields.dateOfChangeProfession.value,
		newProfessionInfo: allFields.newProfessionInfo.value,
		gender: allFields.gender.textContent,
		height: allFields.height.value,
		clothingSize: allFields.clothingSize.textContent,
		shoeSize: allFields.shoeSize.textContent,
		headgearSize: allFields.headgearSize.textContent,
		gasMaskSize: allFields.gasMaskSize.textContent,
		respiratorSize: allFields.respiratorSize.textContent,
		sizeOfMittens: allFields.sizeOfMittens.textContent,
		gloveSize: allFields.gloveSize.textContent,
		deliveryOfThings: allFields.deliveryOfThings.value,
		normsForEmployee: allFields.normData,
		receivedOfEmployee: allFields.receivedData,
	}

	const staff = state.company.staff;
	staff.push(newWorker); //пушим в локальный стэйт

	set(ref(db, `company/staff`), staff); //код добавления в базу данных нашего локального стэйта
	clearAllFieldsInForm(allFields);// чистим поля формы
	deleteTable('.created-norm-grid-container');//удаляем все таблицы норм выдачи
	deleteTable('.self-card__received-grid-container-created')//удаляем все таблицы полученных вещей
	tableOfnorms('#normsTable');//создаём чистую новую строку таблицы норм выдачи
	getAllDataFromBase();// получаем всю дату из базы
	showStaffsOnPage(); // выводим наш стафф на страницу в бар
}

//функция сохранения карточки после её редактирования.
export async function editExistStaffCardAndReplaceItInFirebase(){
	//все поля с карточки
	const state = await getAllDataFromBase();

	const allField = getAllFieldFromEditCard();

	const parentElement = document.querySelector('#getEmployeeInfo');
	const parentId = parentElement.getAttribute('employee-id');//получили id карточки
	const allEmployees = state.company.staff;//получили всех рабочих

//изменяем поля в объекте рабочего
	allEmployees.forEach(elem => { 
		if(elem.id == parentId){
			elem.workplace = allField.workplace.textContent;
			elem.surname = allField.surname.value;
			elem.name = allField.name.value;
			elem.patronymic = allField.patronymic.value;
			elem.structuralSubdivision = allField.structuralSubdivision.value;
			elem.workNumber = allField.workNumber.value;
			elem.profession = allField.profession.value;
			elem.dateOfStartInCompany = allField.dateOfStartInCompany.value;
			elem.dateOfChangeProfession = allField.dateOfChangeProfession.value;
			elem.newProfessionInfo = allField.newProfessionInfo.value;
			elem.gender = allField.gender.textContent;
			elem.height = allField.height.value;
			elem.clothingSize = allField.clothingSize.textContent;
			elem.shoeSize= allField.shoeSize.textContent ;
			elem.headgearSize = allField.headgearSize.textContent;
			elem.gasMaskSize = allField.gasMaskSize.textContent;
			elem.respiratorSize = allField.respiratorSize.textContent;
			elem.sizeOfMittens = allField.sizeOfMittens.textContent;
			elem.gloveSize = allField.gloveSize.textContent;
			elem.deliveryOfThings = allField.deliveryOfThings.value;
			elem.normsForEmployee = allField.normData;
			elem.receivedOfEmployee = allField.receivedData;
		}
	})
	const staff = state.company.staff;
	set(ref(db, `company/staff`), staff);
	showStaffsOnPage();
}

//очищает поля в форме
export function clearAllFieldsInForm(obj) { 
	for(let key in obj) {obj[key].value = '';};
}

//управляет подтверждающими модалками при редактировании или удалении карточек
export function editOrDeleteBtn(nameOfModal, delOrEditFunc) {
	const modal = document.querySelector(nameOfModal);
	const modalBtnYes = modal.querySelector('.modal-confirm__button-yes');
	const modalBtnNo = modal.querySelector('.modal-confirm__button-no');

	modal.classList.add('active');

	modalBtnNo.addEventListener('click', () => modal.classList.remove('active'));
	modalBtnYes.addEventListener('click', () => {
		delOrEditFunc(); // <-- приходит как аргумент
		modal.classList.remove('active');
	});
};

//---------------GET ALL DATA FROM FIREBASE (inicialization)-----------------
//Файербэйсовская функция, нужно её изучить получше
export function getAllDataFromBase() { //получение данных из базы
	const dbref = ref(db);

	return get(child(dbref, "/"))
	.then(data => {
		if (data.val() != null){ 
			state = data.val();
			state.company.staff = state.company.staff.filter((e) => e != null)
			return state
		} else {return inicialState;} //если данных нет - присваеваем каркас из store
	})
}

//Функция вывода списка сотрудников в сайдбар. По умолчанию выводит в порядке добавления в базу данных
export function showStaffsOnPage() {
	const out = document.querySelector('.list__out');
	out.innerHTML = '';
	const staff = state.company.staff;
	
	staff.forEach(e => {
		let patronymic;
		if(e.patronymic[0]) patronymic = e.patronymic[0] + '.';
		else patronymic = '';

		//вывод ФИО сотрудников в сайдбар
		out.innerHTML += ` 
		<div class='list__items' firm='${e.workplace}' id='${e.id}'>
			<div class='list__item'> ${e.surname} ${e.name[0]}. ${patronymic}</div>
			<div class='list__item'>${e.workplace == 'СТРОЙЛЮКС'? 'С-ЛЮКС' : e.workplace}</div>
		</div>
		`;
	});
};

//функция сортирующая список сотрудников в сайдбаре по алфавиту
export function showSortedStaffsOnPage() {
	const out = document.querySelector('.list__out');
	out.innerHTML = '';
	const json = JSON.stringify(state.company.staff);
	const staff =  JSON.parse(json);

	staff.sort((a,b) => {
		const personDataA = a.surname + a.name + a.patronymic;
		const personDataB = b.surname + b.name + b.patronymic;
		return personDataA > personDataB ? 1 : -1;
	})

	staff.forEach(e => {
		let patronymic = e.patronymic[0];
		if(patronymic)patronymic += '.';
		else patronymic = '';

		out.innerHTML += ` 
		<div class='list__items' firm='${e.workplace}' id='${e.id}'>
			<div class='list__item'> ${e.surname} ${e.name[0]}. ${patronymic}</div>
			<div>${e.workplace == 'СТРОЙЛЮКС'? 'С-ЛЮКС' : e.workplace}</div>
		</div>
		`;
	});
};

//функция удаляет карточку из базы данных
export function deleteExistStaffCard(){
	const parentElement = document.querySelector('#getEmployeeInfo');
	const parentId = parentElement.getAttribute('employee-id');//получили id карточки
	const allEmployees = state.company.staff;

	//фильтруем state, удаоляем оттуда карточку
	const newStaffList = allEmployees.filter(e => e.id != parentId);
	state.company.staff = newStaffList;//заменяем поля в state
	set(ref(db, `company/staff`), newStaffList);//отправляем в базу новый state

	const allFields = getAllFieldFromEditCard(); //получаем все поля формы

	clearAllFieldsInForm(allFields); //очищаем все поля формы
	showStaffsOnPage(); //обновляем список
}


//создаёт новую строку в таблице норм выдачи
export function tableOfnorms(id){
	const tableWrapper = document.querySelector(id);
	const div = document.createElement("div");
	div.classList.add('self-card__norm-grid-container');
	div.classList.add('created-norm-grid-container');
	div.setAttribute('id', Date.now());
	div.innerHTML = `
		<input class="self-card__norm-grid-item input name"></input>
		<input class="self-card__norm-grid-item input typeNorms" type='number'></input>
		<input class="self-card__norm-grid-item input measure"></input>
		<input class="self-card__norm-grid-item input picsForYear" type='number'></input>
		<div class="self-card__norm-grid-item-btn-wrapper">
			<div class="self-card__norm-grid-item del-button-tableOfnorms">&times;</div>
		</div>
`;
	tableWrapper.append(div);
	//обновляем слушатели кнопок
	addListenerToArrOfElements('.del-button-tableOfnorms', delTargetNormTable);
	addListenerToArrOfElements('.del-button-tableOfReceived', delTargetReceivedTable);
};

//создаёт новую строку в таблице полученных предметов
export function tableOfReceived(id){
	const tableWrapper = document.querySelector(id);
	const div = document.createElement("div");
	div.classList.add('self-card__received-grid-container');
	div.classList.add('self-card__received-grid-container-created');
	div.setAttribute('id', Date.now());
	div.innerHTML = `
		<textarea class="self-card__received-grid-item received  nameOfThing textarea "></textarea>
		<textarea class="self-card__received-grid-item received  sertNum textarea"></textarea>
		<input class="self-card__received-grid-item received     dateOfTake" type='date'></input>
		<input class="self-card__received-grid-item received     takePics" type='number'></input>
		<input class="self-card__received-grid-item received     percentTake" type='number'></input>
		<textarea class="self-card__received-grid-item received  signOwner textarea " ></textarea>
		<input class="self-card__received-grid-item received     dateOfSend" type='date'></input>
		<input class="self-card__received-grid-item received     sendPics" type='number'></input>
		<input class="self-card__received-grid-item received     percentSend" type='number'></input>
		<textarea class="self-card__received-grid-item received  signOldOwner textarea"></textarea>
		<textarea class="self-card__received-grid-item received  signNewOwner textarea f"></textarea>
		<div class="self-card__received-grid-item-btn-wrapper">
			<div class="self-card__received-grid-item del-button-tableOfReceived">&times;</div>
		</div>
	`;
	tableWrapper.append(div);

	addListenerToArrOfElements('.del-button-tableOfReceived', delTargetReceivedTable);
}

export function getDataFromTableOffReceived(id){
	const parent = document.querySelector(id);
	const receivedContainer = parent.querySelectorAll('.self-card__received-grid-container-created');
	const arrReceivedContainers = [];
	receivedContainer.forEach(receivedContainer => {
		arrReceivedContainers.push({
			id: receivedContainer.getAttribute('id'),
			nameOfThing: receivedContainer.querySelector('.nameOfThing').value,
			sertNum: receivedContainer.querySelector('.sertNum').value,
			dateOfTake: receivedContainer.querySelector('.dateOfTake').value,
			takePics: receivedContainer.querySelector('.takePics').value,
			percentTake: receivedContainer.querySelector('.percentTake').value,
			signOwner: receivedContainer.querySelector('.signOwner').value,
			dateOfSend: receivedContainer.querySelector('.dateOfSend').value,
			sendPics: receivedContainer.querySelector('.sendPics').value,
			percentSend: receivedContainer.querySelector('.percentSend').value,
			signOldOwner: receivedContainer.querySelector('.signOldOwner').value,
			signNewOwner: receivedContainer.querySelector('.signNewOwner').value,
		});
	});
	return arrReceivedContainers
};

//Функция собирает данные из всех полей таблицы норм выдачи и возвращает в качестве массива объектов
export function getDataFromTableOfnorms(id){
	const parent = document.querySelector(id);
	const normsContainers = parent.querySelectorAll('.created-norm-grid-container');
	const arrNormContainers = [];
	normsContainers.forEach(normsContainer => {
		arrNormContainers.push({
			id: normsContainer.getAttribute('id'),
			name: normsContainer.querySelector('.name').value,
			typeNorms: normsContainer.querySelector('.typeNorms').value,
			measure: normsContainer.querySelector('.measure').value,
			picsForYear: normsContainer.querySelector('.picsForYear').value,
		});
	});
	return arrNormContainers;
};

//универсальная функция. получает класс, находит все теги с таким классом и удаляет их. Удобно использовать на врапперах
export function deleteTable(classOfcontainer){
	const normsContainer = document.querySelectorAll(classOfcontainer);
	normsContainer.forEach(elem => elem.remove());
}

export function renderOfReceivedTable(arrReceivedForEmployee){
	const tableWrapper = document.querySelector('#getReceivedTable');

	if(arrReceivedForEmployee) {
		arrReceivedForEmployee.forEach(obj => {
			const div = document.createElement("div");
			div.classList.add('self-card__received-grid-container');
			div.classList.add('self-card__received-grid-container-created');
			div.setAttribute('id', obj.id);
			div.innerHTML = `
				<textarea class="self-card__received-grid-item received  nameOfThing textarea"      >${obj.nameOfThing}</textarea>
				<textarea class="self-card__received-grid-item received  sertNum textarea"          >${obj.sertNum}</textarea>
				<input class="self-card__received-grid-item received     dateOfTake" type='date'    value="${obj.dateOfTake}"></input>
				<input class="self-card__received-grid-item received     takePics" type='number'    value="${obj.takePics}"></input>
				<input class="self-card__received-grid-item received     percentTake" type='number' value="${obj.percentTake}"></input>
				<textarea class="self-card__received-grid-item received  signOwner textarea "       >${obj.signOwner}</textarea>
				<input class="self-card__received-grid-item received     dateOfSend" type='date'    value="${obj.dateOfSend}"></input>
				<input class="self-card__received-grid-item received     sendPics" type='number'    value="${obj.sendPics}"></input>
				<input class="self-card__received-grid-item received     percentSend" type='number' value="${obj.percentSend}"></input>
				<textarea class="self-card__received-grid-item received  signOldOwner textarea"     >${obj.signOldOwner}</textarea>
				<textarea class="self-card__received-grid-item received  signNewOwner textarea f"   >${obj.signNewOwner}</textarea>
				<div class="self-card__received-grid-item-btn-wrapper">
					<div class="self-card__received-grid-item del-button-tableOfReceived">&times;</div>
				</div>
			`;
			tableWrapper.append(div);
		})
		addListenerToArrOfElements('.del-button-tableOfReceived', delTargetReceivedTable);
	}
}

//когда мы хотим просмотреть чью-то карточку, функция собирает и выводит заполненную таблицу норм выдачи на страницу
export function renderOfNormsTable(arrNormsForEmployee){
	const tableWrapper = document.querySelector('#getNormsTable');

	if(arrNormsForEmployee) {
		arrNormsForEmployee.forEach(obj => {
			const div = document.createElement("div");
			div.classList.add('self-card__norm-grid-container');
			div.classList.add('created-norm-grid-container');
			div.setAttribute('id', obj.id);
			div.innerHTML = `
				<input class="self-card__norm-grid-item input name"  value="${obj.name}"></input>
				<input class="self-card__norm-grid-item input typeNorms" value="${obj.typeNorms}" type='number'></input>
				<input class="self-card__norm-grid-item input measure" value="${obj.measure}"></input>
				<input class="self-card__norm-grid-item input picsForYear" value="${obj.picsForYear}" type='number'></input>
				<div class="self-card__norm-grid-item-btn-wrapper">
					<div class="self-card__norm-grid-item del-button-tableOfnorms">&times;</div>
				</div>
		`;
			tableWrapper.append(div);
			//обновляем слушатели кнопок
			addListenerToArrOfElements('.del-button-tableOfnorms', delTargetNormTable);
			addListenerToArrOfElements('.del-button-tableOfReceived', delTargetReceivedTable);
		});
	};
};

//ф-ция удаления строки таблицы норм. Также удаляет строку из стэйт. Сохранение нужер инициировать нажатием кнопки сохранить изменения(оранжевая)
export function delTargetNormTable(e){
	let targetBtn;
	let targetCard;

	 //кнопка удаления по которой клик
	if(e.target.classList.contains('del-button-tableOfnorms'))  targetBtn = e.target;

	//id строки таблици которую нужно удалить
	const tableOfNormsRow = targetBtn.closest('.self-card__norm-grid-container'); // этот тег будем вконце удалять, чтобы визуально изменить вид таблицы до сохранения состояния
	const idTableOfNormsRow =  tableOfNormsRow.getAttribute('id');
	//id ниже есть только у существующих карт. Новая карта возвращает null
	//нужен для поиска карточки в state.company.staff
	const idCardOfEmployeeId = targetBtn.closest('.main-content__page').getAttribute('employee-id');
	if (idCardOfEmployeeId) {
		const anyCard = state.company.staff; //все карточки из state
		//ищем нужную карточку в стэйте и ссылаемся на её объект в targetCard
		anyCard.forEach(elem => {if (elem.id == idCardOfEmployeeId) targetCard = elem;})
		//ищем запись таблицы и удаляем её из стэйта (normsForEmployee - поле таблицы где лежат массивы. Внутри хранится  id по которым и сортируемся)
		targetCard.normsForEmployee = targetCard.normsForEmployee.filter(e => e.id != idTableOfNormsRow);
	};
	tableOfNormsRow.remove();
};

export function delTargetReceivedTable(e){
	let targetBtn;
	let targetCard;
	if(e.target.classList.contains('del-button-tableOfReceived'))  targetBtn = e.target;
	const tableOfReceivedRow = targetBtn.closest('.self-card__received-grid-container'); 
	const idTableOfReceivedRow =  tableOfReceivedRow.getAttribute('id');
	const idCardOfEmployeeId = targetBtn.closest('.main-content__page').getAttribute('employee-id');
	if (idCardOfEmployeeId) {
		const anyCard = state.company.staff;
		anyCard.forEach(elem => {if (elem.id == idCardOfEmployeeId) targetCard = elem;})
		targetCard.receivedOfEmployee = targetCard.receivedOfEmployee.filter(e => e.id != idTableOfReceivedRow);
	};
	tableOfReceivedRow.remove();
};

export async function firstStartApp(){
	state = await getAllDataFromBase()// асинхронная функция
	showStaffsOnPage()// синхронная функция, выполнить после асинхронной
}