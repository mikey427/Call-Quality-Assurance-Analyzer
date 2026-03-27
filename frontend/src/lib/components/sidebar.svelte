<script lang="ts">
	import { signOut } from "$lib/auth"
	import { navigate } from "$lib/router";

	let open = $state(false)
	const items = [
		{
			label: "Home",
			url: "/",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
		},
		{
			label: "Analyze",
			url: "/analyze",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
		},
		{
			label: "History",
			url: "/history",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`
		},
		{
			label: "Settings",
			url: "/settings",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`
		}
	]
</script>

<aside class="relative flex h-screen">
	<!-- Sidebar panel -->
	{#if open}
		<div class="flex flex-col w-56 h-full bg-zinc-950 border-r border-zinc-800 shrink-0">

			<!-- Header -->
			<div class="flex items-center gap-2.5 px-4 h-14 border-b border-zinc-800 shrink-0">
				<div class="flex items-center justify-center w-7 h-7 rounded-md bg-violet-600 text-white shrink-0">
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
				</div>
				<span class="text-sm font-semibold text-zinc-100 truncate">Call Analyzer</span>
			</div>

			<!-- Nav -->
			<nav class="flex-1 overflow-y-auto px-2 py-3">
				<ul class="flex flex-col gap-0.5">
					{#each items as item}
						<li>
							<a
								href={item.url}
								class="flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors duration-150"
							>
								<span class="shrink-0">{@html item.icon}</span>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<!-- Footer -->
			<div class="px-2 py-3 border-t border-zinc-800 shrink-0">
				<button
					onclick={async () => {
						const res = await signOut()
						console.log("res: ", res);
						if(res.error === null) {
							navigate("/login")
						}
					}}
					class="flex items-center gap-3 w-full px-2 py-2 rounded-md text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors duration-150"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
					Sign out
				</button>
			</div>
		</div>
	{/if}

	<!-- Toggle button -->
	<button
		onclick={() => {
			open = !open
			console.log("open: ", open)
		}}
		class="absolute top-3 {open ? 'left-[14.5rem]' : 'left-3'} z-10 flex items-center justify-center w-8 h-8 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all duration-200"
		aria-label={open ? "Close sidebar" : "Open sidebar"}
	>
		{#if open}
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></svg>
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
		{/if}
	</button>
</aside>
