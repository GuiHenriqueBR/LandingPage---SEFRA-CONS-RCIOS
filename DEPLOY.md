# Guia de Deploy - SEFRA CORRETORA Landing Page

## 🚀 Opções de Deploy

### 1. Netlify (Recomendado)

**Vantagens:**
- Deploy automático via Git
- CDN global
- SSL automático
- Formulários nativos
- Analytics integrado

**Passos:**
1. Conecte seu repositório GitHub ao Netlify
2. Configure as variáveis de ambiente:
   - `GA4_MEASUREMENT_ID`: Seu ID do Google Analytics 4
   - `FACEBOOK_PIXEL_ID`: Seu ID do Facebook Pixel
   - `GTM_ID`: Seu ID do Google Tag Manager
3. Configure o build:
   - Build command: `echo "No build needed"`
   - Publish directory: `/`
4. Configure redirects no `_redirects`:
   ```
   /api/leads https://your-backend.com/api/leads 200
   ```

### 2. Vercel

**Vantagens:**
- Performance otimizada
- Edge functions
- Analytics integrado
- Deploy automático

**Passos:**
1. Instale a CLI: `npm i -g vercel`
2. Execute: `vercel`
3. Configure as variáveis de ambiente no dashboard
4. Configure `vercel.json`:
   ```json
   {
     "functions": {
       "api/leads.js": {
         "maxDuration": 10
       }
     },
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           }
         ]
       }
     ]
   }
   ```

### 3. AWS S3 + CloudFront

**Vantagens:**
- Escalabilidade
- Controle total
- CDN global
- Baixo custo

**Passos:**
1. Crie um bucket S3
2. Configure como site estático
3. Configure CloudFront
4. Configure SSL via Certificate Manager
5. Configure Lambda@Edge para headers de segurança

### 4. GitHub Pages

**Vantagens:**
- Gratuito
- Integração com GitHub
- SSL automático

**Limitações:**
- Sem suporte a server-side
- Sem formulários nativos

**Passos:**
1. Ative GitHub Pages no repositório
2. Configure o branch `gh-pages`
3. Use um serviço externo para formulários (Formspree, Netlify Forms)

## 🔧 Configurações Necessárias

### 1. Analytics

**Google Analytics 4:**
```javascript
// Em analytics.js, substitua:
gtag('config', 'G-XXXXXXXXXX', {
    // suas configurações
});
```

**Facebook Pixel:**
```javascript
// Em analytics.js, substitua:
fbq('init', 'YOUR_PIXEL_ID');
```

**Google Tag Manager:**
```html
<!-- Em index.html, substitua: -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
```

### 2. Contatos

**WhatsApp:**
```html
<!-- Substitua em todos os links: -->
href="https://api.whatsapp.com/send?phone=5511999999999&text=..."
```

**Telefone:**
```html
<!-- Substitua nos elementos: -->
<small>Atendimento: (11) 99999-9999</small>
```

**E-mail:**
```html
<!-- Substitua: -->
<li>✉️ contato@sefracorretora.com.br</li>
```

### 3. Backend para Formulários

**Opção 1: Netlify Forms**
```html
<form name="lead-form" method="POST" data-netlify="true">
    <!-- campos do formulário -->
</form>
```

**Opção 2: Formspree**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <!-- campos do formulário -->
</form>
```

**Opção 3: Backend Customizado**
```javascript
// Configure a URL da API em script.js
const API_ENDPOINT = 'https://your-api.com/api/leads';
```

## 📊 Configuração de Tracking

### 1. Google Analytics 4

**Eventos personalizados:**
- `lead_initiated`: Abertura do simulador
- `form_step_completion`: Conclusão de etapa
- `lead_submitted`: Envio do formulário
- `whatsapp_click`: Clique no WhatsApp

### 2. Facebook Pixel

**Eventos configurados:**
- `PageView`: Visualização da página
- `InitiateCheckout`: Abertura do simulador
- `Lead`: Envio do formulário
- `Contact`: Clique no WhatsApp

### 3. Google Tag Manager

**Variáveis:**
- `valor_imovel`: Valor do imóvel
- `prazo_consorcio`: Prazo selecionado
- `utm_source`: Origem do tráfego
- `utm_campaign`: Campanha

## 🔒 Segurança

### 1. Headers de Segurança

```javascript
// Configure no servidor:
'X-Content-Type-Options': 'nosniff',
'X-Frame-Options': 'DENY',
'X-XSS-Protection': '1; mode=block',
'Referrer-Policy': 'strict-origin-when-cross-origin',
'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
```

### 2. SSL/TLS

- Configure certificado SSL válido
- Force HTTPS (redirect HTTP → HTTPS)
- Use HSTS headers

### 3. LGPD

- Checkbox de consentimento obrigatório
- Link para política de privacidade
- Armazenamento seguro de dados
- Direito ao esquecimento

## 📈 Otimizações de Performance

### 1. Core Web Vitals

**LCP (Largest Contentful Paint):**
- Otimize imagens (WebP, lazy loading)
- Preload recursos críticos
- Use CDN

**FID (First Input Delay):**
- Minimize JavaScript
- Use async/defer
- Code splitting

**CLS (Cumulative Layout Shift):**
- Defina dimensões de imagens
- Reserve espaço para ads
- Evite fontes customizadas

### 2. Imagens

```html
<!-- Use WebP com fallback -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

### 3. Fontes

```css
/* Preload fontes críticas */
@font-face {
    font-family: 'Inter';
    src: url('/fonts/inter.woff2') format('woff2');
    font-display: swap;
}
```

## 🧪 Testes

### 1. Testes de Performance

- **PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/

### 2. Testes de Acessibilidade

- **WAVE**: https://wave.webaim.org/
- **axe DevTools**: Extensão do Chrome
- **Lighthouse**: Audit de acessibilidade

### 3. Testes de Funcionalidade

- Teste o formulário em diferentes dispositivos
- Verifique todos os links
- Teste o tracking de eventos
- Valide o WhatsApp

## 📱 PWA

### 1. Manifest

O arquivo `manifest.json` já está configurado com:
- Nome e descrição
- Ícones em diferentes tamanhos
- Theme color
- Display mode

### 2. Service Worker

O arquivo `sw.js` inclui:
- Cache de recursos estáticos
- Cache dinâmico
- Background sync
- Push notifications (opcional)

### 3. Ícones

Crie os ícones necessários:
- `icon-192x192.png`
- `icon-512x512.png`
- `apple-touch-icon.png`
- `favicon.ico`

## 🔄 Monitoramento

### 1. Uptime

Configure monitoramento de uptime:
- **UptimeRobot**: Gratuito
- **Pingdom**: Pago
- **StatusCake**: Freemium

### 2. Analytics

Monitore métricas importantes:
- Taxa de conversão
- Tempo na página
- Taxa de rejeição
- Core Web Vitals

### 3. Erros

Configure logging de erros:
- **Sentry**: Para JavaScript errors
- **LogRocket**: Para session replay
- **Google Analytics**: Para custom events

## 📞 Suporte

Para dúvidas sobre deploy:
- E-mail: contato@sefracorretora.com.br
- WhatsApp: (11) 99999-9999

---

**Lembre-se de testar tudo em ambiente de staging antes do deploy em produção!**