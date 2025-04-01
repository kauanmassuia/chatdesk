import { useState } from 'react';
import { createCheckoutSession } from '../services/paymentService';
import { loadStripe } from '@stripe/stripe-js';

export const useHandleUpgrade = () => {
	// Read the publishable key from env
	const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
	const stripePromise = loadStripe(stripePublishableKey || '');

	// Local authentication check
	const isAuthenticated = (): boolean => {
		const token = localStorage.getItem('access-token');
		const client = localStorage.getItem('client');
		const uid = localStorage.getItem('uid');
		return Boolean(token && client && uid);
	};

	// New states for login modal and pending upgrade plan.
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [pendingPlan, setPendingPlan] = useState<'standard' | 'premium' | null>(null);

	const handleUpgrade = async (plan: 'standard' | 'premium'): Promise<void> => {
		if (!isAuthenticated()) {
			setPendingPlan(plan);
			localStorage.setItem('pending-plan', plan); // persist pending upgrade
			setShowLoginModal(true);
			return;
		}
		try {
			const { sessionId: newSessionId } = await createCheckoutSession(plan);
			const stripe = await stripePromise;
			if (stripe) {
				const { error } = await stripe.redirectToCheckout({ sessionId: newSessionId });
				if (error) console.error('Redirect error:', error);
			} else {
				console.error('Stripe failed to initialize.');
			}
		} catch (error) {
			console.error('Failed to create checkout session', error);
		}
	};

	// To be called on successful login from the modal.
	const handleLoginSuccess = () => {
		setShowLoginModal(false);
		localStorage.removeItem('pending-plan');
		if (pendingPlan) {
			// Re-attempt the upgrade now that user is logged in.
			handleUpgrade(pendingPlan);
			setPendingPlan(null);
		}
	};

	return { handleUpgrade, showLoginModal, handleLoginSuccess };
};
