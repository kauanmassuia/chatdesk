import React from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/chat.css";
 // Você precisará criar este arquivo CSS

export default function Home() {
  const navigate = useNavigate()

  const goToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="landing-page">
      {/* Header/Navigation */}
      <header className="header">
        <div className="logo">ChatDesk</div>
        <nav>
          <ul>
            <li><a href="#funcionalidades">Funcionalidades</a></li>
            <li><a href="#preco">Preço</a></li>
            <li><button onClick={goToLogin} className="login-btn">Login</button></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Gerencie seu atendimento com a ajuda da I.A e a simplicidade do ChatDesk</h1>
          <h2>Nunca foi tão fácil organizar, responder e acompanhar seus atendimentos.</h2>
          <button onClick={goToLogin} className="cta-button">Assinar agora</button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <h2>Veja nossos números</h2>
        <div className="stats-container">
          <div className="stat-item">
            <h3>+0mil</h3>
            <p>Atendimentos realizados</p>
          </div>
          <div className="stat-item">
            <h3>+0%</h3>
            <p>Aumento na satisfação</p>
          </div>
          <div className="stat-item">
            <h3>+0mil</h3>
            <p>Empresas utilizam diariamente</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="features">
        <div className="feature-item">
          <div className="feature-image">
            {/* Placeholder for image */}
            <div className="image-placeholder"></div>
          </div>
          <div className="feature-content">
            <h2>Atendimento com IA integrada</h2>
            <p>Nossa IA analisa e sugere respostas para agilizar seu atendimento ao cliente, incluindo respostas personalizadas.</p>
            <button onClick={goToLogin} className="feature-cta">Assine agora →</button>
          </div>
        </div>

        <div className="feature-item reverse">
          <div className="feature-content">
            <h2>Gerenciamento centralizado</h2>
            <p>Centralize todos os seus canais de atendimento em uma única plataforma e gerencie com facilidade.</p>
            <button onClick={goToLogin} className="feature-cta">Assine agora →</button>
          </div>
          <div className="feature-image">
            {/* Placeholder for image */}
            <div className="image-placeholder"></div>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-image">
            {/* Placeholder for image */}
            <div className="image-placeholder"></div>
          </div>
          <div className="feature-content">
            <h2>Análise de desempenho</h2>
            <p>Acompanhe métricas importantes e descubra oportunidades de melhoria no seu atendimento.</p>
            <button onClick={goToLogin} className="feature-cta">Assine agora →</button>
          </div>
        </div>
      </section>

      {/* More Features Section */}
      <section className="more-features">
        <h2>Mais funcionalidades para facilitar sua vida</h2>
        <p>Além de gerenciar atendimentos com IA, o ChatDesk oferece:</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3>Automação de respostas</h3>
            <p>Configure respostas automáticas para perguntas frequentes e economize tempo da sua equipe.</p>
          </div>
          <div className="feature-card">
            <h3>Relatórios detalhados</h3>
            <p>Visualize relatórios de desempenho, tempo de resposta e satisfação do cliente.</p>
          </div>
          <div className="feature-card">
            <h3>Integração multicanal</h3>
            <p>Conecte WhatsApp, Facebook, Instagram e outros canais em uma única plataforma.</p>
          </div>
          <div className="feature-card">
            <h3>Chatbot personalizado</h3>
            <p>Crie fluxos de atendimento automatizados para resolver problemas comuns.</p>
          </div>
          <div className="feature-card">
            <h3>Assistente com AI</h3>
            <p>Obtenha sugestões de respostas e análise de sentimento em tempo real.</p>
          </div>
          <div className="feature-card">
            <h3>Gestão de equipe</h3>
            <p>Distribua atendimentos e monitore o desempenho de cada atendente.</p>
          </div>
        </div>
        
        <p className="more-text">e muito mais...</p>
      </section>

      {/* Integrations Section */}
      <section className="integrations">
        <h2>Integração com suas ferramentas favoritas</h2>
        <p>Conecte facilmente com CRMs, ERPs e outras ferramentas que você já utiliza.</p>
        <div className="integrations-logos">
          {/* Placeholder for integration logos */}
          <div className="logo-placeholder"></div>
          <div className="logo-placeholder"></div>
          <div className="logo-placeholder"></div>
        </div>
        <p>e mais 30 integrações...</p>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>Não acredite apenas nas nossas palavras</h2>
        <p>Veja alguns de nossos clientes incríveis que estão tendo resultados</p>
        
        <div className="testimonials-container">
          {/* Testimonial cards would go here */}
          <div className="testimonial-card">
            <p>"O ChatDesk revolucionou nosso atendimento ao cliente. Reduzimos o tempo de resposta em 60%."</p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <h4>Nome do Cliente</h4>
                <p>Empresa</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"A integração com IA nos ajudou a escalar o suporte sem precisar contratar mais pessoas."</p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <h4>Nome do Cliente</h4>
                <p>Empresa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="guarantee">
        <h2>Seu dinheiro de volta</h2>
        <p>Caso não goste do serviço no prazo de 7 dias, seu dinheiro será devolvido. A renovação é automática e pode ser cancelada a qualquer momento, sem multas ou taxas adicionais.</p>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <h2>Perguntas frequentes</h2>
        <p>Tudo que você precisa saber sobre o ChatDesk</p>
        
        <div className="faq-item">
          <h3>O que é o ChatDesk?</h3>
          <p>O ChatDesk revoluciona a maneira de gerenciar atendimentos ao cliente, utilizando Inteligência Artificial (IA) para uma experiência única e simplificada. Ao contrário de plataformas tradicionais, o ChatDesk elimina a necessidade de alternar entre diferentes canais e ferramentas.</p>
        </div>
        
        <div className="faq-item">
          <h3>Para quem é indicado?</h3>
          <p>Para empresas que desejam otimizar seu atendimento ao cliente, reduzir tempo de resposta e melhorar a satisfação do cliente. Ideal para equipes que precisam gerenciar múltiplos canais de comunicação de forma eficiente.</p>
        </div>
        
        <div className="faq-item">
          <h3>Como funciona a política de reembolso?</h3>
          <p>Caso não esteja satisfeito ou não veja os resultados esperados, você pode solicitar um reembolso completo dentro de 7 dias após a compra. Esse processo é rápido e sem burocracias, garantindo a sua total satisfação com o serviço.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <h2>Ainda tem dúvidas?</h2>
        <p>Não consegue encontrar a resposta que procura? Fale com a gente!</p>
        <button className="contact-button">Entrar em contato</button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-sections">
          <div className="footer-section">
            <h3>Produto</h3>
            <ul>
              <li><a href="#funcionalidades">Funcionalidades</a></li>
              <li><a href="#preco">Preços</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Termos</h3>
            <ul>
              <li><a href="#privacy">Privacidade</a></li>
              <li><a href="#terms">Termos de Uso</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Suporte</h3>
            <ul>
              <li><a href="#contact">Contato</a></li>
              <li><a href="#help">Central de Ajuda</a></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <p>Copyright © 2025 ChatDesk. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
