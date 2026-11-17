// Recursos de acessibilidade: tamanho da fonte e alto contraste (preferências salvas).
(function () {
  var raiz = document.documentElement;
  var corpo = document.body;
  var aviso = document.getElementById('aviso-status');
  var MIN = 14, MAX = 28, PADRAO = 18;

  function ler(chave) { try { return localStorage.getItem(chave); } catch (e) { return null; } }
  function gravar(chave, v) { try { localStorage.setItem(chave, v); } catch (e) {} }
  function anunciar(msg) { if (aviso) { aviso.textContent = ''; setTimeout(function () { aviso.textContent = msg; }, 50); } }

  var tamanho = parseInt(ler('fonte'), 10) || PADRAO;
  function aplicarFonte() { raiz.style.setProperty('--fonte-base', tamanho + 'px'); gravar('fonte', tamanho); }
  aplicarFonte();

  var btnContraste = document.getElementById('btn-contraste');
  function aplicarContraste(ativo) {
    corpo.classList.toggle('alto-contraste', ativo);
    if (btnContraste) btnContraste.setAttribute('aria-pressed', ativo ? 'true' : 'false');
    gravar('contraste', ativo ? '1' : '0');
  }
  aplicarContraste(ler('contraste') === '1');

  document.getElementById('btn-aumentar').addEventListener('click', function () {
    tamanho = Math.min(MAX, tamanho + 2); aplicarFonte(); anunciar('Fonte aumentada');
  });
  document.getElementById('btn-diminuir').addEventListener('click', function () {
    tamanho = Math.max(MIN, tamanho - 2); aplicarFonte(); anunciar('Fonte diminuída');
  });
  document.getElementById('btn-padrao').addEventListener('click', function () {
    tamanho = PADRAO; aplicarFonte(); aplicarContraste(false); anunciar('Configurações restauradas');
  });
  btnContraste.addEventListener('click', function () {
    var ativo = !corpo.classList.contains('alto-contraste');
    aplicarContraste(ativo);
    anunciar(ativo ? 'Alto contraste ativado' : 'Alto contraste desativado');
  });

  // Validação acessível do formulário de contato
  var form = document.getElementById('form-contato');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var primeiroErro = null;
      ['nome', 'email', 'mensagem'].forEach(function (id) {
        var campo = document.getElementById(id);
        var erro = document.getElementById('erro-' + id);
        var msg = '';
        if (!campo.value.trim()) msg = 'Este campo é obrigatório.';
        else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value)) msg = 'Informe um e-mail válido, por exemplo: nome@exemplo.com.';
        erro.textContent = msg;
        campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (msg && !primeiroErro) primeiroErro = campo;
      });
      var status = document.getElementById('status-form');
      if (primeiroErro) {
        status.textContent = 'O formulário contém erros. Corrija os campos indicados.';
        primeiroErro.focus();
      } else {
        status.textContent = 'Mensagem enviada com sucesso! Obrigado pelo contato.';
        form.reset();
      }
    });
  }
})();
