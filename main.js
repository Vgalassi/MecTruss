let nós = [];
let apoios = [];
let componente_selecionado = document.getElementById('nósdiv');
let forca_id = 0;
let grafico = document.getElementById('grafico');
let gtx = grafico.getContext('2d');




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

    gtx.beginPath();
    gtx.arc(nó_x.value*40+40,400-nó_y.value*20,3,0,2 * Math.PI);
    gtx.strokeStyle = '#00000';
    gtx.fill();
    gtx.stroke();

    gtx.font = "10px Arial";
    gtx.textAlign = "center";
    gtx.fillText(nome_nó.value,nó_x.value*40+40,390-nó_y.value*20);
   


    nós.push(new_nó);
    let nós_display = document.getElementById('nós_display');
    let display_newnó = document.createElement('p');
    display_newnó.style.borderBottom =  "solid #bbbec2";
    display_newnó.style.borderWidth =  "2px";
    display_newnó.style.padding = "10px"
    
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
    componentex = document.getElementById('força_x').value;
    componentey = document.getElementById('força_y').value;
    if(componentex == '' || componentey == ''){
        return window.alert('Preencha todos os valores');
    }
    let i = find_nó(nó_selecionado);


    componentex = Number(componentex);
    componentey = Number(componentey);

    let new_forca = {
        id: forca_id,
        x: componentex,
        y: componentey
    }


    forca_id++;

    let coordenadasx = nós[i].x;
    let coordenadasy = nós[i].y;
    let força_texto;
    if(new_forca.x>0){
        coordenadasx += 1;
        
    }else if(new_forca.x<0){
        coordenadasx -= 1;
        
    }
    if(new_forca.y>0){
        coordenadasy += 2;
    }else if(new_forca.y<0){
        coordenadasy -= 2;
        
    }
    

    coordenadasx = coordenadasx * 40 + 40;
    coordenadasy = 400 - coordenadasy*20
    
    gtx.beginPath();
    gtx.moveTo(nós[i].x*40+40,400 - nós[i].y*20);
    gtx.lineTo(coordenadasx,coordenadasy);
    
    força_texto = Math.sqrt(new_forca.x**2 + new_forca.y**2);
    if(força_texto%1 != 0){
        força_texto = força_texto.toFixed(2);
    }
    força_texto += 'N';

    gtx.font = "10px Arial";
    gtx.fillText(força_texto,coordenadasx+15,coordenadasy+15);


    const angle = Math.atan2(coordenadasy - (400 - nós[i].y*20), coordenadasx - (nós[i].x*40+40));
    gtx.lineTo(coordenadasx - 10 * Math.cos(angle - Math.PI / 6), coordenadasy - 10 * Math.sin(angle - Math.PI / 6));
    gtx.moveTo(coordenadasx, coordenadasy);
    gtx.lineTo(coordenadasx - 10 * Math.cos(angle + Math.PI / 6), coordenadasy - 10 * Math.sin(angle + Math.PI / 6));
    gtx.strokeStyle = '#E60d11';
    gtx.stroke();

    nós[i].forcas.push(new_forca);
    let new_forca_display = document.createElement('p');
    let p_nó = document.getElementById(nós[i].nome);

    new_forca_display.innerText = ` F${new_forca.id}: (${new_forca.x},${new_forca.y})`;
    new_forca_display.style.fontSize = "18px"
    new_forca_display.style.color = "#9e1d11"
    p_nó.appendChild(new_forca_display);

    document.getElementById('força_x').value = null;
    document.getElementById('força_y').value = null;

    
} 

function add_membro(){
    let nó_selecionado1 = document.getElementById('nó_seletor_membro1').value;
    let nó_selecionado2 = document.getElementById('nó_seletor_membro2').value;
    if(nó_selecionado1 == '' || nó_selecionado2 == ''){
        return window.alert('Selecione todos os nós');
    }
    if(nó_selecionado1 == nó_selecionado2){
        return window.alert('Selecione nós diferentes');
    }

    let i = find_nó(nó_selecionado1);
    let j = find_nó(nó_selecionado2);
    let componentex;
    let componentey;
    let nome_membro = nós[i].nome + nós[j].nome;


    
    if(nós[i].x == nós[j].x){
        componentex = undefined;
        componentey = 0;
    }else if(nós[i].y == nós[j].y){
        componentex = 0;
        componentey = undefined;
    }else{
        componentex = undefined;
        componentey = undefined;
    }

    let new_membro = {
        nome: nome_membro,
        x: componentex,
        y: componentey
    }

    gtx.moveTo(nós[i].x*40+40,400 - nós[i].y*20);
    gtx.lineTo(nós[j].x*40+40,400 - nós[j].y*20);
    gtx.stroke();


    nós[i].forcas.push(new_membro);
    nós[j].forcas.push(new_membro);
    let new_membro_display = document.createElement('p');
    let p_nó = document.getElementById(nós[i].nome);
    let p_nó2 = document.getElementById(nós[j].nome);
    new_membro_display.innerText = `Membro ${new_membro.nome}`;
    new_membro_display.style.fontSize = "18px"
    p_nó.appendChild(new_membro_display);
    p_nó2.appendChild(new_membro_display.cloneNode(true));



}

function add_apoio(){
    let nó_selecionado = document.getElementById('nó_seletor_apoio').value;
    let tipo_selecionado = document.getElementById('tipo_seletor').value;
    i = find_nó(nó_selecionado);
    
    let new_apoio = {
        nó: nós[i].nome,
        x: 0,
        y: 0,
        Mo: 0
    }

    let texto;
    let img;
    let inc = 0;
    switch (tipo_selecionado){
        case '1':
            new_apoio.y = undefined;
            texto = `V${nós[i].nome}`
            img = document.getElementById("movel");
            break;
        case '2':
            new_apoio.y = undefined;
            new_apoio.x = undefined;
            texto = `V${nós[i].nome} H${nós[i].nome}`
            img = document.getElementById("fixo");
            break;
        case '3':
            new_apoio.y = undefined;
            new_apoio.x = undefined;
            new_apoio.Mo = undefined;
            texto = ` V${nós[i].nome} H${nós[i].nome} Mo${nós[i].nome}`
            img = document.getElementById("engastamento");
            inc = img.height/2;
            break;
    }

    apoios.push(new_apoio);
    gtx.drawImage(img, nós[i].x*40+40 - img.width/2, 400 - nós[i].y*20-inc);

    let new_apoio_display = document.createElement('p');
    let p_nó = document.getElementById(nós[i].nome);
    new_apoio_display.innerText = `Reações apoio ${texto}`;
    p_nó.appendChild(new_apoio_display);


}