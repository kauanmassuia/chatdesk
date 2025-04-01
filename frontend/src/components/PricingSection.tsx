// components/PricingSection.tsx
import React, { useState } from 'react';
import LoginModal from './modal/LoginModal';
import RegisterModal from './modal/RegisterModal';
import UpgradeStandard from './buttons/UpgradeStandard';
import UpgradePremium from './buttons/UpgradePremium';
import { useHandleUpgrade } from '../hooks/useHandleUpgrade';

const PricingSection: React.FC = () => {
  const { handleUpgrade, showLoginModal, handleLoginSuccess } = useHandleUpgrade();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <>
      <section id="preco" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Escolha o plano ideal para você
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Veja nossos planos e comece a usar o VendFlow hoje!
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Free Plan */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="bg-white p-6 flex-1">
                <h3 className="text-xl font-semibold text-green-500">Free</h3>
                <p className="mt-2 text-gray-600">Para quem quer começar sem custo.</p>
                <p className="mt-4 text-3xl font-bold text-gray-900">R$0/mês</p>
                <ul className="mt-6 space-y-2 text-gray-700">
                  <li>✅ 1 usuário</li>
                  <li>✅ 10 chats/mês</li>
                  <li>✅ Criar pastas</li>
                  <li>❌ Marca d’água</li>
                  <li>❌ Upload de arquivos</li>
                  <li>❌ Suporte prioritário</li>
                </ul>
              </div>
              <div className="p-6">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300">
                  Comece agora
                </button>
              </div>
            </div>

            {/* Starter / Básico Plan */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-bl">
                Mais popular
              </div>
              <div className="bg-white p-6 flex-1">
                <h3 className="text-xl font-semibold text-blue-500">
                  Upgrade para Básico
                </h3>
                <p className="mt-2 text-gray-600">Para indivíduos e pequenos negócios.</p>
                <p className="mt-4 text-3xl font-bold text-gray-900">R$97/mês</p>
                <ul className="mt-6 space-y-2 text-gray-700">
                  <li>✅ 2 usuários</li>
                  <li>✅ 2000 chats/mês</li>
                  <li>✅ Criar pastas</li>
                  <li>✅ Marca d’água</li>
                  <li>✅ Upload de arquivos</li>
                  <li>✅ Suporte prioritário</li>
                </ul>
              </div>
              <div className="p-6">
                <UpgradeStandard handleUpgrade={handleUpgrade} />
              </div>
            </div>

            {/* Pro / Profissional Plan */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="bg-white p-6 flex-1">
                <h3 className="text-xl font-semibold text-purple-500">
                  Upgrade para Profissional
                </h3>
                <p className="mt-2 text-gray-600">Para agências e startups em crescimento.</p>
                <p className="mt-4 text-3xl font-bold text-gray-900">R$297/mês</p>
                <ul className="mt-6 space-y-2 text-gray-700">
                  <li>✅ 4 usuários</li>
                  <li>✅ 20.000 chats/mês</li>
                  <li>✅ Criar pastas</li>
                  <li>✅ Marca d’água</li>
                  <li>✅ Upload de arquivos</li>
                  <li>✅ Suporte prioritário</li>
                </ul>
              </div>
              <div className="p-6">
                <UpgradePremium handleUpgrade={handleUpgrade} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {}}
        onLoginSuccess={handleLoginSuccess}
        onRegisterClick={() => {
          // Trigger the register modal
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegisterSuccess={() => {
          setShowRegisterModal(false);
          // Continue pending purchase after a successful registration
          handleLoginSuccess();
        }}
      />
    </>
  );
};

export default PricingSection;
