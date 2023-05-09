let nós = [];
let componente_selecionado = document.getElementById('nósdiv');
let forca_id = 0;

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

    if(nó_x.value == '' || nó_y.value == '' || nome_nó.value == ''){
        return window.alert('Preencha todos os valores')
    }

    for(let i=0;i<nós.length;i++){
        if(nós[i].nome == nome_nó.value){
            return window.alert('Esse nome já foi escolhido')
        }
        if(nós[i].x == Number(nó_x.value) && nós[i].y == Number(nó_y.value)){
            return window.alert('Já existe um nó nessa posição')
        }
    }

    let forcas = []
    let new_nó = {
        nome: nome_nó.value,
        x: Number(nó_x.value),
        y: Number(nó_y.value),
        forcas: forcas
    }

    nós.push(new_nó);
    let nós_display = document.getElementById('nós_display');
    let display_newnó = document.createElement('p');
    let option_nó = document.createElement('option');
    let nó_seletores = document.getElementsByClassName('nó_seletor');
    
    display_newnó.setAttribute('id',nome_nó.value);
    display_newnó.innerText = `${nome_nó.value} (${nó_x.value},${nó_y.value})`;
    option_nó.innerText = nome_nó.value;
    option_nó.value = nome_nó.value;

    nós_display.appendChild(display_newnó);
    nó_seletores[0].appendChild(option_nó);
    for(let i= 1;i<nó_seletores.length;i++){
    nó_seletores[i].appendChild(option_nó.cloneNode(true));
    }

    nome_nó.value = null;
    nó_x.value = null;
    nó_y.value = null;

}

function find_nó(nome){
    for(let i = 0;i<nós.length;i++){
        if(nós[i].nome == nome){
            return i;
        }
    }
    return false
}

function add_forca(){
    let nó_selecionado = document.getElementById('nó_seletor_forca').value;
    if(nó_selecionado == ''){
        return window.alert('Selecione um nó');
    }
    let i = find_nó(nó_selecionado);
    componentex = document.getElementById('força_x').value;
    componentey = document.getElementById('força_y').value;

    if(componentex == '' || componentey == ''){
        return window.alert('Preencha todos os valores');
    }

    componentex = Number(componentex);
    componentey = Number(componentey);

    let new_forca = {
        id: forca_id,
        x: componentex,
        y: componentey
    }
    forca_id++;
    nós[i].forcas.push(new_forca);
    let new_forca_display = document.createElement('p');
    let p_nó = document.getElementById(nós[i].nome);
    new_forca_display.innerText = ` F${new_forca.id}: (${new_forca.x},${new_forca.x})`;
    p_nó.appendChild(new_forca_display);

    
}