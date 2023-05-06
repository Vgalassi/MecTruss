let nós = [];
let componente_selecionado = document.getElementById('nósdiv');


function trocar(id){
    let new_display = document.getElementById(id);
    componente_selecionado.style.display = 'none';
    new_display.style.display = 'block';
    componente_selecionado = new_display;
    
    
}

function add_nó(){
    let nome_nó = document.getElementById('nome_nó');
    let nó_x = document.getElementById('nó_x');
    let nó_y = document.getElementById('nó_y');

    let new_nó = {
        nome: nome_nó.value,
        x: Number(nó_x.value),
        y: Number(nó_y.value)
    }

    nós.push(new_nó);
    let nós_display = document.getElementById('nós_display');
    let display_newnó = document.createElement('p');
    display_newnó.innerText = `${nome_nó.value} (${nó_x.value},${nó_y.value})`;
    nós_display.appendChild(display_newnó);

    nome_nó.value = null;
    nó_x.value = null;
    nó_y.value = null;

}

