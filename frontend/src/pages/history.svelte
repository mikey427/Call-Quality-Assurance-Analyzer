<script lang="ts">
	import { useSession } from "$lib/auth";
	import Sidebar from "$lib/components/sidebar.svelte";
	import { navigate } from "$lib/router";

	const session = useSession();
	let callAnalysisHistory = $state([])

	$effect(() => {
		console.log("$session:", JSON.stringify($session));

		if (!$session?.isPending && !$session.data) {
			navigate("/login");
			return;
		}

		const userId = $session?.data?.user.id;
		if (!userId) return;

		fetch(`/api/history/${userId}`)
			.then(res => res.json())
			.then(data => {
				console.log("data:", data);
				callAnalysisHistory = data;
			})
			.catch(err => console.error("fetch failed:", err));
	});
</script>

{#if $session.isPending}
	<p>Loading</p>
{:else if $session.data}
	<div class="flex">
		<Sidebar />
		<div>
			<div>
				<ul>
					{#each callAnalysisHistory as record}
						<li class=""></li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
{:else}
	<p>Please sign in.</p>
{/if}