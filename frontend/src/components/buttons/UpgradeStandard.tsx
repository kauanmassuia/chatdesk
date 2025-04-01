import React from 'react';

interface UpgradeStandardProps {
  handleUpgrade: (plan: 'standard' | 'premium') => Promise<void>;
}

const UpgradeStandard: React.FC<UpgradeStandardProps> = ({ handleUpgrade }) => {
	return (
		<button
			onClick={() => handleUpgrade('standard')}
			className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300"
		>
			Upgrade
		</button>
	);
};

export default UpgradeStandard;
