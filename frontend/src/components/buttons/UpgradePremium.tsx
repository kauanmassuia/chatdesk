import React from 'react';

interface UpgradePremiumProps {
  handleUpgrade: (plan: 'standard' | 'premium') => Promise<void>;
}

const UpgradePremium: React.FC<UpgradePremiumProps> = ({ handleUpgrade }) => {
	return (
		<button
			onClick={() => handleUpgrade('premium')}
			className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300"
		>
			Upgrade
		</button>
	);
};

export default UpgradePremium;
