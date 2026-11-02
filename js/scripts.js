//recursos interativos e persistência com localStorage

"use strict";

document.addEventListener("DOMContentLoaded", () => {// Aguarda o carregamento completo do HTML
    // Chaves de armazenamento de dados no navegador

      const KEYS = { //Cria um dicionário centralizado com os nomes exatos das chaves usadas no localStorage.
    tema: "portfolio_tema",
    nome: "portfolio_nome_visitante",
    interesses: "portfolio_interesses",
    rascunho: "portfolio_rascunho_contato"
  };

  // Funções Utilitárias para localStorage
  const getStorage = (key, fallback = null) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } //Lê um valor salvo no localStorage do navegador e o converte de volta de texto (String)
    catch { return fallback; }
    //Se o valor salvo estiver corrompido ou não for um JSON válido, o código não quebra/interrompe a execução do site; ele captura o erro suavemente e devolve o valor de fallback
  };
  const setStorage = (key, val) => localStorage.setItem(key, JSON.stringify(val));// Converte automaticamente arrays, objetos, números ou booleanos em texto (string) antes de salvar
})

 // --- TEMA CLARO / ESCURO ---
  const btnTema = document.getElementById("alternar-tema");
  const isEscuroSalvo = localStorage.getItem(KEYS.tema) === "escuro";

  if (isEscuroSalvo) document.body.classList.add("tema-escuro");

  function atualizarBotaoTema() {
    if (!btnTema) return;
    const ativo = document.body.classList.contains("tema-escuro");
    btnTema.textContent = ativo ? "Ativar tema claro" : "Ativar tema escuro";
    btnTema.setAttribute("aria-pressed", String(ativo));
  }
  atualizarBotaoTema();

  btnTema?.addEventListener("click", () => {
    const isEscuro = document.body.classList.toggle("tema-escuro");
    localStorage.setItem(KEYS.tema, isEscuro ? "escuro" : "claro");
    atualizarBotaoTema();
  });
