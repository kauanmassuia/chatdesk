import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/chat.css";

export default function Home() {
  const navigate = useNavigate()

  const goToLogin = () => {
    navigate('/login')
  }


  useEffect(() => {
    const counters = document.querySelectorAll('.count');
    const duration = 2000; // 2 segundos de duração
    const easeOutQuad = (t) => t * (2 - t);
  
    const animateCounters = () => {
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-val'), 10);
        let current = 0;
        const increment = 1000; // Contar sempre de mil em mil
  
        const updateCounter = (timestamp, start) => {
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = easeOutQuad(progress);
  
          // Atualiza a contagem de mil em mil
          current = Math.min(Math.floor(eased * target), target);
  
          // Formatar o número
          counter.textContent = current.toLocaleString();
  
          if (progress < 1) {
            requestAnimationFrame((timestamp) => updateCounter(timestamp, start));
          } else {
            // Adiciona o sufixo apropriado após a contagem terminar
            if (counter.classList.contains('count-mil')) {
              counter.textContent = `+${target}mil`;
            } else if (counter.classList.contains('count-percent')) {
              counter.textContent = `+${target}%`;
            } else {
              counter.textContent = `+${target}`;
            }
          }
        };
  
        // Inicia a animação
        const startAnimation = () => {
          const step = (timestamp) => {
            let start = timestamp;
            updateCounter(timestamp, start);
          };
  
          requestAnimationFrame(step);
        };
  
        startAnimation();
      });
    };
  
    // Observer para detectar quando a seção estiver visível
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
          observer.disconnect(); // Desconectar após a animação
        }
      },
      { threshold: 0.5 } // Verifica quando pelo menos 50% do elemento estiver visível
    );
  
    observer.observe(document.querySelector('.stats'));
  
    return () => observer.disconnect(); // Limpar quando o componente for desmontado
  }, []);

  

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
          <h1>Crie Chatbots Automáticos e Melhore a Experiência do Cliente</h1>
          <h2>Crie e implemente chatbots inteligentes para um atendimento rápido, escalável e preciso.</h2>
          <button onClick={goToLogin} className="cta-button">Assinar agora</button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <h2>Veja nossos números</h2>
        <div className="stats-container">
          <div className="stat-item">
            <h3 className="count count-mil" data-val="68">0</h3>
            <p>Conversas Registradas</p>
          </div>
          <div className="stat-item">
            <h3 className="count count-percent" data-val="99">0</h3>
            <p>Aumento na satisfação</p>
          </div>
          <div className="stat-item">
            <h3 className="count" data-val="78">0</h3>
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
            <h2>Construa Bots com Simples Arrastar e Soltar</h2>
            <p>Crie chatbots personalizados com facilidade! Com apenas um arrastar de blocos, você define de forma intuitiva o caminho que o seu bot seguirá, criando interações inteligentes e eficientes. Sem código, sem complicação. O controle está em suas mãos!</p>
            <button onClick={goToLogin} className="feature-cta">Leia o Docs →</button>
          </div>
        </div>

        <div className="feature-item reverse">
          <div className="feature-content">
            <h2>Importe e Exporte Templates Prontos</h2>
            <p>Acelere o seu processo de criação com templates prontos! Importe e exporte facilmente funis de vendas, respostas automáticas e fluxos de atendimento já validados no mercado. Economize tempo e use modelos que já foram testados e aprovados, garantindo resultados eficazes desde o primeiro momento.</p>
            <button onClick={goToLogin} className="feature-cta">Leia o Docs →</button>
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
            <h2>Mais do que apenas um Bot: Análise de Performance para o Crescimento</h2>
            <p>Acompanhe o desempenho do seu chatbot em tempo real e otimize sua estratégia com nossas poderosas ferramentas de análise. Acesse métricas detalhadas como taxas de desistência, conclusão de fluxos e engajamento, permitindo que você tome decisões informadas para melhorar a experiência do cliente. Use esses insights para refinar seu atendimento e impulsionar o crescimento do seu negócio.</p>
            <button onClick={goToLogin} className="feature-cta">Leia o Docs →</button>
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
