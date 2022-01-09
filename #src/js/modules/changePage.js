
//--------------change page in main content field------------
export function changePage(event){
	const target = event.target;
	const menuItems = document.querySelectorAll('.navigation__list-item');
	const contetnPages = document.querySelectorAll('.main-content__page');

	if (target.classList.contains('navigation__list-item')) {
		
		menuItems.forEach(elem => elem.classList.remove('active'))//remove active classes
		contetnPages.forEach(elem => elem.classList.remove('active'))//remove active classes

		menuItems.forEach((elem, index) => {
			if(elem === target){
				menuItems[index].classList.add('active')//add active classes
				contetnPages[index].classList.add('active')//add active classes
			}
		})
	}
}