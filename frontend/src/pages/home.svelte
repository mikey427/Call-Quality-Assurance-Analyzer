<script>
	import { useSession } from "$lib/auth";
	import Sidebar from "$lib/components/sidebar.svelte";
	import { navigate } from "$lib/router";
	const session = useSession();

	$effect(() => {
		if (!$session?.isPending && !$session.data) {
			navigate("/login");
		}
	});
</script>

{#if $session.isPending}
	<p>Loading...</p>
{:else if $session.data}
	<div class="flex">
		<Sidebar />
		<div>
			<p>Welcome, {$session.data.user.name}!</p>
		</div>
	</div>
{:else}
	<p>Please sign in.</p>
{/if}
