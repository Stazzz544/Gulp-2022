
//import * as flsFunctions from "./modules/isWebp.js"
import {isWebp} from "./modules/isWebp.js";
import {select} from "./modules/selectHeader.js";
import {changePage} from "./modules/changePage.js";
import { initializeApp } from "firebase/app";
import {
	addListenerToArrOfElements,
	getAllFieldFromEditCard,
	showCompliteCard,
	clearAllFieldsInForm,
	editOrDeleteBtn,
	showStaffsOnPage,
	showSortedStaffsOnPage,
	deleteExistStaffCard,
	tableOfnorms,
	tableOfReceived,
	deleteTable,
	delTargetNormTable,
	delTargetReceivedTable,
	// firstStartApp,
	//addNewPersonCardToFirebase,
	// editExistStaffCardAndReplaceItInFirebase,
	// getAllDataFromBase,
} from "./modules/firebaseFunctions.js";
import {
	getDatabase,
	ref,
	get,
	set,
	child,
	update,
	remove
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./modules/firebaseConfig.js";
import {regisration, login, logout, getUserProfile, updateUserProfile} from "./modules/firebaseAuth.js";

export let inicialState = {
	company:{
		staff:[],
	}
};	
export let state = {}
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getDatabase();


isWebp();
select();





tableOfnorms('#normsTable'); //первый рендер таблицы норм выдачи
tableOfReceived('#receivedTable');//первый рендер таблицы полученных вещей


//================listeners of events==============
//Добавляет вновь созданную карточку в базу данных (зелёная кнопка сохранить)
document.querySelector('#saveSelfCard').onclick = addNewPersonCardToFirebase; //add btn
//---------------------------------------------------
// Применяет изменения после редактирования карточки (оранж кнопка редактировать)
document.querySelector('#editSelfCard').onclick = () => editOrDeleteBtn('.modal-edit', editExistStaffCardAndReplaceItInFirebase);
//---------------------------------------------------
// Удаление карточки с сохранением результата в БД (красн. кнопка удалить)
document.querySelector('#delSelfCard').onclick = () => editOrDeleteBtn('.modal-delete', deleteExistStaffCard);
//---------------------------------------------------
// Показать карточку при клике на фамилию в списке
document.querySelector('#listOfstaff').onclick = showCompliteCard;
//---------------------------------------------------
// сортировать список карточек по алфавиту
document.querySelector('.list__sort-alphabet').onclick = showSortedStaffsOnPage;
//---------------------------------------------------
// сортировать список карточек по дате добавления
document.querySelector('.list__sort-data').onclick = showStaffsOnPage;
//---------------------------------------------------
// Добавляет поле для ввода норм выдачи в карточке создания
document.querySelector('#addFieldsToNorms').onclick = () => tableOfnorms('#normsTable');
//---------------------------------------------------
// Добавляет поле для ввода норм выдачи в карточке редактирования
document.querySelector('#addFieldsToNormsInEdit').onclick = () => tableOfnorms('#getNormsTable');
//---------------------------------------------------
//Слушатели на все кнопки удаления строк в нормах выдачи(первый старт)
addListenerToArrOfElements('.del-button-tableOfnorms', delTargetNormTable);
//Слушатели на все кнопки удаления строк в таблице получения предметов(первый старт)
addListenerToArrOfElements('.del-button-tableOfReceived', delTargetReceivedTable);
//---------------------------------------------------
// Добавляет поле для ввода полученных вещей в карточке редактирования
document.querySelector('#addFieldsToReceived').onclick = () => tableOfReceived('#receivedTable');
//---------------------------------------------------
// Добавляет поле для ввода полученных вещей в карточке редактирования
document.querySelector('#AddFieldsToReceivedInEdit').onclick = () => tableOfReceived('#getReceivedTable');
//---------------------------------------------------
//смена страницы новой карточки на страницу существующей
document.querySelector('header').onclick = changePage
//---------------------------------------------------
//регистрация нового пользователя
document.querySelector('#registrationBtn').onclick = () => regisration(startApp)
//---------------------------------------------------
//залогинится
document.querySelector('#signInBtn').onclick = () => login(startApp)







//Функция добавления новой карточки в базу данных
 async function addNewPersonCardToFirebase() {
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
 async function editExistStaffCardAndReplaceItInFirebase(){
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

 function getAllDataFromBase() { //получение данных из базы
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

async function startApp(){
	state = await getAllDataFromBase()// асинхронная функция
	showStaffsOnPage()// синхронная функция, выполнить после асинхронной
}

































//===============LIBRARIES====================





