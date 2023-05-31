
///Vetor utilizado para armazenar nós
let nós = [];
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
//Contador de reações dos apoios
let apoios_reacoes_count = 0;
///Carrega o canvas principal
let grafico = document.getElementById('grafico');
let gtx = grafico.getContext('2d');

let apoios_id = 0;



let scale = 4; 

//Definindo escala do canvas
  let style = getComputedStyle(grafico);
  grafico.style.width = style.width;
  grafico.style.height = style.height;
  grafico.width = parseInt(style.width) * scale;
  grafico.height = parseInt(style.height) * scale;



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
Funçao trocar
Parâmetros: n/a
Retorno: n/a

Limpa o canvas desenha todos os componentes
É calculado uma aproximação de onde os nó
irão estar baseado na % de espaço que ele
ocupa entre o maior e menor ponto



*/
function draw(){
    //Váriaveis que carregarão coordenadas  do maior e menor ponto
    let limite_x = [nós[0].x,nós[0].x]
    let limite_y = [nós[0].y,nós[0].y]
    
    
    altura = grafico.height
    largura = grafico.width
    
    //Limpando canvas
    gtx.clearRect(0, 0, grafico.width, grafico.height);
    
    //Encontrando menor e maior ponto
    for(let i = 0;i<nós.length;i++){
        if(nós[i].x<limite_x[0]){
            limite_x[0] = nós[i].x
        }else if( nós[i].x>limite_x[1]){
            limite_x[1] = nós[i].x
        }
        if(nós[i].y<limite_y[0]){
            limite_y[0] = nós[i].y
        }else if( nós[i].y>limite_y[1]){
            limite_y[1] = nós[i].y
        }
    }
    
    let k;
    let coordenadas = [,,,]

    //Desenho dos membros
    gtx.strokeStyle = '#00000';
    for(i = 0;i<membros.length;i++){
        k = 0;
        for(j = 0;j<membros[i].nós.length;j++){
            //Pegando as coordenadas de cada nó do membro
            //Se o ponto for o ponto mínimo(x), ele estará no começo do canvas
            if(limite_x[1]-limite_x[0] == 0){
                coordenadas[k] = 0.1 * largura
    
            }else{
            //Se não fazer o cálculo da sua posição
            coordenadas[k] = 0.1*largura + (0.8 * largura) * ((nós[membros[i].nós[j]].x- limite_x[0])/(limite_x[1]-limite_x[0]));
            }
            k++
            //Se o ponto for o ponto mínimo(y), ele estará no teto do canvas
            if(limite_y[1]-limite_y[0] == 0){
                coordenadas[k] = 0.9*altura;
            }else{
                coordenadas[k] = altura - (0.1*altura + (0.8 * altura) * ((nós[membros[i].nós[j]].y- limite_y[0])/(limite_y[1]-limite_y[0])));
            }
            k++
        }
    
        //Desenhando o membro
        gtx.moveTo(coordenadas[0],coordenadas[1]);
        gtx.lineTo(coordenadas[2],coordenadas[3]);
        gtx.lineWidth = altura * 0.004;
        gtx.stroke();
    }
    
    
    //Começo do desenho das forças e nós
    coordenadas = [,]
    //Varivéis que carregam as coordenadas da "ponta" do vetor força
    let xforca,yforca
    
    //Loop para todos os nós    
    for(i = 0;i<nós.length;i++){
        //Encontrando as coordenadas do nó
        if(limite_x[1]-limite_x[0] == 0){
           coordenadas[0] = 0.1 * largura
        }else{
        coordenadas[0] = 0.1*largura + (0.8 * largura) * ((nós[i].x- limite_x[0])/(limite_x[1]-limite_x[0]));
        }
        if(limite_y[1]-limite_y[0] == 0){
            coordenadas[1] = 0.9*altura;
        }else{
        coordenadas[1] = altura - (0.1*altura + (0.8 * altura) * ((nós[i].y- limite_y[0])/(limite_y[1]-limite_y[0])));
        }
        
        //Desenhando o ponto do nó
        gtx.beginPath();
        gtx.arc(coordenadas[0],coordenadas[1], 0.005*largura,0,2 * Math.PI);
        gtx.strokeStyle = '#00000';
        gtx.fill();
        gtx.stroke();

        //Desenhando o texto do nó
        gtx.font = `${0.05*altura}px Arial`;
        gtx.textAlign = "center";
        gtx.fillText(nós[i].nome,coordenadas[0],coordenadas[1]-0.03* altura);
        let img;
        gtx.strokeStyle = '#E60d11';
        //Loop desenho das forças no nó
        for(let j = 0;j<nós[i].forcas.length;j++){
            
            //definindo direção do vetor
            xforca = coordenadas[0];
            yforca = coordenadas[1];
            if(nós[i].forcas[j].x>0){
                xforca += 0.05 * largura;
                
            }else if(nós[i].forcas[j].x<0){
                xforca -= 0.05 * largura;
                
            }
            if(nós[i].forcas[j].y>0){
                yforca -= 0.1 * altura;
            }else if(nós[i].forcas[j].y<0){
                yforca += 0.1 * altura;
                
            }
            
            //Desenhando linha
            gtx.beginPath();
            
            gtx.moveTo(coordenadas[0],coordenadas[1]);
            gtx.lineTo(xforca,yforca);
            gtx.lineWidth = altura * 0.005;
            gtx.stroke();
            
            //Calculando o valor da força
            let força_texto = Math.sqrt(nós[i].forcas[j].x**2 + nós[i].forcas[j].y**2);
            if(força_texto%1 != 0){
                força_texto = força_texto.toFixed(2);
            }
            //Escrevendo o texto
            força_texto += 'N';
            gtx.font =  `${0.05*altura}px Arial`;
            gtx.fillText(força_texto,xforca + 0.03 * largura,yforca - 0.03 * altura);
            
            //Desenhando a seta do vetor
            let angle = Math.atan2(yforca - coordenadas[1], xforca - coordenadas[0]);
            gtx.beginPath();
            gtx.strokeStyle = '#E60d11';
            gtx.moveTo(xforca - altura*0.02 * Math.cos(angle - Math.PI / 6), yforca - largura*0.02 * Math.sin(angle - Math.PI / 6));
            gtx.lineTo(xforca,yforca );
            gtx.lineTo(xforca - altura*0.02 * Math.cos(angle + Math.PI / 6), yforca - largura*0.02 * Math.sin(angle + Math.PI / 6));
            gtx.stroke();
           
            
        }
        //Desenh dos apoio do nó
        gtx.strokeStyle = '#000000';
        for(j = 0;j<apoios.length;j++){
            if(apoios[j].nó == i){
                //Escolhendo a imagem de acordo com o tipo de apoio
                switch (apoios[j].tipo){
                    case 1:
                        img = document.getElementById("movel");
                        break;
                    case 2:
                        img = document.getElementById("fixo");
                        break;
                    case 3:  
                        img = document.getElementById("engastamento"); 
                        break;
                }
                //Desenhando o apoio
                gtx.drawImage(img, coordenadas[0]-largura*0.025, coordenadas[1],largura*0.05,altura*0.08);
            
            }
        }
    }

}




/*
Função add nó
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
        x: Number(nó_x.value),
        y: Number(nó_y.value),
        forcas: forcas,
        reacoes: [],
        utilizado: false

    }

    //Colocando nó no vetor de nós
    nós.push(new_nó);


    ///Desenhando o nó no canvas
    draw();
   


    ///Colocando um novo parágrafo na div de componentes
    let nós_display = document.getElementById('nós_display');
    let display_newnó = document.createElement('p');
    display_newnó.style.borderBottom =  "solid #bbbec2";
    display_newnó.style.borderWidth =  "2px";
    display_newnó.style.padding = "10px"
    display_newnó.style.fontSize = "22px"
    let option_nó = document.createElement('option');
    let nó_seletores = document.getElementsByClassName('nó_seletor');
    
    display_newnó.setAttribute('id','n'+nome_nó.value);
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
    

    draw();

    //Colocando um p contendo as informações da força na div de componentes
    let new_forca_display = document.createElement('p');
    let p_nó = document.getElementById('n'+nós[i].nome);

    new_forca_display.innerText = ` F${new_forca.nome}: (${new_forca.x},${new_forca.y})`;
    new_forca_display.style.fontSize = "18px"
    new_forca_display.style.color = "#9e1d11"
    p_nó.appendChild(new_forca_display);

    //Zerando os inputs
    document.getElementById('força_x').value = null;
    document.getElementById('força_y').value = null;


} 

/*
Função add_membro
Parâmetros: n/a
Retorno: n/a

Adiciona um membro com os dados dos selects em dois nós
Desenha o membro ligado nos dóis nós

Adiciona um parágrafo com o nome do membro na div de componente
em cada parágrado do nó
*/
function add_membro(){

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
    for(let k = 0;k< nós[i].reacoes.length;k++){
        if(nós[i].reacoes[k].nome == nome_membro){
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

    


    //Colocar as reações no vetor de forças  dos dois nós
    nós[i].reacoes.push(new_membro);
    nós[j].reacoes.push(new_membro);
    membros.push(new_membro);
    
    draw();

    //Colocar um p com nome dos membros na div de componentes
    let new_membro_display = document.createElement('p');
    let p_nó = document.getElementById('n' + nós[i].nome);
    let p_nó2 = document.getElementById('n' + nós[j].nome);
    new_membro_display.innerText = `Membro ${new_membro.nome}`;
    new_membro_display.style.fontSize = "18px"
    new_membro_display.style.display = "inline-block";
    p_nó.appendChild(new_membro_display);
    let new_membro_display_2 = new_membro_display.cloneNode(true)
    new_membro_display_2.innerText = `Membro ${nós[j].nome+nós[i].nome}`;
    p_nó2.appendChild(new_membro_display_2);



}

/*
Função add_apoio
Parâmetros: n/a
Retorno: n/a

Adiciona um apoio do tipo selecionado ao nó selecionado
Coloca uma imagem do apaio no nó selecionado
Adicioona um p na div de componentes com os nomes das reações dos apoios


*/
function add_apoio(){

    //Obtendo valores dos selects
    let nó_selecionado = document.getElementById('nó_seletor_apoio').value;
    let tipo_selecionado = document.getElementById('tipo_seletor').value;
    i = find_nó(nó_selecionado);
    
    for(let j = 0;j<apoios.length;j++){
        if(apoios[j].nó == i){
            let apoio_duplicado = document.getElementById('a'+ apoios[j].id);
            apoios_reacoes_count -= apoios[j].tipo
            apoio_duplicado.remove();
            apoios.splice(j,1);
    
        }
    }


    //Criando nova variável do apoio
    let new_apoio = {
        nó: i,
        tipo: null,
        id: apoios_id,
        x: 0,
        y: 0,
        Mo: 0
    }
    nós[i].apoio = apoios.length;

    let texto;
    let img;

    //Colocando valores de acordo com o tipo de apoio selecionado
    switch (tipo_selecionado){
        case '1': //Apoio móvel, apenas uma reação vertical
            apoios_reacoes_count++;
            new_apoio.y = undefined;
            new_apoio.tipo = 1;
            texto = `V${nós[i].nome}`
            break;
        case '2'://Apoio fixo, uma reação vertical e horizontal
            apoios_reacoes_count+= 2;
            new_apoio.y = undefined;
            new_apoio.x = undefined;
            new_apoio.tipo = 2;
            texto = `V${nós[i].nome} H${nós[i].nome}`
           
            break;
        case '3': //Apoio de engastamento, reação vertical,horizontal e de momento
            apoios_reacoes_count+= 3;
            new_apoio.y = undefined;
            new_apoio.x = undefined;
            new_apoio.Mo = undefined;
            new_apoio.tipo = 3;
            texto = ` V${nós[i].nome} H${nós[i].nome} Mo${nós[i].nome}`
            break;
    }
    //Coloca o novo apoio no vetor de apoios
    apoios.push(new_apoio);
    draw(); 
    
    i = find_nó(nó_selecionado);
    //Cria um p na div de componentes com as reações do apoio
    let new_apoio_display = document.createElement('p');
    let p_nó = document.getElementById('n'+nós[i].nome);
    new_apoio_display.setAttribute('id','a'+apoios_id  );
    new_apoio_display.innerText = `Reações apoio ${texto}`;
    new_apoio_display.style.fontSize = "18px";
    p_nó.appendChild(new_apoio_display);
    apoios_id++;

}

/*
Função calc_apoios
Parâmetros: n/a
Retorno: vetor com as reações calculadas

Calcula as reações do apoios, formando
duas matrizes do sistema de equações
para serem calculadas usando regra de cramer


*/
function calc_apoios(){

    //Definindo o centro para o cálculo do momemto
    //O centro será o nó que contém mais forças de reação

    let centro;
    let k = 0;
    let resultados = Array(apoios_reacoes_count).fill().map(() => Array(1).fill(0));
    aux = apoios[0]
    for(let i = 0;i<apoios.length;i++){
        if(apoios[i].tipo>aux.tipo){
            aux = apoios[i];
        }
    }
    aux = nós[aux.nó]
    centro = aux;
   

    if(apoios_reacoes_count == 3){
        k = 1;
    }
    //Calculando a matriz 2 para resolver com regra de cramer
    //A matriz 2 conterá a somátoria, em x , y, mo
    //A matriz 2 terá o número de linhas igual ao número de reações
    //Se estiver uma ou duas reações, irá escolher a melhor somatória para calcular
    for(i = 0;i<nós.length;i++){
        for(j = 0;j<nós[i].forcas.length;j++){
            resultados[0][0] -= nós[i].forcas[j].y;
            if(apoios_reacoes_count == 3 ||  (apoios.length == 1 && apoios_reacoes_count == 2)){
            resultados[apoios_reacoes_count-k-1][0] -= nós[i].forcas[j].x;
            }
            if(apoios_reacoes_count == 3 || (apoios.length == 2 && apoios_reacoes_count == 2)){
                resultados[apoios_reacoes_count-1][0] -= nós[i].forcas[j].x * (centro.y - nós[i].y ) + nós[i].forcas[j].y * (nós[i].x - centro.x);
            }
    }}
   
    //Fazendo o matriz 1 de acordo com o tipo de apoio
    //Matriz 1 conterá as incógnitas do sistema
    let matriz1 = Array(apoios_reacoes_count).fill().map(() => Array(apoios_reacoes_count ).fill(0));
    j = 0
    for(i = 0;i<apoios.length;i++){
        switch(apoios[i].tipo){
            case 1:
                matriz1[0][j] = 1;
                if(apoios_reacoes_count == 3 || (apoios.length == 2 && apoios_reacoes_count == 2)){
                    matriz1[apoios_reacoes_count-1][j] =  1 * (nós[apoios[i].nó].x - centro.x);
                }
                j++
                break;
            case 2:
                matriz1[0][j] = 1;
                j++
                matriz1[1][j] = 1;
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
    //Retornoando os valores das incógnitas
    return math.lusolve(matriz1, resultados);
}



/*

Função add_apoio
Parâmetros: n/a
Retorno: vetor com: resultados,matriz de incógnitas e vetor de nós utilizados

Calcula as reações dos membro montando duas
 matrizes e resolvendo o sistema com regra de cramer


*/
function reacoes_membros(){

    
    //Setando matriz para regra de cramer
    let matriz_1 = Array(membros.length).fill().map(() => Array(membros.length).fill(0));
    let matriz_2 = Array(membros.length).fill().map(() => Array(1).fill(0));
    let k = 0;
    let nós_utilizados = [];
    
    //Copiando vetores
    membros_func = Array.from(membros);
    nós_func = Array.from(nós);
    
    let m = 0;
    let n = 1;
    
    

    //Enquanto a matriz não estiver completa
    while(k != membros.length){

        //Matriz que carrega nós
        //nós_indice[i][0] = carrega número de membros do nó i
        //nós_índice[i][1++] = carrega endereços do membro
        nós_indice = Array(nós_func.length).fill().map(() => Array(1).fill(0));
        

        for(i = 0;i<membros_func.length;i++){
            nós_indice[membros_func[i].nós[0]][0]++;
            nós_indice[membros_func[i].nós[0]].push(i);
            nós_indice[membros_func[i].nós[1]][0]++;
            nós_indice[membros_func[i].nós[1]].push(i);
        }
       
        let maior_nó = [-1];
        j = 0;

        //Escolhe o nó não utilizado com o maior número de membros não calculado
        
        for(i = 0;i<nós_indice.length;i++){
            if(nós_indice[i][0]>maior_nó[0] && nós_func[i].utilizado == false){
                maior_nó = nós_indice[i];
                j = i;
            }
        }
        //Escolhe o nó com forças 
        for(i= 0;i<nós_indice.length;i++){
            if(nós[i].forcas.length>0 && nós_func[i].utilizado == false){
                maior_nó = nós_indice[i];
                j = i
            }
        }
        
        //maior_nó[0] vai carregar endereço do nó
        maior_nó[0]= j;
     
        
        
       
        let flagx = true;
        let flagy = true;
        //Percorrendo todos os membros do maior nó
        if(k+2>membros.length){
            //Se o número de membros for ímpar, escolhe uma somatória para calcular
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
            let negx = false
            let negy = false
            let nós_membros = nós_func[maior_nó[0]].reacoes[i].nós;
            //Definindo o m para colocar na matriz_1
            for(j = 0;j<membros.length;j++){
                if(nós_func[maior_nó[0]].reacoes[i].nome == membros[j].nome){
                    m = j;
                }
            }
            
            
            //Conferindo se o membro já foi colocado em outro nó
            //Definindo se a incognita será negativa ou positiva de acordo com as posições dos nós do membro
            if(nós_func[maior_nó[0]].x> nós_func[nós_membros[0]].x || nós_func[maior_nó[0]].x> nós_func[nós_membros[1]].x){
                negx = true
            }
            if(nós_func[maior_nó[0]].y> nós_func[nós_membros[0]].y || nós_func[maior_nó[0]].y> nós_func[nós_membros[1]].y){
                negy = true
            }
            
        
            //Membro deitado
            if(nós_func[maior_nó[0]].reacoes[i].y != undefined && flagx == true){
                console.log('membro deitado')
                if(negx == false){
                    matriz_1[k][m] = 1
                    
                }else{
                    matriz_1[k][m] = -1
                    
                }
            }
            //Membro de pé
            else if(nós_func[maior_nó[0]].reacoes[i].x != undefined && flagy == true){
                console.log('membro de pé');
                if(negy == false){
                    matriz_1[k+n][m] = 1
                }else{
                    matriz_1[k+n][m] = -1
                }
            }
            //Membro inclinado
            else if(nós_func[maior_nó[0]].reacoes[i].x == undefined && nós_func[maior_nó[0]].reacoes[i].y == undefined){
                
                    if(flagx == true && negx == false){
                    matriz_1[k][m] = Math.abs(math.cos(nós_func[maior_nó[0]].reacoes[i].angulo))
                    }
                    else if(flagx == true){
                    matriz_1[k][m] = -Math.abs(math.cos(nós_func[maior_nó[0]].reacoes[i].angulo))
                    
                    }
                    if(flagy == true && negy == false){
                    matriz_1[k+n][m] = Math.abs(math.sin(nós_func[maior_nó[0]].reacoes[i].angulo))
                    
                    }
                    else if(flagy == true){
                    matriz_1[k+n][m] = -Math.abs(math.sin(nós_func[maior_nó[0]].reacoes[i].angulo))
                    
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
        //Coloca o nó_utilizado no vetor nós_utilizados
        nós_utilizados.push(nós_func[maior_nó[0]].nome);
        nós_utilizados.push(nós_func[maior_nó[0]].nome);
        //Definindo o nó como utilizado
        nós_func[maior_nó[0]].utilizado = true;

    }
    //Retorno da resposta do sistema,matriz de incógnitas, e vetor de nós_utilizados
    let results = [math.lusolve(matriz_1, matriz_2),matriz_1,nós_utilizados];
    return results;
}

/*
Função calcular
Parâmetros: n/a
Retorno: n/a

Chama a função calc_apoios (se sistema válido)
e coloca o resultado como força em seu respectivo nós,
cria um p com as reações na div de resultados
depois chama a reacoes_membros e cria um p com
as reações dos membros

*/
function calcular(){

    //Testando se sistema é válido
    if(apoios_reacoes_count>3 || apoios.length>2){
        return window.alert('Sistema não cálculavel com a reações de equilíbrio ')
    }


    let j = 0;
    let div = document.getElementById("resultados");
    div.style.display = "block";

    if(apoios.length!= 0){
    //Chamando função de calcular reações dos apoios
    reacoes_apoios = calc_apoios();
    let p;
    //Criando p com as informações das reações de acordo com o tipo de apoio
    for(let i = 0;i< apoios.length; i++){
        if(apoios[i].y == undefined){
            apoios[i].y = reacoes_apoios[j][0];
            p = document.createElement('p');
            p.innerText = `V${nós[apoios[i].nó].nome} = ${apoios[i].y}N`
            div.appendChild(p);
            j++;
        }
        if(apoios[i].x == undefined){
           apoios[i].x = reacoes_apoios[j][0];
           
           p = document.createElement('p');
           p.innerText = `H${nós[apoios[i].nó].nome} = ${apoios[i].x}N`
           div.appendChild(p);
           j++
        }
        if(apoios[i].Mo == undefined){
            apoios[i].Mo = reacoes_apoios[j][0];
            p = document.createElement('p');
            p.innerText = `Mo${nós[apoios[i].nó].nome} = ${apoios[i].Mo}N`;
            div.appendChild(p);
            j++;
         }
         nós[apoios[i].nó].forcas.push(apoios[i])
    }
    }
    //Chamando função que calcula as reações dos membros
    let reacoes_calculadas =  reacoes_membros();
   
    
    j = 0
    //Criando p com as informações das reações dos membros
    for(i = 0;i < membros.length;i++){
        for(j = 0;j<membros.length;j++){
            if(reacoes_calculadas[1][j][i] != 0){ 

                let resultado = reacoes_calculadas[0][i][0];
                p = document.createElement('p');
              
                
                if(reacoes_calculadas[2][j] == membros[i].nome.charAt(0)){
                    p.innerText = ` ${reacoes_calculadas[2][j]+membros[i].nome.charAt(1)} = ${resultado.toFixed(2)}N`;
                    div.appendChild(p);
                    p = document.createElement('p');
                    p.innerText = ` ${membros[i].nome.charAt(1)+ reacoes_calculadas[2][j]} = ${-resultado.toFixed(2)}N`;
                    div.appendChild(p);
                }else{
                    p.innerText = ` ${reacoes_calculadas[2][j]+membros[i].nome.charAt(0)} = ${resultado.toFixed(2)}N`;
                    div.appendChild(p);
                    p = document.createElement('p');
                    p.innerText = ` ${membros[i].nome.charAt(0)+ reacoes_calculadas[2][j]} = ${-resultado.toFixed(2)}N`;
                    div.appendChild(p);
                } 

                break;
            }
            
        
        }
    }
    
    
}