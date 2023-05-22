
///Vetor utilizado para armazenar nós
let nós = [];
let nós_id = 0;
//Vetor utilizado para armazenar apoios
let apoios = [];
//Vetor carregando forças x/y
let forcasx = [];
let forcasy = [];
///Carrega a div que está sendro mostrada na tela de adicionar
let componente_selecionado = document.getElementById('nósdiv');
///Contador de forças
let forca_id = 0;
//Contador de membros
var membros = [];
///Carrega o canvas principal
let grafico = document.getElementById('grafico');
let gtx = grafico.getContext('2d');



/*
Funçao trocar
Parâmetros:
id = id da div que irá aparecer
Retorno: n/a

Some com a div armazenada em componente_selecionado
e mostra a div passada pelo parâmetro
Armazena a div do parâmetro em componente_selecionado


*/
function trocar(id){
    let new_display = document.getElementById(id);
    componente_selecionado.style.display = 'none';
    new_display.style.display = 'block';
    componente_selecionado = new_display;
    
    
}



/*
Função add
Paramêtros: n/a
Retorno: n/a

Pega os valores dos inputs do nó e cria um novo nó
Desenha o nó no canvas
O nó é armazenado no vetor nós
É escrito os dados dos nó na div de componentes

*/
function add_nó(){
    // Pegando os valores do input
    let nome_nó = document.getElementById('nome_nó');
    let nó_x = document.getElementById('nó_x');
    let nó_y = document.getElementById('nó_y');


    //Conferindo se os valores são válidos
    //Validação todos  os inputs preenchidos
    if(nó_x.value == '' || nó_y.value == '' || nome_nó.value == ''){
        return window.alert('Preencha todos os valores')
    }

    // Validação repetição de valor
    for(let i=0;i<nós.length;i++){
        if(nós[i].nome == nome_nó.value){
            return window.alert('Esse nome já foi escolhido')
        }
        if(nós[i].x == Number(nó_x.value) && nós[i].y == Number(nó_y.value)){
            return window.alert('Já existe um nó nessa posição')
        }
    }

    // Criando novo objeto com os dados
    let forcas = []
    let new_nó = {
        nome: nome_nó.value,
        id: nós_id,
        x: Number(nó_x.value),
        y: Number(nó_y.value),
        forcas: forcas,
        reacoes: [],
        apoio: null

    }

    nós_id++;


    ///Desenhando o nó no canvas
    gtx.beginPath();
    gtx.arc(nó_x.value*40+40,400-nó_y.value*20,3,0,2 * Math.PI);
    gtx.strokeStyle = '#00000';
    gtx.fill();
    gtx.stroke();
    
    gtx.font = "10px Arial";
    gtx.textAlign = "center";
    gtx.fillText(nome_nó.value,nó_x.value*40+40,390-nó_y.value*20);
   


    ///Colocando um novo parágrafo na div de componentes
    nós.push(new_nó);
    let nós_display = document.getElementById('nós_display');
    let display_newnó = document.createElement('p');
    display_newnó.style.borderBottom =  "solid #bbbec2";
    display_newnó.style.borderWidth =  "2px";
    display_newnó.style.padding = "10px"
    display_newnó.style.fontSize = "22px"
    let option_nó = document.createElement('option');
    let nó_seletores = document.getElementsByClassName('nó_seletor');
    
    display_newnó.setAttribute('id',nome_nó.value);
    display_newnó.innerText = `${nome_nó.value} (${nó_x.value},${nó_y.value})`;
    option_nó.innerText = nome_nó.value;
    option_nó.value = nome_nó.value;

   
    nós_display.appendChild(display_newnó);
    nó_seletores[0].appendChild(option_nó);
     //Colocando o novo nó nos seletores de nó
    for(let i= 1;i<nó_seletores.length;i++){
    nó_seletores[i].appendChild(option_nó.cloneNode(true));
    }

    ///Zerando so valores dos inputs
    nome_nó.value = null;
    nó_x.value = null;
    nó_y.value = null;

}

/*
Função find_nó
Parâmetros: nome do nó
Retorno: índice de onde o nó está localizado

Encontra onde o nó está localizado no vetor de nós 
e retorna seu índice

*/
function find_nó(nome){
    for(let i = 0;i<nós.length;i++){
        if(nós[i].nome == nome){
            return i;
        }
    }
    return false
}



/*

Função add_forca
Parâmetros: n/a
Retorno: n/a

Pega os valores do input e do select e cria uma nova força

A força a armezanada no vetor força do nó selecionado
É desenhado no canvas um vetor de força no nó selecionado

É colocado um parágrafo com as informações da no força
paragráfo no nó selecionado

*/
function add_forca(){
    ///Conferindo se o nó foi selecionado
    let nó_selecionado = document.getElementById('nó_seletor_forca').value;
    if(nó_selecionado == ''){
        return window.alert('Selecione um nó');
    }
    //Pegando os valores do input e conferindo
    componentex = document.getElementById('força_x').value;
    componentey = document.getElementById('força_y').value;
    if(componentex == '' || componentey == ''){
        return window.alert('Preencha todos os valores');
    }
    
    //Criando uma nova força no vetor de força do nó selecionado
    let i = find_nó(nó_selecionado);

    componentex = Number(componentex);
    componentey = Number(componentey);

    let new_forca = {
        nome: forca_id,
        x: componentex,
        y: componentey
    }
    
    forcasx.push(componentex);
    forcasy.push(componentey);


    nós[i].forcas.push(new_forca);

    //Incrementando contador de força
    forca_id++;
    

    ///Conferindo as coordenadas para saber a direção do vetor
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
    
    gtx.strokeStyle = '#E60d11';
    // Desenhando vetor no canvas e colocando o valor de sua força
    coordenadasx = coordenadasx * 40 + 40;
    coordenadasy = 400 - coordenadasy*20
    
    gtx.beginPath();
    gtx.moveTo(nós[i].x*40+40,400 - nós[i].y*20);
    gtx.lineTo(coordenadasx,coordenadasy);
    
    //Calculando o valor da força
    força_texto = Math.sqrt(new_forca.x**2 + new_forca.y**2);
    if(força_texto%1 != 0){
        força_texto = força_texto.toFixed(2);
    }
    força_texto += 'N';

    gtx.font = "10px Arial";
    gtx.fillText(força_texto,coordenadasx+15,coordenadasy+15);

    //Desenhando a seta do vetor
    const angle = Math.atan2(coordenadasy - (400 - nós[i].y*20), coordenadasx - (nós[i].x*40+40));
    gtx.lineTo(coordenadasx - 10 * Math.cos(angle - Math.PI / 6), coordenadasy - 10 * Math.sin(angle - Math.PI / 6));
    gtx.moveTo(coordenadasx, coordenadasy);
    gtx.lineTo(coordenadasx - 10 * Math.cos(angle + Math.PI / 6), coordenadasy - 10 * Math.sin(angle + Math.PI / 6));
    gtx.strokeStyle = '#E60d11';
    gtx.stroke();

    //Colocando um p contendo as informações da força na div de componentes
    let new_forca_display = document.createElement('p');
    let p_nó = document.getElementById(nós[i].nome);

    new_forca_display.innerText = ` F${new_forca.nome}: (${new_forca.x},${new_forca.y})`;
    new_forca_display.style.fontSize = "18px"
    new_forca_display.style.color = "#9e1d11"
    p_nó.appendChild(new_forca_display);

    //Zerando os inputs
    document.getElementById('força_x').value = null;
    document.getElementById('força_y').value = null;


} 

function add_membro(){
    /*
    Função add_membro
    Parâmetros: n/a
    Retorno: n/a

    Adiciona um membro com os dados dos selects em dois nós
    Desenha o membro ligado nos dóis nós

    Adiciona um parágrafo com o nome do membro na div de componente
    em cada parágrado do nó
    */

    //Pegando valores dos selects
    let nó_selecionado1 = document.getElementById('nó_seletor_membro1').value;
    let nó_selecionado2 = document.getElementById('nó_seletor_membro2').value;
    //Validando se estão selecionados ou se não são iguais
    if(nó_selecionado1 == '' || nó_selecionado2 == ''){
        return window.alert('Selecione todos os nós');
    }
    if(nó_selecionado1 == nó_selecionado2){
        return window.alert('Selecione nós diferentes');
    }
    

    //Criando nome do membro com os dois nomes dos nós
    let i = find_nó(nó_selecionado1);
    let j = find_nó(nó_selecionado2);
    let componentex;
    let componentey;
    let nome_membro = nós[i].nome + nós[j].nome;

    //Verificando se os nós já tem um membro
    for(let k = 0;k< nós[i].forcas.length;k++){
        if(nós[i].forcas[k].nome == nome_membro){
            return window.alert('Já existe um membro nesses nós')
        }
    }

    //Calculando o ângulo do membro
    let deltax = nós[i].x - nós[j].x;
    let deltay = nós[i].y - nós[j].y;

    let angulo_calc = Math.atan2(deltax, deltay);

    //Cálculando a possibilidade de reação dos nós
    if(nós[i].y == nós[j].y){
        componentex = undefined;   //Se o membro está deitado, apenas reação x desconhecida
        componentey = 0;
    }else if(nós[i].x == nós[j].x){ //Se o membro está de pé, apenas reação y desconhecida
        componentex = 0;
        componentey = undefined;
    }else{                          //Se o membro está inclinado,reação x e y desconhecida
        componentex = undefined;
        componentey = undefined;
    }

    let new_membro = {
        nome: nome_membro,
        x: componentex,
        y: componentey,
        nós: [i,j],
        angulo: angulo_calc
    }

    

    //Desenhar um linha ligando os dois nós para indicar o membro
    gtx.strokeStyle = '#000000';
    gtx.moveTo(nós[i].x*40+40,400 - nós[i].y*20);
    gtx.lineTo(nós[j].x*40+40,400 - nós[j].y*20);
    gtx.stroke();


    //Colocar as reações no vetor de forças  dos dois nós
    nós[i].reacoes.push(new_membro);
    nós[j].reacoes.push(new_membro);
    membros.push(new_membro);
    


    //Colocar um p com nome dos membros na div de componentes
    let new_membro_display = document.createElement('p');
    let p_nó = document.getElementById(nós[i].nome);
    let p_nó2 = document.getElementById(nós[j].nome);
    new_membro_display.innerText = `Membro ${new_membro.nome}`;
    new_membro_display.style.fontSize = "18px"
    p_nó.appendChild(new_membro_display);
    p_nó2.appendChild(new_membro_display.cloneNode(true));



}

function add_apoio(){
    /*
    Função add_apoio
    Parâmetros: n/a
    Retorno: n/a

    Adiciona um apoio do tipo selecionado ao nó selecionado
    Coloca uma imagem do apaio no nó selecionado
    Adicioona um p na div de componentes com os nomes das reações dos apoios


    */

    //Obtendo valores dos selects
    let nó_selecionado = document.getElementById('nó_seletor_apoio').value;
    let tipo_selecionado = document.getElementById('tipo_seletor').value;
    i = find_nó(nó_selecionado);
    

    //Criando nova variável do apoio
    let new_apoio = {
        nó: i,
        tipo: null,
        x: 0,
        y: 0,
        Mo: 0
    }
    nós[i].apoio = apoios.length;

    let texto;
    let img;
    let inc = 0;
    //Colocando valores de acordo com o tipo de apoio selecionado
    switch (tipo_selecionado){
        case '1': //Apoio móvel, apenas uma reação vertical
            new_apoio.y = undefined;
            new_apoio.tipo = 1;
            texto = `V${nós[i].nome}`
            img = document.getElementById("movel");
            break;
        case '2'://Apoio fixo, uma reação vertical e horizontal
            new_apoio.y = undefined;
            new_apoio.x = undefined;
            new_apoio.tipo = 2;
            texto = `V${nós[i].nome} H${nós[i].nome}`
            img = document.getElementById("fixo");
            break;
        case '3': //Apoio de engastamento, reação vertical,horizontal e de momento
            new_apoio.y = undefined;
            new_apoio.x = undefined;
            new_apoio.Mo = undefined;
            new_apoio.tipo = 3;
            texto = ` V${nós[i].nome} H${nós[i].nome} Mo${nós[i].nome}`
            img = document.getElementById("engastamento");
            inc = img.height/2;
            break;
    }
    //Coloca o novo apoio no vetor de apoios
    apoios.push(new_apoio);
    //Coloca a imagem do apoio no nó
    gtx.drawImage(img, nós[i].x*40+40 - img.width/2, 400 - nós[i].y*20-inc);

    //Cria um p na div de componentes com as reações do apoio
    let new_apoio_display = document.createElement('p');
    let p_nó = document.getElementById(nós[i].nome);
    new_apoio_display.innerText = `Reações apoio ${texto}`;
    new_apoio_display.style.fontSize = "18px";
    p_nó.appendChild(new_apoio_display);


}


function calc_apoios(){

    let centro;
    let k = 0;
    resultados = [
        [0],
        [0],
        [0]
    ]
    aux = nós[apoios[0].nó]
    for(let i = 0;i<apoios.length;i++){
        if(apoios[i].tipo>aux){
            aux = nós[apoios[i].nó];
        }
    }
    centro = aux;
    

    for(i = 0;i<nós.length;i++){
        for(j = 0;j<nós[i].forcas.length;j++){
            resultados[0][0] -= nós[i].forcas[j].x;
            resultados[1][0] -= nós[i].forcas[j].y;
            resultados[2][0] -= nós[i].forcas[j].x * (nós[i].y - centro.y) + nós[i].forcas[j].y * (nós[i].x - centro.x);
    }}
   

    let matriz1 = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ]
    j = 0
    for(i = 0;i<apoios.length;i++){
        switch(apoios[i].tipo){
            case 1:
                matriz1[1][j] = 1;
                matriz1[2][j] =  1 * (nós[apoios[i].nó].x - centro.x);
                j++
                break;
            case 2:
                matriz1[1][j] = 1;
                matriz1[2][j] =  1 * (nós[apoios[i].nó].x - centro.x);
                j++
                matriz1[0][j] = 1;
                matriz1[2][j] =  1 * (nós[apoios[i].nó].y - centro.y);
                j++
                break;
            case 3:
                matriz1[1][j] = 1;
                matriz1[2][j] =  1 * (nós[apoios[i].nó].x - centro.x);
                j++
                matriz1[0][j] = 1;
                matriz1[2][j] =  1 * (nós[apoios[i].nó].y - centro.y);
                j++
                matriz1[2][j] = 1;
                break;

    }
    
}


    return math.lusolve(matriz1, resultados);
}



function reacoes_membros(){
    /*
    Função reacoes membros
    Calcula os membros
    */

    
    //Setando matriz para regra de cramer
    let matriz_1 = Array(membros.length).fill().map(() => Array(membros.length).fill(0));
    let matriz_2 = Array(membros.length).fill().map(() => Array(1).fill(0));
    let k = 0;
    
    
    //Copiando vetores
    membros_func = Array.from(membros);
    nós_func = Array.from(nós);
    
    let m = 0;
    let n = 1;
    let o = 0;
    

    //Enquanto a matriz não estiver completa
    while(k != membros.length){

        //Matriz que carrega nós
        //nós_indice[i][0] = carrega número de membros do nó i
        //nós_índice[i][1++] = carrega endereços do membro
        nós_indice = Array(nós_func.length).fill().map(() => Array(1).fill(0));
        
        console.log(nós_indice);
        console.log(membros_func);
        for(i = 0;i<membros_func.length;i++){
            nós_indice[membros_func[i].nós[0]-o][0]++;
            nós_indice[membros_func[i].nós[0]-o].push(i);
            nós_indice[membros_func[i].nós[1]-o][0]++;
            nós_indice[membros_func[i].nós[1]-o].push(i);
        }
        console.log(nós_indice);
        //Escolhe o nó com o maior número de membros
        let maior_nó = nós_indice[0];
        j = 0;
        for(i = 0;i<nós_indice.length;i++){
            if(nós_indice[i][0]>maior_nó[0]){
                maior_nó = nós_indice[i];
                j = i;
            }
        }
        
        console.log(maior_nó);
        //maior_nó[0] vai carregar endereço do nó
        maior_nó[0]= j;
        console.log(nós_func);
        console.log(maior_nó);
        
        
        let flag = false;
        let flagx = true;
        let flagy = true;
        //Percorrendo todos os membros do maior nó
        if(k+2>membros.length){
            n = 0;
            flagy = false
            for(j = 0;j<nós_func[maior_nó[0]].reacoes;j++){
                    if(nós_func[maior_nó[0]].reacoes[j].nome == membros_func[0].nome){ 
                        if(nós_func[maior_nó[0]].reacoes[j].x == 0){
                            flagx = false;
                            flagy = true;
                        }
                }
            }
        }
        
        for(i = 0;i<nós_func[maior_nó[0]].reacoes.length;i++){

            
            //Definindo o m para colocar na matriz_1
            for(j = 0;j<membros.length;j++){
                if(nós_func[maior_nó[0]].reacoes[i].nome == membros[j].nome){
                    m = j;
                }
            }
            
            
            //Conferindo se o membro já foi colocado em outro nó
            //Se já estiver flag = true (colocar resultado negativo na matriz)
            for(j = 0;j<membros.length;j++){
                if(matriz_1[j][m] == 1){
                    flag = true;
                }
            }
            
            console.log(m)
            console.log(k)
            //Membro deitado
            if(nós_func[maior_nó[0]].reacoes[i].y != undefined && flagx == true){
                
                if(flag == false){
                    matriz_1[k][m] = 1
                }else{
                    matriz_1[k][m] = -1
                }
            }
            //Membro de pé
            else if(nós_func[maior_nó[0]].reacoes[i].x != undefined && flagy == true){
                
                if(flag == false){
                    matriz_1[k+n][m] = 1
                }else{
                    matriz_1[k+n][m] = -1
                }
            }
            //Membro inclinado
            else{
                if(flag == false){
                    matriz_1[k][m] = math.cos(nós_func[maior_nó[0]].reacoes[i].angulo)
                    matriz_1[k+n][m] = math.sin(nós_func[maior_nó[0]].reacoes[i].angulo)
                }else{
                    matriz_1[k][m] = -math.cos(nós_func[maior_nó[0]].reacoes[i].angulo)
                    matriz_1[k+n][m] = -math.sin(nós_func[maior_nó[0]].reacoes[i].angulo)
                }
            }
            
        }
        //Somando as forças para colocar na segunda matriz
        if(flagy == true && flagx == true){
        for(j = 0;j<nós_func[maior_nó[0]].forcas.length;j++){
            matriz_2[k][0] -=  nós_func[maior_nó[0]].forcas[j].x;
            matriz_2[k+1][0] -=  nós_func[maior_nó[0]].forcas[j].y;
        }}
        if(flagy == false && flagx == true){
            for(j = 0;j<nós_func[maior_nó[0]].forcas.length;j++){
                matriz_2[k][0] -=  nós_func[maior_nó[0]].forcas[j].x;
            }
            k--;
        }
        
        if(flagy == true && flagx == false){
            for(j = 0;j<nós_func[maior_nó[0]].forcas.length;j++){
                matriz_2[k][0] -=  nós_func[maior_nó[0]].forcas[j].y;
            }
            k--;
        }
        


        //Retira os membros utilizados no nó do vetor
        j = 0
        for(i = 1;i<maior_nó.length;i++){
            membros_func.splice(maior_nó[i]-j,1);
            j++
        }
        k+= 2;
        console.log(`O VALOR DE K NO FINAL DO LOOP É   ${k}`);
        o++;
        nós_func.splice(maior_nó[0],1);
        console.log(matriz_1);
        console.log(matriz_2);
    }
    
    
    console.log(matriz_1);
    console.log(matriz_2);
    return math.lusolve(matriz_1, matriz_2);
}


function calcular(){
    reacoes_apoios = calc_apoios();
    let j = 0;
    let div = document.getElementById("resultados");
    let p;
    for(let i = 0;i< apoios.length; i++){
        if(apoios[i].y == undefined){
            apoios[i].y = reacoes_apoios[j][0];
            p = document.createElement('p');
            p.innerText = `V${nós[apoios[i].nó].nome} = ${apoios[i].y}`
            div.appendChild(p);
            j++;
        }
        if(apoios[i].x == undefined){
           apoios[i].x = reacoes_apoios[j][0];
           
           p = document.createElement('p');
           p.innerText = `H${nós[apoios[i].nó].nome} = ${apoios[i].x}`
           div.appendChild(p);
           j++
        }
        if(apoios[i].Mo == undefined){
            apoios[i].Mo = reacoes_apoios[j][0];
            p = document.createElement('p');
            p.innerText = `Mo${nós[apoios[i].nó].nome} = ${apoios[i].Mo}`;
            div.appendChild(p);
            j++;
         }
         nós[apoios[i].nó].forcas.push(apoios[i])
    }

    let membrosx_y =  reacoes_membros();
    console.log(membrosx_y);
    
    
}