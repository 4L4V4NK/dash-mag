# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o **Dash Mag**! Este documento fornece diretrizes e instruções para contribuir.

---

## 📋 Código de Conduta

Este projeto e todos os participantes são regidos pelo nosso [Código de Conduta](./CODE_OF_CONDUCT.md). Ao participar, você concorda em seguir estes termos.

---

## 🚀 Como Começar

### 1. Fork o repositório

```bash
# Fork em GitHub
# Clonar seu fork
git clone https://github.com/SEU-USERNAME/dash-mag.git
cd dash-mag
```

### 2. Configurar ambiente local

```bash
# Instalar dependências
npm install

# Criar arquivo .env.local
cp EXPORT_REACT_DASHBOARDS/.env.example .env.local

# Editar .env.local com suas credenciais
nano .env.local

# Iniciar servidor de desenvolvimento
npm run dev
```

### 3. Criar branch de feature

```bash
# Atualizar main
git checkout main
git pull upstream main

# Criar branch
git checkout -b feature/sua-feature
```

---

## 📝 Processo de Contribuição

### Passo 1: Fazer mudanças

```bash
# Editar arquivos
# Criar testes para suas mudanças
npm test

# Verificar linting
npm run lint

# Formatar código
npm run format
```

### Passo 2: Commit das mudanças

```bash
# Commits atômicos, mensagens claras
git add .
git commit -m "feat: descrição clara da mudança

Descrição mais detalhada se necessário.

Fixes #123
"
```

**Formato de commit (Conventional Commits)**:
- `feat`: Nova feature
- `fix`: Bug fix
- `docs`: Mudanças em documentação
- `style`: Formatação, sem mudanças lógicas
- `refactor`: Refatoração sem mudanças de feature
- `perf`: Melhorias de performance
- `test`: Adição ou atualização de testes
- `chore`: Dependências, build, CI/CD

### Passo 3: Push e Pull Request

```bash
# Push para seu fork
git push origin feature/sua-feature

# Criar Pull Request no GitHub
# - Descrever o que muda
# - Referenciar issues (#123)
# - Incluir screenshots se for UI
```

---

## ✅ Critérios de Qualidade

Toda contribuição deve atender:

- [ ] **Tests**: Código novo tem testes (`npm test`)
- [ ] **Lint**: Sem erros de lint (`npm run lint`)
- [ ] **Format**: Código formatado (`npm run format`)
- [ ] **Docs**: Documentação atualizada
- [ ] **Types**: TypeScript types corretos
- [ ] **Performance**: Sem regressões
- [ ] **Accessibility**: Seguir WCAG 2.1 AA

---

## 🧪 Testes

### Executar testes

```bash
# Todos os testes
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Teste específico
npm test -- ComponentName.test.tsx
```

### Estrutura de teste

```typescript
// __tests__/components/ChartBlock.test.tsx
import { render, screen } from '@testing-library/react';
import { ChartBlock } from '@/components/ChartBlock';

describe('ChartBlock', () => {
  it('should render chart data', () => {
    const mockData = [
      { timestamp: '2025-01-01', value: 100 }
    ];

    render(
      <ChartBlock
        data={mockData}
        title="Test Chart"
        type="line"
      />
    );

    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });
});
```

---

## 📚 Adicionar Documentação

### Atualizar docs

```markdown
# docs/COMPONENTS.md

## Novo Componente

**Propósito**: Descrição clara

**Props**:
...

**Uso**:
...
```

### Tipos de documentação

- `docs/ARCHITECTURE.md` - Arquitetura geral
- `docs/COMPONENTS.md` - Catálogo de componentes
- `docs/API.md` - Referência de APIs
- `docs/DEPLOYMENT.md` - Guia de deployment
- `CHANGELOG.md` - Histórico de versões
- `README.md` - Overview do projeto

---

## 🐛 Reportar Bugs

### Template de issue

```markdown
## Descrição

[Descrição clara do bug]

## Passos para reproduzir

1. ...
2. ...
3. ...

## Comportamento esperado

[O que deveria acontecer]

## Comportamento atual

[O que na verdade acontece]

## Ambiente

- Browser: [Chrome, Firefox, Safari]
- OS: [Windows, macOS, Linux]
- Versão: [semver]

## Screenshots

[Se aplicável]
```

---

## 💡 Sugerir Features

### Template de feature request

```markdown
## Descrição da feature

[Descrição clara do que você quer]

## Motivação

[Por que essa feature é importante]

## Exemplo de uso

[Como seria usado]

## Alternativas consideradas

[Outras abordagens]
```

---

## 🔍 Review Process

1. **Automated Checks**
   - Tests devem passar
   - Lint deve passar
   - Coverage não deve diminuir

2. **Code Review**
   - Manter thread de review
   - Responder feedbacks construtivamente
   - Fazer ajustes conforme sugerido

3. **Approval & Merge**
   - 1 aprovação mínima de maintainer
   - Rebase em main antes de merge
   - Squash commits se necessário

---

## 📦 Merge Strategy

```bash
# Squash & merge (padrão)
git checkout main
git pull origin main
git merge --squash feature/sua-feature
git commit -m "feat: descrição da feature"
git push origin main

# Ou: GitHub interface
# - Selecionar "Squash and merge"
# - Editar mensagem se necessário
```

---

## 🎓 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 💬 Dúvidas?

- Abra uma [Discussion](https://github.com/4L4V4NK/dash-mag/discussions)
- Envie um [email](mailto:contato@example.com)
- Junte-se ao [Discord/Slack] (se aplicável)

---

## 🙏 Agradecimentos

Agradecemos por sua contribuição! Cada PR, issue e feedback nos ajuda a melhorar.

**Feliz contribuindo!** 🚀
