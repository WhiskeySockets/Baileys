# Monitoramento de Performance nos Testes E2E

## Visão Geral

O arquivo de teste `send-receive-message.test-e2e.ts` foi atualizado para incluir monitoramento detalhado de performance, incluindo:

- **Uso de Memória**: Heap usado, heap total, memória externa e RSS
- **Vazamento de Memória**: Detecção automática de aumentos significativos
- **Uso de CPU**: Tempo de CPU (user + system)
- **Duração das Operações**: Tempo total de cada operação

## Funcionalidades

### Métricas Coletadas

Para cada teste de envio, as seguintes métricas são coletadas:

1. **Memória Antes**: Estado da memória antes da operação
2. **Memória Depois**: Estado da memória após a operação
3. **Delta de Memória**: Diferença entre antes e depois
4. **Uso de CPU**: Tempo de processamento (user + system)
5. **Duração**: Tempo total da operação em milissegundos

### Testes Monitorados

Os seguintes testes de envio incluem monitoramento:

- ✅ Envio de Mensagem de Texto
- ✅ Edição de Mensagem
- ✅ Envio de Reação
- ✅ Envio de Imagem
- ✅ Envio de Vídeo
- ✅ Envio de Áudio PTT
- ✅ Envio de Documento
- ✅ Envio de Sticker
- ✅ Envio de Enquete

### Detecção de Vazamento

O sistema detecta automaticamente quando o aumento de memória heap ultrapassa 10MB em uma única operação, exibindo um aviso:

```
⚠️  AVISO: Aumento significativo no uso de memória (XX.XX MB)
```

## Relatório Final

Ao final da execução dos testes, um relatório completo é gerado contendo:

### Resumo Geral
- Total de testes com monitoramento
- Aumento total de memória
- Tempo total de CPU
- Duração total das operações
- Média de memória por teste

### Detalhes por Teste
Lista completa de todos os testes executados com suas métricas individuais.

### Top 3 - Maior Consumo de Memória
Identifica os 3 testes que mais consumiram memória.

### Top 3 - Maior Uso de CPU
Identifica os 3 testes que mais utilizaram CPU.

## Exemplo de Saída

```
🔍 Métricas de Performance - Envio de Imagem
⏱️  Duração: 1234.56ms

📊 Memória Antes:
  Heap Usado: 45.23 MB
  Heap Total: 52.00 MB
  Externo: 2.15 MB
  RSS: 78.45 MB

📊 Memória Depois:
  Heap Usado: 47.89 MB
  Heap Total: 52.00 MB
  Externo: 2.18 MB
  RSS: 80.12 MB

📈 Delta de Memória:
  Heap Usado: 2.66 MB ⬆️
  Heap Total: 0.00 MB
  Externo: 0.03 MB ⬆️
  RSS: 1.67 MB ⬆️

💻 Uso de CPU:
  User: 234.56ms
  System: 45.67ms
  Total: 280.23ms
```

## Executando os Testes

Para executar os testes com monitoramento:

```bash
npm run test:win -- --testMatch '**/send-receive-message.test-e2e.ts'
```

### Com Garbage Collection Manual

Para obter métricas mais precisas, execute com a flag `--expose-gc`:

```bash
node --expose-gc node_modules/jest/bin/jest.js --testMatch '**/send-receive-message.test-e2e.ts'
```

Isso permite que o sistema force a coleta de lixo antes de cada medição, resultando em métricas mais consistentes.

## Interpretando os Resultados

### Memória

- **Heap Usado**: Memória JavaScript ativamente em uso
- **Heap Total**: Total de memória alocada para o heap
- **Externo**: Memória usada por buffers C++ e outros recursos externos
- **RSS (Resident Set Size)**: Memória total do processo no sistema operacional

### CPU

- **User**: Tempo de CPU executando código do usuário
- **System**: Tempo de CPU executando chamadas de sistema
- **Total**: Soma de user + system

### Vazamento de Memória

Um possível vazamento pode ser identificado quando:
1. O delta de heap usado é consistentemente positivo e crescente
2. A memória não é recuperada após testes subsequentes
3. Avisos de aumento significativo aparecem frequentemente

## Considerações

- As métricas podem variar entre execuções devido a fatores externos
- A garbage collection do Node.js pode afetar as medições
- Recomenda-se executar os testes múltiplas vezes para obter médias confiáveis
- Testes de rede podem ter variação significativa na duração
