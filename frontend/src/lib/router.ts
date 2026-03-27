import { createRouter } from 'sv-router';
import Home from '../pages/home.svelte';
import SignUp from '../pages/SignUp.svelte';
import Login from '../pages/login.svelte';
import Analyze from '../pages/analyze.svelte';

export const { p, navigate, isActive, route } = createRouter({
	'/': Home,
	'/sign-up': SignUp,
	'/login': Login,
	'/analyze': Analyze
});