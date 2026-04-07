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
				console.log(data)
			})
			.catch(err => console.error("fetch failed:", err));
	});
</script>

{#if $session.isPending}
	<p>Loading</p>
{:else if $session.data}
	<div class="flex">
		<Sidebar />
		<div class="flex items-center justify-center w-full h-screen bg-red-500">
			<div class="w-1/2 h-1/2 border bg-black">
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