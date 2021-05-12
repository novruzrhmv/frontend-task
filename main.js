const fitButton = document.querySelector('.context-actions-fit'),
centerButton = document.querySelector('.context-actions-center'),
zoomSelect = document.querySelector('#context-zoom'),
context = document.querySelector('main.context');
const tree = document.querySelector('.tree');
let changeState = false;

const scategoryTemplate3 = `<div class="tree-bitem-item scategory-item">
	<div class="tree-bitem-item-inline scategory-item">
		<span>Subcategory 1</span>
		<div class="item-actions">
			<svg class="icon icon-add" xmlns="http://www.w3.org/2000/svg">
				<use xlink:href="sprite.svg#icon-add"></use>
			</svg>
			<svg class="icon icon-edit" xmlns="http://www.w3.org/2000/svg">
				<use xlink:href="sprite.svg#icon-edit"></use>
			</svg>
			<svg class="icon icon-close" xmlns="http://www.w3.org/2000/svg">
				<use xlink:href="sprite.svg#icon-close"></use>
			</svg>											
		</div>
	</div>
</div>`,
scategoryTemplate4  = `<div class="tree-bitem-item-inline scategory-item">
	<span>Category 1</span>
	<div class="item-actions">
		<svg class="icon icon-add" xmlns="http://www.w3.org/2000/svg">
			<use xlink:href="sprite.svg#icon-add"></use>
		</svg>
		<svg class="icon icon-edit" xmlns="http://www.w3.org/2000/svg">
			<use xlink:href="sprite.svg#icon-edit"></use>
		</svg>
		<svg class="icon icon-close" xmlns="http://www.w3.org/2000/svg">
			<use xlink:href="sprite.svg#icon-close"></use>
		</svg>											
	</div>
</div>`,

scategoryTemplate = `<div class="tree-bitem-item-inline category-item">
	<span class="tf-nc">selam</span>
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


const zoomButtons = document.querySelectorAll('#context-actions-minus,#context-actions-plus');

zoomButtons[0].addEventListener('click', () => {
	zoom = Number(context.querySelector('.context-container').style.zoom) || 1;
	context.querySelector('.context-container').style.zoom = (zoom - 0.1);
})

zoomButtons[1].addEventListener('click', () => {
	zoom = Number(context.querySelector('.context-container').style.zoom) || 1;
	context.querySelector('.context-container').style.zoom = (zoom + 0.1);
	console.log(zoom)
})


const makeEditable = (ei) => {
	[...document.querySelectorAll('[contenteditable]')].map(el => el !== ei.parentElement.previousElementSibling ? el.removeAttribute('contenteditable') : '');
	ei.parentElement.previousElementSibling.toggleAttribute('contenteditable')
	//ei.parentElement.previousElementSibling = false;
	changeState = !changeState;
}

centerButton.addEventListener('click', () => {
	context.classList.toggle('scrolling')
	y1 = (context.scrollHeight - context.offsetHeight) / 2;
	x1 = (context.scrollWidth - context.offsetWidth) / 2;
	context.scrollTo(x1,y1)
	context.classList.toggle('scrolling')
})

fitButton.addEventListener('click', () => {
	contextWidth = context.clientWidth,
	clientWidth = tree.scrollWidth,
	zoomRatio = Number(contextWidth / clientWidth).toFixed(2);
	context.querySelector('.context-container').style.zoom = zoomRatio;

})

zoomSelect.addEventListener('change', () => {
	context.querySelector('.context-container').style.zoom = zoomSelect.value / 100;
})

document.querySelectorAll('.icon-edit').forEach( ei => {
	ei.addEventListener('click', () => makeEditable(ei));
});

const createCategory = (addButton) => {
	
	if (dez = addButton.closest('.tree-bitem-item-inline').nextElementSibling) {
		console.log(1)
		template = document.createElement('li');
		template.innerHTML = scategoryTemplate
		/* template.classList.add('tree-bitem-item', 'scategory-item');
		dez.setAttribute('child', (Number(dez.getAttribute('child')) + 1));
		template.innerHTML = scategoryTemplate2; */
	}
	else if (dez = addButton.closest('.tree-bitem-item-inline').parentElement) {
		
		template = document.createElement('ul');
		template.appendChild(document.createElement('li')).innerHTML = scategoryTemplate
		template.setAttribute('child', '1');
		
	}

	iconedit = template.querySelector('.icon-edit');
	
	iconedit.addEventListener('click', makeEditable.bind(undefined, iconedit));
	iconadd = template.querySelector('.icon-add')
	iconadd.addEventListener('click', createCategory.bind(undefined, iconadd));


	iconRemove = template.querySelector('.icon-remove');
	iconRemove.addEventListener('click', removeList.bind(undefined, iconRemove));
	dez.append(template)
}

document.querySelectorAll('.icon-add').forEach(addButton => {
	addButton.addEventListener('click', () => {
		//dez = addButton.closest('.tree-bitem-item') || addButton.closest('.tree-bitem-citem').nextElementSibling;
		createCategory(addButton)
	})
})

document.querySelectorAll('.icon-remove').forEach(removeButton => {
	removeButton.addEventListener('click', () => removeList(removeButton));
})

const removeList = (list) => {
	elm = list.closest('li');
	if(elm.parentElement.childNodes.length == 1) {
		elm.parentElement.remove()
	}
	else elm.remove()
};



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
  const x = e.pageX - context.offsetLeft;
  const walk = (x - startX) * .5; //scroll-fast
  const y = e.pageY - context.offsetTop;
  const walkY = (y - startY) * .5;
  if(walk > 0 || walkY > 0) context.classList.add('active');
  context.scrollLeft = scrollLeft - walk;
  context.scrollTop = scrollTop - walkY;
})