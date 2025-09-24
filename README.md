# Landing Page - Consórcio Imobiliário SEFRA CORRETORA

Uma landing page profissional e otimizada para conversão, desenvolvida para capturar leads interessados em consórcio imobiliário.

## 🚀 Características

- **Design Responsivo**: Otimizado para desktop, tablet e mobile
- **Simulador Interativo**: Formulário em etapas para captura de leads
- **Alta Conversão**: Otimizada para Meta Ads e Google Ads
- **Acessibilidade**: Seguindo padrões WCAG 2.1
- **Performance**: Carregamento rápido e otimizado
- **Analytics**: Integração completa com GA4, GTM e Facebook Pixel

## 📁 Estrutura de Arquivos

```
/
├── index.html          # Página principal
├── styles.css          # Estilos CSS com design tokens
├── script.js           # JavaScript principal
├── analytics.js        # Configuração de analytics
└── README.md          # Este arquivo
```

## 🎨 Design System

### Cores
- **Primary**: #C80F15 (Vermelho marca)
- **Primary Hover**: #B30E13
- **Background**: #FFFFFF
- **Surface**: #F4F4F5
- **Text**: #111111
- **Muted**: #444444

### Tipografia
- **Fonte**: Inter (fallback: system fonts)
- **H1**: 48px/36px (desktop/mobile)
- **H2**: 34px/28px
- **H3**: 24px/20px
- **Body**: 16px
- **Small**: 14px/12px

### Espaçamentos
- **Base**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- **Container**: max-width 1200px
- **Grid**: 12 colunas responsivo

## 🔧 Configuração

### 1. Analytics
Edite o arquivo `analytics.js` e substitua:
- `G-XXXXXXXXXX` pelo seu GA4 Measurement ID
- `YOUR_PIXEL_ID` pelo seu Facebook Pixel ID
- `GTM-XXXXXXX` pelo seu Google Tag Manager ID

### 2. Contatos
No arquivo `index.html`, atualize:
- Números de telefone nos links do WhatsApp
- E-mail de contato
- Endereço da empresa

### 3. Integração com CRM
No arquivo `script.js`, função `sendLeadData()`, configure a integração com seu sistema:
- API endpoint para envio de leads
- Formato de dados esperado
- Autenticação necessária

## 📱 Funcionalidades

### Simulador Interativo
1. **Etapa 1**: Valor do imóvel desejado
2. **Etapa 2**: Prazo de pagamento (60, 120 ou 180 meses)
3. **Etapa 3**: Dados de contato (nome, telefone, e-mail)
4. **Etapa 4**: Confirmação e redirecionamento para WhatsApp

### Validações
- Campos obrigatórios
- Formato de e-mail
- Formato de telefone brasileiro
- Valor mínimo/máximo do imóvel
- Consentimento LGPD

### Tracking de Eventos
- `page_view`: Visualização da página
- `lead_initiated`: Abertura do simulador
- `form_step_completion`: Conclusão de etapa
- `lead_submitted`: Envio do formulário
- `whatsapp_click`: Clique no WhatsApp
- `cta_click`: Clique em CTAs

## 🎯 Otimizações para Conversão

### Meta Ads
- Eventos personalizados configurados
- Pixel do Facebook integrado
- Tracking de conversões otimizado

### Google Ads
- GA4 Enhanced Ecommerce
- Google Tag Manager
- UTM parameters tracking
- Conversion tracking

### UX/UI
- CTAs destacados e visíveis
- Formulário em etapas (menos abandono)
- Botão flutuante do WhatsApp
- Design limpo e profissional
- Loading states e feedback visual

## 📊 Métricas Importantes

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Conversão
- Taxa de abertura do simulador
- Taxa de conclusão do formulário
- Taxa de clique no WhatsApp
- Tempo médio na página

## 🔒 LGPD e Privacidade

- Checkbox de consentimento obrigatório
- Link para política de privacidade
- Armazenamento seguro de dados
- SSL obrigatório (HTTPS)

## 🚀 Deploy

### Opções de Hospedagem
1. **Netlify**: Deploy automático via Git
2. **Vercel**: Otimizado para performance
3. **GitHub Pages**: Gratuito para projetos públicos
4. **AWS S3 + CloudFront**: Escalável e rápido

### Checklist de Deploy
- [ ] Configurar analytics
- [ ] Atualizar contatos
- [ ] Testar formulário
- [ ] Verificar responsividade
- [ ] Testar performance
- [ ] Configurar SSL
- [ ] Testar tracking

## 📈 Monitoramento

### Ferramentas Recomendadas
- **Google Analytics 4**: Métricas de comportamento
- **Google Search Console**: SEO e performance
- **PageSpeed Insights**: Core Web Vitals
- **GTM Preview**: Debug de eventos

### KPIs para Acompanhar
- Taxa de conversão do simulador
- Custo por lead (CPL)
- Taxa de abertura do WhatsApp
- Tempo médio de sessão
- Taxa de rejeição

## 🛠️ Manutenção

### Atualizações Regulares
- Testar formulário mensalmente
- Verificar links do WhatsApp
- Atualizar conteúdo sazonal
- Monitorar performance
- Revisar analytics

### Backup
- Fazer backup do código
- Exportar dados de leads
- Documentar mudanças
- Versionar alterações

## 📞 Suporte

Para dúvidas ou suporte técnico:
- E-mail: contato@sefracorretora.com.br
- WhatsApp: (XX) XXXXX-XXXX

---

**Desenvolvido com foco em conversão e performance para SEFRA CORRETORA**