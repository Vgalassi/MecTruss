
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
Parâmetros: results,calc_membros
Results: indica se o resultado já foi calculado
calc_membros: carrega as reações dos membros (apenas para resultado)
Retorno: n/a

Limpa o canvas desenha todos os componentes
É calculado uma aproximação de onde os nó
irão estar baseado na % de espaço que ele
ocupa entre o maior e menor ponto



*/
function draw(results,calc_membros){
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
        //Se o resultado for calculado
        if(results == true){
            
            if(calc_membros[i]>0){ 
                //Linha de azul para tração
                gtx.strokeStyle = '#070bf5'
            }else if(calc_membros[i]<0){
                //Linha de vermelho para compressão
                gtx.strokeStyle = '#f50707'
            }
        }
    
        //Desenhando o membro
        gtx.beginPath();
        gtx.moveTo(coordenadas[0],coordenadas[1]);
        gtx.lineTo(coordenadas[2],coordenadas[3]);
        gtx.lineWidth = altura * 0.006;
        gtx.lineHeight = altura * 0.006;
        gtx.stroke();

        
        gtx.strokeStyle = '#000000';
        //Escrevendo os valores das reações dos membros
        if(results == true){
            let texto = `${calc_membros[i].toFixed(2)}N`
            let midX = (coordenadas[0] + coordenadas[2]) / 2;
            let midY = (coordenadas[1] + coordenadas[3]) / 2;

            // Calcula a angulação da linha
            let angulo = Math.atan2(coordenadas[3] - coordenadas[1], coordenadas[2] - coordenadas[0]);
            if (angulo < -Math.PI / 2 || angulo > Math.PI / 2) {
                angulo += Math.PI;
                
              }

            // Move a origem do contexto para o ponto médio da linha
            gtx.translate(midX, midY);

            // Rotaciona o contexto pela angulação da linha
            gtx.rotate(angulo);
            gtx.font =  `${0.05*altura}px Arial`;
            // Desenha o texto na posição desejada
            gtx.fillText(texto, 0, 0);

            // Restaura o contexto para sua posição e rotação originais
            gtx.setTransform(1, 0, 0, 1, 0, 0);
        }
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
    let o = i,l = j
    let m  = i, n = j
    if(nós[i].x>nós[j].x){
        o = j
        l = i
    }
    if(nós[i].y>nós[j].y){
        m  = j
        n = i
    }
    
    let membros_nós = [i,j];
 
    //Calculando o deltax e deltay do membro
    let deltax;
    let deltay;
    let h,g
    if(nós[i].x<nós[j].x){
        deltax = nós[j].x - nós[i].x
        deltay = nós[j].y - nós[i].y
       g = i
       h = j
       
    }else if(nós[i].x == nós[j].x && nós[i].y<nós[j].y){
        g = i
        h = j
        deltax = nós[j].x - nós[i].x
        deltay = nós[j].y - nós[i].y

    }else{
        deltax = nós[i].x - nós[j].x
        deltay = nós[i].y - nós[j].y
        g = j
        h = i
        membros_nós = [j,i];

    }
    let mr = deltax/deltay
    //Verificando se há colisão com nós
    for(k = 0;k<nós.length;k++){
        if(k != i && k!=j){
            if(nós[o].x == nós[l].x || nós[m].y == nós[n].y){
                if(nós[k].x >= nós[o].x && nós[k].x <= nós[l].x && nós[k].y >= nós[m].y && nós[k].y <= nós[n].y){
                    return(window.alert('Colisão entre nós'));
                }
            }else{
                
                if(nós[k].y == nós[o].y + mr*(nós[k].x - nós[o].x)){
                    return(window.alert('Colisão entre nós'))
                }
            }
            
        }
    }

    //Verificando se há colisão com membros
    for(k = 0;k<membros.length;k++){

        let x3,x4,y3,y4
        let x1 = nós[g].x
        let x2 = nós[h].x
        let y1 = nós[g].y
        let y2 = nós[h].y
        //Calculando os coeficientea
        let a1 =  y2-y1
        let b1 = x1 - x2
        //determinando qual ponnto é menor
        if(nós[membros[k].nós[0]].x>nós[membros[k].nós[1]].x){

            x3 = nós[membros[k].nós[1]].x;
            x4 = nós[membros[k].nós[0]].x;
            y3 = nós[membros[k].nós[1]].y;
            y4 = nós[membros[k].nós[0]].y;
            
        }else{
            x3 = nós[membros[k].nós[0]].x;
            x4 = nós[membros[k].nós[1]].x;
            y3 = nós[membros[k].nós[0]].y;
            y4 = nós[membros[k].nós[1]].y;
        }
        //Calculas os coeficientes
        a2 = y4-y3
        b2 = x3-x4
        //Calculando o c das funções
        let c1 = a1 * x1 + b1 * y1;
        let c2 = a2 * x3 + b2 * y3;
        let determinante = a1 * b2 - a2 * b1;
        if(determinante != 0){
            let x = (b2 * c1 - b1 * c2) / determinante;
            let y = (a1 * c2 - a2 * c1) / determinante;

            //Para membros inclinados
            if(x > nós[o].x && x < nós[l].x && y > nós[m].y && y < nós[n].y){
                return window.alert('Colisão entre membros');
            }
            //Para membros de verticais
            if(x == nós[o].x && x == nós[l].x && y > nós[m].y && y < nós[n].y){
                return window.alert('Colisão entre membros');
            }
            //Para membros hroziontais
            if(x > nós[o].x && x < nós[l].x && y == nós[m].y && y == nós[n].y){
                return window.alert('Colisão entre membros');
            }
        }

    }
    

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

    

    //Comprimento da barra eseno dos ângulos
    comprimento = Math.sqrt(deltax**2 + deltay**2); 
    let cos_membro = deltax/comprimento
    let sin_membro = deltay/comprimento 
    //Criando novo membro
    let new_membro = {
        nome: nome_membro,
        x: componentex,
        y: componentey,
        nós: membros_nós,
        cos: cos_membro,
        sin: sin_membro,
        comprimento: comprimento
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
Função reacoes_membros
Parâmetros: n/a
Retorno: vetor com as reações dos apoios e dos membros (retorno[reacoes_apoios,calc_membros])

Calcula as reações dos membros e dos apoios utiliando método da matriz de rigídez


*/
function reacoes_membros(){

    let matriz_rotacao = [[]];
    //Matriz de rigidez geral de ordem = dobro de número de nós
    let matriz_rigidez_geral = Array(nós.length*2).fill().map(() => Array(nós.length*2).fill(0));
    //Definindo matriz de rigidez local
    let matriz_rigidez_local = [[ 1, 0,-1, 0], [ 0, 0, 0, 0], [-1, 0, 1, 0], [ 0, 0, 0, 0]];
    //Definindo coeficiente elástico e área transversal
    let E = 210000;
    let A = 0.01;


    for(let i = 0;i<membros.length;i++){
        //Definindo o sen e cos do membro e fazendo a matriz de rotação
        let cos = membros[i].cos;
        let sin = membros[i].sin;
        matriz_rotacao = [
            [cos, sin,0,0],
            [-sin, cos,0,0],
            [0,0,cos,sin],
            [0,0,-sin, cos]
        ];

        
        //Multiplicando por area transversal * elasticidade
        let Kl = math.multiply((A*E)/membros[i].comprimento, matriz_rigidez_local);

        //Rotacionando a matriz
        Kl = math.multiply(math.multiply(math.transpose(matriz_rotacao), Kl), matriz_rotacao);



        let coordenadas1 = membros[i].nós[0]*2;
        let coordenadas2 = membros[i].nós[1]*2;
        //Colocando os dados na matriz de rigidez geral, de acordo com sua posição
        for(let j = 0;j<2;j++){
            for(let k = 0;k<2;k++){
                matriz_rigidez_geral[coordenadas1+k][coordenadas1+j] += Kl[k][j]
                matriz_rigidez_geral[coordenadas1+k][coordenadas2+j] += Kl[k][j+2]
            }
        }
        for(let j = 0;j<2;j++){
            for(let k = 0;k<2;k++){
                matriz_rigidez_geral[coordenadas2+k][coordenadas1+j] += Kl[k+2][j]
                matriz_rigidez_geral[coordenadas2+k][coordenadas2+j] += Kl[k+2][j+2]
            }
        }
    }
    //Clonando a matriz,tendo a matriz de rigidez completa (sem modificação de apoios)
    let matriz_rigidez_geral_comp = matriz_rigidez_geral.map(function(arr) {
        return arr.slice();
    });

    //Manipulando a matriz para graus de liberdade nulos (nó com apoio)
    for(i = 0;i<apoios.length;i++){
        coordenadas = apoios[i].nó * 2
        //Quando tem restrição vertical
        for(j = 0;j<matriz_rigidez_geral.length;j++){
            matriz_rigidez_geral[coordenadas+1][j] = 0;
            matriz_rigidez_geral[j][coordenadas+1] = 0;
            matriz_rigidez_geral[coordenadas+1][coordenadas+1] = 1;
        }
        //Quando tem restrição horizontal
        if(apoios[i].tipo != 1){
            for(j = 0;j<matriz_rigidez_geral.length;j++){
                matriz_rigidez_geral[coordenadas][j] = 0;
                matriz_rigidez_geral[j][coordenadas] = 0;
                matriz_rigidez_geral[coordenadas][coordenadas] = 1;
            }
        }
        
    }
    
    //Criando matriz de forças
    let matriz_forcas = Array(nós.length*2).fill().map(() => Array(1).fill(0));
    for(i = 0;i<nós.length;i++){
        let fx = 0,fy = 0;
        for(j = 0;j<nós[i].forcas.length;j++){
            fx += nós[i].forcas[j].x
            fy += nós[i].forcas[j].y
        }
        matriz_forcas[i*2][0] = fx;
        matriz_forcas[i*2 + 1][0] = fy;
    }

    
    let U;
    U = math.lusolve(matriz_rigidez_geral, matriz_forcas);
    //Matriz com reações de apoios
    R = math.multiply(matriz_rigidez_geral_comp,U);

    //Atribuindo as reações para cada apoio
    let reacoes_apoios = [];
    j = 0
    for(i = 0;i<apoios.length;i++){
        reacoes_apoios.push(R[apoios[i].nó *2][0]);
        reacoes_apoios.push(R[apoios[i].nó *2 +1][0]);
    }
    
    //Fazendo cálculo dos reações dos membros
    let calc_membros = [];
    for(i = 0;i<membros.length;i++){
        //Estabelecendo a matriz de rotação do membro
        let cos = membros[i].cos;
        let sin = membros[i].sin;
        matriz_rotacao = [
            [cos, sin,0,0],
            [-sin, cos,0,0],
            [0,0,cos,sin],
            [0,0,-sin, cos]
        ];

        let Kl = math.multiply((A*E)/membros[i].comprimento, matriz_rigidez_local);
        let Ul = [0,0,0,0];
        Ul[0] = U[2*membros[i].nós[0]][0]
        Ul[1] = U[2*membros[i].nós[0]+1][0]
        Ul[2] = U[2*membros[i].nós[1]][0]
        Ul[3] = U[2*membros[i].nós[1]+1][0]

        F = math.multiply(Kl,math.multiply(matriz_rotacao,Ul));
        //Colocando resultado com no vetor calc_membros
        calc_membros.push(F[2]);
        
    }
    //Retornando resultados
    let retorno = [reacoes_apoios,calc_membros];
    return(retorno);

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
    if(apoios_reacoes_count>3 || apoios.length>2 || apoios.length == 0){
        return window.alert('Sistema não cálculavel com a reações de equilíbrio ')
    }

    

    let j = 0;
    let div = document.getElementById("resultados");
    paragrafos = div.querySelectorAll("p");
    for(i = 1;i<paragrafos.length;i++){
        div.removeChild(paragrafos[i]);
    }


    div.style.display = "block";
    
    let resultados =  reacoes_membros();
    let reacoes_apoios = resultados[0];
    let calc_membros = resultados[1];
    console.log(reacoes_apoios);
    let p;
    //Criando p com as informações das reações de acordo com o tipo de apoio
    for( i = 0;i< apoios.length; i++){
            if(apoios[i].tipo != 1){
                apoios[i].x = reacoes_apoios[j][0];
                
                p = document.createElement('p');
                p.innerText = `H${nós[apoios[i].nó].nome} = ${reacoes_apoios[j].toFixed(2)}N`
                div.appendChild(p);
                
            }
                j++
                apoios[i].y = reacoes_apoios[j][0];
                p = document.createElement('p');
                p.innerText = `V${nós[apoios[i].nó].nome} = ${reacoes_apoios[j].toFixed(2)}N`
                div.appendChild(p);
                j++;
            
        
        
    }
    //Chamando função para desenhar os resultados
    draw(true,calc_membros);
   

    
    
}



