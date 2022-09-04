let FecharIntroducao = document.querySelector(".telaIntroducao button")
FecharIntroducao.addEventListener("click", ()=>{
    document.querySelector(".telaIntroducao").style.display = 'none'
    document.querySelector(".contentTelaIntroducao").style.display = 'none'
})


let comandosFeitos = document.querySelector("#comandosFeitos")

var nivel = 1

let user = document.getElementById("1")
user.className = 'mostrarAluno'

let posicaoObjetivo
let posicaoVilao

let comandosUser = []
let celulas = document.querySelectorAll('td')
let todosComandos = document.querySelector("#comandos").childNodes

todosComandos.forEach(element => {
    element.addEventListener("click", listarComando)
});
posicaoAleatoria(((celulas.length - 2)/2), "objetivo", null)

function posicaoAleatoria(ateQuanto, ocasiao, interval){
    let num = Math.round(Math.random() * ateQuanto)
    if(ocasiao == "objetivo"){
        num += 50
        document.getElementById(num).className = 'mostrarObjetivo'
        posicaoObjetivo = num
    }else if(ocasiao == "vilao"){
        if(num == 0){
            num = 2
        }
        let aux2 = document.getElementById(num)
        
        if(aux2.className == 'mostrarBarreira' | aux2.className == 'mostrarObstaculoAbaixar' | aux2.className == 'mostrarParede'){
            posicaoAleatoria(ateQuanto, ocasiao, interval)
        }else{
            celulas.forEach(element=>{
                if(element.id == num){
                    element.className = 'mostrarVilao'
                    posicaoVilao = num
                    setTimeout(() => {
                        validarPerdeuVilao(interval)
                    }, 50);  
                }
            })
        }
    }
}

function listarComando(event){
    comandosUser.push(event.path[1].id)
    switch(event.path[1].id){
        case "Direita":
            comandosFeitos.innerHTML += montarParagrafo("Imagens/comandos/setaDireita.png")
        break
        case "Esquerda":
            comandosFeitos.innerHTML += montarParagrafo("Imagens/comandos/setaEsquerda.png")
        break
        case "Cima":
            comandosFeitos.innerHTML += montarParagrafo("Imagens/comandos/setaCima.png")
        break
        case "Baixo":
            comandosFeitos.innerHTML += montarParagrafo("Imagens/comandos/setaBaixo.png")
        break
        case "Pular":
            comandosFeitos.innerHTML += montarParagrafo("Imagens/comandos/pular.png")
        break
        case "Abaixar":
            comandosFeitos.innerHTML += montarParagrafo("Imagens/comandos/abaixar.png")
        break
        case "iniciar":
            comandosUser.pop()
            posicaoUser = 1
            auxLeitor = 0
            temporizarMoverBoneco()
        break
    }
}

function montarParagrafo(url){
    let parte1= '<img src='
    let parte2= '>'
    return parte1 + url + parte2
}

let auxLeitor = 0
let posicaoUser = 1
let tempoTotal
let temporizadorPasso
function temporizarMoverBoneco(){
    tempoTotal = (comandosUser.length * 100) + 100
    temporizadorPasso = setInterval(()=>{
        moverBoneco()
        auxLeitor++
    }, 100)
    setTimeout(() => {
        clearInterval(temporizadorPasso)
        validarChega()
    }, tempoTotal);
}

function moverBoneco(){
    switch(comandosUser[auxLeitor]){
        case "Direita":
            moverBonecoAux(1, true)
        break
        case "Esquerda":
            moverBonecoAux(-1, true)
        break
        case "Cima":
            moverBonecoAux(-10, true)
        break
        case "Baixo":
            moverBonecoAux(10, true)
        break
        case "Pular":
            pular(auxLeitor)
        break
        case "Abaixar":
            abaixar()
        break
    }
}

function moverBonecoAux(num, boolean){
    posicaoUser += num
    validarBateuObstaculoPular()
    validarBateuObstaculoAbaixar()
    validarBateuObstaculoParede()

    user.className = ""
    user = document.getElementById(posicaoUser)
    if(boolean){
        mostrarAdicionais()
    }
    if(contadorAbaixado == 1){
        user.className = 'mostrarAlunoAbaixado'
        contadorAbaixado = 0
    }else{
        user.className = 'mostrarAluno'
    }
}

function validarBateuObstaculoPular(){
    posicaoObstaculoPulo.forEach(element =>{
        if(posicaoUser == element){
            alert("Você bateu no obstáculo, deveria te-lo pulado ou desviado")
            clearInterval(temporizadorSpawnVilao)
            chamarJogo("duelo")
            reset("", temporizadorSpawnVilao)
        }
    })
}

function validarBateuObstaculoAbaixar(){
    posicaoObstaculoAbaixar.forEach(element =>{
        if(posicaoUser == element){
            if(contadorAbaixado != 1){
                alert("Você bateu no obstáculo, deveria ter se abaixado para passa-lo")
                clearInterval(temporizadorSpawnVilao)
                chamarJogo("cerveja")
                reset("", temporizadorSpawnVilao)
            }  
        }
    })
}

function validarBateuObstaculoParede(){
    posicaoObstaculoParede.forEach(element =>{
        if(posicaoUser == element | posicaoPulada == element){
            alert("Você bateu no obstáculo, deveria te-lo desviado")
            reset("", temporizadorSpawnVilao)
        }
    })
}

function validarChega(){
    if(posicaoUser == posicaoObjetivo){
        alert("Você chegou!!")
        reset("passou", '')
    }
}

function chamarJogo(jogo){
    document.querySelector(".jogosFundo").style.display = "flex"
    if(jogo == "cerveja"){
        document.getElementsByClassName("jogo1")[0].style.display = "flex"
        document.getElementsByClassName("jogo1Content")[0].style.display = "block"
        document.querySelector(".introducao").style.display = "inline"
    }else{
        document.getElementsByClassName("jogo2")[0].style.display = "flex"
        document.getElementsByClassName("jogo2Content")[0].style.display = "flex"
        document.querySelector(".introducao2").style.display = "flex"
    }
}


let auxChamarVilao = 0
function reset(texto, interval){
    posicaoPulada = 0
    tempoTotal = (comandosUser.length * 500) + 100
    celulas.forEach(element=>{
        element.className = ''
        element.style.backgroundColor = 'white'
    })
    let aux1 = posicaoObstaculoPulo.length
    for(let i = 0; i<aux1; i++){
        posicaoObstaculoPulo.pop()
        posicaoObstaculoAbaixar.pop()
        posicaoObstaculoParede.pop()
    }
    comandosFeitos.innerHTML = ""
    let aux = comandosUser.length
    for(let i = 0; i< aux; i++){
        comandosUser.pop()
    }
    moverBonecoAux(-posicaoUser + 1, false)
    posicaoAleatoria((celulas.length - 2)/2, "objetivo", '')

    clearInterval(temporizadorSpawnVilao)

    if(texto == "passou"){
        nivel++
    }
    if(nivel == 2){
        preapararVilao()
    }else if(nivel == 3){
        document.querySelector("#Pular").removeAttribute('disabled')
        document.querySelector("#Abaixar").removeAttribute('disabled')
        preapararVilao()
        prepararNivel3()
    }else if(nivel == 4){
        document.querySelector(".fundo").style.display = "flex"
    }
} 

let temporizadorSpawnVilao
function preapararVilao(){
    temporizadorSpawnVilao = setInterval(()=>{
        celulas.forEach(element=>{
            if(element.className == 'mostrarVilao'){
                element.style.backgroundColor = 'white'
                element.className = ''
            } 
        })
        posicaoAleatoria(celulas.length - 2, "vilao", temporizadorSpawnVilao)
    }, 1000)
}

function validarPerdeuVilao(interval){
    let aux
    if(posicaoVilao == posicaoObjetivo | posicaoVilao == posicaoUser){
        let auxPosicoes = [posicaoVilao - 10, posicaoVilao + 10, posicaoVilao - 1, posicaoVilao + 1]
        clearInterval(temporizadorPasso)
        auxPosicoes.forEach(element => {
            celulas.forEach(e =>{
                if(element == parseInt(e.id)){
                    e.style.backgroundColor = "red"
                }
            })
        });
        setTimeout(() => {
            alert("perdeu")
            reset("", interval)
        }, 1000);
    }
}

let posicaoObstaculoPulo = []
let posicaoObstaculoAbaixar = []
let posicaoObstaculoParede = []
function prepararNivel3(){
    //colocar Obstáculo pulo;
    //colocar obstáculo abaixar;
    let numeroObstaculosPular = 3
    let numeroObstaculosAbaixar = numeroObstaculosPular
    let numeroObstaculosParede = numeroObstaculosAbaixar

    for(let i = 0 ; i < numeroObstaculosPular; i++){
        colocarObstaculo(posicaoObstaculoPulo, 'mostrarBarreira')
    }
    for(let i = 0 ; i < numeroObstaculosAbaixar; i++){
        colocarObstaculo(posicaoObstaculoAbaixar, 'mostrarObstaculoAbaixar')
    }
    for(let i = 0 ; i < numeroObstaculosParede; i++){
        colocarObstaculo(posicaoObstaculoParede, 'mostrarParede')
    }

}

function colocarObstaculo(vetor, classe){
    let num = Math.round(Math.random() * celulas.length - 2)
    if(num <= 0 | num == -1 | num == 1){
        num = 5
    }

    let aux = document.getElementById(num)
    console.log(num)
    if(posicaoObstaculoAbaixar.indexOf(num) == -1 && posicaoObstaculoPulo.indexOf(num) == -1  && posicaoObstaculoParede.indexOf(num) == -1 && aux.className != 'mostrarObjetivo'){
        vetor.push(num)
        document.getElementById(num).className = classe
    }else{
        colocarObstaculo(vetor, classe)
    }

}

let posicaoPulada
function pular(posicaoComandoPular){
    let aux = comandosUser[posicaoComandoPular - 1]
    if(aux == "Direita"){
        posicaoPulada = posicaoUser + 1
        moverBonecoAux(2)
    }else if(aux == "Esquerda"){
        posicaoPulada = posicaoUser -1
        moverBonecoAux(-2)
    }else if(aux == "Cima"){
        posicaoPulada = posicaoUser -10
        moverBonecoAux(-20)
    }else if(aux == "Baixo"){
        posicaoPulada = posicaoUser + 20
        moverBonecoAux(20)
    }
}

let contadorAbaixado
function abaixar(){
    contadorAbaixado = 1
    user.className = ""
    user = document.getElementById(posicaoUser)
    user.className = 'mostrarAlunoAbaixado'
}

function mostrarAdicionais(){
    posicaoObstaculoAbaixar.forEach(element =>{
        document.getElementById(element).className = 'mostrarObstaculoAbaixar'
    })
    document.getElementById(posicaoObjetivo).className = 'mostrarObjetivo'
}

//------------------------------------------------------------  JOGOS  ------------------------------------------------------------------------------------------------
var botoesFechar = document.querySelectorAll(".fecharJogo")

// ----------------------------------- JOGO 1  -----------------------------------------
var botaoComecarJogo1 = document.querySelector("#comecar1")
var botoesJogo1 = document.querySelectorAll(".botoesJogatina1")
var tempoMostrarBebidaJogo1 = 600
var tempoIntervaloSpawnJogo1 = 2000
var tempoJogo1 = 21000
let contadorBebidas = 0


let auxPodeClicar = true
botaoComecarJogo1.addEventListener("click", ()=>{
    document.querySelector(".introducao").style.display = "none"
    document.querySelector("#rostoPirata").style.display = "block"
    document.querySelector(".jogatina1").style.display = "flex"
    document.querySelector(".barraSatisfacao").style.display = "inline-block"
    botoesJogo1.forEach(element => {
        element.style.display = "inline"
        element.addEventListener("click", validarClickBebida)
    });
    var temporiza = setInterval(()=>{
        tudoOnda()
        spawnAleatorio()
        let temporizadorMostrar = setTimeout(()=>{
            auxPodeClicar = true
            tudoOnda()
        }, tempoMostrarBebidaJogo1)
    }, tempoIntervaloSpawnJogo1)

    var finaliza = setTimeout(()=>{
        clearInterval(temporiza)
        validarVitoriaJogo1()
    }, tempoJogo1)
})

function spawnAleatorio(){
    let num = Math.round(Math.random() * 9)

    console.log("foi")
    botoesJogo1.forEach(element => {
        if(element.id == "b" + String(num)){
            element.style.backgroundImage = `url(Imagens/jogoCerveja/bebida2.jpg)`          
        }
    });
}

let auxAltura = 0
function validarClickBebida(event){
    if(event.path[0].style.backgroundImage == 'url("Imagens/jogoCerveja/bebida2.jpg")' && auxPodeClicar){
        contadorBebidas++
        auxPodeClicar = false
        //22.5px por bebida
        auxAltura += 22.5
        document.querySelector("#pintura").style.height = String(auxAltura) + "px"
        if(contadorBebidas == 5){
            document.querySelector("#rostoPirata").setAttribute("src", "Imagens/jogoCerveja/pirataNormal.png")
            document.querySelector("#pintura").style.backgroundColor = "orange"
        }else if(contadorBebidas == 9){
            document.querySelector("#rostoPirata").setAttribute("src", "Imagens/jogoCerveja/piratafeliz.png")
            document.querySelector("#pintura").style.backgroundColor = "green"
        }
    }else if(auxPodeClicar){
        document.querySelector(".jogo1Content").style.backgroundColor = "rgb( 247, 92, 92)"
        if(document.querySelector(".jogo1Content").style.backgroundColor == "rgb(247, 92, 92)"){
            let b = setTimeout(() => {
                document.querySelector(".jogo1Content").style.backgroundColor = "rgb( 245, 237, 226)"
            }, 95);
        }
        
    }
}

function validarVitoriaJogo1(){
    document.querySelector(".jogo1Content").style.display = "none"
    if(contadorBebidas >= 9){
        document.querySelector(".telaVitoria").style.display = "flex"
    }else{
        document.querySelector(".telaDerrota").style.display = "flex"
        vidas.innerHTML = aux - 1
    }
}

botoesFechar.forEach(element => {
    element.addEventListener("click", ()=>{
        document.querySelector(".jogo1Content").style.display = "none"
        document.querySelector(".jogo2Content").style.display = "none"
        document.querySelector(".jogo1").style.display = "none"
        document.querySelector(".jogo2").style.display = "none"
        document.querySelector(".jogosFundo").style.display = "none"
        document.querySelector(".telaVitoria").style.display = "none"
        document.querySelector(".telaDerrota").style.display = "none"
        document.querySelector("#rostoPirata").setAttribute("src", "Imagens/jogoCerveja/pirataBravo.png")
        document.querySelector("#pintura").style.backgroundColor = "red"
        contadorBebidas = 0
        document.querySelector("#pintura").style.height = "0px"
        document.querySelector(".jogatina1").style.display = "none"
        document.querySelector(".jogatina2").style.display = "none"
        auxAltura = 0
        document.querySelector(".telaVitoria2").style.display = "none"
        document.querySelector(".telaDerrota2").style.display = "none"
        balasVilao.innerHTML = "0"
        balasUser.innerHTML = "0"
        nivel.innerHTML = parseInt(nivel.innerHTML) - 1
        reset("", temporizadorSpawnVilao)
    })
});

function tudoOnda(){
    botoesJogo1.forEach(element => {
        element.style.backgroundImage = "url(Imagens/jogoCerveja/ondas3.gif)"  
    });
}

// --------------------  JOGO 2  ---------------------------

var botaoComecarJogo2 = document.querySelector("#comecarJogo2")
var botaoPistola = document.querySelector("#atirar")
var botaoEscudo = document.querySelector("#defender")
var botaoRecarregar = document.querySelector("#recarregar")
let botaoAntiCerveja = document.querySelector("#noCerveja")
let botaoAntiBriga = document.querySelector("#paz")

botaoComecarJogo2.addEventListener("click", iniciarJogatina2)
let balasUser = document.querySelector("#numeroBalas")
let balasVilao = document.querySelector("#numeroBalasVilao")
let opcaoUser = ""
let opcaoVilao = ""

function iniciarJogatina2(event){
    document.querySelector(".introducao2").style.display = "none"
    document.querySelector(".jogatina2").style.display = "flex"
    botaoPistola.addEventListener("click", Mostrar)
    botaoEscudo.addEventListener("click", Mostrar)
    botaoRecarregar.addEventListener("click", Mostrar)
    mainJogatina2()
}

let tempoTotalSec = 5
function mainJogatina2() {
    let CronometroHTML = document.querySelector(".tempoRound")
    CronometroHTML.innerHTML = tempoTotalSec
    let tempoTotalMs = parseInt(tempoTotalSec + "000")
    let cronometro = setInterval(() => {
        if(parseInt(CronometroHTML.innerHTML) > 0){
            CronometroHTML.innerHTML = parseInt(CronometroHTML.innerHTML) - 1
        }else{
            let numeroDeAcoes = 3
            botaoRecarregar.setAttribute('disabled', 'disabled')
            botaoPistola.setAttribute('disabled', 'disabled')
            botaoEscudo.setAttribute('disabled', 'disabled')
            iniciarDuelo(numeroDeAcoes)
        }
    }, 1000);

    setTimeout(() => {
        clearInterval(cronometro)
        tempoTotalSec = 1
    }, tempoTotalMs + 1200);
}
function iniciarDuelo(numeroDeAcoes) {
    let num = Math.round(Math.random() * numeroDeAcoes)
    if(num == 0 | (num == 1 && balasVilao.innerHTML == "0")){
        num = 3
    }
    switch (num) {
        case 1:
            opcaoVilao = "atirar"
            mostrarOpcaoDuelo('Imagens/jogoDuelo/Pistola.png', 'opcaoVilao', '150px', 'auto')
            balasVilao.innerHTML = parseInt(balasVilao.innerHTML) - 1
            break;
        case 2: 
            opcaoVilao = "defender"
            mostrarOpcaoDuelo('Imagens/jogoDuelo/escudo.png', 'opcaoVilao', '160px', 'auto')
            break
        case 3: 
            opcaoVilao = "recarregar"
            mostrarOpcaoDuelo('Imagens/jogoDuelo/balas.png', 'opcaoVilao', 'auto', '170px')
            balasVilao.innerHTML = parseInt(balasVilao.innerHTML) + 1
            break
    }
    switch(opcaoUser){
        case "atirar":
            mostrarOpcaoDuelo('Imagens/jogoDuelo/Pistola.png', 'opcaoUser', '150px', 'auto')
        break
        case "recarregar":
            mostrarOpcaoDuelo('Imagens/jogoDuelo/balas.png', 'opcaoUser', 'auto', '170px')
            balasUser.innerHTML = parseInt(balasUser.innerHTML) + 1
        break
        case "defender":
            mostrarOpcaoDuelo('Imagens/jogoDuelo/escudo.png', 'opcaoUser', '160px', 'auto')
        break
    }
    
    let a = setTimeout(() => {
        verificarOcorreu()
    }, 1000);
        
}

function verificarOcorreu() {
    if(opcaoUser == "atirar" && opcaoVilao != "defender" && balasUser.innerHTML != '0'){
        prepararProximoNivel2()
        document.querySelector(".telaVitoria2").style.display = "flex"
    }else if(opcaoVilao == "atirar" && opcaoUser != "defender"){
        prepararProximoNivel2()
        document.querySelector(".telaDerrota2").style.display = "flex"
        vidas.innerHTML = parseInt(vidas.innerHTML) - 1
    }else{
        prepararProximoNivel2()
        iniciarJogatina2()
    }
}
function prepararProximoNivel2() {
    if(opcaoUser == "atirar" && parseInt(balasUser.innerHTML) > 0){
        balasUser.innerHTML = parseInt(balasUser.innerHTML) - 1
    }
    document.querySelector(".opcaoUser").className = "nada" 
    document.querySelector(".opcaoVilao").className = "nada"
    botaoPistola.removeAttribute('disabled')
    botaoRecarregar.removeAttribute('disabled')
    botaoEscudo.removeAttribute('disabled')
}

function mostrarOpcaoDuelo(url, classe, height, width) {
    let element = document.createElement('img')
    element.src = url
    element.className = classe
    element.style.height = height
    element.style.width = width
    document.body.append(element)
}
function Mostrar(event) {
    let imgComando = document.querySelector(".comandoDuelo").childNodes[0]
    imgComando.style.width = "150px"
    imgComando.style.height = "auto"
    if(event.path[0].id == "atirar"){
        imgComando.src = "Imagens/jogoDuelo//Pistola.png"
        opcaoUser = event.path[0].id
    }else if(event.path[0].id == "recarregar"){
        imgComando.src = "Imagens/jogoDuelo//balas.png"
        imgComando.style.width = "180px"
        imgComando.style.height = "auto"
        opcaoUser = event.path[0].id
    }else{
        imgComando.src = "Imagens/jogoDuelo//escudo.png"
        opcaoUser = event.path[0].id
    }
    
}

/*
for(let i = 0; i<tabela.rows.length - 1; i++){
    for(let b = 0; b<tabela.rows.length - 1; b++){
        let celula = tabela.rows[i].children[b]
        celula.addEventListener("click", ()=>{
            celula.style.backgroundColor = "green"
        })
    }
}
*/
