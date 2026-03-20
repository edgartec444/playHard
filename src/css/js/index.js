let jogador = {
  nome: "",
  nivel: 1,
  adrenalina: 0,
  energia: 100,
  forca: 1,
  velocidade: 1,
  tecnica: 1,
  resistencia: 1,
  moedas: 0
};

let esportes = [
  { nome:"Corrida", atributo:"velocidade", dificuldade:"médio" },
  { nome:"Futebol", atributo:"tecnica", dificuldade:"fácil" },
  { nome:"Basquete", atributo:"forca", dificuldade:"médio" },
  { nome:"Natação", atributo:"resistencia", dificuldade:"difícil" }
];

let treinos = [
  { nome:"Corrida leve", atributo:"velocidade", dificuldade:"fácil" },
  { nome:"Musculação", atributo:"forca", dificuldade:"médio" },
  { nome:"Treino técnico", atributo:"tecnica", dificuldade:"difícil" },
  { nome:"Cardio", atributo:"resistencia", dificuldade:"médio" }
];

let perguntas = [
  { pergunta:"Quantos jogadores no futebol?", opcoes:["10","11","12"], correta:1 },
  { pergunta:"Qual esporte usa cesta?", opcoes:["Basquete","Futebol","Tênis"], correta:0 }
];

let loja = [
  { nome: "Energia Extra", preco: 50, efeito: ()=> jogador.energia = Math.min(jogador.energia+20,100) },
  { nome: "Boost Adrenalina", preco: 100, efeito: ()=> jogador.adrenalina = Math.min(jogador.adrenalina+30,100) },
  { nome: "Sapato Rápido", preco: 200, efeito: ()=> jogador.velocidade++ },
  { nome: "Luvas Técnicas", preco: 200, efeito: ()=> jogador.tecnica++ }
];

const motivacoes = [
  "Ótimo trabalho! Continue focando na técnica.",
  "Excelente postura e ritmo!",
  "Sua precisão está melhorando!",
  "Mantenha o esforço, está evoluindo!",
  "Cada treino conta para o próximo nível!"
];

// ================== FUNÇÕES ==================
function iniciarJogo(){
  const nome = document.getElementById("input-nome").value;
  if(nome.trim()===""){ alert("Digite um nome!"); return; }
  jogador.nome = nome;
  document.getElementById("nome-inicial").style.display = "none";
  atualizarStatus();
  mostrarMensagem(`Bem-vindo, ${jogador.nome}!`);
}

function atualizarStatus(){
  updateBar("energia-barra", jogador.energia, "#f59e0b");
  updateBar("adrenalina-barra", jogador.adrenalina, "#10b981");
  updateBar("nivel-barra", jogador.nivel*10, "#f43f5e");
  updateBar("moedas-barra", jogador.moedas, "#fbbf24");
}

function updateBar(id, value, cor){
  const bar = document.getElementById(id);
  let width = Math.min(value,100) + "%";
  bar.style.width = width;
  // cor muda conforme progresso
  if(value<30) bar.style.background = "#ef4444";
  else if(value<70) bar.style.background = cor;
  else bar.style.background = "#4ade80";
}

function irPara(tela){
  if(!jogador.nome){ alert("Digite seu nome primeiro!"); return; }
  if(tela==="jogar") mostrarEsportes();
  if(tela==="treino") mostrarTreinos();
  if(tela==="quiz") mostrarQuiz();
  if(tela==="loja") mostrarLoja();
}

// ================== ESPORTES ==================
function mostrarEsportes(){
  let html="<h2>Escolha um esporte</h2>";
  esportes.forEach((e,i)=>{ html+=`<button onclick="jogar(${i})">${e.nome} (${e.dificuldade})</button>`; });
  document.getElementById("tela").innerHTML = html;
}

function jogar(i){
  if(jogador.energia<=0){ mostrarMensagem("😴 Sem energia!"); return; }
  let e = esportes[i];
  let sucesso = Math.random()>0.2;
  if(sucesso){
    let ganho = 10 + jogador[e.atributo];
    jogador.adrenalina += ganho;
    jogador.moedas += 5;
    mostrarMensagem(`✅ Sucesso no ${e.nome}! +${ganho} adrenalina`);
  } else{
    jogador.energia -= 10;
    mostrarMensagem(`❌ Falhou no ${e.nome}! -10 energia`);
  }
  verificarNivel();
  atualizarStatus();
}

// ================== TREINOS ==================
function mostrarTreinos(){
  let html="<h2>Treinar</h2>";
  treinos.forEach((t,i)=>{ html+=`<button onclick="treinar(${i})">${t.nome} (${t.dificuldade})</button>`; });
  document.getElementById("tela").innerHTML = html;
}

function treinar(i){
  if(jogador.energia<=0){ mostrarMensagem("😴 Sem energia!"); return; }
  let t = treinos[i];
  jogador[t.atributo]++;
  jogador.energia-=10;
  mostrarMensagem(`💪 ${t.nome}: +1 ${t.atributo}`);
  verificarNivel();
  atualizarStatus();
}

// ================== QUIZ ==================
function mostrarQuiz(){
  let p = perguntas[Math.floor(Math.random()*perguntas.length)];
  let html=`<h2>${p.pergunta}</h2>`;
  p.opcoes.forEach((op,i)=>{ html+=`<button onclick='responder(${i}, ${JSON.stringify(p).replace(/"/g,'&quot;')})'>${op}</button>`; });
  document.getElementById("tela").innerHTML = html;
}

function responder(i,p){
  if(i===p.correta){ jogador.adrenalina+=20; jogador.moedas+=5; mostrarMensagem("🎉 Acertou! +20 adrenalina"); }
  else{ jogador.energia-=10; mostrarMensagem("❌ Errou! -10 energia"); }
  verificarNivel();
  atualizarStatus();
}

// ================== LOJA ==================
function mostrarLoja(){
  let html="<h2>Loja Virtual</h2>";
  loja.forEach((item,i)=>{ html+=`<button onclick="comprarItem(${i})">${item.nome} - ${item.preco} moedas</button>`; });
  document.getElementById("tela").innerHTML = html;
}

function comprarItem(i){
  let item = loja[i];
  if(jogador.moedas >= item.preco){
    jogador.moedas -= item.preco;
    item.efeito();
    mostrarMensagem(`🛒 Comprou ${item.nome}!`);
  } else mostrarMensagem("❌ Moedas insuficientes!");
  atualizarStatus();
}

// ================== NIVEL ==================
function verificarNivel(){
  if(jogador.adrenalina>=100){
    jogador.nivel++;
    jogador.adrenalina=0;
    mostrarMensagem("⭐ LEVEL UP! Você subiu de nível!");
  }
}

// ================== MENSAGENS ==================
function mostrarMensagem(msg){
  const motivacao = motivacoes[Math.floor(Math.random()*motivacoes.length)];
  document.getElementById("tela").innerHTML = `<p class="fade">${msg}</p><p style="font-style:italic; color:#6b7280;">${motivacao}</p>`;
