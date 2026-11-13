// Checkpoint 3 - recursos interativos e persistência com localStorage
"use strict"; //ativar uma variante mais rigorosa da linguagem

document.addEventListener("DOMContentLoaded", () => {
  //totalmente lido e a árvore de elementos (DOM) pegando a pagina inteira
  const STORAGE = {
    tema: "portfolio_tema",
    nome: "portfolio_nome_visitante",
    interesses: "portfolio_interesses",
    rascunho: "portfolio_rascunho_contato",
  };

  // Tema claro/escuro: carrega a preferência salva e mantém a escolha.
  const botaoTema = document.getElementById("alternar-tema"); //botão do tema
  const temaSalvo = localStorage.getItem(STORAGE.tema); //usado para ler um dado salvo no Web Storage
  if (temaSalvo === "escuro") document.body.classList.add("tema-escuro"); //adiciona uma classe
  atualizarBotaoTema();

  if (botaoTema) {
    //função de automatização de botão tema e tema escuro para manter a mudança apos recarregar página
    botaoTema.addEventListener("click", () => {
      document.body.classList.toggle("tema-escuro"); // ação de click
      localStorage.setItem(
        STORAGE.tema,
        document.body.classList.contains("tema-escuro") ? "escuro" : "claro",
      ); //verifica se contem o tema-escuro
      atualizarBotaoTema();
    });
  }

  //função de automatização de botão tema e tema escuro
  function atualizarBotaoTema() {
    if (!botaoTema) return;
    const escuro = document.body.classList.contains("tema-escuro");
    botaoTema.textContent = escuro ? "tema escuro" : "tema claro"; // atribui um texto novo no html
    botaoTema.setAttribute("aria-pressed", String(escuro)); // atribui o escuro ao texto
  }

  // Boas-vindas personalizadas.
  const campoNome = document.getElementById("nome-visitante");
  const botaoNome = document.getElementById("salvar-nome");
  const saudacao = document.getElementById("mensagem-boas-vindas");

  function mostrarSaudacao() {
    // função para exibir um nome digitado pelo usuario salvo mesmo apos atualizar
    const nome = localStorage.getItem(STORAGE.nome);
    if (saudacao && nome) saudacao.textContent = `Olá, ${nome}!`;
    if (campoNome) campoNome.value = "";
  }

  mostrarSaudacao();

  if (botaoNome && campoNome) {
    botaoNome.addEventListener("click", () => {
      const nome = campoNome.value.trim(); //elimina caracteres de espaço
      if (!nome) {
        campoNome.setCustomValidity("Digite seu nome antes de salvar."); // define uma mensagem de erro customizada para um elemento de formulário
        campoNome.reportValidity(); //força o disparo da interface visual de erro para o usuário sem precisar submeter o formulário
        return;
      }
      campoNome.setCustomValidity("");
      localStorage.setItem(STORAGE.nome, nome);

      mostrarSaudacao();
    });
    campoNome.addEventListener("input", () => campoNome.setCustomValidity(""));
    //limpa a mensagem de erro customizada do campo de texto no exato momento em que o usuário começa a digitar ou alterar o conteúdo.
  }

  // Lista de interesses salva no navegador.
  const formInteresses = document.getElementById("form-interesses");
  const campoInteresse = document.getElementById("novo-interesse");
  const listaInteresses = document.getElementById("lista-interesses");

  function obterInteresses() {
    try {
      // definir um bloco de código que você deseja testar quanto a possíveis erros durante a execução
      return JSON.parse(localStorage.getItem(STORAGE.interesses) || "[]");
      //recupera uma lista guardada no localStorage e a converte de volta para um Array/Objeto JavaScript
    } catch {
      //recebe o objeto de erro capturado.
      return [];
    }
  }

  function salvarInteresses(itens) {
    localStorage.setItem(STORAGE.interesses, JSON.stringify(itens)); //converte valores ou objetos do JavaScript em uma String no formato JSON
  }

  function renderizarInteresses() {
    if (!listaInteresses) return;
    listaInteresses.replaceChildren();
    obterInteresses().forEach((interesse, indice) => {
      //usada para percorrer sobre os elementos de um Array
      const li = document.createElement("li"); //cria uma lista no html
      const texto = document.createElement("span"); //cria uma span no html
      texto.textContent = interesse;
      const remover = document.createElement("button"); //cria um botão de remover
      remover.type = "button";
      remover.textContent = "X";
      remover.addEventListener("click", () => { 
        // evento de click em arrow
        const itens = obterInteresses();
        itens.splice(indice, 1); //removendo
        salvarInteresses(itens);
        renderizarInteresses();
      });
      li.append(texto, remover); //insere novos elementos ou conteúdos no final de um elemento
      listaInteresses.appendChild(li); // insere elemento no final
    });
  }

  renderizarInteresses();

  if (formInteresses && campoInteresse) {
    formInteresses.addEventListener("submit", (event) => {
      event.preventDefault(); //evita recarregamentos de página ao enviar formulários
      const valor = campoInteresse.value.trim();
      if (!valor) return;
      const itens = obterInteresses();
      if (!itens.some((item) => item.toLowerCase() === valor.toLowerCase())) {
        itens.push(valor);
        salvarInteresses(itens);
      }
      campoInteresse.value = "";
      renderizarInteresses();
    });
  }

  // Formulário: validação com feedback na página e salvamento de rascunho.
  const formulario = document.getElementById("form-contato");
  const feedback = document.getElementById("feedback-formulario");

  if (formulario) {
    const campos = ["nome", "email", "telefone", "mensagem"];

    function exibirFeedback(mensagem, tipo) {
      if (!feedback) return;
      feedback.textContent = mensagem;
      feedback.className = `c3-message visivel ${tipo}`;
    }

    function salvarRascunho() {
      const dados = {};
      campos.forEach((id) => {
        const campo = formulario.elements.namedItem(id);
        if (campo) dados[id] = campo.value;
      });
      localStorage.setItem(STORAGE.rascunho, JSON.stringify(dados));
    }

    try {
      const rascunho = JSON.parse(
        localStorage.getItem(STORAGE.rascunho) || "{}",
      );
      campos.forEach((id) => {
        const campo = formulario.elements.namedItem(id);
        if (campo && typeof rascunho[id] === "string")
          campo.value = rascunho[id];
      });
    } catch {
      localStorage.removeItem(STORAGE.rascunho);
    }

    campos.forEach((id) => {
      const campo = formulario.elements.namedItem(id);
      if (campo) campo.addEventListener("input", salvarRascunho);
    });

    formulario.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!formulario.checkValidity()) {
        formulario.reportValidity();
        exibirFeedback(
          "Confira os campos: há informações obrigatórias ou em formato inválido.",
          "erro",
        );
        return;
      }
      exibirFeedback(
        "Formulário validado com sucesso! Este projeto é demonstrativo e não envia os dados para um servidor.",
        "sucesso",
      );
      localStorage.removeItem(STORAGE.rascunho);
      formulario.reset();
    });

    formulario.addEventListener("reset", () => {
      setTimeout(() => {
        localStorage.removeItem(STORAGE.rascunho);
        if (feedback) feedback.className = "c3-message";
      }, 0);
    });
  }
});