# LGPD e privacidade

A privacidade faz parte da jornada do usuário neste protótipo.

## O que aparece na interface

- **Banner de consentimento** na primeira visita (Aceitar / Recusar).
- **Checkbox obrigatório** no login e no cadastro.
- **Checkbox obrigatório** antes de enviar o pedido para o pagamento externo.
- Link para a **Política de Privacidade** no banner, no rodapé e nos formulários.

## Dados tratados (demonstração)

- Nome e e-mail (formulário de cadastro/login).
- Itens do pedido e unidade selecionada.

Não são solicitados dados bancários. O pagamento é apenas simulado.

## Minimização e transparência

O protótipo pede só o necessário para a experiência acadêmica.
A interface deixa claro que o pagamento ocorre em serviço externo e que não há coleta real de dados financeiros.

## Consentimento

Sem marcar o aceite, o usuário não consegue:
- concluir o login/cadastro;
- seguir para o pagamento.

A preferência do banner é guardada em `localStorage` (chave `rn_lgpd`) só para não reaparecer a cada reload — é um recurso de demonstração, não um armazenamento real de dados sensíveis.

## Segurança

Aplicação front-end de estudo. Não deve ser usada para processar pagamentos ou guardar informações sensíveis de verdade.
