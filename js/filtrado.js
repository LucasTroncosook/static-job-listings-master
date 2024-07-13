const dato = './data.json';
const $ = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);
const $id = (el) => document.getElementById(el);

const containerCard = $id('container-card');
const headerNav = $('.header nav');

const btnClear = $id('clear');

const dibujarCard = (
        {
            id, 
            company, 
            logo, 
            new:newBoolean, 
            featured, 
            contract, 
            languages, 
            level, 
            location, 
            position, 
            postedAt, 
            role, 
            tools
        }) => {
    const obtenerEtiqueta = (valor, string) => valor ? string : '';

   const collectionA = (array) => {
        const anchors = array.map(elemento => `<a href="#">${elemento}</a>`);
        return anchors.join('');
    }   

    const arrayTools = [role, level, ...languages];
    const newArrayTools = arrayTools.concat(tools);

    const cardClass = newBoolean && featured ? 'card-active' : ''

    containerCard.innerHTML += 
    `
    <section class="card ${cardClass}" id="${id}">
      <header>
        <figure>
          <img src="${logo}" alt="${company}">
        </figure>
        <nav>
          <section>
            <span>${company}</span>
            <span>${obtenerEtiqueta(newBoolean, 'new!')}</span>
            <span>${obtenerEtiqueta(featured, 'featured')}</span>
          </section>
          <section>
            <h4>${position}</h4>
          </section>
          <section>
            <span>${postedAt}</span>
            <span>${contract}</span>
            <span>${location}</span>
          </section>
        </nav>
      </header>

      <nav class="languages">
        ${collectionA(newArrayTools)}
      </nav>
    </section>        
    `
}


const eliminarEtiqueta = (elemento) => {
    const filtro = elemento.closest('.filtado');
    if(filtro){
      filtro.remove();
      actualizarFiltrado ();
    }
}

const actualizarFiltrado  = (tools) => {
    const someA = Array.from(headerNav.querySelectorAll('.nav-filter .filtado'));
  
    someA.length > 0 
        ? headerNav.classList.add('navActive')
        : headerNav.classList.remove('navActive')
    
        
    const cards = $$('.card');
    cards.forEach(card => {
        const cardEtiquetas = Array.from(card.querySelectorAll('.languages a')).map(a => a.textContent);
        const etiquetasMarcadas = Array.from(headerNav.querySelectorAll('.nav-filter .filtado span')).map(span => span.textContent);
        
        const matches = etiquetasMarcadas.every(tag => cardEtiquetas.includes(tag));
        
        matches 
        ? card.style.display = "flex"
        : card.style.display= 'none' 
    })

    const btnEliminar = headerNav.querySelectorAll('.nav-filter .filtado a');
    btnEliminar.forEach(btn => {
        btn.addEventListener('click', eliminarEtiquetaHandler);
    });
}

const filtrarCards = (tools) => {
  const navContainer = headerNav.querySelector('.nav-filter');
  const someA = Array.from(headerNav.querySelectorAll('.nav-filter .filtado'));

  const existe = someA.some(elemento => elemento.querySelector('span').textContent === tools);

  !existe
  ?navContainer.innerHTML += 
  `
      <section class="filtado">
        <span>${tools}</span>
        <a href="#">
         <img src="./images/icon-remove.svg" alt="icon-remove">
        </a>
      </section>
  `
  : ''

actualizarFiltrado();
}

const eliminarEtiquetaHandler = (e) => {
  eliminarEtiqueta(e.target);
};

const obtenerDatos = async (url) => {
    const response = await fetch(url);
    const datos = await response.json();

    datos.forEach(dato => dibujarCard(dato));

    const btnTools = document.querySelectorAll('nav.languages a');
    btnTools.forEach(tools => {
        tools.addEventListener('click', function(e){
            filtrarCards(e.target.textContent)
        })
    })
}

btnClear.addEventListener('click', function(e){
  const navContainer = headerNav.querySelector('.nav-filter');
  navContainer.innerHTML = ''; 
  headerNav.classList.remove('navActive');
  
  const cards = $$('.card');
  cards.forEach(card => {
      card.style.display = "flex";
  });
});

obtenerDatos(dato);
