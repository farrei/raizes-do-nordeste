# Plano de testes

Estratégia: validar fluxos principais, usabilidade, responsividade e conformidade com LGPD (consentimento e mensagens de erro).

| ID | Tipo | Cenário | Entrada | Saída esperada |
|----|------|---------|---------|----------------|
| T01 | Positivo | Abrir a página inicial | Acessar a URL publicada | Header, hero, cardápio e seções carregam corretamente |
| T02 | Positivo | Filtrar por Pratos | Clicar no filtro "Pratos" | Somente itens da categoria Pratos aparecem |
| T03 | Positivo | Filtrar por Lanches | Clicar no filtro "Lanches" | Somente lanches são exibidos |
| T04 | Positivo | Filtrar por Bebidas | Clicar no filtro "Bebidas" | Somente bebidas são exibidas |
| T05 | Positivo | Alterar unidade | Selecionar outra unidade no select | Toast informa a unidade escolhida |
| T06 | Positivo | Adicionar item | Clicar em "Adicionar" em um prato | Item entra na sacola e contador sobe |
| T07 | Positivo | Adicionar item repetido | Adicionar o mesmo item de novo | Quantidade do item aumenta |
| T08 | Positivo | Remover item | Clicar em "Remover" na sacola | Quantidade diminui ou item some |
| T09 | Negativo | Finalizar sacola vazia | Clicar em "Continuar para pagamento" com sacola vazia | Toast: "Adicione pelo menos um item." e não abre o modal |
| T10 | Negativo | Pagamento sem consentimento | Abrir pagamento e clicar em "Ir para pagamento" sem marcar o checkbox | Toast: "Confirme o consentimento LGPD..." e não avança |
| T11 | Positivo | Pagamento com consentimento | Marcar o checkbox e confirmar | Pedido recebe número, sacola zera e status inicia em Recebido |
| T12 | Positivo | Acompanhamento do pedido | Aguardar após confirmação | Status avança: Recebido → Em preparo → Pronto → Retirada |
| T13 | Negativo | Login sem consentimento | Abrir login e clicar em Entrar sem marcar o aceite | Toast pede o consentimento e não faz login |
| T14 | Negativo | Cadastro sem nome / sem LGPD | Tentar cadastrar sem nome ou sem checkbox | Toast de validação correspondente |
| T15 | Positivo | Banner LGPD | Primeira visita (ou localStorage limpo) | Banner aparece; Aceitar esconde e grava preferência |
| T16 | Positivo | Responsividade | Redimensionar para mobile (~375px) | Layout em coluna única, menu adaptado, banner usável |

## Critérios de aceitação

- Testar em navegador atualizado (Chrome/Firefox/Edge).
- Verificar navegação por teclado e textos legíveis.
- Confirmar que imagens carregam e possuem `alt`.
- Validar que as mensagens de erro de LGPD e de sacola vazia aparecem de forma clara.
