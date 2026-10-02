# LGPD e privacidade

O protótipo aplica de forma **explícita** a **Lei nº 13.709, de 14 de agosto de 2018** (Lei Geral de Proteção de Dados Pessoais — LGPD).

## O que aparece na interface

- **Banner** na primeira visita com o texto “LGPD — Lei nº 13.709/2018”, base legal (art. 7º, I) e botões Aceitar / Recusar.
- **Checkbox obrigatório** no login e no cadastro, citando a Lei 13.709/2018.
- **Checkbox obrigatório** no pagamento, com referência ao art. 7º, inciso I.
- **Política de Privacidade** (modal) com: controlador, dados, finalidade, base legal, direitos do titular (art. 18) e aviso de protótipo acadêmico.
- Link no **rodapé**: “Política de Privacidade (LGPD — Lei 13.709/2018)”.

## Dados tratados (demonstração)

- Nome e e-mail (cadastro/login).
- Itens do pedido e unidade selecionada.

Não são solicitados dados bancários.

## Consentimento

Sem marcar o aceite, o usuário não conclui login/cadastro nem o pagamento. Mensagens de erro citam a LGPD.

Preferência do banner em `localStorage` (`rn_lgpd`) apenas para a demonstração.

## Segurança

Front-end acadêmico. Não processa pagamento real nem armazena dados sensíveis de produção.
