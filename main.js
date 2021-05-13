const fitButton = document.querySelector('.context-actions-fit'),
centerButton = document.querySelector('.context-actions-center'),
zoomSelect = document.querySelector('#context-zoom'),
context = document.querySelector('main.context'),
contextContainer = context.querySelector('.context-container'),
header = document.querySelector('header'),
zoomButtons = document.querySelectorAll('#context-actions-minus,#context-actions-plus');
const tree = document.querySelector('.tree');
let changeState = false;


const Handlers = {
	pageLoaded: () => {
		console.log('hi')
	},

	createCategory : (addButton) => {
		console.log(addButton.parentElement.previousElementSibling);
		[...document.querySelectorAll('[contenteditable]')].map(el => el.removeAttribute('contenteditable') );
		if (dez = addButton.closest('.tree-bitem-item-inline').nextElementSibling) {
			console.log(1)
			template = document.createElement('li');
			template.innerHTML = scategoryTemplate
		}
		else if (dez = addButton.closest('.tree-bitem-item-inline').parentElement) {
			
			template = document.createElement('ul');
			template.appendChild(document.createElement('li')).innerHTML = scategoryTemplate
			template.setAttribute('child', '1');
			
		}
	
		iconedit = template.querySelector('.icon-edit');
		
		iconedit.addEventListener('click', Handlers.makeEditable.bind(undefined, iconedit));
		iconadd = template.querySelector('.icon-add')
		iconadd.addEventListener('click', Handlers.createCategory.bind(undefined, iconadd));
	
	
		iconRemove = template.querySelector('.icon-remove');
		iconRemove.addEventListener('click', Handlers.removeList.bind(undefined, iconRemove));
		dez.append(template);
		
	},

	removeList : (list) => {
		elm = list.closest('li');
		if(elm.parentElement.childNodes.length == 1) {
			elm.parentElement.remove()
		}
		else elm.remove()
	},

	centerHandler : () => tree.scrollIntoView({behavior: "smooth", block: "center", inline: "center"}),

	zoomOutHandler : () => {
		scale = Number(contextContainer.style.transform.replace(/\(|\)|scale/g,'')) || 1;
		scale -= 0.1;
		scale < 1 ? scale = 1 : '';
		contextContainer.style.transform = `scale(${scale})`;
	},
	
	zoomInHandler : () => {
		scale = Number(contextContainer.style.transform.replace(/\(|\)|scale/g,'')) || 1;
		scale += 0.1;
		contextContainer.style.transform = `scale(${scale})`;
	},

	makeEditable : (ei) => {
		[...document.querySelectorAll('[contenteditable]')].map(el => el !== ei.parentElement.previousElementSibling ? el.removeAttribute('contenteditable') : '');
		ei.parentElement.previousElementSibling.toggleAttribute('contenteditable')
		//ei.parentElement.previousElementSibling = false;
		changeState = !changeState;
	}

}

Handlers.centerHandler();


const scategoryTemplate = `<div class="tree-bitem-item-inline category-item">
	<span class="tf-nc" contenteditable autofocus>Deneme</span>
	<div class="item-actions">
		<svg class="icon icon-add" xmlns="http://www.w3.org/2000/svg">
			<use xlink:href="sprite.svg#icon-add"></use>
		</svg>
		<svg class="icon icon-edit" xmlns="http://www.w3.org/2000/svg">
			<use xlink:href="sprite.svg#icon-edit"></use>
		</svg>
		<svg class="icon icon-remove" xmlns="http://www.w3.org/2000/svg">
			<use xlink:href="sprite.svg#icon-remove"></use>
		</svg>
	</div>
</div>`;


zoomButtons[0].addEventListener('click', Handlers.zoomOutHandler)

zoomButtons[1].addEventListener('click', Handlers.zoomInHandler)

centerButton.addEventListener('click', Handlers.centerHandler)

fitButton.addEventListener('click', () => {
	contextWidth = context.clientWidth,
	clientWidth = (tree.querySelector(':scope ul > li > ul') || tree.querySelector(':scope > ul > li > div')).scrollWidth,
	zoomRatio = Number(contextWidth / clientWidth).toFixed(4);
	tree.style.transform = `scale(${zoomRatio})`;
	contextContainer.addEventListener('transitionend', Handlers.centerHandler, { once: true });
})


zoomSelect.addEventListener('change', () => {
	scale = zoomSelect.value / 100;
	context.querySelector('.context-container').style.transform = `scale(${scale})`;
})

document.querySelectorAll('.icon-edit').forEach( ei => {
	ei.addEventListener('click', () => Handlers.makeEditable(ei));
})

document.querySelectorAll('.icon-add').forEach(addButton => {
	addButton.addEventListener('click', () => {
		
		Handlers.createCategory(addButton);
		setTimeout( () => document.execCommand('selectAll',false,null), 0);
	})
})

document.querySelectorAll('.icon-remove').forEach(removeButton => {
	removeButton.addEventListener('click', () => Handlers.removeList(removeButton));
})



//TOUCH EVENTS
let isDown = false, startX, startY, scrollLeft, scrollTop;
context.addEventListener('mousedown', (e) => {
  isDown = true;
  if(changeState) if(e.target.getAttribute('contenteditable') !== null) isDown = false;
  startX = e.pageX - context.offsetLeft;
  scrollLeft = context.scrollLeft;
  startY = e.pageY - context.offsetTop;
  scrollTop = context.scrollTop;
})


context.addEventListener('mouseleave', () => {
  isDown = false;
  context.classList.remove('active');
})


context.addEventListener('mouseup', () => {
  isDown = false;
  context.classList.remove('active');
})


context.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - context.offsetLeft,
  speedX = (x - startX) * .5,
  y = e.pageY - context.offsetTop,
  speedY = (y - startY) * .5;
  if(speedX > 0 || speedY > 0) context.classList.add('active');
  context.scrollLeft = scrollLeft - speedX;
  context.scrollTop = scrollTop - speedY;
})



